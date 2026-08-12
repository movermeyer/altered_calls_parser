/**
 * Labels each word of a call with the part of the syntax it belongs to.
 *
 * This is a parse-tree walk, not a lexer pass, because the lexer alone cannot
 * tell these apart: of the two numbers in "Knockdown 5 3 Flesh Drain" the first
 * is the damage amount while the second belongs to the drain, and of the two
 * "Flesh"es in "5 Flesh 3 Flesh Drain" the first is a damage type while the
 * second is the resource being drained. Only the rule a terminal sits under
 * decides which.
 *
 * The player-facing wording lives in shared/canonical-tokens.json alongside
 * every other player-visible string, so both language implementations say the
 * same thing and neither hard-codes English against a token name.
 */

import { ErrorNode, TerminalNode, Token, type CommonTokenStream } from "antlr4ng";

import { titleCase } from "./canonical.js";
import { CallsLexer } from "./generated/CallsLexer.js";
import tokens from "./generated/canonical-tokens.json" with { type: "json" };
import {
  DefenseNameContext,
  DefensiveCallContext,
  type DamageCallContext,
  type DamageTypeContext,
  type DefenseWordContext,
  type DrainDamageTypeContext,
  type EffectContext,
  type ElementalContext,
  type FullAutoContext,
  type NumberContext,
  type ResourceContext,
} from "./generated/CallsParser.js";
import { CallsVisitor } from "./generated/CallsVisitor.js";
import type { CallTree } from "./tree.js";

const WORDS: Record<string, string> = tokens.words;
const ROLE_CATEGORIES: Record<string, string> = tokens.roleCategories;
const ROLE_LABELS: Record<string, string> = tokens.roleLabels;
const ROLE_DESCRIPTIONS: Record<string, string> = tokens.roleDescriptions;

/** Each of the fifteen keywords the `effect` grammar rule accepts, lowercased. */
export type EffectRole =
  | "break"
  | "charm"
  | "command"
  | "daze"
  | "death"
  | "disarm"
  | "fear"
  | "knockdown"
  | "knockout"
  | "maim"
  | "pin"
  | "rage"
  | "slam"
  | "slay"
  | "stun";

export type CallTokenRole =
  | "overwhelm"
  | EffectRole
  | "full-auto"
  | "amount"
  | "damage-type"
  | "drain-amount"
  | "drain-resource"
  | "drain"
  | "mitigate"
  | "parry"
  | "phase-out"
  | "phase-in"
  | "sacrifice"
  | "shrug-off"
  | "withstand"
  | "defense-name"
  | "unknown";

export interface CallToken {
  /** Half-open range in the input, the same convention CallHint uses. */
  start: number;
  end: number;
  /**
   * The input slice, in its original casing -- including whatever separator the
   * player put between the words of a multi-word call ("Shrug-Off").
   */
  text: string;
  /**
   * The canonical spelling normalize() would write here, or the digits
   * themselves for a number. Multi-word calls come back hyphen-joined
   * ("Full-Auto"), exactly as normalize() writes them. Empty for an "unknown"
   * token, which is by definition not part of a call the canonicalizer would
   * accept.
   */
  canonical: string;
  /** Which part of the syntax this is, given where it sits in the call. */
  role: CallTokenRole;
  /**
   * Coarse grouping for colour-coding: one of `categoryOrder`, or "unknown".
   * Several roles share a category -- a drain's amount and a call's damage
   * amount are both numbers.
   */
  category: string;
  /** Short player-facing name for the role, e.g. "Drain amount". */
  label: string;
  /** A complete player-facing sentence. Safe to render as-is. */
  description: string;
}

/**
 * The terminals of one part of a call, before their input slice has been read.
 *
 * Usually one token, but a call made of several words is one part: "Shrug" and
 * "Off" are a single `shrug-off`, and a Defense name is a single name however
 * many words the player used for it.
 */
interface ClaimedSpan {
  tokens: Token[];
  role: CallTokenRole;
}

function tokenName(tokenType: number): string {
  const name = CallsLexer.symbolicNames[tokenType];
  if (name === null || name === undefined) {
    throw new Error(`No symbolic name for token type ${tokenType}`);
  }
  return name;
}

/**
 * Whether `token` points at real input.
 *
 * ErrorNode extends TerminalNode, so on invalid input the generated accessors
 * (ctx.POWER() and friends) can hand back a token ANTLR conjured during
 * single-token-insertion recovery -- "full auto" gets a missing NUMBER
 * inserted. Those carry start === stop === -1, so testing only that the range
 * is non-empty would let them through; the start has to be checked against the
 * input as well.
 */
function isRealToken(token: Token | null | undefined): token is Token {
  return (
    token !== null &&
    token !== undefined &&
    token.type !== Token.EOF &&
    token.start >= 0 &&
    token.stop >= token.start
  );
}

/**
 * Re-types a generated accessor's result as nullable, which it genuinely is.
 *
 * The generated contexts declare their *required* children non-null and reach
 * that type with a `!` assertion -- `getRuleContext(0, NumberContext)!`. That
 * assertion only holds for a tree that parsed. After error recovery a required
 * child can be missing outright: "full" builds a FullAutoContext whose AUTO()
 * and number() are both null at runtime despite their types. Canonicalizer
 * never meets this because normalize() throws before it walks an invalid tree,
 * but tokenize() promises not to throw, so every required child has to be
 * checked here.
 */
function maybe<T>(value: T): T | null {
  return value ?? null;
}

/**
 * Which of §8.4's seven forms a defensive call is, keyed by its first word --
 * which is what the grammar itself picks the alternative on. PHASE is absent
 * because it alone needs a second word to tell its two forms apart.
 */
const DEFENSIVE_ROLES: Record<string, CallTokenRole> = {
  MITIGATE: "mitigate",
  SACRIFICE: "sacrifice",
  PARRY: "parry",
  SHRUG: "shrug-off",
  WITHSTAND: "withstand",
};

/**
 * The role every keyword of this defensive call carries.
 *
 * The role belongs to the call as a whole rather than to its individual words
 * -- "Shrug" and "Off" are one call between them, and the rulebook has one
 * sentence to say about the pair.
 */
function defensiveRole(ctx: DefensiveCallContext): CallTokenRole {
  if (ctx.PHASE()) {
    // Half-typed input ("phase") reaches here with neither word, and there is
    // nothing to tell the two apart by; the first alternative is as good a
    // guess as the second, and tokenize() is best-effort on invalid input.
    return ctx.IN() ? "phase-in" : "phase-out";
  }
  const start = ctx.start;
  return (start && DEFENSIVE_ROLES[tokenName(start.type)]) || "unknown";
}

/**
 * Walks a call parse tree, recording which part of the syntax each matched
 * terminal belongs to. The structural sibling of Canonicalizer, with one
 * difference: Canonicalizer pushes canonical words as string constants and so
 * never needs a terminal to read a position from, whereas every role here has
 * to be pinned to the token that actually carries it.
 */
class Tokenizer extends CallsVisitor<void> {
  private claimed: ClaimedSpan[] = [];

  public collect(tree: CallTree | null): ClaimedSpan[] {
    this.claimed = [];
    if (tree instanceof DefensiveCallContext) {
      this.visitDefensiveCall(tree);
    } else if (tree) {
      this.visitDamageCall(tree);
    }
    return this.claimed;
  }

  /**
   * Claim `candidates` as one part of the call. Anything the parser conjured
   * during error recovery drops out, and a span left with nothing real in it is
   * not claimed at all -- so a half-typed "full" claims the one word it has.
   */
  private push(candidates: (Token | null | undefined)[], role: CallTokenRole): void {
    const tokens = candidates.filter(isRealToken);
    if (tokens.length > 0) {
      this.claimed.push({ tokens, role });
    }
  }

  public visitDamageCall = (ctx: DamageCallContext): void => {
    const fullAuto = ctx.fullAuto();
    if (fullAuto) {
      // Full Auto stands in for both the effect and the number slots -- it
      // excludes any other effect, and carries its own damage number.
      this.visitFullAuto(fullAuto);
    } else {
      const effect = ctx.effect();
      if (effect) {
        this.visitEffect(effect);
      }
      this.pushNumber(ctx.number(), "amount");
    }
    for (const damageType of ctx.damageType()) {
      this.visitDamageType(damageType);
    }
  };

  private pushNumber(ctx: NumberContext | null, role: CallTokenRole): void {
    this.push([maybe(ctx?.NUMBER())?.symbol], role);
  }

  public visitFullAuto = (ctx: FullAutoContext): void => {
    this.push([ctx.OVERWHELM()?.symbol], "overwhelm");
    // Both words are one effect. The number stays its own part: it is what the
    // player varies, not part of the call's name.
    this.push([maybe(ctx.FULL())?.symbol, maybe(ctx.AUTO())?.symbol], "full-auto");
    this.pushNumber(maybe(ctx.number()), "amount");
  };

  public visitEffect = (ctx: EffectContext): void => {
    // "Overwhelm" is an optional prefix on the effect keyword, so the keyword
    // itself is the rule's last token rather than its first.
    this.push([ctx.OVERWHELM()?.symbol], "overwhelm");
    // Each of the fifteen effect keywords gets its own role -- the lexer's
    // symbolic name lowercased -- so the tokenizer can hand back a
    // rulebook-accurate description per effect instead of one generic blurb.
    const stop = ctx.stop;
    if (isRealToken(stop)) {
      this.push([stop], tokenName(stop.type).toLowerCase() as EffectRole);
    }
  };

  public visitDamageType = (ctx: DamageTypeContext): void => {
    const drain = ctx.drainDamageType();
    if (drain) {
      this.visitDrainDamageType(drain);
      return;
    }
    const elemental = ctx.elemental();
    if (elemental) {
      this.visitElemental(elemental);
      return;
    }
    // Bare FLESH/HEAL/REPAIR/FOCUS/STAMINA leaf.
    this.push([ctx.start], "damage-type");
  };

  public visitElemental = (ctx: ElementalContext): void => {
    this.push([ctx.start], "damage-type");
  };

  public visitDrainDamageType = (ctx: DrainDamageTypeContext): void => {
    // A drain carries its own amount, distinct from damageCall's optional
    // leading number ("knockdown 5 3 flesh drain" has both).
    this.pushNumber(maybe(ctx.number()), "drain-amount");
    const resource = maybe(ctx.resource());
    if (resource) {
      this.visitResource(resource);
    }
    this.push([maybe(ctx.DRAIN())?.symbol], "drain");
  };

  public visitResource = (ctx: ResourceContext): void => {
    this.push([ctx.start], "drain-resource");
  };

  public visitDefensiveCall = (ctx: DefensiveCallContext): void => {
    // Every one of the seven forms is a run of keywords optionally followed by
    // a Defense name, and the keywords of one form are one call between them --
    // so this covers all seven without a branch per form, and "Shrug Off" and
    // "Phase Out" come back whole.
    const role = defensiveRole(ctx);
    const keywords: Token[] = [];
    for (const child of ctx.children) {
      if (child instanceof DefenseNameContext) {
        this.visitDefenseName(child);
      } else if (child instanceof TerminalNode && !(child instanceof ErrorNode)) {
        // Error nodes are TerminalNodes too, and they hang off whichever rule
        // was being matched when recovery kicked in -- so claiming them here
        // would label the word that broke the call as part of it. Leaving them
        // unclaimed sends them to "unknown" instead.
        keywords.push(child.symbol);
      }
    }
    this.push(keywords, role);
  };

  /**
   * The whole name is one part of the call, however many words it took.
   *
   * This holds for names nobody here has heard of as well as the listed ones:
   * the grammar accepts any run of words, and a player who says "Mitigate Angry
   * Bear" has named one Defense, not two.
   */
  public visitDefenseName = (ctx: DefenseNameContext): void => {
    this.push(
      ctx.defenseWord().map((word: DefenseWordContext) => word.start),
      "defense-name",
    );
  };
}

/**
 * Every real token the lexer produced, including the ones the parse tree
 * rejected. SEP is skipped rather than sent to a hidden channel, so separators
 * never enter the stream at all and no channel filtering is needed here.
 */
function unclaimedTokens(stream: CommonTokenStream, claimed: ClaimedSpan[]): ClaimedSpan[] {
  const claimedStarts = new Set(claimed.flatMap((c) => c.tokens.map((token) => token.start)));
  return stream
    .getTokens()
    .filter((token) => isRealToken(token) && !claimedStarts.has(token.start))
    .map((token) => ({ tokens: [token], role: "unknown" as const }));
}

/** The canonical spelling of one word, as normalize() would write it. */
function canonicalWord(text: string, token: Token): string {
  if (token.type === CallsLexer.NUMBER) {
    return text.slice(token.start, token.stop + 1);
  }
  if (token.type === CallsLexer.IDENT) {
    // A Defense name the rulebook doesn't list -- the only place IDENT is part
    // of a call at all. There is no canonical spelling on file for it, so it
    // keeps the player's word, capitalized like the rest.
    return titleCase(text.slice(token.start, token.stop + 1));
  }
  return WORDS[tokenName(token.type)];
}

function toCallToken(text: string, { tokens, role }: ClaimedSpan): CallToken {
  const start = tokens[0].start;
  const end = tokens[tokens.length - 1].stop + 1;

  return {
    start,
    end,
    // Slice the original input rather than reading token.text, which reflects
    // the upper-cased view CaseChangingCharStream gave the lexer to match
    // against. Slicing the whole span at once also keeps the separator the
    // player typed between the words of a multi-word call.
    text: text.slice(start, end),
    // Hyphen-joined, which is how normalize() joins words -- so a caller can
    // still rebuild the canonical call by joining these with a hyphen,
    // whether or not any of them turned out to be several words.
    canonical:
      role === "unknown" ? "" : tokens.map((token) => canonicalWord(text, token)).join("-"),
    role,
    category: ROLE_CATEGORIES[role],
    label: ROLE_LABELS[role],
    description: ROLE_DESCRIPTIONS[role],
  };
}

/**
 * Label each part of `text` with the part of the syntax it belongs to.
 *
 * One token per *part* of the call rather than per word: a call made of several
 * words ("Shrug Off", "Full Auto") comes back as one token covering all of
 * them, as does a Defense name however many words it took.
 *
 * Takes the tree and token stream rather than parsing for itself so that the
 * public tokenize() in index.ts can build them the same way parse() does, off
 * one CaseChangingCharStream, instead of standing up a second pipeline that
 * could drift from it. `tree` is null when error recovery could not tell which
 * kind of call was meant, in which case every word comes back "unknown".
 *
 * Invalid input still yields whatever the parser's error recovery managed to
 * recognise, with the words it could not place coming back as "unknown" -- so a
 * half-typed call still explains the half that parsed.
 *
 * The returned tokens are in source order but are *not* contiguous: spaces and
 * hyphens are separators the lexer skips, so a caller rendering the tokens back
 * out must take the gaps between them from the original text.
 */
export function tokenizeTree(
  text: string,
  tree: CallTree | null,
  stream: CommonTokenStream,
): CallToken[] {
  const claimed = new Tokenizer().collect(tree);
  return [...claimed, ...unclaimedTokens(stream, claimed)]
    .sort((a, b) => a.tokens[0].start - b.tokens[0].start)
    .map((c) => toCallToken(text, c));
}

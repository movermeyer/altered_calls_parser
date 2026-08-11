/**
 * Labels each word of a call with the part of the syntax it belongs to.
 *
 * This is a parse-tree walk, not a lexer pass, because the lexer alone cannot
 * tell these apart: "Light" is an elemental damage type in "Stun Light" but
 * half of the power call in "Power Light Stun", and of the two numbers in
 * "Knockdown 5 3 Flesh Drain" the first is the damage amount while the second
 * belongs to the drain. Only the rule a terminal sits under decides which.
 *
 * The player-facing wording lives in shared/canonical-tokens.json alongside
 * every other player-visible string, so both language implementations say the
 * same thing and neither hard-codes English against a token name.
 */

import { Token, type CommonTokenStream } from "antlr4ng";

import { CallsLexer } from "./generated/CallsLexer.js";
import tokens from "./generated/canonical-tokens.json" with { type: "json" };
import {
  type BasicEffectContext,
  type DamageCallContext,
  type DamageTypeContext,
  type DrainDamageTypeContext,
  type EffectContext,
  type ElementalContext,
  type FullAutoContext,
  type NumberContext,
  type PowerLightContext,
  type PowerWordContext,
  type ResourceContext,
  type TargetContext,
} from "./generated/CallsParser.js";
import { CallsVisitor } from "./generated/CallsVisitor.js";

const WORDS: Record<string, string> = tokens.words;
const ROLE_CATEGORIES: Record<string, string> = tokens.roleCategories;
const ROLE_LABELS: Record<string, string> = tokens.roleLabels;
const ROLE_DESCRIPTIONS: Record<string, string> = tokens.roleDescriptions;

export type CallTokenRole =
  | "overwhelm"
  | "power-word"
  | "power-light"
  | "target"
  | "effect"
  | "full-auto"
  | "amount"
  | "damage-type"
  | "drain-amount"
  | "drain-resource"
  | "drain"
  | "unknown";

export interface CallToken {
  /** Half-open range in the input, the same convention CallHint uses. */
  start: number;
  end: number;
  /** The input slice, in its original casing. */
  text: string;
  /**
   * The canonical spelling normalize() would write for this word, or the
   * digits themselves for a number. Empty for an "unknown" token, which is by
   * definition not part of a call the canonicalizer would accept.
   */
  canonical: string;
  /** Which part of the syntax this word is, given where it sits in the call. */
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

/** A terminal the tree claimed, before its input slice has been read. */
interface ClaimedToken {
  token: Token;
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
 * that type with a `!` assertion -- `getRuleContext(0, BasicEffectContext)!`.
 * That assertion only holds for a tree that parsed. After error recovery a
 * required child can be missing outright: "power light" builds a
 * PowerLightContext whose basicEffect() is null at runtime despite its type.
 * Canonicalizer never meets this because normalize() throws before it walks an
 * invalid tree, but tokenize() promises not to throw, so every required child
 * has to be checked here.
 */
function maybe<T>(value: T): T | null {
  return value ?? null;
}

/**
 * Walks a damageCall parse tree, recording which part of the syntax each
 * matched terminal belongs to. The structural sibling of Canonicalizer, with
 * one difference: Canonicalizer pushes canonical words as string constants and
 * so never needs a terminal to read a position from, whereas every role here
 * has to be pinned to the token that actually carries it.
 */
class Tokenizer extends CallsVisitor<void> {
  private claimed: ClaimedToken[] = [];

  public collect(tree: DamageCallContext): ClaimedToken[] {
    this.claimed = [];
    this.visitDamageCall(tree);
    return this.claimed;
  }

  private push(token: Token | null | undefined, role: CallTokenRole): void {
    if (isRealToken(token)) {
      this.claimed.push({ token, role });
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
    this.push(maybe(ctx?.NUMBER())?.symbol, role);
  }

  public visitFullAuto = (ctx: FullAutoContext): void => {
    this.push(ctx.OVERWHELM()?.symbol, "overwhelm");
    this.push(maybe(ctx.FULL())?.symbol, "full-auto");
    this.push(maybe(ctx.AUTO())?.symbol, "full-auto");
    this.pushNumber(maybe(ctx.number()), "amount");
  };

  public visitEffect = (ctx: EffectContext): void => {
    const powerWord = ctx.powerWord();
    const powerLight = ctx.powerLight();
    const basicEffect = ctx.basicEffect();
    if (powerWord) {
      this.visitPowerWord(powerWord);
    } else if (powerLight) {
      this.visitPowerLight(powerLight);
    } else if (basicEffect) {
      this.visitBasicEffect(basicEffect);
    }
  };

  public visitPowerWord = (ctx: PowerWordContext): void => {
    this.push(maybe(ctx.POWER())?.symbol, "power-word");
    this.push(maybe(ctx.WORD_KW())?.symbol, "power-word");
    this.visitPowerTail(ctx.target(), maybe(ctx.basicEffect()));
  };

  public visitPowerLight = (ctx: PowerLightContext): void => {
    this.push(maybe(ctx.POWER())?.symbol, "power-light");
    // The one label the lexer could never get right on its own: "Light" is an
    // elemental damage type everywhere else in the grammar.
    this.push(maybe(ctx.LIGHT())?.symbol, "power-light");
    this.visitPowerTail(ctx.target(), maybe(ctx.basicEffect()));
  };

  /** Power Word and Power Light take the same optional target then effect. */
  private visitPowerTail(target: TargetContext | null, basicEffect: BasicEffectContext | null): void {
    if (target) {
      this.visitTarget(target);
    }
    if (basicEffect) {
      this.visitBasicEffect(basicEffect);
    }
  }

  public visitTarget = (ctx: TargetContext): void => {
    this.push(ctx.start, "target");
  };

  public visitBasicEffect = (ctx: BasicEffectContext): void => {
    // "Overwhelm" is an optional prefix on the effect keyword, so the keyword
    // itself is the rule's last token rather than its first.
    this.push(ctx.OVERWHELM()?.symbol, "overwhelm");
    this.push(ctx.stop, "effect");
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
    this.push(ctx.start, "damage-type");
  };

  public visitElemental = (ctx: ElementalContext): void => {
    this.push(ctx.start, "damage-type");
  };

  public visitDrainDamageType = (ctx: DrainDamageTypeContext): void => {
    // A drain carries its own amount, distinct from damageCall's optional
    // leading number ("knockdown 5 3 flesh drain" has both).
    this.pushNumber(maybe(ctx.number()), "drain-amount");
    const resource = maybe(ctx.resource());
    if (resource) {
      this.visitResource(resource);
    }
    this.push(maybe(ctx.DRAIN())?.symbol, "drain");
  };

  public visitResource = (ctx: ResourceContext): void => {
    this.push(ctx.start, "drain-resource");
  };
}

/**
 * Every real token the lexer produced, including the ones the parse tree
 * rejected. SEP is skipped rather than sent to a hidden channel, so separators
 * never enter the stream at all and no channel filtering is needed here.
 */
function unclaimedTokens(stream: CommonTokenStream, claimed: ClaimedToken[]): ClaimedToken[] {
  const claimedStarts = new Set(claimed.map((c) => c.token.start));
  return stream
    .getTokens()
    .filter((token) => isRealToken(token) && !claimedStarts.has(token.start))
    .map((token) => ({ token, role: "unknown" as const }));
}

function toCallToken(text: string, { token, role }: ClaimedToken): CallToken {
  const start = token.start;
  const end = token.stop + 1;
  // Slice the original input rather than reading token.text, which reflects the
  // upper-cased view CaseChangingCharStream gave the lexer to match against.
  const slice = text.slice(start, end);

  let canonical = "";
  if (role !== "unknown") {
    canonical = token.type === CallsLexer.NUMBER ? slice : WORDS[tokenName(token.type)];
  }

  return {
    start,
    end,
    text: slice,
    canonical,
    role,
    category: ROLE_CATEGORIES[role],
    label: ROLE_LABELS[role],
    description: ROLE_DESCRIPTIONS[role],
  };
}

/**
 * Label each word of `text` with the part of the syntax it belongs to.
 *
 * Takes the tree and token stream rather than parsing for itself so that the
 * public tokenize() in index.ts can build them the same way parse() does, off
 * one CaseChangingCharStream, instead of standing up a second pipeline that
 * could drift from it.
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
  tree: DamageCallContext,
  stream: CommonTokenStream,
): CallToken[] {
  const claimed = new Tokenizer().collect(tree);
  return [...claimed, ...unclaimedTokens(stream, claimed)]
    .sort((a, b) => a.token.start - b.token.start)
    .map((c) => toCallToken(text, c));
}

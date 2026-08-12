import { TerminalNode, type ParserRuleContext } from "antlr4ng";

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
  type ResourceContext,
} from "./generated/CallsParser.js";
import { CallsVisitor } from "./generated/CallsVisitor.js";
import type { CallTree } from "./tree.js";

const WORDS: Record<string, string> = tokens.words;

/**
 * Capitalize `word` the way the canonical spellings in WORDS are.
 *
 * Only IDENT needs this: every other token has its canonical spelling on file,
 * but a Defense name the rulebook doesn't list has to borrow the player's own
 * word. IDENT is `[A-Za-z]+`, so there is no locale or grapheme subtlety here
 * -- which matters, because the Python mirror must agree character for
 * character.
 */
export function titleCase(word: string): string {
  return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
}

function tokenName(tokenType: number): string {
  const name = CallsLexer.symbolicNames[tokenType];
  if (name === null || name === undefined) {
    throw new Error(`No symbolic name for token type ${tokenType}`);
  }
  return name;
}

function leafWord(ctx: ParserRuleContext): string {
  const start = ctx.start;
  if (start === null) {
    throw new Error("Expected a matched token for this rule context");
  }
  return WORDS[tokenName(start.type)];
}

function lastWord(ctx: ParserRuleContext): string {
  const stop = ctx.stop;
  if (stop === null || stop === undefined) {
    throw new Error("Expected a matched token for this rule context");
  }
  return WORDS[tokenName(stop.type)];
}

/**
 * Walks a call parse tree, emitting canonical capitalized, hyphen-separated
 * words in grammar order. Words always come out in the order they were called:
 * the two damage-type slots can hold any two damage types (not just two
 * elementals), and there is no rulebook order to sort such a pair into, so
 * "fire dark" and "dark fire" normalize apart.
 */
export class Canonicalizer extends CallsVisitor<void> {
  private words: string[] = [];

  public canonicalize(tree: CallTree): string {
    this.words = [];
    if (tree instanceof DefensiveCallContext) {
      this.visitDefensiveCall(tree);
    } else {
      this.visitDamageCall(tree);
    }
    return this.words.join("-");
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
      const number = ctx.number();
      if (number) {
        this.words.push(number.NUMBER().getText());
      }
    }
    for (const damageType of ctx.damageType()) {
      this.visitDamageType(damageType);
    }
  };

  public visitFullAuto = (ctx: FullAutoContext): void => {
    if (ctx.OVERWHELM()) {
      this.words.push(WORDS.OVERWHELM);
    }
    this.words.push(WORDS.FULL, WORDS.AUTO, ctx.number().NUMBER().getText());
  };

  public visitEffect = (ctx: EffectContext): void => {
    // "Overwhelm" is an optional prefix on the effect keyword, so the keyword
    // itself is the rule's last token rather than its first.
    if (ctx.OVERWHELM()) {
      this.words.push(WORDS.OVERWHELM);
    }
    this.words.push(lastWord(ctx));
  };

  public visitResource = (ctx: ResourceContext): void => {
    this.words.push(leafWord(ctx));
  };

  public visitElemental = (ctx: ElementalContext): void => {
    this.words.push(leafWord(ctx));
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
    this.words.push(leafWord(ctx));
  };

  public visitDrainDamageType = (ctx: DrainDamageTypeContext): void => {
    // A drain carries its own amount, distinct from damageCall's optional
    // leading number ("knockdown 5 3 flesh drain" has both).
    this.words.push(ctx.number().NUMBER().getText());
    this.visitResource(ctx.resource());
    this.words.push(WORDS.DRAIN);
  };

  public visitDefensiveCall = (ctx: DefensiveCallContext): void => {
    // Every one of §8.4's seven forms is a run of keywords optionally followed
    // by a Defense name, so walking the children in order covers all of them
    // without a branch per form.
    for (const child of ctx.children) {
      if (child instanceof DefenseNameContext) {
        this.visitDefenseName(child);
      } else if (child instanceof TerminalNode) {
        this.words.push(WORDS[tokenName(child.symbol.type)]);
      }
    }
  };

  public visitDefenseName = (ctx: DefenseNameContext): void => {
    for (const word of ctx.defenseWord()) {
      this.visitDefenseWord(word);
    }
  };

  public visitDefenseWord = (ctx: DefenseWordContext): void => {
    // The rule matches any token but NUMBER, so the word is read off the token
    // itself rather than through a generated accessor. A word the lexer didn't
    // recognize has no canonical spelling on file -- that is what IDENT is --
    // so it keeps the player's own word with our capitalization applied.
    if (ctx.start?.type === CallsLexer.IDENT) {
      this.words.push(titleCase(ctx.start.text ?? ""));
      return;
    }
    this.words.push(leafWord(ctx));
  };
}

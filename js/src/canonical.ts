import type { ParserRuleContext } from "antlr4ng";

import { CallsLexer } from "./generated/CallsLexer.js";
import tokens from "./generated/canonical-tokens.json" with { type: "json" };
import {
  type DamageCallContext,
  type DamageTypeContext,
  type DrainDamageTypeContext,
  type EffectContext,
  type ElementalContext,
  type FullAutoContext,
  type ResourceContext,
} from "./generated/CallsParser.js";
import { CallsVisitor } from "./generated/CallsVisitor.js";

const WORDS: Record<string, string> = tokens.words;

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
 * Walks a damageCall parse tree, emitting canonical capitalized,
 * hyphen-separated words in grammar order. Words always come out in the
 * order they were called: the two damage-type slots can hold any two damage
 * types (not just two elementals), and there is no rulebook order to sort
 * such a pair into, so "fire dark" and "dark fire" normalize apart.
 */
export class Canonicalizer extends CallsVisitor<void> {
  private words: string[] = [];

  public canonicalize(tree: DamageCallContext): string {
    this.words = [];
    this.visitDamageCall(tree);
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
}

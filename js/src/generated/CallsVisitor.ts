
import { AbstractParseTreeVisitor } from "antlr4ng";


import { DamageCallContext } from "./CallsParser.js";
import { EffectContext } from "./CallsParser.js";
import { FullAutoContext } from "./CallsParser.js";
import { PowerWordContext } from "./CallsParser.js";
import { PowerLightContext } from "./CallsParser.js";
import { TargetContext } from "./CallsParser.js";
import { BasicEffectContext } from "./CallsParser.js";
import { NumberContext } from "./CallsParser.js";
import { DamageTypeContext } from "./CallsParser.js";
import { DrainDamageTypeContext } from "./CallsParser.js";
import { ResourceContext } from "./CallsParser.js";
import { ElementalContext } from "./CallsParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `CallsParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class CallsVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `CallsParser.damageCall`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDamageCall?: (ctx: DamageCallContext) => Result;
    /**
     * Visit a parse tree produced by `CallsParser.effect`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitEffect?: (ctx: EffectContext) => Result;
    /**
     * Visit a parse tree produced by `CallsParser.fullAuto`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFullAuto?: (ctx: FullAutoContext) => Result;
    /**
     * Visit a parse tree produced by `CallsParser.powerWord`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPowerWord?: (ctx: PowerWordContext) => Result;
    /**
     * Visit a parse tree produced by `CallsParser.powerLight`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPowerLight?: (ctx: PowerLightContext) => Result;
    /**
     * Visit a parse tree produced by `CallsParser.target`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitTarget?: (ctx: TargetContext) => Result;
    /**
     * Visit a parse tree produced by `CallsParser.basicEffect`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitBasicEffect?: (ctx: BasicEffectContext) => Result;
    /**
     * Visit a parse tree produced by `CallsParser.number`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitNumber?: (ctx: NumberContext) => Result;
    /**
     * Visit a parse tree produced by `CallsParser.damageType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDamageType?: (ctx: DamageTypeContext) => Result;
    /**
     * Visit a parse tree produced by `CallsParser.drainDamageType`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDrainDamageType?: (ctx: DrainDamageTypeContext) => Result;
    /**
     * Visit a parse tree produced by `CallsParser.resource`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitResource?: (ctx: ResourceContext) => Result;
    /**
     * Visit a parse tree produced by `CallsParser.elemental`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElemental?: (ctx: ElementalContext) => Result;
}


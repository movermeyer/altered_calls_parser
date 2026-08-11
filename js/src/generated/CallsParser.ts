
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { CallsVisitor } from "./CallsVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class CallsParser extends antlr.Parser {
    public static readonly OVERWHELM = 1;
    public static readonly FULL = 2;
    public static readonly AUTO = 3;
    public static readonly BREAK = 4;
    public static readonly CHARM = 5;
    public static readonly COMMAND = 6;
    public static readonly DAZE = 7;
    public static readonly DEATH = 8;
    public static readonly DISARM = 9;
    public static readonly FEAR = 10;
    public static readonly KNOCKDOWN = 11;
    public static readonly KNOCKOUT = 12;
    public static readonly MAIM = 13;
    public static readonly PIN = 14;
    public static readonly RAGE = 15;
    public static readonly SLAM = 16;
    public static readonly SLAY = 17;
    public static readonly STUN = 18;
    public static readonly FLESH = 19;
    public static readonly HEAL = 20;
    public static readonly REPAIR = 21;
    public static readonly FOCUS = 22;
    public static readonly STAMINA = 23;
    public static readonly FIRE = 24;
    public static readonly DARK = 25;
    public static readonly LIGHT = 26;
    public static readonly POISON = 27;
    public static readonly RAD = 28;
    public static readonly RADIATION = 29;
    public static readonly AURIC = 30;
    public static readonly FAE = 31;
    public static readonly DEEP = 32;
    public static readonly ICE = 33;
    public static readonly DRAIN = 34;
    public static readonly ARMOUR = 35;
    public static readonly NUMBER = 36;
    public static readonly SEP = 37;
    public static readonly IDENT = 38;
    public static readonly RULE_damageCall = 0;
    public static readonly RULE_fullAuto = 1;
    public static readonly RULE_effect = 2;
    public static readonly RULE_number = 3;
    public static readonly RULE_damageType = 4;
    public static readonly RULE_drainDamageType = 5;
    public static readonly RULE_resource = 6;
    public static readonly RULE_elemental = 7;

    public static readonly literalNames = [
        null, "'OVERWHELM'", "'FULL'", "'AUTO'", "'BREAK'", "'CHARM'", "'COMMAND'", 
        "'DAZE'", "'DEATH'", "'DISARM'", "'FEAR'", "'KNOCKDOWN'", "'KNOCKOUT'", 
        "'MAIM'", "'PIN'", "'RAGE'", "'SLAM'", "'SLAY'", "'STUN'", "'FLESH'", 
        "'HEAL'", "'REPAIR'", "'FOCUS'", "'STAMINA'", "'FIRE'", "'DARK'", 
        "'LIGHT'", "'POISON'", "'RAD'", "'RADIATION'", "'AURIC'", "'FAE'", 
        "'DEEP'", "'ICE'", "'DRAIN'", "'ARMOUR'"
    ];

    public static readonly symbolicNames = [
        null, "OVERWHELM", "FULL", "AUTO", "BREAK", "CHARM", "COMMAND", 
        "DAZE", "DEATH", "DISARM", "FEAR", "KNOCKDOWN", "KNOCKOUT", "MAIM", 
        "PIN", "RAGE", "SLAM", "SLAY", "STUN", "FLESH", "HEAL", "REPAIR", 
        "FOCUS", "STAMINA", "FIRE", "DARK", "LIGHT", "POISON", "RAD", "RADIATION", 
        "AURIC", "FAE", "DEEP", "ICE", "DRAIN", "ARMOUR", "NUMBER", "SEP", 
        "IDENT"
    ];
    public static readonly ruleNames = [
        "damageCall", "fullAuto", "effect", "number", "damageType", "drainDamageType", 
        "resource", "elemental",
    ];

    public get grammarFileName(): string { return "Calls.g4"; }
    public get literalNames(): (string | null)[] { return CallsParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return CallsParser.symbolicNames; }
    public get ruleNames(): string[] { return CallsParser.ruleNames; }
    public get serializedATN(): number[] { return CallsParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, CallsParser._ATN, CallsParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public damageCall(): DamageCallContext {
        let localContext = new DamageCallContext(this.context, this.state);
        this.enterRule(localContext, 0, CallsParser.RULE_damageCall);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 23;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 2, this.context) ) {
            case 1:
                {
                this.state = 16;
                this.fullAuto();
                }
                break;
            case 2:
                {
                this.state = 18;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 524274) !== 0)) {
                    {
                    this.state = 17;
                    this.effect();
                    }
                }

                this.state = 21;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
                case 1:
                    {
                    this.state = 20;
                    this.number_();
                    }
                    break;
                }
                }
                break;
            }
            this.state = 26;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 3, this.context) ) {
            case 1:
                {
                this.state = 25;
                this.damageType();
                }
                break;
            }
            this.state = 29;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (((((_la - 19)) & ~0x1F) === 0 && ((1 << (_la - 19)) & 163839) !== 0)) {
                {
                this.state = 28;
                this.damageType();
                }
            }

            this.state = 31;
            this.match(CallsParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public fullAuto(): FullAutoContext {
        let localContext = new FullAutoContext(this.context, this.state);
        this.enterRule(localContext, 2, CallsParser.RULE_fullAuto);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 34;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 1) {
                {
                this.state = 33;
                this.match(CallsParser.OVERWHELM);
                }
            }

            this.state = 36;
            this.match(CallsParser.FULL);
            this.state = 37;
            this.match(CallsParser.AUTO);
            this.state = 38;
            this.number_();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public effect(): EffectContext {
        let localContext = new EffectContext(this.context, this.state);
        this.enterRule(localContext, 4, CallsParser.RULE_effect);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 41;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 1) {
                {
                this.state = 40;
                this.match(CallsParser.OVERWHELM);
                }
            }

            this.state = 43;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 524272) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public number_(): NumberContext {
        let localContext = new NumberContext(this.context, this.state);
        this.enterRule(localContext, 6, CallsParser.RULE_number);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 45;
            this.match(CallsParser.NUMBER);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public damageType(): DamageTypeContext {
        let localContext = new DamageTypeContext(this.context, this.state);
        this.enterRule(localContext, 8, CallsParser.RULE_damageType);
        try {
            this.state = 54;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case CallsParser.NUMBER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 47;
                this.drainDamageType();
                }
                break;
            case CallsParser.FLESH:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 48;
                this.match(CallsParser.FLESH);
                }
                break;
            case CallsParser.HEAL:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 49;
                this.match(CallsParser.HEAL);
                }
                break;
            case CallsParser.REPAIR:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 50;
                this.match(CallsParser.REPAIR);
                }
                break;
            case CallsParser.FOCUS:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 51;
                this.match(CallsParser.FOCUS);
                }
                break;
            case CallsParser.STAMINA:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 52;
                this.match(CallsParser.STAMINA);
                }
                break;
            case CallsParser.FIRE:
            case CallsParser.DARK:
            case CallsParser.LIGHT:
            case CallsParser.POISON:
            case CallsParser.RAD:
            case CallsParser.RADIATION:
            case CallsParser.AURIC:
            case CallsParser.FAE:
            case CallsParser.DEEP:
            case CallsParser.ICE:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 53;
                this.elemental();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public drainDamageType(): DrainDamageTypeContext {
        let localContext = new DrainDamageTypeContext(this.context, this.state);
        this.enterRule(localContext, 10, CallsParser.RULE_drainDamageType);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 56;
            this.number_();
            this.state = 57;
            this.resource();
            this.state = 58;
            this.match(CallsParser.DRAIN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public resource(): ResourceContext {
        let localContext = new ResourceContext(this.context, this.state);
        this.enterRule(localContext, 12, CallsParser.RULE_resource);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 60;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 19)) & ~0x1F) === 0 && ((1 << (_la - 19)) & 65561) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public elemental(): ElementalContext {
        let localContext = new ElementalContext(this.context, this.state);
        this.enterRule(localContext, 14, CallsParser.RULE_elemental);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 62;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 24)) & ~0x1F) === 0 && ((1 << (_la - 24)) & 1023) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public static readonly _serializedATN: number[] = [
        4,1,38,65,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,1,0,1,0,3,0,19,8,0,1,0,3,0,22,8,0,3,0,24,8,0,1,0,3,0,27,
        8,0,1,0,3,0,30,8,0,1,0,1,0,1,1,3,1,35,8,1,1,1,1,1,1,1,1,1,1,2,3,
        2,42,8,2,1,2,1,2,1,3,1,3,1,4,1,4,1,4,1,4,1,4,1,4,1,4,3,4,55,8,4,
        1,5,1,5,1,5,1,5,1,6,1,6,1,7,1,7,1,7,0,0,8,0,2,4,6,8,10,12,14,0,3,
        1,0,4,18,3,0,19,19,22,23,35,35,1,0,24,33,69,0,23,1,0,0,0,2,34,1,
        0,0,0,4,41,1,0,0,0,6,45,1,0,0,0,8,54,1,0,0,0,10,56,1,0,0,0,12,60,
        1,0,0,0,14,62,1,0,0,0,16,24,3,2,1,0,17,19,3,4,2,0,18,17,1,0,0,0,
        18,19,1,0,0,0,19,21,1,0,0,0,20,22,3,6,3,0,21,20,1,0,0,0,21,22,1,
        0,0,0,22,24,1,0,0,0,23,16,1,0,0,0,23,18,1,0,0,0,24,26,1,0,0,0,25,
        27,3,8,4,0,26,25,1,0,0,0,26,27,1,0,0,0,27,29,1,0,0,0,28,30,3,8,4,
        0,29,28,1,0,0,0,29,30,1,0,0,0,30,31,1,0,0,0,31,32,5,0,0,1,32,1,1,
        0,0,0,33,35,5,1,0,0,34,33,1,0,0,0,34,35,1,0,0,0,35,36,1,0,0,0,36,
        37,5,2,0,0,37,38,5,3,0,0,38,39,3,6,3,0,39,3,1,0,0,0,40,42,5,1,0,
        0,41,40,1,0,0,0,41,42,1,0,0,0,42,43,1,0,0,0,43,44,7,0,0,0,44,5,1,
        0,0,0,45,46,5,36,0,0,46,7,1,0,0,0,47,55,3,10,5,0,48,55,5,19,0,0,
        49,55,5,20,0,0,50,55,5,21,0,0,51,55,5,22,0,0,52,55,5,23,0,0,53,55,
        3,14,7,0,54,47,1,0,0,0,54,48,1,0,0,0,54,49,1,0,0,0,54,50,1,0,0,0,
        54,51,1,0,0,0,54,52,1,0,0,0,54,53,1,0,0,0,55,9,1,0,0,0,56,57,3,6,
        3,0,57,58,3,12,6,0,58,59,5,34,0,0,59,11,1,0,0,0,60,61,7,1,0,0,61,
        13,1,0,0,0,62,63,7,2,0,0,63,15,1,0,0,0,8,18,21,23,26,29,34,41,54
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!CallsParser.__ATN) {
            CallsParser.__ATN = new antlr.ATNDeserializer().deserialize(CallsParser._serializedATN);
        }

        return CallsParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(CallsParser.literalNames, CallsParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return CallsParser.vocabulary;
    }

    private static readonly decisionsToDFA = CallsParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class DamageCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(CallsParser.EOF, 0)!;
    }
    public fullAuto(): FullAutoContext | null {
        return this.getRuleContext(0, FullAutoContext);
    }
    public damageType(): DamageTypeContext[];
    public damageType(i: number): DamageTypeContext | null;
    public damageType(i?: number): DamageTypeContext[] | DamageTypeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(DamageTypeContext);
        }

        return this.getRuleContext(i, DamageTypeContext);
    }
    public effect(): EffectContext | null {
        return this.getRuleContext(0, EffectContext);
    }
    public number(): NumberContext | null {
        return this.getRuleContext(0, NumberContext);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_damageCall;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitDamageCall) {
            return visitor.visitDamageCall(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FullAutoContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FULL(): antlr.TerminalNode {
        return this.getToken(CallsParser.FULL, 0)!;
    }
    public AUTO(): antlr.TerminalNode {
        return this.getToken(CallsParser.AUTO, 0)!;
    }
    public number(): NumberContext {
        return this.getRuleContext(0, NumberContext)!;
    }
    public OVERWHELM(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.OVERWHELM, 0);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_fullAuto;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitFullAuto) {
            return visitor.visitFullAuto(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class EffectContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public BREAK(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.BREAK, 0);
    }
    public CHARM(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.CHARM, 0);
    }
    public COMMAND(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.COMMAND, 0);
    }
    public DAZE(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.DAZE, 0);
    }
    public DEATH(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.DEATH, 0);
    }
    public DISARM(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.DISARM, 0);
    }
    public FEAR(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.FEAR, 0);
    }
    public KNOCKDOWN(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.KNOCKDOWN, 0);
    }
    public KNOCKOUT(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.KNOCKOUT, 0);
    }
    public MAIM(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.MAIM, 0);
    }
    public PIN(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.PIN, 0);
    }
    public RAGE(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.RAGE, 0);
    }
    public SLAM(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.SLAM, 0);
    }
    public SLAY(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.SLAY, 0);
    }
    public STUN(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.STUN, 0);
    }
    public OVERWHELM(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.OVERWHELM, 0);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_effect;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitEffect) {
            return visitor.visitEffect(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class NumberContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public NUMBER(): antlr.TerminalNode {
        return this.getToken(CallsParser.NUMBER, 0)!;
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_number;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitNumber) {
            return visitor.visitNumber(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DamageTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public drainDamageType(): DrainDamageTypeContext | null {
        return this.getRuleContext(0, DrainDamageTypeContext);
    }
    public FLESH(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.FLESH, 0);
    }
    public HEAL(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.HEAL, 0);
    }
    public REPAIR(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.REPAIR, 0);
    }
    public FOCUS(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.FOCUS, 0);
    }
    public STAMINA(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.STAMINA, 0);
    }
    public elemental(): ElementalContext | null {
        return this.getRuleContext(0, ElementalContext);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_damageType;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitDamageType) {
            return visitor.visitDamageType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DrainDamageTypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public number(): NumberContext {
        return this.getRuleContext(0, NumberContext)!;
    }
    public resource(): ResourceContext {
        return this.getRuleContext(0, ResourceContext)!;
    }
    public DRAIN(): antlr.TerminalNode {
        return this.getToken(CallsParser.DRAIN, 0)!;
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_drainDamageType;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitDrainDamageType) {
            return visitor.visitDrainDamageType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ResourceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public FLESH(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.FLESH, 0);
    }
    public STAMINA(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.STAMINA, 0);
    }
    public FOCUS(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.FOCUS, 0);
    }
    public ARMOUR(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.ARMOUR, 0);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_resource;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitResource) {
            return visitor.visitResource(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElementalContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public AURIC(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.AURIC, 0);
    }
    public DARK(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.DARK, 0);
    }
    public DEEP(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.DEEP, 0);
    }
    public FAE(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.FAE, 0);
    }
    public FIRE(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.FIRE, 0);
    }
    public ICE(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.ICE, 0);
    }
    public LIGHT(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.LIGHT, 0);
    }
    public POISON(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.POISON, 0);
    }
    public RAD(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.RAD, 0);
    }
    public RADIATION(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.RADIATION, 0);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_elemental;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitElemental) {
            return visitor.visitElemental(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


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
    public static readonly POWER = 4;
    public static readonly WORD_KW = 5;
    public static readonly LIGHT = 6;
    public static readonly YOU = 7;
    public static readonly NPCS = 8;
    public static readonly BREAK = 9;
    public static readonly CHARM = 10;
    public static readonly COMMAND = 11;
    public static readonly DAZE = 12;
    public static readonly DEATH = 13;
    public static readonly DISARM = 14;
    public static readonly FEAR = 15;
    public static readonly KNOCKDOWN = 16;
    public static readonly KNOCKOUT = 17;
    public static readonly MAIM = 18;
    public static readonly PIN = 19;
    public static readonly RAGE = 20;
    public static readonly SLAM = 21;
    public static readonly SLAY = 22;
    public static readonly STUN = 23;
    public static readonly FLESH = 24;
    public static readonly HEAL = 25;
    public static readonly REPAIR = 26;
    public static readonly FOCUS = 27;
    public static readonly STAMINA = 28;
    public static readonly FIRE = 29;
    public static readonly DARK = 30;
    public static readonly POISON = 31;
    public static readonly RAD = 32;
    public static readonly RADIATION = 33;
    public static readonly AURIC = 34;
    public static readonly FAE = 35;
    public static readonly DEEP = 36;
    public static readonly ICE = 37;
    public static readonly DRAIN = 38;
    public static readonly ARMOUR = 39;
    public static readonly NUMBER = 40;
    public static readonly SEP = 41;
    public static readonly IDENT = 42;
    public static readonly RULE_damageCall = 0;
    public static readonly RULE_effect = 1;
    public static readonly RULE_fullAuto = 2;
    public static readonly RULE_powerWord = 3;
    public static readonly RULE_powerLight = 4;
    public static readonly RULE_target = 5;
    public static readonly RULE_basicEffect = 6;
    public static readonly RULE_number = 7;
    public static readonly RULE_damageType = 8;
    public static readonly RULE_drainDamageType = 9;
    public static readonly RULE_resource = 10;
    public static readonly RULE_elemental = 11;

    public static readonly literalNames = [
        null, "'OVERWHELM'", "'FULL'", "'AUTO'", "'POWER'", "'WORD'", "'LIGHT'", 
        "'YOU'", "'NPCS'", "'BREAK'", "'CHARM'", "'COMMAND'", "'DAZE'", 
        "'DEATH'", "'DISARM'", "'FEAR'", "'KNOCKDOWN'", "'KNOCKOUT'", "'MAIM'", 
        "'PIN'", "'RAGE'", "'SLAM'", "'SLAY'", "'STUN'", "'FLESH'", "'HEAL'", 
        "'REPAIR'", "'FOCUS'", "'STAMINA'", "'FIRE'", "'DARK'", "'POISON'", 
        "'RAD'", "'RADIATION'", "'AURIC'", "'FAE'", "'DEEP'", "'ICE'", "'DRAIN'", 
        "'ARMOUR'"
    ];

    public static readonly symbolicNames = [
        null, "OVERWHELM", "FULL", "AUTO", "POWER", "WORD_KW", "LIGHT", 
        "YOU", "NPCS", "BREAK", "CHARM", "COMMAND", "DAZE", "DEATH", "DISARM", 
        "FEAR", "KNOCKDOWN", "KNOCKOUT", "MAIM", "PIN", "RAGE", "SLAM", 
        "SLAY", "STUN", "FLESH", "HEAL", "REPAIR", "FOCUS", "STAMINA", "FIRE", 
        "DARK", "POISON", "RAD", "RADIATION", "AURIC", "FAE", "DEEP", "ICE", 
        "DRAIN", "ARMOUR", "NUMBER", "SEP", "IDENT"
    ];
    public static readonly ruleNames = [
        "damageCall", "effect", "fullAuto", "powerWord", "powerLight", "target", 
        "basicEffect", "number", "damageType", "drainDamageType", "resource", 
        "elemental",
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
            this.state = 31;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 2, this.context) ) {
            case 1:
                {
                this.state = 24;
                this.fullAuto();
                }
                break;
            case 2:
                {
                this.state = 26;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 16776722) !== 0)) {
                    {
                    this.state = 25;
                    this.effect();
                    }
                }

                this.state = 29;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
                case 1:
                    {
                    this.state = 28;
                    this.number_();
                    }
                    break;
                }
                }
                break;
            }
            this.state = 34;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 3, this.context) ) {
            case 1:
                {
                this.state = 33;
                this.damageType();
                }
                break;
            }
            this.state = 37;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 4278190144) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 319) !== 0)) {
                {
                this.state = 36;
                this.damageType();
                }
            }

            this.state = 39;
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
    public effect(): EffectContext {
        let localContext = new EffectContext(this.context, this.state);
        this.enterRule(localContext, 2, CallsParser.RULE_effect);
        try {
            this.state = 44;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 5, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 41;
                this.powerWord();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 42;
                this.powerLight();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 43;
                this.basicEffect();
                }
                break;
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
        this.enterRule(localContext, 4, CallsParser.RULE_fullAuto);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 47;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 1) {
                {
                this.state = 46;
                this.match(CallsParser.OVERWHELM);
                }
            }

            this.state = 49;
            this.match(CallsParser.FULL);
            this.state = 50;
            this.match(CallsParser.AUTO);
            this.state = 51;
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
    public powerWord(): PowerWordContext {
        let localContext = new PowerWordContext(this.context, this.state);
        this.enterRule(localContext, 6, CallsParser.RULE_powerWord);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 53;
            this.match(CallsParser.POWER);
            this.state = 54;
            this.match(CallsParser.WORD_KW);
            this.state = 56;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 7 || _la === 8) {
                {
                this.state = 55;
                this.target();
                }
            }

            this.state = 58;
            this.basicEffect();
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
    public powerLight(): PowerLightContext {
        let localContext = new PowerLightContext(this.context, this.state);
        this.enterRule(localContext, 8, CallsParser.RULE_powerLight);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 60;
            this.match(CallsParser.POWER);
            this.state = 61;
            this.match(CallsParser.LIGHT);
            this.state = 63;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 7 || _la === 8) {
                {
                this.state = 62;
                this.target();
                }
            }

            this.state = 65;
            this.basicEffect();
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
    public target(): TargetContext {
        let localContext = new TargetContext(this.context, this.state);
        this.enterRule(localContext, 10, CallsParser.RULE_target);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 67;
            _la = this.tokenStream.LA(1);
            if(!(_la === 7 || _la === 8)) {
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
    public basicEffect(): BasicEffectContext {
        let localContext = new BasicEffectContext(this.context, this.state);
        this.enterRule(localContext, 12, CallsParser.RULE_basicEffect);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 70;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 1) {
                {
                this.state = 69;
                this.match(CallsParser.OVERWHELM);
                }
            }

            this.state = 72;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 16776704) !== 0))) {
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
        this.enterRule(localContext, 14, CallsParser.RULE_number);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 74;
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
        this.enterRule(localContext, 16, CallsParser.RULE_damageType);
        try {
            this.state = 83;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case CallsParser.NUMBER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 76;
                this.drainDamageType();
                }
                break;
            case CallsParser.FLESH:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 77;
                this.match(CallsParser.FLESH);
                }
                break;
            case CallsParser.HEAL:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 78;
                this.match(CallsParser.HEAL);
                }
                break;
            case CallsParser.REPAIR:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 79;
                this.match(CallsParser.REPAIR);
                }
                break;
            case CallsParser.FOCUS:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 80;
                this.match(CallsParser.FOCUS);
                }
                break;
            case CallsParser.STAMINA:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 81;
                this.match(CallsParser.STAMINA);
                }
                break;
            case CallsParser.LIGHT:
            case CallsParser.FIRE:
            case CallsParser.DARK:
            case CallsParser.POISON:
            case CallsParser.RAD:
            case CallsParser.RADIATION:
            case CallsParser.AURIC:
            case CallsParser.FAE:
            case CallsParser.DEEP:
            case CallsParser.ICE:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 82;
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
        this.enterRule(localContext, 18, CallsParser.RULE_drainDamageType);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 85;
            this.number_();
            this.state = 86;
            this.resource();
            this.state = 87;
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
        this.enterRule(localContext, 20, CallsParser.RULE_resource);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 89;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 24)) & ~0x1F) === 0 && ((1 << (_la - 24)) & 32793) !== 0))) {
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
        this.enterRule(localContext, 22, CallsParser.RULE_elemental);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 91;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 6)) & ~0x1F) === 0 && ((1 << (_la - 6)) & 4286578689) !== 0))) {
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
        4,1,42,94,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,1,0,1,0,3,0,27,8,0,
        1,0,3,0,30,8,0,3,0,32,8,0,1,0,3,0,35,8,0,1,0,3,0,38,8,0,1,0,1,0,
        1,1,1,1,1,1,3,1,45,8,1,1,2,3,2,48,8,2,1,2,1,2,1,2,1,2,1,3,1,3,1,
        3,3,3,57,8,3,1,3,1,3,1,4,1,4,1,4,3,4,64,8,4,1,4,1,4,1,5,1,5,1,6,
        3,6,71,8,6,1,6,1,6,1,7,1,7,1,8,1,8,1,8,1,8,1,8,1,8,1,8,3,8,84,8,
        8,1,9,1,9,1,9,1,9,1,10,1,10,1,11,1,11,1,11,0,0,12,0,2,4,6,8,10,12,
        14,16,18,20,22,0,4,1,0,7,8,1,0,9,23,3,0,24,24,27,28,39,39,2,0,6,
        6,29,37,98,0,31,1,0,0,0,2,44,1,0,0,0,4,47,1,0,0,0,6,53,1,0,0,0,8,
        60,1,0,0,0,10,67,1,0,0,0,12,70,1,0,0,0,14,74,1,0,0,0,16,83,1,0,0,
        0,18,85,1,0,0,0,20,89,1,0,0,0,22,91,1,0,0,0,24,32,3,4,2,0,25,27,
        3,2,1,0,26,25,1,0,0,0,26,27,1,0,0,0,27,29,1,0,0,0,28,30,3,14,7,0,
        29,28,1,0,0,0,29,30,1,0,0,0,30,32,1,0,0,0,31,24,1,0,0,0,31,26,1,
        0,0,0,32,34,1,0,0,0,33,35,3,16,8,0,34,33,1,0,0,0,34,35,1,0,0,0,35,
        37,1,0,0,0,36,38,3,16,8,0,37,36,1,0,0,0,37,38,1,0,0,0,38,39,1,0,
        0,0,39,40,5,0,0,1,40,1,1,0,0,0,41,45,3,6,3,0,42,45,3,8,4,0,43,45,
        3,12,6,0,44,41,1,0,0,0,44,42,1,0,0,0,44,43,1,0,0,0,45,3,1,0,0,0,
        46,48,5,1,0,0,47,46,1,0,0,0,47,48,1,0,0,0,48,49,1,0,0,0,49,50,5,
        2,0,0,50,51,5,3,0,0,51,52,3,14,7,0,52,5,1,0,0,0,53,54,5,4,0,0,54,
        56,5,5,0,0,55,57,3,10,5,0,56,55,1,0,0,0,56,57,1,0,0,0,57,58,1,0,
        0,0,58,59,3,12,6,0,59,7,1,0,0,0,60,61,5,4,0,0,61,63,5,6,0,0,62,64,
        3,10,5,0,63,62,1,0,0,0,63,64,1,0,0,0,64,65,1,0,0,0,65,66,3,12,6,
        0,66,9,1,0,0,0,67,68,7,0,0,0,68,11,1,0,0,0,69,71,5,1,0,0,70,69,1,
        0,0,0,70,71,1,0,0,0,71,72,1,0,0,0,72,73,7,1,0,0,73,13,1,0,0,0,74,
        75,5,40,0,0,75,15,1,0,0,0,76,84,3,18,9,0,77,84,5,24,0,0,78,84,5,
        25,0,0,79,84,5,26,0,0,80,84,5,27,0,0,81,84,5,28,0,0,82,84,3,22,11,
        0,83,76,1,0,0,0,83,77,1,0,0,0,83,78,1,0,0,0,83,79,1,0,0,0,83,80,
        1,0,0,0,83,81,1,0,0,0,83,82,1,0,0,0,84,17,1,0,0,0,85,86,3,14,7,0,
        86,87,3,20,10,0,87,88,5,38,0,0,88,19,1,0,0,0,89,90,7,2,0,0,90,21,
        1,0,0,0,91,92,7,3,0,0,92,23,1,0,0,0,11,26,29,31,34,37,44,47,56,63,
        70,83
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


export class EffectContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public powerWord(): PowerWordContext | null {
        return this.getRuleContext(0, PowerWordContext);
    }
    public powerLight(): PowerLightContext | null {
        return this.getRuleContext(0, PowerLightContext);
    }
    public basicEffect(): BasicEffectContext | null {
        return this.getRuleContext(0, BasicEffectContext);
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


export class PowerWordContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public POWER(): antlr.TerminalNode {
        return this.getToken(CallsParser.POWER, 0)!;
    }
    public WORD_KW(): antlr.TerminalNode {
        return this.getToken(CallsParser.WORD_KW, 0)!;
    }
    public basicEffect(): BasicEffectContext {
        return this.getRuleContext(0, BasicEffectContext)!;
    }
    public target(): TargetContext | null {
        return this.getRuleContext(0, TargetContext);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_powerWord;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitPowerWord) {
            return visitor.visitPowerWord(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PowerLightContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public POWER(): antlr.TerminalNode {
        return this.getToken(CallsParser.POWER, 0)!;
    }
    public LIGHT(): antlr.TerminalNode {
        return this.getToken(CallsParser.LIGHT, 0)!;
    }
    public basicEffect(): BasicEffectContext {
        return this.getRuleContext(0, BasicEffectContext)!;
    }
    public target(): TargetContext | null {
        return this.getRuleContext(0, TargetContext);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_powerLight;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitPowerLight) {
            return visitor.visitPowerLight(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TargetContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public YOU(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.YOU, 0);
    }
    public NPCS(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.NPCS, 0);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_target;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitTarget) {
            return visitor.visitTarget(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class BasicEffectContext extends antlr.ParserRuleContext {
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
        return CallsParser.RULE_basicEffect;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitBasicEffect) {
            return visitor.visitBasicEffect(this);
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

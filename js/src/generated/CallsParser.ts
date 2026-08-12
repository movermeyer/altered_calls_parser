
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
    public static readonly MITIGATE = 36;
    public static readonly SACRIFICE = 37;
    public static readonly PARRY = 38;
    public static readonly PHASE = 39;
    public static readonly OUT = 40;
    public static readonly IN = 41;
    public static readonly SHRUG = 42;
    public static readonly OFF = 43;
    public static readonly WITHSTAND = 44;
    public static readonly BALANCED = 45;
    public static readonly ETHEREAL = 46;
    public static readonly FERAL = 47;
    public static readonly DEFENSE = 48;
    public static readonly INSPIRED = 49;
    public static readonly MORALE = 50;
    public static readonly RECEDING = 51;
    public static readonly TIDE = 52;
    public static readonly REINFORCED = 53;
    public static readonly MIND = 54;
    public static readonly STURDY = 55;
    public static readonly SUNKISSED = 56;
    public static readonly NUMBER = 57;
    public static readonly SEP = 58;
    public static readonly IDENT = 59;
    public static readonly RULE_call = 0;
    public static readonly RULE_damageCall = 1;
    public static readonly RULE_fullAuto = 2;
    public static readonly RULE_effect = 3;
    public static readonly RULE_number = 4;
    public static readonly RULE_damageType = 5;
    public static readonly RULE_drainDamageType = 6;
    public static readonly RULE_resource = 7;
    public static readonly RULE_elemental = 8;
    public static readonly RULE_defensiveCall = 9;
    public static readonly RULE_defenseName = 10;
    public static readonly RULE_defenseWord = 11;

    public static readonly literalNames = [
        null, "'OVERWHELM'", "'FULL'", "'AUTO'", "'BREAK'", "'CHARM'", "'COMMAND'", 
        "'DAZE'", "'DEATH'", "'DISARM'", "'FEAR'", "'KNOCKDOWN'", "'KNOCKOUT'", 
        "'MAIM'", "'PIN'", "'RAGE'", "'SLAM'", "'SLAY'", "'STUN'", "'FLESH'", 
        "'HEAL'", "'REPAIR'", "'FOCUS'", "'STAMINA'", "'FIRE'", "'DARK'", 
        "'LIGHT'", "'POISON'", "'RAD'", "'RADIATION'", "'AURIC'", "'FAE'", 
        "'DEEP'", "'ICE'", "'DRAIN'", "'ARMOUR'", "'MITIGATE'", "'SACRIFICE'", 
        "'PARRY'", "'PHASE'", "'OUT'", "'IN'", "'SHRUG'", "'OFF'", "'WITHSTAND'", 
        "'BALANCED'", "'ETHEREAL'", "'FERAL'", "'DEFENSE'", "'INSPIRED'", 
        "'MORALE'", "'RECEDING'", "'TIDE'", "'REINFORCED'", "'MIND'", "'STURDY'", 
        "'SUNKISSED'"
    ];

    public static readonly symbolicNames = [
        null, "OVERWHELM", "FULL", "AUTO", "BREAK", "CHARM", "COMMAND", 
        "DAZE", "DEATH", "DISARM", "FEAR", "KNOCKDOWN", "KNOCKOUT", "MAIM", 
        "PIN", "RAGE", "SLAM", "SLAY", "STUN", "FLESH", "HEAL", "REPAIR", 
        "FOCUS", "STAMINA", "FIRE", "DARK", "LIGHT", "POISON", "RAD", "RADIATION", 
        "AURIC", "FAE", "DEEP", "ICE", "DRAIN", "ARMOUR", "MITIGATE", "SACRIFICE", 
        "PARRY", "PHASE", "OUT", "IN", "SHRUG", "OFF", "WITHSTAND", "BALANCED", 
        "ETHEREAL", "FERAL", "DEFENSE", "INSPIRED", "MORALE", "RECEDING", 
        "TIDE", "REINFORCED", "MIND", "STURDY", "SUNKISSED", "NUMBER", "SEP", 
        "IDENT"
    ];
    public static readonly ruleNames = [
        "call", "damageCall", "fullAuto", "effect", "number", "damageType", 
        "drainDamageType", "resource", "elemental", "defensiveCall", "defenseName", 
        "defenseWord",
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
    public call(): CallContext {
        let localContext = new CallContext(this.context, this.state);
        this.enterRule(localContext, 0, CallsParser.RULE_call);
        try {
            this.state = 30;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case CallsParser.EOF:
            case CallsParser.OVERWHELM:
            case CallsParser.FULL:
            case CallsParser.BREAK:
            case CallsParser.CHARM:
            case CallsParser.COMMAND:
            case CallsParser.DAZE:
            case CallsParser.DEATH:
            case CallsParser.DISARM:
            case CallsParser.FEAR:
            case CallsParser.KNOCKDOWN:
            case CallsParser.KNOCKOUT:
            case CallsParser.MAIM:
            case CallsParser.PIN:
            case CallsParser.RAGE:
            case CallsParser.SLAM:
            case CallsParser.SLAY:
            case CallsParser.STUN:
            case CallsParser.FLESH:
            case CallsParser.HEAL:
            case CallsParser.REPAIR:
            case CallsParser.FOCUS:
            case CallsParser.STAMINA:
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
            case CallsParser.NUMBER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 24;
                this.damageCall();
                this.state = 25;
                this.match(CallsParser.EOF);
                }
                break;
            case CallsParser.MITIGATE:
            case CallsParser.SACRIFICE:
            case CallsParser.PARRY:
            case CallsParser.PHASE:
            case CallsParser.SHRUG:
            case CallsParser.WITHSTAND:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 27;
                this.defensiveCall();
                this.state = 28;
                this.match(CallsParser.EOF);
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
    public damageCall(): DamageCallContext {
        let localContext = new DamageCallContext(this.context, this.state);
        this.enterRule(localContext, 2, CallsParser.RULE_damageCall);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 39;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 3, this.context) ) {
            case 1:
                {
                this.state = 32;
                this.fullAuto();
                }
                break;
            case 2:
                {
                this.state = 34;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 524274) !== 0)) {
                    {
                    this.state = 33;
                    this.effect();
                    }
                }

                this.state = 37;
                this.errorHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this.tokenStream, 2, this.context) ) {
                case 1:
                    {
                    this.state = 36;
                    this.number_();
                    }
                    break;
                }
                }
                break;
            }
            this.state = 42;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 4, this.context) ) {
            case 1:
                {
                this.state = 41;
                this.damageType();
                }
                break;
            }
            this.state = 45;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 4294443008) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 33554435) !== 0)) {
                {
                this.state = 44;
                this.damageType();
                }
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
    public fullAuto(): FullAutoContext {
        let localContext = new FullAutoContext(this.context, this.state);
        this.enterRule(localContext, 4, CallsParser.RULE_fullAuto);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 48;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 1) {
                {
                this.state = 47;
                this.match(CallsParser.OVERWHELM);
                }
            }

            this.state = 50;
            this.match(CallsParser.FULL);
            this.state = 51;
            this.match(CallsParser.AUTO);
            this.state = 52;
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
        this.enterRule(localContext, 6, CallsParser.RULE_effect);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 55;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 1) {
                {
                this.state = 54;
                this.match(CallsParser.OVERWHELM);
                }
            }

            this.state = 57;
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
        this.enterRule(localContext, 8, CallsParser.RULE_number);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 59;
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
        this.enterRule(localContext, 10, CallsParser.RULE_damageType);
        try {
            this.state = 68;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case CallsParser.NUMBER:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 61;
                this.drainDamageType();
                }
                break;
            case CallsParser.FLESH:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 62;
                this.match(CallsParser.FLESH);
                }
                break;
            case CallsParser.HEAL:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 63;
                this.match(CallsParser.HEAL);
                }
                break;
            case CallsParser.REPAIR:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 64;
                this.match(CallsParser.REPAIR);
                }
                break;
            case CallsParser.FOCUS:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 65;
                this.match(CallsParser.FOCUS);
                }
                break;
            case CallsParser.STAMINA:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 66;
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
                this.state = 67;
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
        this.enterRule(localContext, 12, CallsParser.RULE_drainDamageType);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 70;
            this.number_();
            this.state = 71;
            this.resource();
            this.state = 72;
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
        this.enterRule(localContext, 14, CallsParser.RULE_resource);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 74;
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
        this.enterRule(localContext, 16, CallsParser.RULE_elemental);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 76;
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
    public defensiveCall(): DefensiveCallContext {
        let localContext = new DefensiveCallContext(this.context, this.state);
        this.enterRule(localContext, 18, CallsParser.RULE_defensiveCall);
        let _la: number;
        try {
            this.state = 87;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case CallsParser.MITIGATE:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 78;
                this.match(CallsParser.MITIGATE);
                this.state = 79;
                this.defenseName();
                }
                break;
            case CallsParser.SACRIFICE:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 80;
                this.match(CallsParser.SACRIFICE);
                }
                break;
            case CallsParser.PARRY:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 81;
                this.match(CallsParser.PARRY);
                }
                break;
            case CallsParser.PHASE:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 82;
                this.match(CallsParser.PHASE);
                this.state = 83;
                _la = this.tokenStream.LA(1);
                if(!(_la === 40 || _la === 41)) {
                this.errorHandler.recoverInline(this);
                }
                else {
                    this.errorHandler.reportMatch(this);
                    this.consume();
                }
                }
                break;
            case CallsParser.SHRUG:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 84;
                this.match(CallsParser.SHRUG);
                this.state = 85;
                this.match(CallsParser.OFF);
                }
                break;
            case CallsParser.WITHSTAND:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 86;
                this.match(CallsParser.WITHSTAND);
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
    public defenseName(): DefenseNameContext {
        let localContext = new DefenseNameContext(this.context, this.state);
        this.enterRule(localContext, 20, CallsParser.RULE_defenseName);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 90;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            do {
                {
                {
                this.state = 89;
                this.defenseWord();
                }
                }
                this.state = 92;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 4294967294) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 234881023) !== 0));
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
    public defenseWord(): DefenseWordContext {
        let localContext = new DefenseWordContext(this.context, this.state);
        this.enterRule(localContext, 22, CallsParser.RULE_defenseWord);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 94;
            _la = this.tokenStream.LA(1);
            if(_la<=0 || _la === 57) {
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
        4,1,59,97,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,1,0,1,0,1,0,1,0,1,
        0,1,0,3,0,31,8,0,1,1,1,1,3,1,35,8,1,1,1,3,1,38,8,1,3,1,40,8,1,1,
        1,3,1,43,8,1,1,1,3,1,46,8,1,1,2,3,2,49,8,2,1,2,1,2,1,2,1,2,1,3,3,
        3,56,8,3,1,3,1,3,1,4,1,4,1,5,1,5,1,5,1,5,1,5,1,5,1,5,3,5,69,8,5,
        1,6,1,6,1,6,1,6,1,7,1,7,1,8,1,8,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,
        1,9,3,9,88,8,9,1,10,4,10,91,8,10,11,10,12,10,92,1,11,1,11,1,11,0,
        0,12,0,2,4,6,8,10,12,14,16,18,20,22,0,5,1,0,4,18,3,0,19,19,22,23,
        35,35,1,0,24,33,1,0,40,41,1,0,57,57,104,0,30,1,0,0,0,2,39,1,0,0,
        0,4,48,1,0,0,0,6,55,1,0,0,0,8,59,1,0,0,0,10,68,1,0,0,0,12,70,1,0,
        0,0,14,74,1,0,0,0,16,76,1,0,0,0,18,87,1,0,0,0,20,90,1,0,0,0,22,94,
        1,0,0,0,24,25,3,2,1,0,25,26,5,0,0,1,26,31,1,0,0,0,27,28,3,18,9,0,
        28,29,5,0,0,1,29,31,1,0,0,0,30,24,1,0,0,0,30,27,1,0,0,0,31,1,1,0,
        0,0,32,40,3,4,2,0,33,35,3,6,3,0,34,33,1,0,0,0,34,35,1,0,0,0,35,37,
        1,0,0,0,36,38,3,8,4,0,37,36,1,0,0,0,37,38,1,0,0,0,38,40,1,0,0,0,
        39,32,1,0,0,0,39,34,1,0,0,0,40,42,1,0,0,0,41,43,3,10,5,0,42,41,1,
        0,0,0,42,43,1,0,0,0,43,45,1,0,0,0,44,46,3,10,5,0,45,44,1,0,0,0,45,
        46,1,0,0,0,46,3,1,0,0,0,47,49,5,1,0,0,48,47,1,0,0,0,48,49,1,0,0,
        0,49,50,1,0,0,0,50,51,5,2,0,0,51,52,5,3,0,0,52,53,3,8,4,0,53,5,1,
        0,0,0,54,56,5,1,0,0,55,54,1,0,0,0,55,56,1,0,0,0,56,57,1,0,0,0,57,
        58,7,0,0,0,58,7,1,0,0,0,59,60,5,57,0,0,60,9,1,0,0,0,61,69,3,12,6,
        0,62,69,5,19,0,0,63,69,5,20,0,0,64,69,5,21,0,0,65,69,5,22,0,0,66,
        69,5,23,0,0,67,69,3,16,8,0,68,61,1,0,0,0,68,62,1,0,0,0,68,63,1,0,
        0,0,68,64,1,0,0,0,68,65,1,0,0,0,68,66,1,0,0,0,68,67,1,0,0,0,69,11,
        1,0,0,0,70,71,3,8,4,0,71,72,3,14,7,0,72,73,5,34,0,0,73,13,1,0,0,
        0,74,75,7,1,0,0,75,15,1,0,0,0,76,77,7,2,0,0,77,17,1,0,0,0,78,79,
        5,36,0,0,79,88,3,20,10,0,80,88,5,37,0,0,81,88,5,38,0,0,82,83,5,39,
        0,0,83,88,7,3,0,0,84,85,5,42,0,0,85,88,5,43,0,0,86,88,5,44,0,0,87,
        78,1,0,0,0,87,80,1,0,0,0,87,81,1,0,0,0,87,82,1,0,0,0,87,84,1,0,0,
        0,87,86,1,0,0,0,88,19,1,0,0,0,89,91,3,22,11,0,90,89,1,0,0,0,91,92,
        1,0,0,0,92,90,1,0,0,0,92,93,1,0,0,0,93,21,1,0,0,0,94,95,8,4,0,0,
        95,23,1,0,0,0,11,30,34,37,39,42,45,48,55,68,87,92
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

export class CallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public damageCall(): DamageCallContext | null {
        return this.getRuleContext(0, DamageCallContext);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(CallsParser.EOF, 0)!;
    }
    public defensiveCall(): DefensiveCallContext | null {
        return this.getRuleContext(0, DefensiveCallContext);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_call;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitCall) {
            return visitor.visitCall(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DamageCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
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


export class DefensiveCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public MITIGATE(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.MITIGATE, 0);
    }
    public defenseName(): DefenseNameContext | null {
        return this.getRuleContext(0, DefenseNameContext);
    }
    public SACRIFICE(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.SACRIFICE, 0);
    }
    public PARRY(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.PARRY, 0);
    }
    public PHASE(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.PHASE, 0);
    }
    public OUT(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.OUT, 0);
    }
    public IN(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.IN, 0);
    }
    public SHRUG(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.SHRUG, 0);
    }
    public OFF(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.OFF, 0);
    }
    public WITHSTAND(): antlr.TerminalNode | null {
        return this.getToken(CallsParser.WITHSTAND, 0);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_defensiveCall;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitDefensiveCall) {
            return visitor.visitDefensiveCall(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DefenseNameContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public defenseWord(): DefenseWordContext[];
    public defenseWord(i: number): DefenseWordContext | null;
    public defenseWord(i?: number): DefenseWordContext[] | DefenseWordContext | null {
        if (i === undefined) {
            return this.getRuleContexts(DefenseWordContext);
        }

        return this.getRuleContext(i, DefenseWordContext);
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_defenseName;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitDefenseName) {
            return visitor.visitDefenseName(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DefenseWordContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public NUMBER(): antlr.TerminalNode {
        return this.getToken(CallsParser.NUMBER, 0)!;
    }
    public override get ruleIndex(): number {
        return CallsParser.RULE_defenseWord;
    }
    public override accept<Result>(visitor: CallsVisitor<Result>): Result | null {
        if (visitor.visitDefenseWord) {
            return visitor.visitDefenseWord(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}

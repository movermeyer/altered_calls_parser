# encoding: utf-8
from antlr4 import *
from io import StringIO
import sys
if sys.version_info[1] > 5:
	from typing import TextIO
else:
	from typing.io import TextIO

def serializedATN():
    return [
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
    ]

class CallsParser ( Parser ):

    grammarFileName = "Calls.g4"

    atn = ATNDeserializer().deserialize(serializedATN())

    decisionsToDFA = [ DFA(ds, i) for i, ds in enumerate(atn.decisionToState) ]

    sharedContextCache = PredictionContextCache()

    literalNames = [ "<INVALID>", "'OVERWHELM'", "'FULL'", "'AUTO'", "'BREAK'", 
                     "'CHARM'", "'COMMAND'", "'DAZE'", "'DEATH'", "'DISARM'", 
                     "'FEAR'", "'KNOCKDOWN'", "'KNOCKOUT'", "'MAIM'", "'PIN'", 
                     "'RAGE'", "'SLAM'", "'SLAY'", "'STUN'", "'FLESH'", 
                     "'HEAL'", "'REPAIR'", "'FOCUS'", "'STAMINA'", "'FIRE'", 
                     "'DARK'", "'LIGHT'", "'POISON'", "'RAD'", "'RADIATION'", 
                     "'AURIC'", "'FAE'", "'DEEP'", "'ICE'", "'DRAIN'", "'ARMOUR'", 
                     "'MITIGATE'", "'SACRIFICE'", "'PARRY'", "'PHASE'", 
                     "'OUT'", "'IN'", "'SHRUG'", "'OFF'", "'WITHSTAND'", 
                     "'BALANCED'", "'ETHEREAL'", "'FERAL'", "'DEFENSE'", 
                     "'INSPIRED'", "'MORALE'", "'RECEDING'", "'TIDE'", "'REINFORCED'", 
                     "'MIND'", "'STURDY'", "'SUNKISSED'" ]

    symbolicNames = [ "<INVALID>", "OVERWHELM", "FULL", "AUTO", "BREAK", 
                      "CHARM", "COMMAND", "DAZE", "DEATH", "DISARM", "FEAR", 
                      "KNOCKDOWN", "KNOCKOUT", "MAIM", "PIN", "RAGE", "SLAM", 
                      "SLAY", "STUN", "FLESH", "HEAL", "REPAIR", "FOCUS", 
                      "STAMINA", "FIRE", "DARK", "LIGHT", "POISON", "RAD", 
                      "RADIATION", "AURIC", "FAE", "DEEP", "ICE", "DRAIN", 
                      "ARMOUR", "MITIGATE", "SACRIFICE", "PARRY", "PHASE", 
                      "OUT", "IN", "SHRUG", "OFF", "WITHSTAND", "BALANCED", 
                      "ETHEREAL", "FERAL", "DEFENSE", "INSPIRED", "MORALE", 
                      "RECEDING", "TIDE", "REINFORCED", "MIND", "STURDY", 
                      "SUNKISSED", "NUMBER", "SEP", "IDENT" ]

    RULE_call = 0
    RULE_damageCall = 1
    RULE_fullAuto = 2
    RULE_effect = 3
    RULE_number = 4
    RULE_damageType = 5
    RULE_drainDamageType = 6
    RULE_resource = 7
    RULE_elemental = 8
    RULE_defensiveCall = 9
    RULE_defenseName = 10
    RULE_defenseWord = 11

    ruleNames =  [ "call", "damageCall", "fullAuto", "effect", "number", 
                   "damageType", "drainDamageType", "resource", "elemental", 
                   "defensiveCall", "defenseName", "defenseWord" ]

    EOF = Token.EOF
    OVERWHELM=1
    FULL=2
    AUTO=3
    BREAK=4
    CHARM=5
    COMMAND=6
    DAZE=7
    DEATH=8
    DISARM=9
    FEAR=10
    KNOCKDOWN=11
    KNOCKOUT=12
    MAIM=13
    PIN=14
    RAGE=15
    SLAM=16
    SLAY=17
    STUN=18
    FLESH=19
    HEAL=20
    REPAIR=21
    FOCUS=22
    STAMINA=23
    FIRE=24
    DARK=25
    LIGHT=26
    POISON=27
    RAD=28
    RADIATION=29
    AURIC=30
    FAE=31
    DEEP=32
    ICE=33
    DRAIN=34
    ARMOUR=35
    MITIGATE=36
    SACRIFICE=37
    PARRY=38
    PHASE=39
    OUT=40
    IN=41
    SHRUG=42
    OFF=43
    WITHSTAND=44
    BALANCED=45
    ETHEREAL=46
    FERAL=47
    DEFENSE=48
    INSPIRED=49
    MORALE=50
    RECEDING=51
    TIDE=52
    REINFORCED=53
    MIND=54
    STURDY=55
    SUNKISSED=56
    NUMBER=57
    SEP=58
    IDENT=59

    def __init__(self, input:TokenStream, output:TextIO = sys.stdout):
        super().__init__(input, output)
        self.checkVersion("4.13.2")
        self._interp = ParserATNSimulator(self, self.atn, self.decisionsToDFA, self.sharedContextCache)
        self._predicates = None




    class CallContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def damageCall(self):
            return self.getTypedRuleContext(CallsParser.DamageCallContext,0)


        def EOF(self):
            return self.getToken(CallsParser.EOF, 0)

        def defensiveCall(self):
            return self.getTypedRuleContext(CallsParser.DefensiveCallContext,0)


        def getRuleIndex(self):
            return CallsParser.RULE_call

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitCall" ):
                return visitor.visitCall(self)
            else:
                return visitor.visitChildren(self)




    def call(self):

        localctx = CallsParser.CallContext(self, self._ctx, self.state)
        self.enterRule(localctx, 0, self.RULE_call)
        try:
            self.state = 30
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [-1, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 57]:
                self.enterOuterAlt(localctx, 1)
                self.state = 24
                self.damageCall()
                self.state = 25
                self.match(CallsParser.EOF)
                pass
            elif token in [36, 37, 38, 39, 42, 44]:
                self.enterOuterAlt(localctx, 2)
                self.state = 27
                self.defensiveCall()
                self.state = 28
                self.match(CallsParser.EOF)
                pass
            else:
                raise NoViableAltException(self)

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class DamageCallContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def fullAuto(self):
            return self.getTypedRuleContext(CallsParser.FullAutoContext,0)


        def damageType(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(CallsParser.DamageTypeContext)
            else:
                return self.getTypedRuleContext(CallsParser.DamageTypeContext,i)


        def effect(self):
            return self.getTypedRuleContext(CallsParser.EffectContext,0)


        def number(self):
            return self.getTypedRuleContext(CallsParser.NumberContext,0)


        def getRuleIndex(self):
            return CallsParser.RULE_damageCall

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitDamageCall" ):
                return visitor.visitDamageCall(self)
            else:
                return visitor.visitChildren(self)




    def damageCall(self):

        localctx = CallsParser.DamageCallContext(self, self._ctx, self.state)
        self.enterRule(localctx, 2, self.RULE_damageCall)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 39
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,3,self._ctx)
            if la_ == 1:
                self.state = 32
                self.fullAuto()
                pass

            elif la_ == 2:
                self.state = 34
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if (((_la) & ~0x3f) == 0 and ((1 << _la) & 524274) != 0):
                    self.state = 33
                    self.effect()


                self.state = 37
                self._errHandler.sync(self)
                la_ = self._interp.adaptivePredict(self._input,2,self._ctx)
                if la_ == 1:
                    self.state = 36
                    self.number()


                pass


            self.state = 42
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,4,self._ctx)
            if la_ == 1:
                self.state = 41
                self.damageType()


            self.state = 45
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if (((_la) & ~0x3f) == 0 and ((1 << _la) & 144115205255200768) != 0):
                self.state = 44
                self.damageType()


        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class FullAutoContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def FULL(self):
            return self.getToken(CallsParser.FULL, 0)

        def AUTO(self):
            return self.getToken(CallsParser.AUTO, 0)

        def number(self):
            return self.getTypedRuleContext(CallsParser.NumberContext,0)


        def OVERWHELM(self):
            return self.getToken(CallsParser.OVERWHELM, 0)

        def getRuleIndex(self):
            return CallsParser.RULE_fullAuto

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitFullAuto" ):
                return visitor.visitFullAuto(self)
            else:
                return visitor.visitChildren(self)




    def fullAuto(self):

        localctx = CallsParser.FullAutoContext(self, self._ctx, self.state)
        self.enterRule(localctx, 4, self.RULE_fullAuto)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 48
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==1:
                self.state = 47
                self.match(CallsParser.OVERWHELM)


            self.state = 50
            self.match(CallsParser.FULL)
            self.state = 51
            self.match(CallsParser.AUTO)
            self.state = 52
            self.number()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class EffectContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def BREAK(self):
            return self.getToken(CallsParser.BREAK, 0)

        def CHARM(self):
            return self.getToken(CallsParser.CHARM, 0)

        def COMMAND(self):
            return self.getToken(CallsParser.COMMAND, 0)

        def DAZE(self):
            return self.getToken(CallsParser.DAZE, 0)

        def DEATH(self):
            return self.getToken(CallsParser.DEATH, 0)

        def DISARM(self):
            return self.getToken(CallsParser.DISARM, 0)

        def FEAR(self):
            return self.getToken(CallsParser.FEAR, 0)

        def KNOCKDOWN(self):
            return self.getToken(CallsParser.KNOCKDOWN, 0)

        def KNOCKOUT(self):
            return self.getToken(CallsParser.KNOCKOUT, 0)

        def MAIM(self):
            return self.getToken(CallsParser.MAIM, 0)

        def PIN(self):
            return self.getToken(CallsParser.PIN, 0)

        def RAGE(self):
            return self.getToken(CallsParser.RAGE, 0)

        def SLAM(self):
            return self.getToken(CallsParser.SLAM, 0)

        def SLAY(self):
            return self.getToken(CallsParser.SLAY, 0)

        def STUN(self):
            return self.getToken(CallsParser.STUN, 0)

        def OVERWHELM(self):
            return self.getToken(CallsParser.OVERWHELM, 0)

        def getRuleIndex(self):
            return CallsParser.RULE_effect

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitEffect" ):
                return visitor.visitEffect(self)
            else:
                return visitor.visitChildren(self)




    def effect(self):

        localctx = CallsParser.EffectContext(self, self._ctx, self.state)
        self.enterRule(localctx, 6, self.RULE_effect)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 55
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==1:
                self.state = 54
                self.match(CallsParser.OVERWHELM)


            self.state = 57
            _la = self._input.LA(1)
            if not((((_la) & ~0x3f) == 0 and ((1 << _la) & 524272) != 0)):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class NumberContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def NUMBER(self):
            return self.getToken(CallsParser.NUMBER, 0)

        def getRuleIndex(self):
            return CallsParser.RULE_number

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitNumber" ):
                return visitor.visitNumber(self)
            else:
                return visitor.visitChildren(self)




    def number(self):

        localctx = CallsParser.NumberContext(self, self._ctx, self.state)
        self.enterRule(localctx, 8, self.RULE_number)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 59
            self.match(CallsParser.NUMBER)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class DamageTypeContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def drainDamageType(self):
            return self.getTypedRuleContext(CallsParser.DrainDamageTypeContext,0)


        def FLESH(self):
            return self.getToken(CallsParser.FLESH, 0)

        def HEAL(self):
            return self.getToken(CallsParser.HEAL, 0)

        def REPAIR(self):
            return self.getToken(CallsParser.REPAIR, 0)

        def FOCUS(self):
            return self.getToken(CallsParser.FOCUS, 0)

        def STAMINA(self):
            return self.getToken(CallsParser.STAMINA, 0)

        def elemental(self):
            return self.getTypedRuleContext(CallsParser.ElementalContext,0)


        def getRuleIndex(self):
            return CallsParser.RULE_damageType

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitDamageType" ):
                return visitor.visitDamageType(self)
            else:
                return visitor.visitChildren(self)




    def damageType(self):

        localctx = CallsParser.DamageTypeContext(self, self._ctx, self.state)
        self.enterRule(localctx, 10, self.RULE_damageType)
        try:
            self.state = 68
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [57]:
                self.enterOuterAlt(localctx, 1)
                self.state = 61
                self.drainDamageType()
                pass
            elif token in [19]:
                self.enterOuterAlt(localctx, 2)
                self.state = 62
                self.match(CallsParser.FLESH)
                pass
            elif token in [20]:
                self.enterOuterAlt(localctx, 3)
                self.state = 63
                self.match(CallsParser.HEAL)
                pass
            elif token in [21]:
                self.enterOuterAlt(localctx, 4)
                self.state = 64
                self.match(CallsParser.REPAIR)
                pass
            elif token in [22]:
                self.enterOuterAlt(localctx, 5)
                self.state = 65
                self.match(CallsParser.FOCUS)
                pass
            elif token in [23]:
                self.enterOuterAlt(localctx, 6)
                self.state = 66
                self.match(CallsParser.STAMINA)
                pass
            elif token in [24, 25, 26, 27, 28, 29, 30, 31, 32, 33]:
                self.enterOuterAlt(localctx, 7)
                self.state = 67
                self.elemental()
                pass
            else:
                raise NoViableAltException(self)

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class DrainDamageTypeContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def number(self):
            return self.getTypedRuleContext(CallsParser.NumberContext,0)


        def resource(self):
            return self.getTypedRuleContext(CallsParser.ResourceContext,0)


        def DRAIN(self):
            return self.getToken(CallsParser.DRAIN, 0)

        def getRuleIndex(self):
            return CallsParser.RULE_drainDamageType

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitDrainDamageType" ):
                return visitor.visitDrainDamageType(self)
            else:
                return visitor.visitChildren(self)




    def drainDamageType(self):

        localctx = CallsParser.DrainDamageTypeContext(self, self._ctx, self.state)
        self.enterRule(localctx, 12, self.RULE_drainDamageType)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 70
            self.number()
            self.state = 71
            self.resource()
            self.state = 72
            self.match(CallsParser.DRAIN)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class ResourceContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def FLESH(self):
            return self.getToken(CallsParser.FLESH, 0)

        def STAMINA(self):
            return self.getToken(CallsParser.STAMINA, 0)

        def FOCUS(self):
            return self.getToken(CallsParser.FOCUS, 0)

        def ARMOUR(self):
            return self.getToken(CallsParser.ARMOUR, 0)

        def getRuleIndex(self):
            return CallsParser.RULE_resource

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitResource" ):
                return visitor.visitResource(self)
            else:
                return visitor.visitChildren(self)




    def resource(self):

        localctx = CallsParser.ResourceContext(self, self._ctx, self.state)
        self.enterRule(localctx, 14, self.RULE_resource)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 74
            _la = self._input.LA(1)
            if not((((_la) & ~0x3f) == 0 and ((1 << _la) & 34372845568) != 0)):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class ElementalContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def AURIC(self):
            return self.getToken(CallsParser.AURIC, 0)

        def DARK(self):
            return self.getToken(CallsParser.DARK, 0)

        def DEEP(self):
            return self.getToken(CallsParser.DEEP, 0)

        def FAE(self):
            return self.getToken(CallsParser.FAE, 0)

        def FIRE(self):
            return self.getToken(CallsParser.FIRE, 0)

        def ICE(self):
            return self.getToken(CallsParser.ICE, 0)

        def LIGHT(self):
            return self.getToken(CallsParser.LIGHT, 0)

        def POISON(self):
            return self.getToken(CallsParser.POISON, 0)

        def RAD(self):
            return self.getToken(CallsParser.RAD, 0)

        def RADIATION(self):
            return self.getToken(CallsParser.RADIATION, 0)

        def getRuleIndex(self):
            return CallsParser.RULE_elemental

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitElemental" ):
                return visitor.visitElemental(self)
            else:
                return visitor.visitChildren(self)




    def elemental(self):

        localctx = CallsParser.ElementalContext(self, self._ctx, self.state)
        self.enterRule(localctx, 16, self.RULE_elemental)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 76
            _la = self._input.LA(1)
            if not((((_la) & ~0x3f) == 0 and ((1 << _la) & 17163091968) != 0)):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class DefensiveCallContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def MITIGATE(self):
            return self.getToken(CallsParser.MITIGATE, 0)

        def defenseName(self):
            return self.getTypedRuleContext(CallsParser.DefenseNameContext,0)


        def SACRIFICE(self):
            return self.getToken(CallsParser.SACRIFICE, 0)

        def PARRY(self):
            return self.getToken(CallsParser.PARRY, 0)

        def PHASE(self):
            return self.getToken(CallsParser.PHASE, 0)

        def OUT(self):
            return self.getToken(CallsParser.OUT, 0)

        def IN(self):
            return self.getToken(CallsParser.IN, 0)

        def SHRUG(self):
            return self.getToken(CallsParser.SHRUG, 0)

        def OFF(self):
            return self.getToken(CallsParser.OFF, 0)

        def WITHSTAND(self):
            return self.getToken(CallsParser.WITHSTAND, 0)

        def getRuleIndex(self):
            return CallsParser.RULE_defensiveCall

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitDefensiveCall" ):
                return visitor.visitDefensiveCall(self)
            else:
                return visitor.visitChildren(self)




    def defensiveCall(self):

        localctx = CallsParser.DefensiveCallContext(self, self._ctx, self.state)
        self.enterRule(localctx, 18, self.RULE_defensiveCall)
        self._la = 0 # Token type
        try:
            self.state = 87
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [36]:
                self.enterOuterAlt(localctx, 1)
                self.state = 78
                self.match(CallsParser.MITIGATE)
                self.state = 79
                self.defenseName()
                pass
            elif token in [37]:
                self.enterOuterAlt(localctx, 2)
                self.state = 80
                self.match(CallsParser.SACRIFICE)
                pass
            elif token in [38]:
                self.enterOuterAlt(localctx, 3)
                self.state = 81
                self.match(CallsParser.PARRY)
                pass
            elif token in [39]:
                self.enterOuterAlt(localctx, 4)
                self.state = 82
                self.match(CallsParser.PHASE)
                self.state = 83
                _la = self._input.LA(1)
                if not(_la==40 or _la==41):
                    self._errHandler.recoverInline(self)
                else:
                    self._errHandler.reportMatch(self)
                    self.consume()
                pass
            elif token in [42]:
                self.enterOuterAlt(localctx, 5)
                self.state = 84
                self.match(CallsParser.SHRUG)
                self.state = 85
                self.match(CallsParser.OFF)
                pass
            elif token in [44]:
                self.enterOuterAlt(localctx, 6)
                self.state = 86
                self.match(CallsParser.WITHSTAND)
                pass
            else:
                raise NoViableAltException(self)

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class DefenseNameContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def defenseWord(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(CallsParser.DefenseWordContext)
            else:
                return self.getTypedRuleContext(CallsParser.DefenseWordContext,i)


        def getRuleIndex(self):
            return CallsParser.RULE_defenseName

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitDefenseName" ):
                return visitor.visitDefenseName(self)
            else:
                return visitor.visitChildren(self)




    def defenseName(self):

        localctx = CallsParser.DefenseNameContext(self, self._ctx, self.state)
        self.enterRule(localctx, 20, self.RULE_defenseName)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 90 
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            while True:
                self.state = 89
                self.defenseWord()
                self.state = 92 
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if not ((((_la) & ~0x3f) == 0 and ((1 << _la) & 1008806316530991102) != 0)):
                    break

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class DefenseWordContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def NUMBER(self):
            return self.getToken(CallsParser.NUMBER, 0)

        def getRuleIndex(self):
            return CallsParser.RULE_defenseWord

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitDefenseWord" ):
                return visitor.visitDefenseWord(self)
            else:
                return visitor.visitChildren(self)




    def defenseWord(self):

        localctx = CallsParser.DefenseWordContext(self, self._ctx, self.state)
        self.enterRule(localctx, 22, self.RULE_defenseWord)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 94
            _la = self._input.LA(1)
            if _la <= 0 or _la==57:
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx






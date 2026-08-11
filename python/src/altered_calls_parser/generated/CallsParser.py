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
    ]

class CallsParser ( Parser ):

    grammarFileName = "Calls.g4"

    atn = ATNDeserializer().deserialize(serializedATN())

    decisionsToDFA = [ DFA(ds, i) for i, ds in enumerate(atn.decisionToState) ]

    sharedContextCache = PredictionContextCache()

    literalNames = [ "<INVALID>", "'OVERWHELM'", "'FULL'", "'AUTO'", "'POWER'", 
                     "'WORD'", "'LIGHT'", "'YOU'", "'NPCS'", "'BREAK'", 
                     "'CHARM'", "'COMMAND'", "'DAZE'", "'DEATH'", "'DISARM'", 
                     "'FEAR'", "'KNOCKDOWN'", "'KNOCKOUT'", "'MAIM'", "'PIN'", 
                     "'RAGE'", "'SLAM'", "'SLAY'", "'STUN'", "'FLESH'", 
                     "'HEAL'", "'REPAIR'", "'FOCUS'", "'STAMINA'", "'FIRE'", 
                     "'DARK'", "'POISON'", "'RAD'", "'RADIATION'", "'AURIC'", 
                     "'FAE'", "'DEEP'", "'ICE'", "'DRAIN'", "'ARMOUR'" ]

    symbolicNames = [ "<INVALID>", "OVERWHELM", "FULL", "AUTO", "POWER", 
                      "WORD_KW", "LIGHT", "YOU", "NPCS", "BREAK", "CHARM", 
                      "COMMAND", "DAZE", "DEATH", "DISARM", "FEAR", "KNOCKDOWN", 
                      "KNOCKOUT", "MAIM", "PIN", "RAGE", "SLAM", "SLAY", 
                      "STUN", "FLESH", "HEAL", "REPAIR", "FOCUS", "STAMINA", 
                      "FIRE", "DARK", "POISON", "RAD", "RADIATION", "AURIC", 
                      "FAE", "DEEP", "ICE", "DRAIN", "ARMOUR", "NUMBER", 
                      "SEP", "IDENT" ]

    RULE_damageCall = 0
    RULE_effect = 1
    RULE_fullAuto = 2
    RULE_powerWord = 3
    RULE_powerLight = 4
    RULE_target = 5
    RULE_basicEffect = 6
    RULE_number = 7
    RULE_damageType = 8
    RULE_drainDamageType = 9
    RULE_resource = 10
    RULE_elemental = 11

    ruleNames =  [ "damageCall", "effect", "fullAuto", "powerWord", "powerLight", 
                   "target", "basicEffect", "number", "damageType", "drainDamageType", 
                   "resource", "elemental" ]

    EOF = Token.EOF
    OVERWHELM=1
    FULL=2
    AUTO=3
    POWER=4
    WORD_KW=5
    LIGHT=6
    YOU=7
    NPCS=8
    BREAK=9
    CHARM=10
    COMMAND=11
    DAZE=12
    DEATH=13
    DISARM=14
    FEAR=15
    KNOCKDOWN=16
    KNOCKOUT=17
    MAIM=18
    PIN=19
    RAGE=20
    SLAM=21
    SLAY=22
    STUN=23
    FLESH=24
    HEAL=25
    REPAIR=26
    FOCUS=27
    STAMINA=28
    FIRE=29
    DARK=30
    POISON=31
    RAD=32
    RADIATION=33
    AURIC=34
    FAE=35
    DEEP=36
    ICE=37
    DRAIN=38
    ARMOUR=39
    NUMBER=40
    SEP=41
    IDENT=42

    def __init__(self, input:TokenStream, output:TextIO = sys.stdout):
        super().__init__(input, output)
        self.checkVersion("4.13.2")
        self._interp = ParserATNSimulator(self, self.atn, self.decisionsToDFA, self.sharedContextCache)
        self._predicates = None




    class DamageCallContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def EOF(self):
            return self.getToken(CallsParser.EOF, 0)

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
        self.enterRule(localctx, 0, self.RULE_damageCall)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 31
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,2,self._ctx)
            if la_ == 1:
                self.state = 24
                self.fullAuto()
                pass

            elif la_ == 2:
                self.state = 26
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if (((_la) & ~0x3f) == 0 and ((1 << _la) & 16776722) != 0):
                    self.state = 25
                    self.effect()


                self.state = 29
                self._errHandler.sync(self)
                la_ = self._interp.adaptivePredict(self._input,1,self._ctx)
                if la_ == 1:
                    self.state = 28
                    self.number()


                pass


            self.state = 34
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,3,self._ctx)
            if la_ == 1:
                self.state = 33
                self.damageType()


            self.state = 37
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if (((_la) & ~0x3f) == 0 and ((1 << _la) & 1374372757568) != 0):
                self.state = 36
                self.damageType()


            self.state = 39
            self.match(CallsParser.EOF)
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

        def powerWord(self):
            return self.getTypedRuleContext(CallsParser.PowerWordContext,0)


        def powerLight(self):
            return self.getTypedRuleContext(CallsParser.PowerLightContext,0)


        def basicEffect(self):
            return self.getTypedRuleContext(CallsParser.BasicEffectContext,0)


        def getRuleIndex(self):
            return CallsParser.RULE_effect

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitEffect" ):
                return visitor.visitEffect(self)
            else:
                return visitor.visitChildren(self)




    def effect(self):

        localctx = CallsParser.EffectContext(self, self._ctx, self.state)
        self.enterRule(localctx, 2, self.RULE_effect)
        try:
            self.state = 44
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,5,self._ctx)
            if la_ == 1:
                self.enterOuterAlt(localctx, 1)
                self.state = 41
                self.powerWord()
                pass

            elif la_ == 2:
                self.enterOuterAlt(localctx, 2)
                self.state = 42
                self.powerLight()
                pass

            elif la_ == 3:
                self.enterOuterAlt(localctx, 3)
                self.state = 43
                self.basicEffect()
                pass


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
            self.state = 47
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==1:
                self.state = 46
                self.match(CallsParser.OVERWHELM)


            self.state = 49
            self.match(CallsParser.FULL)
            self.state = 50
            self.match(CallsParser.AUTO)
            self.state = 51
            self.number()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class PowerWordContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def POWER(self):
            return self.getToken(CallsParser.POWER, 0)

        def WORD_KW(self):
            return self.getToken(CallsParser.WORD_KW, 0)

        def basicEffect(self):
            return self.getTypedRuleContext(CallsParser.BasicEffectContext,0)


        def target(self):
            return self.getTypedRuleContext(CallsParser.TargetContext,0)


        def getRuleIndex(self):
            return CallsParser.RULE_powerWord

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitPowerWord" ):
                return visitor.visitPowerWord(self)
            else:
                return visitor.visitChildren(self)




    def powerWord(self):

        localctx = CallsParser.PowerWordContext(self, self._ctx, self.state)
        self.enterRule(localctx, 6, self.RULE_powerWord)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 53
            self.match(CallsParser.POWER)
            self.state = 54
            self.match(CallsParser.WORD_KW)
            self.state = 56
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==7 or _la==8:
                self.state = 55
                self.target()


            self.state = 58
            self.basicEffect()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class PowerLightContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def POWER(self):
            return self.getToken(CallsParser.POWER, 0)

        def LIGHT(self):
            return self.getToken(CallsParser.LIGHT, 0)

        def basicEffect(self):
            return self.getTypedRuleContext(CallsParser.BasicEffectContext,0)


        def target(self):
            return self.getTypedRuleContext(CallsParser.TargetContext,0)


        def getRuleIndex(self):
            return CallsParser.RULE_powerLight

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitPowerLight" ):
                return visitor.visitPowerLight(self)
            else:
                return visitor.visitChildren(self)




    def powerLight(self):

        localctx = CallsParser.PowerLightContext(self, self._ctx, self.state)
        self.enterRule(localctx, 8, self.RULE_powerLight)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 60
            self.match(CallsParser.POWER)
            self.state = 61
            self.match(CallsParser.LIGHT)
            self.state = 63
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==7 or _la==8:
                self.state = 62
                self.target()


            self.state = 65
            self.basicEffect()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class TargetContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def YOU(self):
            return self.getToken(CallsParser.YOU, 0)

        def NPCS(self):
            return self.getToken(CallsParser.NPCS, 0)

        def getRuleIndex(self):
            return CallsParser.RULE_target

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitTarget" ):
                return visitor.visitTarget(self)
            else:
                return visitor.visitChildren(self)




    def target(self):

        localctx = CallsParser.TargetContext(self, self._ctx, self.state)
        self.enterRule(localctx, 10, self.RULE_target)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 67
            _la = self._input.LA(1)
            if not(_la==7 or _la==8):
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


    class BasicEffectContext(ParserRuleContext):
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
            return CallsParser.RULE_basicEffect

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitBasicEffect" ):
                return visitor.visitBasicEffect(self)
            else:
                return visitor.visitChildren(self)




    def basicEffect(self):

        localctx = CallsParser.BasicEffectContext(self, self._ctx, self.state)
        self.enterRule(localctx, 12, self.RULE_basicEffect)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 70
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==1:
                self.state = 69
                self.match(CallsParser.OVERWHELM)


            self.state = 72
            _la = self._input.LA(1)
            if not((((_la) & ~0x3f) == 0 and ((1 << _la) & 16776704) != 0)):
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
        self.enterRule(localctx, 14, self.RULE_number)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 74
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
        self.enterRule(localctx, 16, self.RULE_damageType)
        try:
            self.state = 83
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [40]:
                self.enterOuterAlt(localctx, 1)
                self.state = 76
                self.drainDamageType()
                pass
            elif token in [24]:
                self.enterOuterAlt(localctx, 2)
                self.state = 77
                self.match(CallsParser.FLESH)
                pass
            elif token in [25]:
                self.enterOuterAlt(localctx, 3)
                self.state = 78
                self.match(CallsParser.HEAL)
                pass
            elif token in [26]:
                self.enterOuterAlt(localctx, 4)
                self.state = 79
                self.match(CallsParser.REPAIR)
                pass
            elif token in [27]:
                self.enterOuterAlt(localctx, 5)
                self.state = 80
                self.match(CallsParser.FOCUS)
                pass
            elif token in [28]:
                self.enterOuterAlt(localctx, 6)
                self.state = 81
                self.match(CallsParser.STAMINA)
                pass
            elif token in [6, 29, 30, 31, 32, 33, 34, 35, 36, 37]:
                self.enterOuterAlt(localctx, 7)
                self.state = 82
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
        self.enterRule(localctx, 18, self.RULE_drainDamageType)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 85
            self.number()
            self.state = 86
            self.resource()
            self.state = 87
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
        self.enterRule(localctx, 20, self.RULE_resource)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 89
            _la = self._input.LA(1)
            if not((((_la) & ~0x3f) == 0 and ((1 << _la) & 550175244288) != 0)):
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
        self.enterRule(localctx, 22, self.RULE_elemental)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 91
            _la = self._input.LA(1)
            if not((((_la) & ~0x3f) == 0 and ((1 << _la) & 274341036096) != 0)):
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






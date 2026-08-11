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
                     "'AURIC'", "'FAE'", "'DEEP'", "'ICE'", "'DRAIN'", "'ARMOUR'" ]

    symbolicNames = [ "<INVALID>", "OVERWHELM", "FULL", "AUTO", "BREAK", 
                      "CHARM", "COMMAND", "DAZE", "DEATH", "DISARM", "FEAR", 
                      "KNOCKDOWN", "KNOCKOUT", "MAIM", "PIN", "RAGE", "SLAM", 
                      "SLAY", "STUN", "FLESH", "HEAL", "REPAIR", "FOCUS", 
                      "STAMINA", "FIRE", "DARK", "LIGHT", "POISON", "RAD", 
                      "RADIATION", "AURIC", "FAE", "DEEP", "ICE", "DRAIN", 
                      "ARMOUR", "NUMBER", "SEP", "IDENT" ]

    RULE_damageCall = 0
    RULE_fullAuto = 1
    RULE_effect = 2
    RULE_number = 3
    RULE_damageType = 4
    RULE_drainDamageType = 5
    RULE_resource = 6
    RULE_elemental = 7

    ruleNames =  [ "damageCall", "fullAuto", "effect", "number", "damageType", 
                   "drainDamageType", "resource", "elemental" ]

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
    NUMBER=36
    SEP=37
    IDENT=38

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
            self.state = 23
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,2,self._ctx)
            if la_ == 1:
                self.state = 16
                self.fullAuto()
                pass

            elif la_ == 2:
                self.state = 18
                self._errHandler.sync(self)
                _la = self._input.LA(1)
                if (((_la) & ~0x3f) == 0 and ((1 << _la) & 524274) != 0):
                    self.state = 17
                    self.effect()


                self.state = 21
                self._errHandler.sync(self)
                la_ = self._interp.adaptivePredict(self._input,1,self._ctx)
                if la_ == 1:
                    self.state = 20
                    self.number()


                pass


            self.state = 26
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,3,self._ctx)
            if la_ == 1:
                self.state = 25
                self.damageType()


            self.state = 29
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if (((_la) & ~0x3f) == 0 and ((1 << _la) & 85898821632) != 0):
                self.state = 28
                self.damageType()


            self.state = 31
            self.match(CallsParser.EOF)
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
        self.enterRule(localctx, 2, self.RULE_fullAuto)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 34
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==1:
                self.state = 33
                self.match(CallsParser.OVERWHELM)


            self.state = 36
            self.match(CallsParser.FULL)
            self.state = 37
            self.match(CallsParser.AUTO)
            self.state = 38
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
        self.enterRule(localctx, 4, self.RULE_effect)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 41
            self._errHandler.sync(self)
            _la = self._input.LA(1)
            if _la==1:
                self.state = 40
                self.match(CallsParser.OVERWHELM)


            self.state = 43
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
        self.enterRule(localctx, 6, self.RULE_number)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 45
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
        self.enterRule(localctx, 8, self.RULE_damageType)
        try:
            self.state = 54
            self._errHandler.sync(self)
            token = self._input.LA(1)
            if token in [36]:
                self.enterOuterAlt(localctx, 1)
                self.state = 47
                self.drainDamageType()
                pass
            elif token in [19]:
                self.enterOuterAlt(localctx, 2)
                self.state = 48
                self.match(CallsParser.FLESH)
                pass
            elif token in [20]:
                self.enterOuterAlt(localctx, 3)
                self.state = 49
                self.match(CallsParser.HEAL)
                pass
            elif token in [21]:
                self.enterOuterAlt(localctx, 4)
                self.state = 50
                self.match(CallsParser.REPAIR)
                pass
            elif token in [22]:
                self.enterOuterAlt(localctx, 5)
                self.state = 51
                self.match(CallsParser.FOCUS)
                pass
            elif token in [23]:
                self.enterOuterAlt(localctx, 6)
                self.state = 52
                self.match(CallsParser.STAMINA)
                pass
            elif token in [24, 25, 26, 27, 28, 29, 30, 31, 32, 33]:
                self.enterOuterAlt(localctx, 7)
                self.state = 53
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
        self.enterRule(localctx, 10, self.RULE_drainDamageType)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 56
            self.number()
            self.state = 57
            self.resource()
            self.state = 58
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
        self.enterRule(localctx, 12, self.RULE_resource)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 60
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
        self.enterRule(localctx, 14, self.RULE_elemental)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 62
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






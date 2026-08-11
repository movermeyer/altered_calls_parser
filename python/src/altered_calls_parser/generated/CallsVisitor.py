from antlr4 import *
if "." in __name__:
    from .CallsParser import CallsParser
else:
    from CallsParser import CallsParser

# This class defines a complete generic visitor for a parse tree produced by CallsParser.

class CallsVisitor(ParseTreeVisitor):

    # Visit a parse tree produced by CallsParser#damageCall.
    def visitDamageCall(self, ctx:CallsParser.DamageCallContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by CallsParser#fullAuto.
    def visitFullAuto(self, ctx:CallsParser.FullAutoContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by CallsParser#effect.
    def visitEffect(self, ctx:CallsParser.EffectContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by CallsParser#number.
    def visitNumber(self, ctx:CallsParser.NumberContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by CallsParser#damageType.
    def visitDamageType(self, ctx:CallsParser.DamageTypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by CallsParser#drainDamageType.
    def visitDrainDamageType(self, ctx:CallsParser.DrainDamageTypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by CallsParser#resource.
    def visitResource(self, ctx:CallsParser.ResourceContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by CallsParser#elemental.
    def visitElemental(self, ctx:CallsParser.ElementalContext):
        return self.visitChildren(ctx)



del CallsParser
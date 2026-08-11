from antlr4 import ParserRuleContext

from ._tokens import WORDS, token_name
from .generated.CallsParser import CallsParser
from .generated.CallsVisitor import CallsVisitor


def _leaf_word(ctx: ParserRuleContext) -> str:
    return WORDS[token_name(ctx.start.type)]


class Canonicalizer(CallsVisitor):
    """Walks a damageCall parse tree, emitting canonical capitalized,
    hyphen-separated words in grammar order. Words always come out in the
    order they were called: the two damage-type slots can hold any two
    damage types (not just two elementals), and there is no rulebook order
    to sort such a pair into, so "fire dark" and "dark fire" normalize
    apart.
    """

    def __init__(self) -> None:
        super().__init__()
        self.words: list[str] = []

    def canonicalize(self, tree: CallsParser.DamageCallContext) -> str:
        self.words = []
        self.visitDamageCall(tree)
        return "-".join(self.words)

    def visitDamageCall(self, ctx: CallsParser.DamageCallContext) -> None:
        full_auto = ctx.fullAuto()
        if full_auto is not None:
            # Full Auto stands in for both the effect and the number slots --
            # it excludes any other effect, and carries its own damage number.
            self.visitFullAuto(full_auto)
        else:
            effect = ctx.effect()
            if effect is not None:
                self.visitEffect(effect)
            number = ctx.number()
            if number is not None:
                self.words.append(number.NUMBER().getText())
        for damage_type in ctx.damageType():
            self.visitDamageType(damage_type)

    def visitFullAuto(self, ctx: CallsParser.FullAutoContext) -> None:
        if ctx.OVERWHELM() is not None:
            self.words.append(WORDS["OVERWHELM"])
        self.words.append(WORDS["FULL"])
        self.words.append(WORDS["AUTO"])
        self.words.append(ctx.number().NUMBER().getText())

    def visitEffect(self, ctx: CallsParser.EffectContext) -> None:
        # "Overwhelm" is an optional prefix on the effect keyword, so the
        # keyword itself is the rule's last token rather than its first.
        if ctx.OVERWHELM() is not None:
            self.words.append(WORDS["OVERWHELM"])
        self.words.append(WORDS[token_name(ctx.stop.type)])

    def visitResource(self, ctx: CallsParser.ResourceContext) -> None:
        self.words.append(_leaf_word(ctx))

    def visitElemental(self, ctx: CallsParser.ElementalContext) -> None:
        self.words.append(_leaf_word(ctx))

    def visitDamageType(self, ctx: CallsParser.DamageTypeContext) -> None:
        drain = ctx.drainDamageType()
        if drain is not None:
            self.visitDrainDamageType(drain)
            return
        elemental = ctx.elemental()
        if elemental is not None:
            self.visitElemental(elemental)
            return
        # Bare FLESH/HEAL/REPAIR/FOCUS/STAMINA leaf.
        self.words.append(_leaf_word(ctx))

    def visitDrainDamageType(self, ctx: CallsParser.DrainDamageTypeContext) -> None:
        # A drain carries its own amount, distinct from damageCall's optional
        # leading number ("knockdown 5 3 flesh drain" has both).
        self.words.append(ctx.number().NUMBER().getText())
        self.visitResource(ctx.resource())
        self.words.append(WORDS["DRAIN"])

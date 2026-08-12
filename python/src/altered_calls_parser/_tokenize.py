"""Labels each word of a call with the part of the syntax it belongs to.

This is a parse-tree walk, not a lexer pass, because the lexer alone cannot
tell these apart: of the two numbers in "Knockdown 5 3 Flesh Drain" the first
is the damage amount while the second belongs to the drain, and of the two
"Flesh"es in "5 Flesh 3 Flesh Drain" the first is a damage type while the
second is the resource being drained. Only the rule a terminal sits under
decides which.

The wording lives here (and in the TypeScript mirror, tokenize.ts) rather than
in each consumer, and all of it comes from shared/canonical-tokens.json -- no
English is hard-coded against a role name here.
"""

from dataclasses import dataclass

from antlr4 import CommonTokenStream, ParserRuleContext, Token
from antlr4.tree.Tree import TerminalNode

from ._tokens import (
    ROLE_CATEGORIES,
    ROLE_DESCRIPTIONS,
    ROLE_LABELS,
    WORDS,
    token_name,
)
from .generated.CallsLexer import CallsLexer
from .generated.CallsParser import CallsParser
from .generated.CallsVisitor import CallsVisitor


@dataclass(frozen=True)
class CallToken:
    #: Half-open range in the input, the same convention CallHint uses.
    start: int
    end: int
    #: The input slice, in its original casing.
    text: str
    #: The canonical spelling normalize() would write for this word, or the
    #: digits themselves for a number. Empty for an "unknown" token, which is
    #: by definition not part of a call the canonicalizer would accept.
    canonical: str
    #: Which part of the syntax this word is, given where it sits in the call.
    #: One of "overwhelm", one of the fifteen effect keywords lowercased
    #: ("break", "charm", "command", "daze", "death", "disarm", "fear",
    #: "knockdown", "knockout", "maim", "pin", "rage", "slam", "slay", "stun"),
    #: "full-auto", "amount", "damage-type", "drain-amount", "drain-resource",
    #: "drain", "unknown".
    role: str
    #: Coarse grouping for colour-coding: one of `categoryOrder`, or "unknown".
    #: Several roles share a category -- a drain's amount and a call's damage
    #: amount are both numbers.
    category: str
    #: Short player-facing name for the role, e.g. "Drain amount".
    label: str
    #: A complete player-facing sentence. Safe to render as-is.
    description: str


def _is_real_token(token: Token | None) -> bool:
    """Whether `token` points at real input.

    On invalid input the parser's error recovery conjures tokens to stand in
    for ones the player never typed -- "full auto" gets a missing NUMBER
    inserted -- and those carry start == stop == -1. Testing only that the
    range is non-empty would let them through, since -1 >= -1, so the start has
    to be checked against the input as well.
    """
    if token is None:
        return False
    return bool(token.type != Token.EOF and 0 <= token.start <= token.stop)


def _symbol(node: TerminalNode | None) -> Token | None:
    return None if node is None else node.symbol


class _Tokenizer(CallsVisitor):
    """Walks a damageCall parse tree, recording which part of the syntax each
    matched terminal belongs to. The structural sibling of Canonicalizer, with
    one difference: Canonicalizer pushes canonical words as string constants
    and so never needs a terminal to read a position from, whereas every role
    here has to be pinned to the token that actually carries it.

    Every child is checked for None, including the ones the grammar makes
    mandatory. After error recovery a required child can be missing outright:
    "full" builds a FullAutoContext with neither an AUTO nor a number under it.
    Canonicalizer never meets this because normalize() throws before it walks
    an invalid tree, but tokenize() promises not to throw.
    """

    def __init__(self) -> None:
        super().__init__()
        self.claimed: list[tuple[Token, str]] = []

    def collect(self, tree: CallsParser.DamageCallContext) -> list[tuple[Token, str]]:
        self.claimed = []
        self.visitDamageCall(tree)
        return self.claimed

    def _push(self, token: Token | None, role: str) -> None:
        if _is_real_token(token):
            assert token is not None
            self.claimed.append((token, role))

    def _push_number(self, ctx: CallsParser.NumberContext | None, role: str) -> None:
        if ctx is not None:
            self._push(_symbol(ctx.NUMBER()), role)

    def _push_leaf(self, ctx: ParserRuleContext, role: str) -> None:
        self._push(ctx.start, role)

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
            self._push_number(ctx.number(), "amount")
        for damage_type in ctx.damageType():
            self.visitDamageType(damage_type)

    def visitFullAuto(self, ctx: CallsParser.FullAutoContext) -> None:
        self._push(_symbol(ctx.OVERWHELM()), "overwhelm")
        self._push(_symbol(ctx.FULL()), "full-auto")
        self._push(_symbol(ctx.AUTO()), "full-auto")
        self._push_number(ctx.number(), "amount")

    def visitEffect(self, ctx: CallsParser.EffectContext) -> None:
        # "Overwhelm" is an optional prefix on the effect keyword, so the
        # keyword itself is the rule's last token rather than its first.
        self._push(_symbol(ctx.OVERWHELM()), "overwhelm")
        # Each of the fifteen effect keywords gets its own role -- the lexer's
        # symbolic name lowercased -- so the tokenizer can hand back a
        # rulebook-accurate description per effect instead of one generic blurb.
        stop = ctx.stop
        if _is_real_token(stop):
            assert stop is not None
            self._push(stop, token_name(stop.type).lower())

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
        self._push_leaf(ctx, "damage-type")

    def visitElemental(self, ctx: CallsParser.ElementalContext) -> None:
        self._push_leaf(ctx, "damage-type")

    def visitDrainDamageType(self, ctx: CallsParser.DrainDamageTypeContext) -> None:
        # A drain carries its own amount, distinct from damageCall's optional
        # leading number ("knockdown 5 3 flesh drain" has both).
        self._push_number(ctx.number(), "drain-amount")
        resource = ctx.resource()
        if resource is not None:
            self.visitResource(resource)
        self._push(_symbol(ctx.DRAIN()), "drain")

    def visitResource(self, ctx: CallsParser.ResourceContext) -> None:
        self._push_leaf(ctx, "drain-resource")


def _unclaimed(
    token_stream: CommonTokenStream, claimed: list[tuple[Token, str]]
) -> list[tuple[Token, str]]:
    """Every real token the lexer produced that the parse tree did not claim.

    SEP is skipped rather than sent to a hidden channel, so separators never
    enter the stream at all and no channel filtering is needed here.
    """
    claimed_starts = {token.start for token, _ in claimed}
    return [
        (token, "unknown")
        for token in token_stream.tokens
        if _is_real_token(token) and token.start not in claimed_starts
    ]


def _to_call_token(text: str, token: Token, role: str) -> CallToken:
    start = token.start
    end = token.stop + 1
    # Slice the original input rather than reading token.text, which reflects
    # the upper-cased view CaseChangingCharStream gave the lexer to match
    # against.
    slice_ = text[start:end]

    canonical = ""
    if role != "unknown":
        canonical = (
            slice_ if token.type == CallsLexer.NUMBER else WORDS[token_name(token.type)]
        )

    return CallToken(
        start=start,
        end=end,
        text=slice_,
        canonical=canonical,
        role=role,
        category=ROLE_CATEGORIES[role],
        label=ROLE_LABELS[role],
        description=ROLE_DESCRIPTIONS[role],
    )


def tokenize_tree(
    text: str,
    tree: CallsParser.DamageCallContext,
    token_stream: CommonTokenStream,
) -> list[CallToken]:
    """Label each word of `text` with the part of the syntax it belongs to.

    Takes the tree and token stream rather than parsing for itself so that the
    public tokenize() in __init__.py can build them the same way parse() does,
    off one CaseChangingCharStream, instead of standing up a second pipeline
    that could drift from it.

    Invalid input still yields whatever the parser's error recovery managed to
    recognise, with the words it could not place coming back as "unknown" -- so
    a half-typed call still explains the half that parsed.

    The returned tokens are in source order but are *not* contiguous: spaces
    and hyphens are separators the lexer skips, so a caller rendering the
    tokens back out must take the gaps between them from the original text.
    """
    claimed = _Tokenizer().collect(tree)
    merged = claimed + _unclaimed(token_stream, claimed)
    merged.sort(key=lambda pair: pair[0].start)
    return [_to_call_token(text, token, role) for token, role in merged]

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
from antlr4.tree.Tree import ErrorNode, TerminalNode

from ._tokens import (
    ROLE_CATEGORIES,
    ROLE_DESCRIPTIONS,
    ROLE_LABELS,
    WORDS,
    title_case,
    token_name,
)
from ._tree import CallTree
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
    #: "drain", "mitigate", "parry", "phase-out", "phase-in", "sacrifice",
    #: "shrug-off", "withstand", "defense-name", "unknown".
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


#: Which of §8.4's seven forms a defensive call is, keyed by its first word --
#: which is what the grammar itself picks the alternative on. PHASE is absent
#: because it alone needs a second word to tell its two forms apart.
_DEFENSIVE_ROLES = {
    "MITIGATE": "mitigate",
    "SACRIFICE": "sacrifice",
    "PARRY": "parry",
    "SHRUG": "shrug-off",
    "WITHSTAND": "withstand",
}


def _defensive_role(ctx: CallsParser.DefensiveCallContext) -> str:
    """The role every keyword of this defensive call carries.

    The role belongs to the call as a whole rather than to its individual
    words -- "Shrug" and "Off" are one call between them, and the rulebook has
    one sentence to say about the pair.
    """
    if ctx.PHASE() is not None:
        # Half-typed input ("phase") reaches here with neither word, and there
        # is nothing to tell the two apart by; the first alternative is as good
        # a guess as the second, and tokenize() is best-effort on invalid input.
        return "phase-in" if ctx.IN() is not None else "phase-out"
    role = _DEFENSIVE_ROLES.get(token_name(ctx.start.type))
    return role if role is not None else "unknown"


class _Tokenizer(CallsVisitor):
    """Walks a call parse tree, recording which part of the syntax each
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

    def collect(self, tree: CallTree | None) -> list[tuple[Token, str]]:
        self.claimed = []
        if isinstance(tree, CallsParser.DefensiveCallContext):
            self.visitDefensiveCall(tree)
        elif tree is not None:
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

    def visitDefensiveCall(self, ctx: CallsParser.DefensiveCallContext) -> None:
        # Every one of the seven forms is a run of keywords optionally followed
        # by a Defense name, and all the keywords of one form share its role --
        # so this covers all seven without a branch per form.
        role = _defensive_role(ctx)
        for child in ctx.getChildren():
            if isinstance(child, CallsParser.DefenseNameContext):
                self.visitDefenseName(child)
            elif isinstance(child, TerminalNode) and not isinstance(child, ErrorNode):
                # Error nodes are TerminalNodes too, and they hang off whichever
                # rule was being matched when recovery kicked in -- so claiming
                # them here would label the word that broke the call as part of
                # it. Leaving them unclaimed sends them to "unknown" instead.
                self._push(child.symbol, role)

    def visitDefenseName(self, ctx: CallsParser.DefenseNameContext) -> None:
        for word in ctx.defenseWord():
            self.visitDefenseWord(word)

    def visitDefenseWord(self, ctx: CallsParser.DefenseWordContext) -> None:
        self._push_leaf(ctx, "defense-name")


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
        if token.type == CallsLexer.NUMBER:
            canonical = slice_
        elif token.type == CallsLexer.IDENT:
            # A Defense name the rulebook doesn't list -- the only place IDENT
            # is part of a call at all. There is no canonical spelling on file
            # for it, so it keeps the player's word, capitalized like the rest.
            canonical = title_case(slice_)
        else:
            canonical = WORDS[token_name(token.type)]

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
    tree: CallTree | None,
    token_stream: CommonTokenStream,
) -> list[CallToken]:
    """Label each word of `text` with the part of the syntax it belongs to.

    Takes the tree and token stream rather than parsing for itself so that the
    public tokenize() in __init__.py can build them the same way parse() does,
    off one CaseChangingCharStream, instead of standing up a second pipeline
    that could drift from it. `tree` is None when error recovery could not tell
    which kind of call was meant, in which case every word comes back
    "unknown".

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

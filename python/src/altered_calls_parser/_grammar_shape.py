"""A declarative mirror of grammar/Calls.g4's parser rules, used by
_completion.py to compute autocomplete candidates via Brzozowski
derivatives instead of ANTLR ATN introspection (there is no Python port
of antlr4-c3). Keep this in sync with the grammar by hand; drift is
caught by test_grammar_shape_consistency.py, which cross-checks samples
generated from this shape against the real ANTLR-generated parser.
"""

from dataclasses import dataclass

NUMBER_TOKEN = "NUMBER"

#: The lexer's catch-all token: any word it didn't recognize as a keyword. No
#: slot names it -- AnyWordSlot covers it along with every keyword -- but it is
#: still the token a made-up Defense name arrives as, which the drift guard in
#: test_grammar_shape_consistency.py needs in order to stand one up.
IDENT_TOKEN = "IDENT"

#: Stands in for AnyWordSlot in a candidate set, where every other member is a
#: token name. It is not a token: no single word the lexer could produce means
#: "any word", so _completion.py answers it with the known Defense names rather
#: than looking it up in WORDS.
ANY_WORD_TOKEN = "ANY_WORD"


@dataclass(frozen=True)
class Lit:
    name: str


@dataclass(frozen=True)
class NumberSlot:
    pass


@dataclass(frozen=True)
class AnyWordSlot:
    """Any single word, keyword or not -- the grammar's `defenseWord : ~NUMBER`.

    Unlike every other slot this one has no fixed set of words to offer, so
    _completion.py answers it with the Defense names the rulebook does list. An
    autocomplete that said "any word goes here" would be noise.
    """


@dataclass(frozen=True)
class Seq:
    parts: tuple["Node", ...]


@dataclass(frozen=True)
class Alt:
    options: tuple["Node", ...]


@dataclass(frozen=True)
class Opt:
    part: "Node"


@dataclass(frozen=True)
class Rep:
    """One or more of `part`, mirroring ANTLR's `+`."""

    part: "Node"


Node = Lit | NumberSlot | AnyWordSlot | Seq | Alt | Opt | Rep

# "Overwhelm" prefixes the effect keyword itself, so it lives inside this rule
# rather than beside it in DAMAGE_CALL.
EFFECT = Seq(
    (
        Opt(Lit("OVERWHELM")),
        Alt(
            (
                Lit("BREAK"),
                Lit("CHARM"),
                Lit("COMMAND"),
                Lit("DAZE"),
                Lit("DEATH"),
                Lit("DISARM"),
                Lit("FEAR"),
                Lit("KNOCKDOWN"),
                Lit("KNOCKOUT"),
                Lit("MAIM"),
                Lit("PIN"),
                Lit("RAGE"),
                Lit("SLAM"),
                Lit("SLAY"),
                Lit("STUN"),
            )
        ),
    )
)

# "Full Auto" sits beside `effect` rather than inside it -- unlike every other
# effect it must state a number, and it carries the number it requires.
FULL_AUTO = Seq((Opt(Lit("OVERWHELM")), Lit("FULL"), Lit("AUTO"), NumberSlot()))

RESOURCE = Alt((Lit("FLESH"), Lit("STAMINA"), Lit("FOCUS"), Lit("ARMOUR")))
DRAIN_DAMAGE_TYPE = Seq((NumberSlot(), RESOURCE, Lit("DRAIN")))

ELEMENTAL = Alt(
    (
        Lit("AURIC"),
        Lit("DARK"),
        Lit("DEEP"),
        Lit("FAE"),
        Lit("FIRE"),
        Lit("ICE"),
        Lit("LIGHT"),
        Lit("POISON"),
        Lit("RAD"),
        Lit("RADIATION"),
    )
)

DAMAGE_TYPE = Alt(
    (
        DRAIN_DAMAGE_TYPE,
        Lit("FLESH"),
        Lit("HEAL"),
        Lit("REPAIR"),
        Lit("FOCUS"),
        Lit("STAMINA"),
        ELEMENTAL,
    )
)

# The two damage-type slots are any two damage types, not specifically two
# elementals -- so "fire flesh" and "5 focus drain 3 flesh drain" parse too.
DAMAGE_CALL = Seq(
    (
        Alt((FULL_AUTO, Seq((Opt(EFFECT), Opt(NumberSlot()))))),
        Opt(DAMAGE_TYPE),
        Opt(DAMAGE_TYPE),
    )
)

# Any word at all, because the rulebook's list of Defense names isn't
# exhaustive -- including one this grammar knows in another role ("Mitigate
# Flesh"). A name is a run of them, word by word rather than name by name: the
# grammar doesn't require "Receding" to be followed by "Tide", so neither does
# this.
DEFENSE_WORD = AnyWordSlot()

DEFENSE_NAME = Rep(DEFENSE_WORD)

DEFENSIVE_CALL = Alt(
    (
        Seq((Lit("MITIGATE"), DEFENSE_NAME)),
        Lit("SACRIFICE"),
        Lit("PARRY"),
        Seq((Lit("PHASE"), Alt((Lit("OUT"), Lit("IN"))))),
        Seq((Lit("SHRUG"), Lit("OFF"))),
        Lit("WITHSTAND"),
    )
)

# The entry rule. Damage calls come first, matching the grammar -- it matters
# only for readability here, since candidates() unions the branches anyway.
CALL = Alt((DAMAGE_CALL, DEFENSIVE_CALL))

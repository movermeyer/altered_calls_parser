"""A declarative mirror of grammar/Calls.g4's parser rules, used by
_completion.py to compute autocomplete candidates via Brzozowski
derivatives instead of ANTLR ATN introspection (there is no Python port
of antlr4-c3). Keep this in sync with the grammar by hand; drift is
caught by test_grammar_shape_consistency.py, which cross-checks samples
generated from this shape against the real ANTLR-generated parser.
"""

from dataclasses import dataclass

NUMBER_TOKEN = "NUMBER"


@dataclass(frozen=True)
class Lit:
    name: str


@dataclass(frozen=True)
class NumberSlot:
    pass


@dataclass(frozen=True)
class Seq:
    parts: tuple["Node", ...]


@dataclass(frozen=True)
class Alt:
    options: tuple["Node", ...]


@dataclass(frozen=True)
class Opt:
    part: "Node"


Node = Lit | NumberSlot | Seq | Alt | Opt

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

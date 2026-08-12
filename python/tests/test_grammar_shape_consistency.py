"""Drift guard: samples complete token sequences from _grammar_shape.py
(the declarative mirror used for autocomplete) and checks the real
ANTLR-generated parser agrees they're valid and normalizes them the same
way. This is the main defense against _grammar_shape.py silently
diverging from grammar/Calls.g4 as the grammar evolves.
"""

import random

import pytest

from altered_calls_parser import normalize, validate
from altered_calls_parser._grammar_shape import (
    CALL,
    IDENT_TOKEN,
    NUMBER_TOKEN,
    Alt,
    AnyWordSlot,
    Lit,
    Node,
    NumberSlot,
    Opt,
    Rep,
    Seq,
)
from altered_calls_parser._tokens import WORDS

SAMPLE_COUNT = 300
SEED = 20260811

#: Stand-ins for a Defense name the rulebook doesn't list, which is the only
#: place IDENT appears in a call. Already capitalized the way normalize() would
#: write them, so a sample's canonical form stays the same words hyphenated.
#: None of these may be a keyword, or the lexer would not produce an IDENT.
IDENT_WORDS = ("Bulwark", "Warded", "Stoneskin")

#: What an AnyWordSlot is sampled from: every keyword, plus IDENT standing in
#: for the words that aren't. A Defense name accepts all of them, so the
#: keywords are what pins that down -- "Mitigate Flesh" names a Defense, it is
#: not a damage call.
ANY_WORDS = (IDENT_TOKEN, *WORDS)

#: How many times a Rep is sampled at most. One is enough to cover the shape;
#: more exists to catch a `+` that the real grammar only lets through once.
MAX_REPEATS = 3


def _sample(node: Node, rng: random.Random) -> list[str]:
    if isinstance(node, Lit):
        return [node.name]
    if isinstance(node, NumberSlot):
        return [NUMBER_TOKEN]
    if isinstance(node, AnyWordSlot):
        return [rng.choice(ANY_WORDS)]
    if isinstance(node, Opt):
        if rng.random() < 0.5:
            return []
        return _sample(node.part, rng)
    if isinstance(node, Rep):
        result = []
        for _ in range(rng.randint(1, MAX_REPEATS)):
            result.extend(_sample(node.part, rng))
        return result
    if isinstance(node, Seq):
        result = []
        for part in node.parts:
            result.extend(_sample(part, rng))
        return result
    if isinstance(node, Alt):
        return _sample(rng.choice(node.options), rng)
    raise TypeError(node)


def _generate_cases() -> list[dict[str, str]]:
    rng = random.Random(SEED)
    seen: set[tuple[str, ...]] = set()
    cases: list[dict[str, str]] = []
    attempts = 0
    while len(cases) < SAMPLE_COUNT and attempts < SAMPLE_COUNT * 20:
        attempts += 1
        token_names = _sample(CALL, rng)
        # A call can hold two independent numbers -- damageCall's leading one
        # and drainDamageType's own -- so each slot gets its own value, which
        # pins down which number the real parser binds where. Defense names
        # get the same treatment for the same reason.
        number_values = [
            str(rng.randint(0, 999)) for name in token_names if name == NUMBER_TOKEN
        ]
        ident_values = [
            rng.choice(IDENT_WORDS) for name in token_names if name == IDENT_TOKEN
        ]
        key = tuple(token_names) + tuple(number_values) + tuple(ident_values)
        if key in seen:
            continue
        seen.add(key)

        numbers = iter(number_values)
        idents = iter(ident_values)
        raw_words: list[str] = []
        for name in token_names:
            if name == NUMBER_TOKEN:
                raw_words.append(next(numbers))
            elif name == IDENT_TOKEN:
                # IDENT has no canonical spelling on file -- that is the whole
                # point of it -- so the sampled word stands in for one.
                raw_words.append(next(idents))
            else:
                raw_words.append(WORDS[name])
        # Normalization never reorders, so the canonical form is just the
        # same words hyphen-separated -- what this still pins down is that
        # the real parser accepts the shape at all, and binds each number to
        # the same slot the sample put it in.
        cases.append(
            {
                "id": f"sample-{len(cases)}",
                "raw": " ".join(raw_words),
                "canonical": "-".join(raw_words),
            }
        )
    return cases


CASES = _generate_cases()


@pytest.mark.parametrize("case", CASES, ids=lambda c: c["id"])
def test_sampled_sequence_is_valid_and_normalizes(case: dict[str, str]) -> None:
    assert validate(
        case["raw"]
    ), f"real grammar rejected shape-generated input: {case['raw']!r}"
    assert normalize(case["raw"]) == case["canonical"]

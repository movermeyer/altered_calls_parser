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
    DAMAGE_CALL,
    NUMBER_TOKEN,
    Alt,
    Lit,
    Node,
    NumberSlot,
    Opt,
    Seq,
)
from altered_calls_parser._tokens import WORDS

SAMPLE_COUNT = 300
SEED = 20260811


def _sample(node: Node, rng: random.Random) -> list[str]:
    if isinstance(node, Lit):
        return [node.name]
    if isinstance(node, NumberSlot):
        return [NUMBER_TOKEN]
    if isinstance(node, Opt):
        if rng.random() < 0.5:
            return []
        return _sample(node.part, rng)
    if isinstance(node, Seq):
        result: list[str] = []
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
        token_names = _sample(DAMAGE_CALL, rng)
        # A call can hold two independent numbers -- damageCall's leading one
        # and drainDamageType's own -- so each slot gets its own value, which
        # pins down which number the real parser binds where.
        number_values = [
            str(rng.randint(0, 999)) for name in token_names if name == NUMBER_TOKEN
        ]
        key = tuple(token_names) + tuple(number_values)
        if key in seen:
            continue
        seen.add(key)

        numbers = iter(number_values)
        raw_words = [
            next(numbers) if name == NUMBER_TOKEN else WORDS[name]
            for name in token_names
        ]
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

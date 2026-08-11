import re
from typing import Any

import pytest

from altered_calls_parser import normalize, tokenize
from altered_calls_parser._tokens import (
    CATEGORY_ORDER,
    ROLE_CATEGORIES,
    ROLE_DESCRIPTIONS,
    ROLE_LABELS,
)

from conftest import load_fixture

CASES = load_fixture("tokens.json")
CALLS = load_fixture("calls.json")
VALID_CALLS = [c for c in CALLS if c["valid"]]

CATEGORIES = set(CATEGORY_ORDER) | {"unknown"}

#: Spaces and hyphens, the two separators SEP skips.
SEPARATORS = re.compile(r"^[ \t\r\n-]*$")


@pytest.mark.parametrize("case", CASES, ids=lambda c: c["id"])
def test_tokenize_matches_fixture(case: dict[str, Any]) -> None:
    actual = [
        {
            "start": t.start,
            "end": t.end,
            "text": t.text,
            "canonical": t.canonical,
            "role": t.role,
        }
        for t in tokenize(case["raw"])
    ]
    assert actual == case["tokens"]


@pytest.mark.parametrize("case", CASES, ids=lambda c: c["id"])
def test_wording_is_derived_never_hard_coded(case: dict[str, Any]) -> None:
    for token in tokenize(case["raw"]):
        assert token.category == ROLE_CATEGORIES[token.role]
        assert token.label == ROLE_LABELS[token.role]
        assert token.description == ROLE_DESCRIPTIONS[token.role]


def test_every_role_map_covers_the_same_roles() -> None:
    # A role with a category but no sentence would reach a player as a KeyError.
    roles = set(ROLE_CATEGORIES)
    assert set(ROLE_LABELS) == roles
    assert set(ROLE_DESCRIPTIONS) == roles


@pytest.mark.parametrize("case", CALLS, ids=lambda c: c["id"])
def test_tokens_are_well_formed(case: dict[str, Any]) -> None:
    raw = case["raw"]
    previous_end = 0

    for token in tokenize(raw):
        assert token.start >= 0
        assert token.end > token.start
        assert token.end <= len(raw)
        # The slice must be the original input, not the upper-cased view the
        # lexer matched against.
        assert token.text == raw[token.start : token.end]

        # Sorted and non-overlapping, so a caller can render them in one pass.
        assert token.start >= previous_end
        previous_end = token.end

        assert token.category in CATEGORIES
        # A description is rendered verbatim to players, so it must be a real
        # sentence -- never empty, and never leaking a role name.
        assert token.description
        assert token.description.endswith(".")
        assert token.label


@pytest.mark.parametrize("case", VALID_CALLS, ids=lambda c: c["id"])
def test_a_valid_call_is_explained_completely(case: dict[str, Any]) -> None:
    raw = case["raw"]
    tokens = tokenize(raw)

    # Nothing in a call that parses is left unaccounted for.
    for token in tokens:
        assert token.role != "unknown"

    # Everything between the tokens is separator, so a caller that puts the
    # gaps back verbatim reproduces exactly what was typed.
    cursor = 0
    for token in tokens:
        assert SEPARATORS.match(raw[cursor : token.start])
        cursor = token.end
    assert SEPARATORS.match(raw[cursor:])


@pytest.mark.parametrize("case", VALID_CALLS, ids=lambda c: c["id"])
def test_canonical_words_agree_with_normalize(case: dict[str, Any]) -> None:
    """The tokenizer and the canonicalizer are two separate walks of the same
    tree, so they could drift apart as the grammar grows. Joining the canonical
    spellings has to reproduce normalize() exactly -- which pins word choice,
    word order, and that neither walk drops or invents a word.
    """
    raw = case["raw"]
    joined = "-".join(t.canonical for t in tokenize(raw))
    assert joined == normalize(raw)


@pytest.mark.parametrize(
    "raw",
    ["", "   ", "-", "!", "Stun!", "power word you stun", "full auto", "5 5 5 5 5"],
)
def test_tokenize_never_raises(raw: str) -> None:
    tokenize(raw)


@pytest.mark.parametrize("case", CALLS, ids=lambda c: c["id"])
def test_tokenize_never_raises_for_fixture_calls(case: dict[str, Any]) -> None:
    tokenize(case["raw"])

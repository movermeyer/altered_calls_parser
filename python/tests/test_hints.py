import re
from typing import Any

import pytest

from altered_calls_parser import parse
from altered_calls_parser._hints import did_you_mean

from conftest import load_fixture

CASES = load_fixture("hints.json")
CALLS = load_fixture("calls.json")
INVALID_CALLS = [c for c in CALLS if not c["valid"]]
VALID_CALLS = [c for c in CALLS if c["valid"]]

ANTLR_PHRASING = re.compile(r"mismatched|extraneous|expecting|<EOF>")


@pytest.mark.parametrize("case", CASES, ids=lambda c: c["id"])
def test_hint_matches_fixture(case: dict[str, Any]) -> None:
    errors = parse(case["raw"]).errors
    assert errors

    hint = errors[0].hint
    assert hint.kind == case["kind"]
    assert hint.offending_text == case["offendingText"]
    assert hint.start == case["start"]
    assert hint.end == case["end"]
    if "text" in case:
        assert hint.text == case["text"]
    if "suggestions" in case:
        assert hint.suggestions == case["suggestions"]


@pytest.mark.parametrize("case", INVALID_CALLS, ids=lambda c: c["id"])
def test_hints_are_well_formed(case: dict[str, Any]) -> None:
    raw = case["raw"]
    for err in parse(raw).errors:
        hint = err.hint
        # A hint is rendered verbatim to players, so it must always be a real
        # sentence -- never empty, and never leaking ANTLR's own phrasing.
        assert hint.text
        assert hint.text.endswith((".", "?"))
        assert not ANTLR_PHRASING.search(hint.text)

        assert hint.start <= hint.end <= len(raw)
        assert hint.offending_text == raw[hint.start : hint.end]


@pytest.mark.parametrize("case", VALID_CALLS, ids=lambda c: c["id"])
def test_valid_calls_have_no_errors(case: dict[str, Any]) -> None:
    assert parse(case["raw"]).errors == []


def test_hint_underlines_the_bad_word() -> None:
    hint = parse("knockdown 5 zzzz").errors[0].hint
    assert (hint.start, hint.end, hint.offending_text) == (12, 16, "zzzz")


def test_unfinished_call_collapses_to_a_caret_at_the_end() -> None:
    hint = parse("full auto").errors[0].hint
    assert hint.kind == "incomplete"
    assert (hint.start, hint.end, hint.offending_text) == (9, 9, "")


def test_did_you_mean_finds_prefix_match_edit_distance_would_miss() -> None:
    # "knock" is 4 edits from "knockdown" -- well past the threshold -- so only
    # the prefix rule recovers the split-in-two spelling.
    assert did_you_mean("knock") == ["Knockdown", "Knockout"]


# Whatever casing the typo arrives in, the suggestion comes back in the
# canonical capitalized spelling -- that is what gets offered as a one-click fix.
@pytest.mark.parametrize(
    ("typo", "expected"),
    [
        ("stmina", "Stamina"),
        ("knockdow", "Knockdown"),
        ("poisen", "Poison"),
        ("KNOCKDWN", "Knockdown"),
    ],
)
def test_did_you_mean_finds_typos(typo: str, expected: str) -> None:
    assert did_you_mean(typo) == [expected]


def test_did_you_mean_holds_short_words_to_a_tighter_distance() -> None:
    # "cat" is distance 2 from "rad" but only 3 letters long, so it is
    # rejected; a 6-letter word gets the looser threshold.
    assert did_you_mean("cat") == []
    assert did_you_mean("stamnia") == ["Stamina"]


def test_did_you_mean_returns_nothing_for_a_word_close_to_nothing() -> None:
    assert did_you_mean("zzzzz") == []
    assert did_you_mean("") == []


def test_did_you_mean_never_suggests_the_word_itself() -> None:
    # The canonical spelling, not the typed one -- asserting the lowercase form
    # is absent would pass for free now that candidates come back capitalized.
    assert "Stun" not in did_you_mean("stun")
    assert "Stun" not in did_you_mean("Stun")


def test_did_you_mean_caps_candidates() -> None:
    assert len(did_you_mean("s", 3)) <= 3

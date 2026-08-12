"""Drift guard: checks the phrase tables in shared/canonical-tokens.json
against the real parser.

Those tables say which keywords are one call between them, and for a Defense name
nothing in the grammar says so at all -- so a phrase whose words the grammar never
allows in that order would otherwise become a suggestion that produces an invalid
call.

Two things this deliberately does not prove. A phrase naming a token that doesn't
exist fails earlier and louder than any assertion here, when the completion engine
builds its tables at import. And a *made-up* Defense name ("Mitigate Receding
Mind") passes, because the grammar accepts any run of words as a name on purpose
-- the same trade-off Calls.g4 records for a typo in a known name. What is checked
is that every listed name really does make a call, and comes back from tokenize()
as the one name it was offered as.
"""

import pytest

from altered_calls_parser import normalize, tokenize, validate
from altered_calls_parser._tokens import DEFENSE_NAMES, PHRASES, WORDS

from conftest import load_fixture

CALLS = load_fixture("calls.json")


def label(names: list[str]) -> str:
    """How the phrase is offered as a completion, e.g. "Full Auto"."""
    return " ".join(WORDS[name] for name in names)


def canonical(names: list[str]) -> str:
    """How normalize() writes the phrase, and so what one CallToken carries."""
    return "-".join(WORDS[name] for name in names)


@pytest.mark.parametrize("names", DEFENSE_NAMES, ids=label)
def test_listed_defense_name_is_one_the_grammar_accepts(names: list[str]) -> None:
    raw = f"Mitigate {label(names)}"
    assert validate(raw)
    assert normalize(raw) == f"Mitigate-{canonical(names)}"
    # And one name, however many words: a suggestion the breakdown then splits in
    # two would be describing a different call than the one offered.
    parts = tokenize(raw)
    assert [part.canonical for part in parts] == ["Mitigate", canonical(names)]
    assert [part.role for part in parts] == ["mitigate", "defense-name"]


@pytest.mark.parametrize("names", PHRASES, ids=label)
def test_keyword_phrase_is_one_part_of_a_call_the_grammar_accepts(
    names: list[str],
) -> None:
    # A phrase has no call of its own to be tried in -- "Full Auto" is not a call
    # until it states a number -- so each is checked against the corpus instead.
    joined = canonical(names)
    containing = [
        case for case in CALLS if case["valid"] and joined in case.get("canonical", "")
    ]
    assert containing, f"no valid call in calls.json contains {label(names)}"
    for case in containing:
        assert joined in [part.canonical for part in tokenize(case["raw"])]

"""Drift guard: enumerates the whole call language from _grammar_shape.py (the
declarative mirror used for autocomplete) and checks the real ANTLR parser
agrees about every single call. This is the main defense against
_grammar_shape.py silently diverging from grammar/Calls.g4 as the grammar
evolves.

Bind the grammar's two open slots -- the damage number and the Defense name --
and the language is finite, so there is no reason to sample it: this walks all
24,400 calls. Three checks run over that set, each testing a different seam:

* the mirror's two readers agree with each other (product walk vs. the
  derivative engine in _completion.py);
* the real parser accepts everything the mirror produces, and normalizes it to
  the words it was given;
* the whole list matches tests/fixtures/all-calls.txt, which js/test/
  enumerate.test.ts also checks itself against -- and *that* comparison is what
  catches the direction nothing here can, since the JS enumeration walks the
  real ATN rather than the mirror.

Runs in about 12 seconds, nearly all of it the forward searches.
"""

from conftest import load_lines

from altered_calls_parser import CallParseError, normalize, tokenize
from altered_calls_parser._enumerate import (
    Binding,
    enumerate_by_product,
    enumerate_by_frontier,
)

#: The binding tests/fixtures/all-calls.txt is written with.
DEFAULT = Binding()

#: Reaches what the default binding cannot: Defense names run together, and
#: names made of words the lexer has never heard of (which arrive as IDENT).
#: These were the `MAX_REPEATS` and `IDENT_WORDS` of the random sampler this
#: test replaced, kept so nothing that guarded is lost.
REPEATED_NAMES = Binding(
    max_name_repeats=2,
    extra_name_words=("Bulwark", "Warded", "Stoneskin"),
)

#: Two distinct values, so that a call holding two independent numbers
#: ("Knockdown 3 7 Flesh Drain") pins down which slot binds which. The default
#: binding cannot: with one value, both orders read the same.
TWO_NUMBERS = Binding(numbers=("3", "7"))

CALLS = enumerate_by_product(DEFAULT)


def assert_none_failed(failures: list[str], what: str) -> None:
    """Report a handful of offenders rather than 24,400 parametrized cases."""
    assert (
        not failures
    ), f"{len(failures)} of {len(CALLS)} calls {what}, including:\n  " + "\n  ".join(
        sorted(failures)[:5]
    )


def test_enumeration_is_not_trivially_empty() -> None:
    # Every check below is over CALLS, so they would all pass vacuously if the
    # walk silently produced nothing.
    assert len(CALLS) == 24_400
    assert "" in CALLS, "the empty call is a member of the language"
    assert "Withstand" in CALLS
    assert "Mitigate Receding Tide" in CALLS
    assert "5 5 Armour Drain 5 Flesh Drain" in CALLS


def test_product_and_frontier_agree() -> None:
    """The two ways of reading the mirror describe the same language.

    Confirms the derivative engine in _completion.py -- what actually drives
    autocomplete -- understands _grammar_shape.py the same way a direct walk of
    its Alt/Opt/Rep structure does.
    """
    assert enumerate_by_frontier(DEFAULT) == CALLS


def test_enumeration_matches_fixture() -> None:
    """Run `make enumerate` to update the fixture after a deliberate change."""
    assert sorted(CALLS) == load_lines("all-calls.txt")


def test_every_call_is_valid_and_normalizes_to_its_own_words() -> None:
    """Normalization never reorders, so a call's canonical form is just its own
    words hyphenated. What this pins down is that the real parser accepts the
    shape at all, and binds each number to the slot the mirror put it in."""
    failures = []
    for call in CALLS:
        try:
            if normalize(call) != "-".join(call.split()):
                failures.append(f"{call!r} -> {normalize(call)!r}")
        except CallParseError:
            failures.append(f"{call!r} -> rejected by the real parser")
    assert_none_failed(failures, "did not normalize to their own words")


def test_every_call_is_fully_explained() -> None:
    """No word of a valid call may come back as `unknown` -- tokenize() has to
    have a role for every part of everything that parses."""
    failures = [
        f"{call!r} -> {[t.text for t in tokenize(call) if t.role == 'unknown']}"
        for call in CALLS
        if any(token.role == "unknown" for token in tokenize(call))
    ]
    assert_none_failed(failures, "contained a word tokenize() could not explain")


def test_repeated_and_unknown_defense_names() -> None:
    extra = enumerate_by_product(REPEATED_NAMES)
    assert enumerate_by_frontier(REPEATED_NAMES) == extra

    # Only the calls the default binding didn't already cover are worth
    # re-checking: the damage half of this binding is identical to CALLS.
    new = extra - CALLS
    assert "Mitigate Bulwark" in new, "a name the lexer sees as IDENT"
    assert "Mitigate Receding Tide Sturdy" in new, "two names run together"
    for call in new:
        assert normalize(call) == "-".join(call.split()), call


def test_two_numbers_bind_to_their_own_slots() -> None:
    new = enumerate_by_product(TWO_NUMBERS) - CALLS
    assert "Knockdown 3 7 Flesh Drain" in new
    for call in new:
        assert normalize(call) == "-".join(call.split()), call

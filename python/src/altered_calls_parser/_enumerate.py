"""Exhaustive enumeration of the call language, used by the drift guard in
tests/test_grammar_shape_consistency.py and by scripts/dump-calls.py.

The grammar has exactly two open slots -- the damage number (`NUMBER`) and the
Defense name (`defenseName : defenseWord+`, any run of words at all). Bind both
and the language becomes finite and small enough to write out in full: 24,400
calls for the default Binding below.

Two independent strategies are provided, and the drift guard asserts they agree:

* enumerate_by_product walks the declarative mirror in _grammar_shape.py
  directly, taking every branch of every Alt/Opt/Rep. It is the sampler in
  test_grammar_shape_consistency.py with the random choices removed.
* enumerate_by_frontier searches forward one token at a time, asking
  _completion.candidates() what may come next and the real parser whether what
  it has so far is a whole call. It exercises the derivative engine rather than
  reading the mirror's structure.

Both read the mirror, so agreement between them proves only that _completion.py
and the product walk understand _grammar_shape.py the same way. What proves the
mirror still matches grammar/Calls.g4 is that every call either produces is fed
to the real ANTLR parser, plus the JS enumeration in js/test/enumerate.ts, which
walks the real ATN via antlr4-c3 and must produce the identical set.
"""

from collections import deque
from dataclasses import dataclass, field

from . import validate
from ._grammar_shape import (
    ANY_WORD_TOKEN,
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
from ._tokens import DEFENSE_NAMES, WORDS

#: The Defense names the rulebook lists, as canonical words rather than token
#: names, so a Binding can add a name made of words the lexer has never heard of
#: (which is the whole point of `defenseWord : ~NUMBER`) without those needing a
#: token to be named by.
DEFAULT_DEFENSE_NAMES: tuple[tuple[str, ...], ...] = tuple(
    tuple(WORDS[name] for name in names) for names in DEFENSE_NAMES
)

#: Which token the lexer produces for a canonical word. Defense names are given
#: to enumerate_by_frontier as words, but candidates() speaks token names, so
#: this is how a word is handed back to it -- and a word with no keyword of its
#: own is an IDENT, exactly as the lexer would have it.
_TOKEN_NAME_BY_WORD: dict[str, str] = {word: name for name, word in WORDS.items()}


@dataclass(frozen=True)
class Binding:
    """Values bound to the grammar's open slots, making the language finite."""

    #: Values to try in every `number` position. One is enough to cover the
    #: shape; more than one pins down which slot each number binds to, since a
    #: call can hold two independent numbers ("Knockdown 5 3 Flesh Drain").
    numbers: tuple[str, ...] = ("5",)

    #: Defense names, each as its canonical words. These stand in for a slot
    #: that accepts any run of words at all, so this list bounds what gets
    #: enumerated, not what parses.
    defense_names: tuple[tuple[str, ...], ...] = DEFAULT_DEFENSE_NAMES

    #: How many whole Defense names may be strung together. The grammar's
    #: `defenseWord+` is unbounded, so without a cap here the forward search
    #: never terminates -- binding a slot's values is not enough on its own.
    max_name_repeats: int = 1

    #: Words that are not Defense names in their own right, offered as extra
    #: single-word names. Used by the drift guard to reach names the lexer sees
    #: as IDENT.
    extra_name_words: tuple[str, ...] = field(default=())

    @property
    def names(self) -> tuple[tuple[str, ...], ...]:
        return self.defense_names + tuple((word,) for word in self.extra_name_words)


def _render(words: tuple[str, ...]) -> str:
    return " ".join(words)


# ============================================================
# Strategy 1: cross-product over the declarative mirror
# ============================================================


def _expand(node: Node, binding: Binding) -> list[tuple[str, ...]]:
    """Every word sequence `node` can match, under `binding`."""
    if isinstance(node, Lit):
        return [(WORDS[node.name],)]
    if isinstance(node, NumberSlot):
        return [(value,) for value in binding.numbers]
    if isinstance(node, AnyWordSlot):
        # A whole name at a time rather than word by word. The grammar does not
        # require "Receding" to be followed by "Tide", but enumerating every
        # word of every name against every other would be noise: the names are
        # the point, and max_name_repeats covers running two together.
        return list(binding.names)
    if isinstance(node, Opt):
        return [(), *_expand(node.part, binding)]
    if isinstance(node, Rep):
        once = _expand(node.part, binding)
        result = list(once)
        current = once
        for _ in range(binding.max_name_repeats - 1):
            current = [a + b for a in current for b in once]
            result.extend(current)
        return result
    if isinstance(node, Seq):
        result = [()]
        for part in node.parts:
            sub = _expand(part, binding)
            result = [a + b for a in result for b in sub]
        return result
    if isinstance(node, Alt):
        result = []
        for option in node.options:
            result.extend(_expand(option, binding))
        return result
    raise TypeError(node)


def enumerate_by_product(binding: Binding | None = None) -> set[str]:
    """Every call in the language, by taking every branch of the mirror.

    A set rather than a list because the grammar derives some calls more than
    one way: `damageCall`'s two optional damage-type slots mean a call with a
    single damage type is reachable by filling either one, so "Fire" comes out
    twice (1,216 duplicates in all, under the default Binding).
    """
    binding = binding or Binding()
    return {_render(words) for words in _expand(CALL, binding)}


# ============================================================
# Strategy 2: forward search over the completion frontier
# ============================================================


@dataclass(frozen=True)
class _Prefix:
    """A partial call, in both the forms the search needs it in."""

    #: The words so far, for rendering and for the acceptance test.
    words: tuple[str, ...]
    #: The same run as token names, which is what candidates() speaks.
    token_names: tuple[str, ...]
    #: How many whole Defense names have been laid down, against max_name_repeats.
    names_used: int


def enumerate_by_frontier(binding: Binding | None = None) -> set[str]:
    """Every call in the language, by searching forward one token at a time.

    The successor function is _completion.candidates() -- "what may follow this
    run of tokens" -- and the acceptance test is the real parser, since the
    candidate set says what may come next but never that nothing needs to. This
    is the same shape as the JS enumeration, which asks antlr4-c3 the same
    question of the real ATN.
    """
    from ._completion import candidates  # noqa: PLC0415 -- avoids an import cycle

    binding = binding or Binding()
    accepted: set[str] = set()
    frontier: deque[_Prefix] = deque([_Prefix((), (), 0)])

    while frontier:
        prefix = frontier.popleft()
        text = _render(prefix.words)
        if validate(text):
            accepted.add(text)

        for candidate in sorted(candidates(list(prefix.token_names))):
            if candidate == NUMBER_TOKEN:
                for value in binding.numbers:
                    frontier.append(
                        _Prefix(
                            prefix.words + (value,),
                            prefix.token_names + (NUMBER_TOKEN,),
                            prefix.names_used,
                        )
                    )
            elif candidate == ANY_WORD_TOKEN:
                if prefix.names_used >= binding.max_name_repeats:
                    continue
                for name in binding.names:
                    frontier.append(
                        _Prefix(
                            prefix.words + name,
                            prefix.token_names
                            + tuple(
                                _TOKEN_NAME_BY_WORD.get(word, IDENT_TOKEN)
                                for word in name
                            ),
                            prefix.names_used + 1,
                        )
                    )
            else:
                frontier.append(
                    _Prefix(
                        prefix.words + (WORDS[candidate],),
                        prefix.token_names + (candidate,),
                        prefix.names_used,
                    )
                )

    return accepted

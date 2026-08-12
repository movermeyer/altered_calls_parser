"""Autocomplete via Brzozowski derivatives over the declarative grammar
mirror in _grammar_shape.py. This mirrors what antlr4-c3 does by walking
an ATN, but there is no Python port of antlr4-c3, and the grammar is
small/flat/non-recursive enough for a hand-rolled derivative walk to be
tractable and easy to keep correct.
"""

import re
from dataclasses import dataclass

from antlr4 import CommonTokenStream

from ._case_changing_stream import CaseChangingCharStream
from ._grammar_shape import (
    ANY_WORD_TOKEN,
    CALL,
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
from ._tokens import CATEGORIES, DEFENSE_NAMES, PHRASES, WORDS
from .generated.CallsLexer import CallsLexer


class _Empty:
    """Matches only the empty remainder; nullable, consumes nothing further."""


class _Fail:
    """A dead end; matches nothing."""


EMPTY = _Empty()
FAIL = _Fail()


def nullable(node: Node | _Empty | _Fail) -> bool:
    if isinstance(node, _Empty):
        return True
    if isinstance(node, _Fail):
        return False
    if isinstance(node, (Lit, NumberSlot, AnyWordSlot)):
        return False
    if isinstance(node, Opt):
        return True
    if isinstance(node, Rep):
        # One or more, so an empty match is never enough.
        return False
    if isinstance(node, Seq):
        return all(nullable(p) for p in node.parts)
    if isinstance(node, Alt):
        return any(nullable(o) for o in node.options)
    raise TypeError(node)


def first(node: Node | _Empty | _Fail) -> set[str]:
    if isinstance(node, (_Empty, _Fail)):
        return set()
    if isinstance(node, Lit):
        return {node.name}
    if isinstance(node, NumberSlot):
        return {NUMBER_TOKEN}
    if isinstance(node, AnyWordSlot):
        return {ANY_WORD_TOKEN}
    if isinstance(node, (Opt, Rep)):
        return first(node.part)
    if isinstance(node, Seq):
        result: set[str] = set()
        for part in node.parts:
            result |= first(part)
            if not nullable(part):
                break
        return result
    if isinstance(node, Alt):
        result = set()
        for option in node.options:
            result |= first(option)
        return result
    raise TypeError(node)


def _seq_of(parts: tuple[Node | _Empty | _Fail, ...]) -> Node | _Empty | _Fail:
    filtered = [p for p in parts if not isinstance(p, _Empty)]
    if not filtered:
        return EMPTY
    if any(isinstance(p, _Fail) for p in filtered):
        return FAIL
    if len(filtered) == 1:
        return filtered[0]
    return Seq(tuple(filtered))  # type: ignore[arg-type]


def _alt_of(branches: list[Node | _Empty | _Fail]) -> Node | _Empty | _Fail:
    non_fail = [b for b in branches if not isinstance(b, _Fail)]
    if not non_fail:
        return FAIL
    if len(non_fail) == 1:
        return non_fail[0]
    return Alt(tuple(non_fail))  # type: ignore[arg-type]


def derivative(node: Node | _Empty | _Fail, token: str) -> Node | _Empty | _Fail:
    if isinstance(node, (_Empty, _Fail)):
        return FAIL
    if isinstance(node, Lit):
        return EMPTY if node.name == token else FAIL
    if isinstance(node, NumberSlot):
        return EMPTY if token == NUMBER_TOKEN else FAIL
    if isinstance(node, AnyWordSlot):
        # Any word at all -- which is every token the lexer can produce except
        # NUMBER, since a Defense name is made of words.
        return FAIL if token == NUMBER_TOKEN else EMPTY
    if isinstance(node, Opt):
        return derivative(node.part, token)
    if isinstance(node, Rep):
        # Having taken one, the rest are optional: d(P+) = d(P) . P*, and P*
        # is written Opt(Rep(P)) since there is no Star node.
        return _seq_of((derivative(node.part, token), Opt(node)))
    if isinstance(node, Seq):
        return _seq_derivative(node.parts, token)
    if isinstance(node, Alt):
        return _alt_of([derivative(o, token) for o in node.options])
    raise TypeError(node)


def _seq_derivative(parts: tuple[Node, ...], token: str) -> Node | _Empty | _Fail:
    if not parts:
        return FAIL
    head, *rest = parts
    branches: list[Node | _Empty | _Fail] = []
    d_head = derivative(head, token)
    if not isinstance(d_head, _Fail):
        branches.append(_seq_of((d_head, *rest)))
    if nullable(head):
        branches.append(_seq_derivative(tuple(rest), token))
    return _alt_of(branches)


def candidates(consumed_token_names: list[str]) -> set[str]:
    """The set of token names (or NUMBER_TOKEN, or ANY_WORD_TOKEN) valid
    immediately after having consumed `consumed_token_names`, per the grammar
    mirror."""
    node: Node | _Empty | _Fail = CALL
    for name in consumed_token_names:
        node = derivative(node, name)
        if isinstance(node, _Fail):
            return set()
    return first(node)


@dataclass(frozen=True)
class _Phrase:
    """A run of words that is one call between them -- "Full Auto", "Shrug Off",
    "Receding Tide". The grammar sees each of these as several keywords, but a
    player shouts one call, so autocomplete offers and accepts them whole.
    """

    #: Token names, in order.
    names: tuple[str, ...]
    #: Canonical words, in order -- WORDS[names[i]].
    words: tuple[str, ...]
    #: The whole phrase as one label, e.g. "Full Auto".
    label: str
    #: Coarse grouping, one of `categoryOrder`.
    category: str
    #: Whether this is a Defense name. Names are admitted by a slot rather than
    #: by their keywords (AnyWordSlot, the grammar's `defenseWord : ~NUMBER`), so
    #: a different question decides whether one may go at the caret.
    is_name: bool


def _phrase(names: list[str], is_name: bool) -> _Phrase:
    words = tuple(WORDS[name] for name in names)
    return _Phrase(
        names=tuple(names),
        words=words,
        label=" ".join(words),
        # A name's words keep their own categories elsewhere -- FULL is an
        # "effect", because of "Full Auto" -- but a Defense name is a defense
        # name and nothing else, which is what keeps "Full" from leaking out of
        # the Mitigate hint as an effect. Every other phrase takes its first
        # word's.
        category="defense-name" if is_name else CATEGORIES[names[0]],
        is_name=is_name,
    )


_ALL_PHRASES: list[_Phrase] = [_phrase(names, False) for names in PHRASES] + [
    _phrase(names, True) for names in DEFENSE_NAMES
]

#: How many words of a phrase the caret may already have behind it and still
#: complete the whole thing, so that "Shrug O" offers "Shrug Off" rather than
#: just "Off". Derived from the tables rather than fixed at one, so a three-word
#: call would need no change here.
_MAX_WORDS_TYPED = max(len(p.names) for p in _ALL_PHRASES) - 1

_SEPARATORS = re.compile(r"[ \t\r\n\-,:]+")


def _typed_prefix(slice_: str) -> str:
    """What the player has typed, in the form a phrase label can be compared
    against: lower-cased, with every run of separators collapsed to the single
    space labels are written with, so "Full-A" and "shrug,of" match too.
    """
    return _SEPARATORS.sub(" ", slice_.lower())


@dataclass(frozen=True)
class Suggestion:
    kind: str  # "keyword" | "number"
    #: Half-open range in the input that `label` replaces. It reaches back over
    #: any words of the phrase already typed, so accepting a suggestion never
    #: leaves a partial word behind.
    start: int
    end: int
    #: The whole call to insert, e.g. "Shrug Off" -- a single word for most
    #: calls. None for a number.
    label: str | None = None
    #: Just the word the caret is completing: "Off" for a caret after "Shrug ",
    #: "Shrug" for a caret at the start of input. What a hint means when it names
    #: the words allowed at a position. None for a number.
    word: str | None = None
    #: Coarse grouping, one of `categoryOrder`. None for a number.
    category: str | None = None


def _find_caret_token_index(tokens: list, cursor: int) -> int:  # type: ignore[type-arg]
    for i, tok in enumerate(tokens):
        if cursor <= tok.stop + 1:
            return i
    return len(tokens) - 1


def suggest(text: str, cursor: int) -> list[Suggestion]:
    """Suggest completions for `text` at caret offset `cursor`.

    Multi-word calls come back as one suggestion each. The candidate set the
    derivative walk reports is per token, so "Shrug Off" would otherwise arrive
    as "Shrug" and then "Off"; the phrase tables above say which tokens belong to
    one call, and every suggestion carries the input range it replaces so that
    accepting one mid-phrase rewrites the words already typed instead of
    appending to them.
    """
    stream = CaseChangingCharStream(text, upper=True)
    lexer = CallsLexer(stream)
    token_stream = CommonTokenStream(lexer)
    token_stream.fill()
    all_tokens = token_stream.tokens

    caret_index = _find_caret_token_index(all_tokens, cursor)

    consumed_names = [
        name
        for tok in all_tokens[:caret_index]
        if (name := CallsLexer.symbolicNames[tok.type]) is not None
    ]
    raw_candidates = candidates(consumed_names)
    number_allowed = NUMBER_TOKEN in raw_candidates
    name_allowed = ANY_WORD_TOKEN in raw_candidates
    allowed_names = raw_candidates - {NUMBER_TOKEN, ANY_WORD_TOKEN}

    suggestions: list[Suggestion] = []
    seen_labels: set[str] = set()
    # Words already spoken for by a phrase, so the bare word isn't offered too.
    phrase_words: set[str] = set()

    # Phrases first, and from the furthest-back anchor forwards: a phrase that
    # reaches back over words the player has already typed beats the bare next
    # word, and the earliest anchor that still matches is the one whose range
    # rewrites the whole phrase rather than just its last word.
    for anchor in range(max(0, caret_index - _MAX_WORDS_TYPED), caret_index + 1):
        words_typed = caret_index - anchor
        start = all_tokens[anchor].start
        typed = _typed_prefix(text[start:cursor])
        for candidate in _ALL_PHRASES:
            if words_typed >= len(candidate.names):
                continue
            # Whether the word the caret is on may go here at all. Indexing the
            # phrase by how many of its words are already typed is what makes
            # one test serve both "Ful" (nothing typed yet, so FULL must be
            # allowed) and "Full " (one word in, so AUTO must be).
            if candidate.is_name:
                allowed = name_allowed
            else:
                allowed = candidate.names[words_typed] in allowed_names
            if not allowed:
                continue
            # Everything from the anchor to the caret has to read as the start of
            # this phrase -- which also confirms the earlier words really are its
            # earlier words, so no separate token-by-token check is needed.
            if not candidate.label.lower().startswith(typed):
                continue
            if candidate.label in seen_labels:
                continue
            seen_labels.add(candidate.label)
            phrase_words.add(candidate.words[words_typed])
            suggestions.append(
                Suggestion(
                    kind="keyword",
                    start=start,
                    end=cursor,
                    label=candidate.label,
                    word=candidate.words[words_typed],
                    category=candidate.category,
                )
            )

    # Then the plain keywords, which only ever complete the word the caret is
    # actually on.
    caret_start = all_tokens[caret_index].start
    caret_typed = _typed_prefix(text[caret_start:cursor])
    for name in allowed_names:
        label = WORDS.get(name)
        # Canonical words are capitalized; what the user has typed so far is
        # whatever they typed, lower-cased above -- so match case-insensitively
        # while still offering the canonical spelling.
        if label is None or not label.lower().startswith(caret_typed):
            continue
        # "Auto" on its own is never the answer when "Full Auto" is already on
        # offer, and neither is "Full" when it can only begin one.
        if label in phrase_words or label in seen_labels:
            continue
        seen_labels.add(label)
        suggestions.append(
            Suggestion(
                kind="keyword",
                start=caret_start,
                end=cursor,
                label=label,
                word=label,
                category=CATEGORIES[name],
            )
        )

    if number_allowed and (caret_typed.isdigit() or caret_typed == ""):
        suggestions.append(Suggestion(kind="number", start=caret_start, end=cursor))

    suggestions.sort(key=lambda s: (s.label is None, s.label or ""))
    return suggestions

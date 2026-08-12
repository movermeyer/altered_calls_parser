"""Autocomplete via Brzozowski derivatives over the declarative grammar
mirror in _grammar_shape.py. This mirrors what antlr4-c3 does by walking
an ATN, but there is no Python port of antlr4-c3, and the grammar is
small/flat/non-recursive enough for a hand-rolled derivative walk to be
tractable and easy to keep correct.
"""

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
from ._tokens import DEFENSE_NAME_WORDS, WORDS
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
class Suggestion:
    kind: str  # "keyword" | "number"
    label: str | None = None


def _find_caret_token_index(tokens: list, cursor: int) -> int:  # type: ignore[type-arg]
    for i, tok in enumerate(tokens):
        if cursor <= tok.stop + 1:
            return i
    return len(tokens) - 1


def suggest(text: str, cursor: int) -> list[Suggestion]:
    stream = CaseChangingCharStream(text, upper=True)
    lexer = CallsLexer(stream)
    token_stream = CommonTokenStream(lexer)
    token_stream.fill()
    all_tokens = token_stream.tokens

    caret_index = _find_caret_token_index(all_tokens, cursor)
    caret_token = all_tokens[caret_index]
    partial = text[caret_token.start : cursor].lower()
    partial_is_digits = partial.isdigit() or partial == ""

    consumed_names = [
        name
        for tok in all_tokens[:caret_index]
        if (name := CallsLexer.symbolicNames[tok.type]) is not None
    ]
    raw_candidates = candidates(consumed_names)

    suggestions: list[Suggestion] = []
    for name in raw_candidates:
        if name == NUMBER_TOKEN:
            if partial_is_digits:
                suggestions.append(Suggestion(kind="number"))
            continue
        # A Defense name is any word at all, so there is nothing here to
        # complete against -- the names the rulebook does list stand in.
        labels = DEFENSE_NAME_WORDS if name == ANY_WORD_TOKEN else [WORDS[name]]
        # Canonical words are capitalized; what the user has typed so far is
        # whatever they typed, lower-cased above -- so match case-insensitively
        # while still offering the canonical spelling.
        suggestions.extend(
            Suggestion(kind="keyword", label=label)
            for label in labels
            if label.lower().startswith(partial)
        )

    suggestions.sort(key=lambda s: (s.label is None, s.label or ""))
    return suggestions

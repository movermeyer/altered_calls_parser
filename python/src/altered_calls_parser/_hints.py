"""Turns raw ANTLR syntax errors into plain-language hints aimed at players
rather than developers.

The wording lives here (and in the TypeScript mirror, hints.ts) rather than in
each consumer so that every front end says the same thing, and so that the two
language implementations can be held to identical output by the shared
tests/fixtures/hints.json fixture. All player-visible vocabulary comes from
shared/canonical-tokens.json -- no English is hard-coded against a token name
here.
"""

from dataclasses import dataclass, field

from ._completion import suggest
from ._tokens import (
    CATEGORY_EXAMPLES,
    CATEGORY_LABELS,
    CATEGORY_ORDER,
    NUMBER_WORDS,
    WORDS,
)

_ALL_WORDS: list[str] = sorted(WORDS.values())


@dataclass(frozen=True)
class CallHint:
    #: One of "unknown-word", "spelled-number", "misplaced-word", "incomplete",
    #: "invalid-character".
    kind: str
    #: A complete, player-facing sentence. Safe to render as-is.
    text: str
    #: The exact slice of the input at fault, in its original casing ("" at end of input).
    offending_text: str
    #: Half-open range of `offending_text` in the input, for underlining.
    start: int
    end: int
    #: Words worth offering as one-click fixes: the did-you-mean candidates for
    #: a misspelling, or the words that would actually be accepted here otherwise.
    suggestions: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class _Allowed:
    """What the grammar will accept at some caret position."""

    #: The single words that may go here, in suggestion order, without repeats.
    words: list[str]
    #: Each word's coarse category, parallel to `words`.
    categories: list[str]
    number: bool


def _allowed_at(text: str, cursor: int) -> _Allowed:
    """What may go at `cursor`, as single words.

    A hint names the next *word* rather than the whole call it might start: a
    player who has typed "Shrug" wants to hear `Add "Off"`, not `Add "Shrug
    Off"`. So this reads each suggestion's `word` and not its `label` -- and takes
    the category from the suggestion too, since the same word can be an effect in
    one position ("Full Auto") and a Defense name in another ("Full Defense").
    """
    items = suggest(text, cursor)
    words: list[str] = []
    categories: list[str] = []
    for s in items:
        # "Phase In" and "Phase Out" are two calls but one next word.
        if s.kind != "keyword" or s.word is None or s.word in words:
            continue
        words.append(s.word)
        categories.append(s.category if s.category is not None else "unknown")
    return _Allowed(
        words=words,
        categories=categories,
        number=any(s.kind == "number" for s in items),
    )


def _allowed_after(text: str) -> _Allowed:
    """What may follow the whole of `text`.

    Asking for candidates at the end of the input would instead complete the
    final *word* ("armour" -> "armour"), so the caret is moved past a synthetic
    separator to get the genuinely-next tokens ("armour" -> "drain"). SEP is
    skipped by the lexer, so this cannot change how the preceding text
    tokenizes.
    """
    padded = text + " "
    return _allowed_at(padded, len(padded))


def _quote(word: str) -> str:
    return f'"{word}"'


def _join_or(parts: list[str]) -> str:
    if not parts:
        return ""
    if len(parts) == 1:
        return parts[0]
    return f"{', '.join(parts[:-1])} or {parts[-1]}"


def describe_allowed(allowed: _Allowed) -> str:
    """Describe `allowed` as a noun phrase, e.g. `"drain"` or
    `"Overwhelm", an effect (like "Stun") or a number`.

    Small sets are listed verbatim; larger ones collapse to category names so
    the player never faces the 30-item token dump ANTLR would have produced.
    """
    total = len(allowed.words) + (1 if allowed.number else 0)
    if total == 0:
        return ""
    if total <= 3:
        parts = [_quote(w) for w in allowed.words]
        if allowed.number:
            parts.insert(0, CATEGORY_LABELS["number"])
        return _join_or(parts)

    parts = []
    for category in CATEGORY_ORDER:
        if category == "number":
            if allowed.number:
                parts.append(CATEGORY_LABELS["number"])
            continue
        members = [
            w
            for w, w_category in zip(allowed.words, allowed.categories, strict=True)
            if w_category == category
        ]
        if not members:
            continue
        # One or two words are shorter and more concrete named outright than
        # described ('"power"' beats 'a power call (like "power")').
        if len(members) <= 2:
            parts.extend(_quote(w) for w in members)
            continue
        example = CATEGORY_EXAMPLES[category]
        if example not in members:
            example = members[0]
        parts.append(f"{CATEGORY_LABELS[category]} (like {_quote(example)})")
    return _join_or(parts)


def _levenshtein(a: str, b: str) -> int:
    previous = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        current = [i]
        for j in range(1, len(b) + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            current.append(
                min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost)
            )
        previous = current
    return previous[len(b)]


def did_you_mean(word: str, limit: int = 3) -> list[str]:
    """Closest canonical words to `word`, best first, at most `limit`.

    Prefix matches rank above edit-distance matches so that a call split in two
    ("knock down") still points at "knockdown", which is far enough away in
    edit distance to miss the threshold entirely.
    """
    w = word.lower()
    if w == "":
        return []

    max_distance = 1 if len(w) <= 4 else 2
    scored: list[tuple[int, int, str]] = []
    for candidate in _ALL_WORDS:
        # Compare against a lower-cased view -- canonical words are capitalized
        # and `w` is not, so a case difference would otherwise cost an edit and
        # push real matches past the distance threshold. The canonical spelling
        # is what gets offered back.
        lower = candidate.lower()
        if lower == w:
            continue
        if lower.startswith(w):
            scored.append((0, 0, candidate))
            continue
        distance = _levenshtein(w, lower)
        if distance <= max_distance:
            scored.append((1, distance, candidate))

    scored.sort()
    return [c for _, _, c in scored[:limit]]


def _unknown_word_hint(
    text: str, offending_text: str, start: int, end: int
) -> CallHint:
    lower = offending_text.lower()
    allowed = _allowed_at(text, start)

    # "Knockdown five Fire" is a spelling mistake in the number slot, not an
    # unrecognised call word -- and edit distance would unhelpfully offer
    # "fire" for "five". Only claim this when a number really does belong here.
    digits = NUMBER_WORDS.get(lower)
    if digits is not None and allowed.number:
        return CallHint(
            kind="spelled-number",
            text=f"Write the number in digits: {_quote(digits)}, not {_quote(offending_text)}.",
            offending_text=offending_text,
            start=start,
            end=end,
            suggestions=[digits],
        )

    candidates = did_you_mean(lower)
    if candidates:
        joined = _join_or([_quote(c) for c in candidates])
        return CallHint(
            kind="unknown-word",
            text=f"{_quote(offending_text)} isn't a call word. Did you mean {joined}?",
            offending_text=offending_text,
            start=start,
            end=end,
            suggestions=candidates,
        )

    description = describe_allowed(allowed)
    sentence = f"{_quote(offending_text)} isn't a call word."
    if description:
        sentence += f" Here you can put {description}."
    return CallHint(
        kind="unknown-word",
        text=sentence,
        offending_text=offending_text,
        start=start,
        end=end,
        suggestions=allowed.words,
    )


def _misplaced_word_hint(
    text: str, offending_text: str, start: int, end: int
) -> CallHint:
    allowed = _allowed_at(text, start)
    description = describe_allowed(allowed)
    if description:
        sentence = (
            f"{_quote(offending_text)} can't go here. Here you can put {description}."
        )
    else:
        sentence = (
            f"The call is already complete before {_quote(offending_text)}, "
            "so there is nothing more to add."
        )
    return CallHint(
        kind="misplaced-word",
        text=sentence,
        offending_text=offending_text,
        start=start,
        end=end,
        suggestions=allowed.words,
    )


def _incomplete_hint(text: str, start: int) -> CallHint:
    allowed = _allowed_after(text)
    description = describe_allowed(allowed)
    sentence = "The call isn't finished yet."
    if description:
        sentence += f" Add {description}."
    return CallHint(
        kind="incomplete",
        text=sentence,
        offending_text="",
        start=start,
        end=start,
        suggestions=allowed.words,
    )


def _invalid_character_hint(offending_text: str, start: int, end: int) -> CallHint:
    return CallHint(
        kind="invalid-character",
        text=(
            "Calls are made of words and numbers only, so "
            f"{_quote(offending_text)} can't appear in one."
        ),
        offending_text=offending_text,
        start=start,
        end=end,
        suggestions=[],
    )


def offset_of(text: str, line: int, column: int) -> int:
    """Absolute offset of a 1-based line / 0-based column pair within `text`."""
    offset = 0
    for _ in range(line - 1):
        nxt = text.find("\n", offset)
        if nxt == -1:
            break
        offset = nxt + 1
    return min(offset + column, len(text))


@dataclass(frozen=True)
class OffendingToken:
    """Where and what the parser tripped over, independent of ANTLR's message text."""

    #: Half-open range in the input; empty (start == end) at end of input.
    start: int
    end: int
    is_eof: bool
    is_word: bool


def build_hint(
    text: str, line: int, column: int, offending: OffendingToken | None
) -> CallHint:
    """Build the hint for one syntax error.

    `offending` is None for lexer errors, where no token could be formed at
    all; the error kind is then read off the token itself rather than by
    matching against ANTLR's message strings, which are not a stable interface.
    """
    if offending is None:
        start = offset_of(text, line, column)
        end = min(start + 1, len(text))
        return _invalid_character_hint(text[start:end], start, end)

    if offending.is_eof:
        return _incomplete_hint(text, len(text))

    # Slice the original input rather than reading token.text, which reflects
    # the upper-cased view the lexer matched against.
    offending_text = text[offending.start : offending.end]
    if offending.is_word:
        return _unknown_word_hint(text, offending_text, offending.start, offending.end)
    return _misplaced_word_hint(text, offending_text, offending.start, offending.end)

import json
from pathlib import Path

from .generated.CallsLexer import CallsLexer

_TOKENS_PATH = Path(__file__).resolve().parent / "generated" / "canonical-tokens.json"
with _TOKENS_PATH.open() as _f:
    _TOKENS: dict[str, object] = json.load(_f)

WORDS: dict[str, str] = _TOKENS["words"]  # type: ignore[assignment]

# Runs of keywords that are one call between them, as token names: the grammar
# joins these in a rule of its own, so `FULL AUTO` and `SHRUG OFF` are here but
# `KNOCKDOWN` is not. _completion.py offers each whole.
PHRASES: list[list[str]] = _TOKENS["phrases"]  # type: ignore[assignment]

# The Defense names the rulebook does list, as token names, one entry per name.
# The grammar accepts any run of words at all as a Defense name and doesn't
# require "Receding" to be followed by "Tide", so there is nothing in it left to
# complete against -- _completion.py offers these on its behalf.
DEFENSE_NAMES: list[list[str]] = _TOKENS["defenseNames"]  # type: ignore[assignment]

# Player-facing vocabulary used by _completion.py to say which part of a call a
# suggestion would be, and by _hints.py to group them.
CATEGORIES: dict[str, str] = _TOKENS["categories"]  # type: ignore[assignment]
CATEGORY_ORDER: list[str] = _TOKENS["categoryOrder"]  # type: ignore[assignment]
CATEGORY_LABELS: dict[str, str] = _TOKENS["categoryLabels"]  # type: ignore[assignment]
CATEGORY_EXAMPLES: dict[str, str] = _TOKENS["categoryExamples"]  # type: ignore[assignment]
NUMBER_WORDS: dict[str, str] = _TOKENS["numberWords"]  # type: ignore[assignment]

# Player-facing vocabulary used by _tokenize.py to describe which part of the
# syntax each word of a call belongs to.
ROLE_CATEGORIES: dict[str, str] = _TOKENS["roleCategories"]  # type: ignore[assignment]
ROLE_LABELS: dict[str, str] = _TOKENS["roleLabels"]  # type: ignore[assignment]
ROLE_DESCRIPTIONS: dict[str, str] = _TOKENS["roleDescriptions"]  # type: ignore[assignment]


def token_name(token_type: int) -> str:
    name = CallsLexer.symbolicNames[token_type]
    assert name is not None
    return str(name)


def title_case(word: str) -> str:
    """Capitalize `word` the way the canonical spellings in WORDS are.

    Only IDENT needs this: every other token has its canonical spelling on file,
    but a Defense name the rulebook doesn't list has to borrow the player's own
    word. IDENT is `[A-Za-z]+`, so there is no locale or grapheme subtlety here
    -- which matters, because the TypeScript mirror must agree character for
    character.
    """
    return word[:1].upper() + word[1:].lower()

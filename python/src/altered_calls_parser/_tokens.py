import json
from pathlib import Path

from .generated.CallsLexer import CallsLexer

_TOKENS_PATH = Path(__file__).resolve().parent / "generated" / "canonical-tokens.json"
with _TOKENS_PATH.open() as _f:
    _TOKENS: dict[str, object] = json.load(_f)

WORDS: dict[str, str] = _TOKENS["words"]  # type: ignore[assignment]

# Player-facing vocabulary used by _hints.py to describe what belongs where.
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

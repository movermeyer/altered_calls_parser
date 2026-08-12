from typing import Any

import pytest

from altered_calls_parser import suggest

from conftest import load_fixture

CASES = load_fixture("completions.json")


@pytest.mark.parametrize("case", CASES, ids=lambda c: c["id"])
def test_suggest(case: dict[str, Any]) -> None:
    results = suggest(case["raw"], case["cursor"])
    keyword_labels = sorted(
        r.label for r in results if r.kind == "keyword" and r.label is not None
    )
    has_number = any(r.kind == "number" for r in results)

    if case.get("exhaustive"):
        assert keyword_labels == sorted(case["expectedKeywordLabels"])
    else:
        for label in case["expectedKeywordLabels"]:
            assert label in keyword_labels

    assert has_number is case.get("expectedNumberSlot", False)

    # Where a case pins them, the whole suggestion: which word of a multi-word
    # call the caret is on, and the range accepting it would rewrite.
    actual = [
        {
            "label": r.label,
            "word": r.word,
            "category": r.category,
            "start": r.start,
            "end": r.end,
        }
        for r in results
        if r.kind == "keyword"
    ]
    for expected in case.get("expectedSuggestions", []):
        assert expected in actual

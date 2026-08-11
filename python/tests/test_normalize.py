from typing import Any

import pytest

from altered_calls_parser import CallParseError, normalize

from conftest import load_fixture

CASES = load_fixture("calls.json")
VALID_CASES = [c for c in CASES if c["valid"]]
INVALID_CASES = [c for c in CASES if not c["valid"]]


@pytest.mark.parametrize("case", VALID_CASES, ids=lambda c: c["id"])
def test_normalize_valid(case: dict[str, Any]) -> None:
    assert normalize(case["raw"]) == case["canonical"]


@pytest.mark.parametrize("case", INVALID_CASES, ids=lambda c: c["id"])
def test_normalize_invalid_raises(case: dict[str, Any]) -> None:
    with pytest.raises(CallParseError):
        normalize(case["raw"])

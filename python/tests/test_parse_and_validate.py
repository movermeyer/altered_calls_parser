from typing import Any

import pytest

from altered_calls_parser import validate

from conftest import load_fixture

CASES = load_fixture("calls.json")


@pytest.mark.parametrize("case", CASES, ids=lambda c: c["id"])
def test_validate(case: dict[str, Any]) -> None:
    assert validate(case["raw"]) is case["valid"]

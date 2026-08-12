import json
from pathlib import Path
from typing import Any

FIXTURES_DIR = Path(__file__).resolve().parents[2] / "tests" / "fixtures"


def load_fixture(name: str) -> list[dict[str, Any]]:
    with (FIXTURES_DIR / name).open() as f:
        result: list[dict[str, Any]] = json.load(f)
        return result


def load_lines(name: str) -> list[str]:
    """A line-per-record fixture. The trailing newline is dropped, but blank
    lines are kept: the empty call is a real member of all-calls.txt."""
    return (FIXTURES_DIR / name).read_text().rstrip("\n").split("\n")

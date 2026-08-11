import json
from pathlib import Path
from typing import Any

FIXTURES_DIR = Path(__file__).resolve().parents[2] / "tests" / "fixtures"


def load_fixture(name: str) -> list[dict[str, Any]]:
    with (FIXTURES_DIR / name).open() as f:
        result: list[dict[str, Any]] = json.load(f)
        return result

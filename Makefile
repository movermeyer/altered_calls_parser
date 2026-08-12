.PHONY: install generate enumerate test-python test-js test lint lint-python lint-js demo ci

install:
	cd python && uv sync
	cd js && npm install

generate:
	./scripts/generate.sh

# Rewrites the full list of valid calls that both test suites check themselves
# against. Like the generated parsers, it is committed, so a grammar change
# shows up in review as the calls it made legal or illegal.
enumerate:
	cd python && uv run python ../scripts/dump-calls.py > ../tests/fixtures/all-calls.txt

test-python:
	cd python && uv run pytest

test-js:
	cd js && npm test

test: test-python test-js

lint-python:
	cd python && uv run black --check . && uv run mypy

lint-js:
	cd js && npm run typecheck

lint: lint-python lint-js

demo:
	cd js && npm run build:demo

ci: generate enumerate
	git diff --exit-code -- python/src/altered_calls_parser/generated js/src/generated tests/fixtures/all-calls.txt
	$(MAKE) lint
	$(MAKE) test
	$(MAKE) demo

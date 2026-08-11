.PHONY: install generate test-python test-js test lint lint-python lint-js demo ci

install:
	cd python && uv sync
	cd js && npm install

generate:
	./scripts/generate.sh

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

ci: generate
	git diff --exit-code -- python/src/altered_calls_parser/generated js/src/generated
	$(MAKE) lint
	$(MAKE) test
	$(MAKE) demo

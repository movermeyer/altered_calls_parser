#!/usr/bin/env bash
# Regenerates the Python and TypeScript parsers from grammar/Calls.g4.
#
# Codegen is done entirely via antlr-ng (a Node-only reimplementation of
# the ANTLR4 tool), so no Java installation is required. antlr-ng's
# TypeScript target is used for the JS/TS package rather than its classic
# JavaScript target because antlr4-c3 (the autocomplete engine used on the
# JS side) only supports the antlr4ng runtime, which the TypeScript target
# produces code for.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GRAMMAR="$ROOT/grammar/Calls.g4"
ANTLR_NG=(npx --prefix "$ROOT/js" antlr-ng)

PY_OUT="$ROOT/python/src/altered_calls_parser/generated"
TS_OUT="$ROOT/js/src/generated"

rm -rf "$PY_OUT" "$TS_OUT"
mkdir -p "$PY_OUT" "$TS_OUT"

"${ANTLR_NG[@]}" "$GRAMMAR" -o "$PY_OUT" --generate-visitor --generate-listener=false -D language=Python3
touch "$PY_OUT/__init__.py"

"${ANTLR_NG[@]}" "$GRAMMAR" -o "$TS_OUT" --generate-visitor --generate-listener=false -D language=TypeScript

# shared/canonical-tokens.json is the single source of truth for the
# token->canonical-word table, but each package must ship its own copy
# rather than reaching outside its own directory at runtime -- an npm or
# PyPI install only contains that package's own files, not repo siblings.
# Treat it like the rest of the generated/ contents: copied here, and
# `make ci`'s diff-check catches drift against shared/.
cp "$ROOT/shared/canonical-tokens.json" "$PY_OUT/canonical-tokens.json"
cp "$ROOT/shared/canonical-tokens.json" "$TS_OUT/canonical-tokens.json"

echo "Generated Python parser -> $PY_OUT"
echo "Generated TypeScript parser -> $TS_OUT"

# Unofficial Altered LARP Damage Calls parser

> **Unofficial project.** This is a fan-made, community project and is
> not affiliated with, endorsed by, or sponsored by the creators of
> [Altered LARP](https://www.alteredlarp.com/).
> "Altered LARP" and any related names/marks
> belong to their respective owners.

Parses, validates, normalizes, and autocompletes "damage calls" used in
[Altered LARP](https://www.alteredlarp.com/) (e.g. `Knockdown 5 Fire`, `Power Word You Stun`), from a
single ANTLR4 grammar shared by a both a Python package and a TypeScript/JavaScript package.

Based on the [version 3.2 rules](https://docs.google.com/document/d/1-WhH-Tlogm5gIzZnr2T3OYtau2sRdrpZROQMOvQcH18/edit?usp=sharing). See the top of [the grammar file](grammar/Calls.g4) for the assumptions and differences used in this parser.

## Demo

A live, browser-only demo of the JS/TS package — parse/validate/normalize
plus `suggest()`-driven autocomplete — is deployed via GitHub Pages at
<https://movermeyer.github.io/altered_calls_parser/>.

## Library API

It's built as a re-usable library for both Python and TypeScript/JavaScript.

Both packages expose the same five functions:

| function                | behavior                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| `parse(text)`           | Parse `text`, returning `{ valid, tree, errors }` without throwing.                                      |
| `validate(text)`        | `true`/`True` iff `text` is a syntactically valid call.                                                  |
| `normalize(text)`       | Normalized capitalized, hyphen-separated form (e.g. `Knockdown-5-Fire`). Raises/throws on invalid input. |
| `suggest(text, cursor)` | Autocomplete candidates for a caret position while typing.                                               |
| `tokenize(text)`        | Each word of `text` labelled with the part of the syntax it belongs to.                                  |

Parsing is case-insensitive, and both spaces and hyphens are valid word
separators, so already-normalized text (`Knockdown-5-Fire`) parses the
same as `knockdown 5 fire`.

### Error hints

Every syntax error carries both ANTLR's raw `message` and a `hint`
describing the same problem in language aimed at players rather than
developers:

| field           | meaning                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------- |
| `kind`          | `unknown-word`, `spelled-number`, `misplaced-word`, `incomplete`, or `invalid-character` |
| `text`          | a complete sentence, safe to show as-is                                                  |
| `offendingText` | the input slice at fault, in its original casing (`""` at end of input)                  |
| `start` / `end` | offsets of that slice, for underlining it in place                                       |
| `suggestions`   | words worth offering as one-click fixes                                                  |

```
parse("knock down 5 fire").errors[0]
  message: "mismatched input 'knock' expecting {<EOF>, 'OVERWHELM', 'POWER', ...}"
  hint.text: '"knock" isn't a call word. Did you mean "Knockdown" or "Knockout"?'
```

## Development

### Dependencies

| tool                             | version used | purpose                                                     |
| -------------------------------- | ------------ | ----------------------------------------------------------- |
| [Node.js](https://nodejs.org/)   | 24+          | runs the JS/TS package, its tests, and grammar codegen      |
| [uv](https://docs.astral.sh/uv/) | 0.12+        | manages the Python 3.14 interpreter, venv, and dependencies |
| Python                           | 3.14+        | installed automatically by `uv` if not already present      |

Install everything with:

```sh
make install
```

This bundles [`demo/src/main.ts`](demo/src/main.ts) (via
[esbuild](https://esbuild.github.io/)) into `demo/dist/bundle.js`. Then
open `demo/index.html` directly in a browser, or serve the repo root
with any static file server.

### Regenerating the parser ("compilation")

The lexer/parser/visitor code under `python/src/altered_calls_parser/generated/`
and `js/src/generated/` is generated from `grammar/Calls.g4` and
committed to the repo (so installing either package doesn't require
Node.js or re-running codegen). After editing the grammar, regenerate
both languages with:

```sh
make generate
# or directly:
./scripts/generate.sh
```

CI fails if the committed generated code doesn't match what
regeneration produces, so always run this after touching the grammar.

### Running tests

```sh
make test            # both languages
make test-python      # pytest
make test-js           # vitest
```

### Linting / type checking

```sh
make lint             # both languages
make lint-python        # black --check, mypy
make lint-js              # tsc --noEmit
```

Install the git pre-commit hooks (black + mypy run automatically on
`git commit`) with:

```sh
uv tool install pre-commit   # one-time, if not already installed
pre-commit install
```

### Demo

A browser-only demo of the JS/TS package — parse/validate/normalize
plus `suggest()`-driven autocomplete — is deployed via GitHub Pages at
<https://movermeyer.github.io/altered_calls_parser/>.

Build and preview it locally with:

```sh
make demo
```

### Everything CI runs

```sh
make ci
```

Regenerates the parsers, checks for drift against the committed
generated code, lints, and runs both test suites — the same steps as
[`.github/workflows/ci.yml`](.github/workflows/ci.yml).

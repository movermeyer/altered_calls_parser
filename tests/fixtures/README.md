# Shared test fixtures

These JSON files are the single source of truth for behavior that must be
identical across the Python and JS/TS implementations. Both language test
suites load these files directly (no per-language copies) so the two
implementations can't silently drift apart.

## `calls.json`

An array of objects:

| field       | type            | meaning                                                             |
|-------------|-----------------|----------------------------------------------------------------------|
| `id`        | string          | stable, unique case name                                             |
| `raw`       | string          | the raw input text to parse                                          |
| `valid`     | boolean         | whether `raw` should parse successfully                              |
| `canonical` | string, optional| required when `valid` is true: the expected `normalize(raw)` output  |

## `hints.json`

Player-facing hint text must be identical in both implementations, so the exact
sentences are pinned here. Each case asserts against the hint on the **first**
error of `parse(raw)` — every `raw` here is invalid.

| field           | type              | meaning                                                                     |
|-----------------|-------------------|-----------------------------------------------------------------------------|
| `id`            | string            | stable, unique case name                                                    |
| `raw`           | string            | the raw input text to parse                                                 |
| `kind`          | string            | expected `hint.kind`                                                        |
| `text`          | string, optional  | the exact player-facing sentence                                            |
| `offendingText` | string            | the input slice at fault, in its original casing (`""` at end of input)     |
| `start`         | integer           | start offset of the offending slice                                         |
| `end`           | integer           | end offset (exclusive); equals `start` at end of input                      |
| `suggestions`   | string[], optional| expected `hint.suggestions` exactly; omit where the list is the full set of words allowed at that position, which is covered by `completions.json` |

## `tokens.json`

Which part of the syntax each word of a call belongs to. Pins `tokenize(raw)`
exhaustively — the expected list is compared to the actual one whole, so a
dropped or invented word fails the case.

| field       | type            | meaning                                                        |
|-------------|-----------------|------------------------------------------------------------------|
| `id`        | string          | stable, unique case name                                       |
| `raw`       | string          | the raw input text to tokenize                                 |
| `valid`     | boolean         | whether `raw` parses (mirrors `calls.json`)                    |
| `tokens`    | object[]        | the complete expected output, in order                         |

Each entry of `tokens`:

| field       | type    | meaning                                                                     |
|-------------|---------|-------------------------------------------------------------------------------|
| `start`     | integer | start offset of the word                                                    |
| `end`       | integer | end offset (exclusive)                                                      |
| `text`      | string  | the input slice, in its original casing                                     |
| `canonical` | string  | the spelling `normalize` would write (`""` when `role` is `unknown`)        |
| `role`      | string  | e.g. `effect`, `amount`, `drain-amount`, `drain-resource`, `mitigate`, `defense-name`, `unknown` |

`category`, `label` and `description` are deliberately absent: all three are
lookups from `shared/canonical-tokens.json` keyed by `role`, so pinning them
here would be a second copy of that file. Both test suites assert the lookup
agrees instead.

## `completions.json`

An array of objects:

| field                   | type     | meaning                                                                 |
|-------------------------|----------|--------------------------------------------------------------------------|
| `id`                    | string   | stable, unique case name                                                 |
| `raw`                   | string   | the input text typed so far                                              |
| `cursor`                | integer  | caret offset (UTF-16 code unit index) into `raw`                         |
| `expectedKeywordLabels` | string[] | the set of canonical keyword words that must appear among the suggestions (order-independent; other candidates may also be present unless `exhaustive` is true) |
| `exhaustive`            | boolean, optional | when true, `expectedKeywordLabels` must be the *complete* set of keyword candidates |
| `expectedNumberSlot`    | boolean, optional | whether a `{ kind: "number" }` suggestion must be present            |

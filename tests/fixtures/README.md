# Shared test fixtures

These files are the single source of truth for behavior that must be
identical across the Python and JS/TS implementations. Both language test
suites load these files directly (no per-language copies) so the two
implementations can't silently drift apart.

Every file here is hand-written **except `all-calls.txt`**, which is generated
by `make enumerate` and documented last.

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
| `start`     | integer | start offset of the part                                                    |
| `end`       | integer | end offset (exclusive)                                                      |
| `text`      | string  | the input slice, in its original casing                                     |
| `canonical` | string  | the spelling `normalize` would write (`""` when `role` is `unknown`)        |
| `role`      | string  | e.g. `effect`, `amount`, `drain-amount`, `drain-resource`, `mitigate`, `defense-name`, `unknown` |

One entry per *part* of the call rather than per word: a call made of several
words (`Shrug Off`, `Full Auto`) is one entry covering both, as is a Defense name
however many words it took. Such an entry's `text` includes the separator the
player typed (`"Shrug-Off"`) and its `canonical` is hyphen-joined
(`"Shrug-Off"`), which is how `normalize` writes it.

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
| `expectedKeywordLabels` | string[] | the set of suggestion labels that must appear among the suggestions (order-independent; other candidates may also be present unless `exhaustive` is true). A multi-word call is one label: `"Shrug Off"`, not `"Shrug"` and `"Off"` |
| `exhaustive`            | boolean, optional | when true, `expectedKeywordLabels` must be the *complete* set of keyword candidates |
| `expectedNumberSlot`    | boolean, optional | whether a `{ kind: "number" }` suggestion must be present            |
| `expectedSuggestions`   | object[], optional | whole suggestions that must be present, each pinning `label`, `word`, `category`, `start` and `end`. A subset check, independent of `exhaustive`: it is where a case pins which word of a multi-word call the caret is on, and the input range accepting it would rewrite |

## `all-calls.txt`

Every call the grammar accepts, one per line, sorted. Unlike the files above
this one is **generated** — run `make enumerate` to rewrite it, and never edit
it by hand. It is committed and diff-checked by `make ci`, exactly like the
generated parsers, so a grammar change shows up in review as an explicit list
of the calls it made legal or illegal.

The grammar has two open slots — the damage number, and the Defense name
(`defenseName : defenseWord+`, any run of words at all). Bind both and the
language becomes finite: with `5` in every number slot, the ten Defense names
the rulebook lists, and one name per call, it is **24,400 calls**.

**The first line is empty.** Every part of a damage call is optional, so the
empty call is a member of the language — see the `empty-input` case in
`calls.json`. Tests must expect it rather than filter it out.

The point of the file is that the two implementations reach it by genuinely
different routes, so agreeing on it means something:

| suite | how it enumerates | what it reads |
|-------|-------------------|---------------|
| Python | cross-product over the declarative mirror, plus an independent forward search through the completion engine | `_grammar_shape.py` |
| JS | forward search asking `antlr4-c3` what may follow each prefix | the real ATN generated from `Calls.g4` |

Python's two strategies both read the hand-synced mirror, so on their own they
prove only that the mirror never invents a call the real parser rejects. The JS
enumeration walks the real ATN, so it catches the other direction: a construct
the grammar allows but the mirror has fallen behind on. Both suites asserting
against this one file is what closes the loop.

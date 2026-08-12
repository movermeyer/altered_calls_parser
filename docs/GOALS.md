# Goals

This is an unofficial, community-built project, not affiliated with or
endorsed by the creators of Altered LARP.

- **One grammar, two runtimes.** `grammar/Calls.g4` is the single
  source of truth for what counts as a valid Altered LARP call.
  Python and JavaScript/TypeScript libraries are generated from it
  rather than hand-written twice, so the two never define the syntax
  differently by accident.
- **Automation and generation.** As much as possible, we should take
  advantage of existing dependency libraries and tooling to
  have the full project generated from the grammar (tests excluded), and
  to re-use data across the tech stacks. When the grammar changes in the future,
  we aim to have minimal changes to the rest of the code.
- **Parse and validate** a call as free-typed text: case-insensitive,
  tolerant of spaces, hyphens, commas or colons as word separators,
  so a user can type loosely — or exactly as the rulebook prints it,
  commas and all — and still get a correct yes/no plus error positions.
- **Normalize** any valid call to one canonical form — each word
  capitalized, hyphen-separated (`Knockdown-5-Fire`) — regardless of how it was
  capitalized or spaced by the person typing it. Word order is
  preserved as called: the two damage-type slots accept any two damage
  types, and there is no rulebook order to sort such a pair into, so
  `fire dark` and `dark fire` normalize apart. Word *choice* is
  preserved too: where the rulebook term and the in-game shorthand are
  both accepted (`Radiation` / `Rad`), each keeps its own canonical
  spelling rather than collapsing into the other.
- **Autocomplete-ready.** `suggest(text, cursor)` gives a text box
  enough information (candidate next words, or "a number goes here")
  to drive real-time suggestions while someone is still typing, not
  just after they submit.
- **Behavioral parity across languages.** The Python and JS engines
  are implemented independently (different completion strategies, see
  below) but are both tested against the same
  [shared fixture files](../tests/fixtures/), so "valid in Python but
  rejected in JS" is a bug, not a documented quirk.

## Non-goals

- **Not a LARP rules engine.** This project answers "is this text a
  well-formed call, and what does it normalize to" — not "what does a
  Knockdown effect do to a character," damage resolution, character
  sheets, or anything else about how Altered is actually played.
- **Not a UI component.** Several of these functions exist to serve a
  UI — `suggest` and `tokenize` are only useful to one — but they are
  plain functions a text box calls into, returning data with offsets
  and never markup, colours, or wording tied to a layout. Building the
  actual widget is left to the caller: how to insert a suggested word
  (with what separator, at what position), and how to render a
  breakdown (what colours, whether the explanation hovers or sits
  inline) are all decisions this library declines to make. The demo
  makes them for itself.
- **Not a general-purpose ANTLR completion library.** The Python
  autocomplete engine is a small hand-rolled derivative walker over a
  declarative mirror of this specific grammar
  (`_grammar_shape.py`/`_completion.py`), not a reusable ATN-based
  engine — it exists because no Python port of `antlr4-c3` does. It's
  intentionally scoped to a grammar this small and non-recursive; it
  is not meant to generalize to arbitrary ANTLR grammars.
- **Not every kind of call.** Damage Calls (_§8.3_) and Defensive Calls
  (_§8.4_) are in scope. Power Word, Power Light, and spells are not
  Damage Calls and are out of scope — same with Ability Calls,
  Concoctions, etc.
- **Not targeting languages beyond Python and JS/TS.** Other ANTLR
  targets (Java, C#, Go, etc.) are out of scope.

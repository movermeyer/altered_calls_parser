/**
 * Turns raw ANTLR syntax errors into plain-language hints aimed at players
 * rather than developers.
 *
 * The wording lives here (and in the Python mirror, _hints.py) rather than in
 * each consumer so that every front end says the same thing, and so that the
 * two language implementations can be held to identical output by the shared
 * tests/fixtures/hints.json fixture. All player-visible vocabulary comes from
 * shared/canonical-tokens.json -- no English is hard-coded against a token
 * name here.
 */

import { suggest } from "./completion.js";
import tokens from "./generated/canonical-tokens.json" with { type: "json" };

const WORDS: Record<string, string> = tokens.words;
const CATEGORIES: Record<string, string> = tokens.categories;
const CATEGORY_ORDER: string[] = tokens.categoryOrder;
const CATEGORY_LABELS: Record<string, string> = tokens.categoryLabels;
const CATEGORY_EXAMPLES: Record<string, string> = tokens.categoryExamples;
const NUMBER_WORDS: Record<string, string> = tokens.numberWords;

/** Canonical word -> category, keyed by the word itself rather than its token name. */
const WORD_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(WORDS).map(([name, word]) => [word, CATEGORIES[name]]),
);

const ALL_WORDS: string[] = Object.values(WORDS).sort();

export type CallHintKind =
  | "unknown-word"
  | "spelled-number"
  | "misplaced-word"
  | "incomplete"
  | "invalid-character";

export interface CallHint {
  kind: CallHintKind;
  /** A complete, player-facing sentence. Safe to render as-is. */
  text: string;
  /** The exact slice of the input at fault, in its original casing ("" at end of input). */
  offendingText: string;
  /** Half-open range of `offendingText` in the input, for underlining. */
  start: number;
  end: number;
  /**
   * Words worth offering as one-click fixes: the did-you-mean candidates for a
   * misspelling, or the words that would actually be accepted here otherwise.
   */
  suggestions: string[];
}

/** What the grammar will accept at some caret position. */
interface Allowed {
  words: string[];
  number: boolean;
}

function allowedAt(text: string, cursor: number): Allowed {
  const items = suggest(text, cursor);
  return {
    words: items.flatMap((s) => (s.kind === "keyword" ? [s.label] : [])),
    number: items.some((s) => s.kind === "number"),
  };
}

/**
 * What may follow the whole of `text`. Asking for candidates at the end of the
 * input would instead complete the final *word* ("armour" -> "armour"), so the
 * caret is moved past a synthetic separator to get the genuinely-next tokens
 * ("armour" -> "drain"). SEP is skipped by the lexer, so this cannot change how
 * the preceding text tokenizes.
 */
function allowedAfter(text: string): Allowed {
  const padded = `${text} `;
  return allowedAt(padded, padded.length);
}

function quote(word: string): string {
  return `"${word}"`;
}

function joinOr(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} or ${parts[parts.length - 1]}`;
}

/**
 * Describe `allowed` as a noun phrase, e.g. `"drain"` or
 * `"Overwhelm", an effect (like "Stun") or a number`. Small sets are listed verbatim;
 * larger ones collapse to category names so the player never faces the
 * 30-item token dump ANTLR would have produced.
 */
export function describeAllowed(allowed: Allowed): string {
  const total = allowed.words.length + (allowed.number ? 1 : 0);
  if (total === 0) return "";
  if (total <= 3) {
    const parts = allowed.words.map(quote);
    if (allowed.number) parts.unshift(CATEGORY_LABELS["number"]);
    return joinOr(parts);
  }

  const parts: string[] = [];
  for (const category of CATEGORY_ORDER) {
    if (category === "number") {
      if (allowed.number) parts.push(CATEGORY_LABELS["number"]);
      continue;
    }
    const members = allowed.words.filter((w) => WORD_CATEGORY[w] === category);
    if (members.length === 0) continue;
    // One or two words are shorter and more concrete named outright than
    // described ("\"power\"" beats "a power call (like \"power\")").
    if (members.length <= 2) {
      parts.push(...members.map(quote));
      continue;
    }
    const example = members.includes(CATEGORY_EXAMPLES[category])
      ? CATEGORY_EXAMPLES[category]
      : members[0];
    parts.push(`${CATEGORY_LABELS[category]} (like ${quote(example)})`);
  }
  return joinOr(parts);
}

function levenshtein(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current.push(Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost));
    }
    previous = current;
  }
  return previous[b.length];
}

/**
 * Closest canonical words to `word`, best first, at most `limit`.
 *
 * Prefix matches rank above edit-distance matches so that a call split in two
 * ("knock down") still points at "knockdown", which is far enough away in edit
 * distance to miss the threshold entirely.
 */
export function didYouMean(word: string, limit = 3): string[] {
  const w = word.toLowerCase();
  if (w === "") return [];

  const maxDistance = w.length <= 4 ? 1 : 2;
  const scored: { word: string; rank: number; distance: number }[] = [];
  for (const candidate of ALL_WORDS) {
    // Compare against a lower-cased view -- canonical words are capitalized and
    // `w` is not, so a case difference would otherwise cost an edit and push
    // real matches past the distance threshold. The canonical spelling is what
    // gets offered back.
    const lower = candidate.toLowerCase();
    if (lower === w) continue;
    if (lower.startsWith(w)) {
      scored.push({ word: candidate, rank: 0, distance: 0 });
      continue;
    }
    const distance = levenshtein(w, lower);
    if (distance <= maxDistance) {
      scored.push({ word: candidate, rank: 1, distance });
    }
  }

  scored.sort(
    (a, b) => a.rank - b.rank || a.distance - b.distance || a.word.localeCompare(b.word),
  );
  return scored.slice(0, limit).map((s) => s.word);
}

function unknownWordHint(
  text: string,
  offendingText: string,
  start: number,
  end: number,
): CallHint {
  const lower = offendingText.toLowerCase();
  const allowed = allowedAt(text, start);

  // "Knockdown five Fire" is a spelling mistake in the number slot, not an
  // unrecognised call word -- and edit distance would unhelpfully offer
  // "fire" for "five". Only claim this when a number really does belong here.
  const digits = NUMBER_WORDS[lower];
  if (digits !== undefined && allowed.number) {
    return {
      kind: "spelled-number",
      text: `Write the number in digits: ${quote(digits)}, not ${quote(offendingText)}.`,
      offendingText,
      start,
      end,
      suggestions: [digits],
    };
  }

  const candidates = didYouMean(lower);
  if (candidates.length > 0) {
    return {
      kind: "unknown-word",
      text: `${quote(offendingText)} isn't a call word. Did you mean ${joinOr(candidates.map(quote))}?`,
      offendingText,
      start,
      end,
      suggestions: candidates,
    };
  }

  const description = describeAllowed(allowed);
  return {
    kind: "unknown-word",
    text:
      description === ""
        ? `${quote(offendingText)} isn't a call word.`
        : `${quote(offendingText)} isn't a call word. Here you can put ${description}.`,
    offendingText,
    start,
    end,
    suggestions: allowed.words,
  };
}

function misplacedWordHint(
  text: string,
  offendingText: string,
  start: number,
  end: number,
): CallHint {
  const allowed = allowedAt(text, start);
  const description = describeAllowed(allowed);
  return {
    kind: "misplaced-word",
    text:
      description === ""
        ? `The call is already complete before ${quote(offendingText)}, so there is nothing more to add.`
        : `${quote(offendingText)} can't go here. Here you can put ${description}.`,
    offendingText,
    start,
    end,
    suggestions: allowed.words,
  };
}

function incompleteHint(text: string, start: number): CallHint {
  const allowed = allowedAfter(text);
  const description = describeAllowed(allowed);
  return {
    kind: "incomplete",
    text:
      description === ""
        ? "The call isn't finished yet."
        : `The call isn't finished yet. Add ${description}.`,
    offendingText: "",
    start,
    end: start,
    suggestions: allowed.words,
  };
}

function invalidCharacterHint(offendingText: string, start: number, end: number): CallHint {
  return {
    kind: "invalid-character",
    text: `Calls are made of words and numbers only, so ${quote(offendingText)} can't appear in one.`,
    offendingText,
    start,
    end,
    suggestions: [],
  };
}

/** Absolute offset of a 1-based line / 0-based column pair within `text`. */
export function offsetOf(text: string, line: number, column: number): number {
  let offset = 0;
  for (let i = 1; i < line; i++) {
    const next = text.indexOf("\n", offset);
    if (next === -1) break;
    offset = next + 1;
  }
  return Math.min(offset + column, text.length);
}

/** Where and what the parser tripped over, independent of ANTLR's message text. */
export interface OffendingToken {
  /** Half-open range in the input; empty (start === end) at end of input. */
  start: number;
  end: number;
  isEof: boolean;
  isWord: boolean;
}

/**
 * Build the hint for one syntax error.
 *
 * `offending` is null for lexer errors, where no token could be formed at all;
 * the error kind is then read off the token itself rather than by matching
 * against ANTLR's message strings, which are not a stable interface.
 */
export function buildHint(
  text: string,
  line: number,
  column: number,
  offending: OffendingToken | null,
): CallHint {
  if (offending === null) {
    const start = offsetOf(text, line, column);
    const end = Math.min(start + 1, text.length);
    return invalidCharacterHint(text.slice(start, end), start, end);
  }

  if (offending.isEof) {
    return incompleteHint(text, text.length);
  }

  // Slice the original input rather than reading token.text, which reflects
  // the upper-cased view the lexer matched against.
  const offendingText = text.slice(offending.start, offending.end);
  return offending.isWord
    ? unknownWordHint(text, offendingText, offending.start, offending.end)
    : misplacedWordHint(text, offendingText, offending.start, offending.end);
}

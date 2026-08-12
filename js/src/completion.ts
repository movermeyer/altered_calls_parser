import { CodeCompletionCore } from "antlr4-c3";
import { CommonTokenStream } from "antlr4ng";

import { CaseChangingCharStream } from "./caseChangingCharStream.js";
import { CallsLexer } from "./generated/CallsLexer.js";
import { CallsParser } from "./generated/CallsParser.js";
import tokens from "./generated/canonical-tokens.json" with { type: "json" };

const WORDS: Record<string, string> = tokens.words;
const CATEGORIES: Record<string, string> = tokens.categories;

/**
 * A run of words that is one call between them -- "Full Auto", "Shrug Off",
 * "Receding Tide". The grammar sees each of these as several keywords, but a
 * player shouts one call, so autocomplete offers and accepts them whole.
 */
interface Phrase {
  /** Token names, in order. */
  names: string[];
  /** Canonical words, in order -- `WORDS[names[i]]`. */
  words: string[];
  /** The whole phrase as one label, e.g. "Full Auto". */
  label: string;
  /** Coarse grouping, one of `categoryOrder`. */
  category: string;
  /**
   * Whether this is a Defense name. Names are admitted by a rule rather than by
   * their keywords (`defenseWord : ~NUMBER`), so a different question decides
   * whether one may go at the caret.
   */
  isName: boolean;
}

function phrase(names: string[], isName: boolean): Phrase {
  const words = names.map((name) => WORDS[name]);
  return {
    names,
    words,
    label: words.join(" "),
    // A name's words keep their own categories elsewhere -- FULL is an
    // "effect", because of "Full Auto" -- but a Defense name is a defense name
    // and nothing else, which is what keeps "Full" from leaking out of the
    // Mitigate hint as an effect. Every other phrase takes its first word's.
    category: isName ? "defense-name" : CATEGORIES[names[0]],
    isName,
  };
}

/** The keyword runs the grammar joins: `FULL AUTO`, `SHRUG OFF`, `PHASE (OUT | IN)`. */
const PHRASES: Phrase[] = tokens.phrases.map((names) => phrase(names, false));

/**
 * The Defense names the rulebook does list, as whole names.
 *
 * The grammar accepts any word at all as a Defense name (`defenseWord :
 * ~NUMBER`) and doesn't require "Receding" to be followed by "Tide", so there is
 * nothing in it left to complete against -- these are offered on its behalf.
 * Kept in shared/canonical-tokens.json rather than here so the Python engine
 * offers the same set.
 */
const DEFENSE_NAMES: Phrase[] = tokens.defenseNames.map((names) => phrase(names, true));

const ALL_PHRASES: Phrase[] = [...PHRASES, ...DEFENSE_NAMES];

/**
 * How many words of a phrase the caret may already have behind it and still
 * complete the whole thing, so that "Shrug O" offers "Shrug Off" rather than
 * just "Off". Derived from the tables rather than fixed at one, so a
 * three-word call would need no change here.
 */
const MAX_WORDS_TYPED = Math.max(...ALL_PHRASES.map((p) => p.names.length)) - 1;

/**
 * What the player has typed, in the form a phrase label can be compared
 * against: lower-cased, with every run of separators collapsed to the single
 * space labels are written with, so "Full-A" and "shrug,of" match too.
 */
function typedPrefix(slice: string): string {
  return slice.toLowerCase().replace(/[ \t\r\n\-,:]+/g, " ");
}

export interface KeywordSuggestion {
  kind: "keyword";
  /** The whole call to insert, e.g. "Shrug Off" -- a single word for most calls. */
  label: string;
  /**
   * Just the word the caret is completing: "Off" for a caret after "Shrug ",
   * "Shrug" for a caret at the start of input. What a hint means when it names
   * the words allowed at a position.
   */
  word: string;
  /** Coarse grouping, one of `categoryOrder`. */
  category: string;
  /**
   * Half-open range in the input that `label` replaces. It reaches back over
   * any words of the phrase already typed, so accepting a suggestion never
   * leaves a partial word behind.
   */
  start: number;
  end: number;
}

export interface NumberSuggestion {
  kind: "number";
  /** Half-open range in the input a number would occupy. */
  start: number;
  end: number;
}

export type Suggestion = KeywordSuggestion | NumberSuggestion;

function findCaretTokenIndex(tokenStream: CommonTokenStream, cursor: number): number {
  const all = tokenStream.getTokens();
  for (let i = 0; i < all.length; i++) {
    if (cursor <= all[i].stop + 1) {
      return i;
    }
  }
  return all.length - 1;
}

/**
 * Suggest completions for `text` at caret offset `cursor` (a UTF-16 code
 * unit index). Uses antlr4-c3's ATN-based CodeCompletionCore, which is the
 * reason the JS/TS side is built on antlr4ng rather than the classic
 * antlr4 runtime -- antlr4-c3 only supports antlr4ng.
 *
 * Multi-word calls come back as one suggestion each. The candidate set antlr4-c3
 * reports is per token, so "Shrug Off" would otherwise arrive as "Shrug" and
 * then "Off"; the phrase tables above say which tokens belong to one call, and
 * every suggestion carries the input range it replaces so that accepting one
 * mid-phrase rewrites the words already typed instead of appending to them.
 */
export function suggest(text: string, cursor: number): Suggestion[] {
  const stream = new CaseChangingCharStream(text, true);
  const lexer = new CallsLexer(stream);
  const tokenStream = new CommonTokenStream(lexer);
  tokenStream.fill();

  const parser = new CallsParser(tokenStream);
  parser.removeErrorListeners();
  // Tolerant parse: default error-recovery builds a best-effort tree even
  // over invalid/partial input, which is what collectCandidates needs.
  parser.call();

  const caretTokenIndex = findCaretTokenIndex(tokenStream, cursor);

  const core = new CodeCompletionCore(parser);
  core.ignoredTokens = new Set([CallsLexer.EOF]);
  // `defenseWord` matches any token but NUMBER, so left alone the core would
  // report every keyword in the language wherever a Defense name may go.
  // Marking it preferred stops the walk at the rule instead, which is answered
  // with DEFENSE_NAMES below.
  core.preferredRules = new Set([CallsParser.RULE_defenseWord]);
  const candidates = core.collectCandidates(caretTokenIndex);

  let numberAllowed = false;
  const allowedNames = new Set<string>();
  for (const tokenType of candidates.tokens.keys()) {
    if (tokenType === CallsLexer.NUMBER) {
      numberAllowed = true;
      continue;
    }
    const name = CallsLexer.symbolicNames[tokenType];
    if (name !== null && name !== undefined) {
      allowedNames.add(name);
    }
  }
  const nameAllowed = candidates.rules.has(CallsParser.RULE_defenseWord);

  const all = tokenStream.getTokens();
  const suggestions: Suggestion[] = [];
  const seenLabels = new Set<string>();
  /** Words already spoken for by a phrase, so the bare word isn't offered too. */
  const phraseWords = new Set<string>();

  // Phrases first, and from the furthest-back anchor forwards: a phrase that
  // reaches back over words the player has already typed beats the bare next
  // word, and the earliest anchor that still matches is the one whose range
  // rewrites the whole phrase rather than just its last word.
  for (
    let anchor = Math.max(0, caretTokenIndex - MAX_WORDS_TYPED);
    anchor <= caretTokenIndex;
    anchor++
  ) {
    const wordsTyped = caretTokenIndex - anchor;
    const start = all[anchor].start;
    const typed = typedPrefix(text.slice(start, cursor));
    for (const candidate of ALL_PHRASES) {
      if (wordsTyped >= candidate.names.length) continue;
      // Whether the word the caret is on may go here at all. Indexing the
      // phrase by how many of its words are already typed is what makes one
      // test serve both "Ful" (nothing typed yet, so FULL must be allowed) and
      // "Full " (one word in, so AUTO must be).
      const allowed = candidate.isName
        ? nameAllowed
        : allowedNames.has(candidate.names[wordsTyped]);
      if (!allowed) continue;
      // Everything from the anchor to the caret has to read as the start of
      // this phrase -- which also confirms the earlier words really are its
      // earlier words, so no separate token-by-token check is needed.
      if (!candidate.label.toLowerCase().startsWith(typed)) continue;
      if (seenLabels.has(candidate.label)) continue;
      seenLabels.add(candidate.label);
      phraseWords.add(candidate.words[wordsTyped]);
      suggestions.push({
        kind: "keyword",
        label: candidate.label,
        word: candidate.words[wordsTyped],
        category: candidate.category,
        start,
        end: cursor,
      });
    }
  }

  // Then the plain keywords, which only ever complete the word the caret is
  // actually on.
  const caretStart = all[caretTokenIndex].start;
  const caretTyped = typedPrefix(text.slice(caretStart, cursor));
  for (const name of allowedNames) {
    const label = WORDS[name];
    // Canonical words are capitalized; what the user has typed so far is
    // whatever they typed, lower-cased above -- so match case-insensitively
    // while still offering the canonical spelling.
    if (label === undefined || !label.toLowerCase().startsWith(caretTyped)) continue;
    // "Auto" on its own is never the answer when "Full Auto" is already on
    // offer, and neither is "Full" when it can only begin one.
    if (phraseWords.has(label) || seenLabels.has(label)) continue;
    seenLabels.add(label);
    suggestions.push({
      kind: "keyword",
      label,
      word: label,
      category: CATEGORIES[name],
      start: caretStart,
      end: cursor,
    });
  }

  if (numberAllowed && /^[0-9]*$/.test(caretTyped)) {
    suggestions.push({ kind: "number", start: caretStart, end: cursor });
  }

  suggestions.sort((a, b) => {
    const aKey = a.kind === "number" ? "" : a.label;
    const bKey = b.kind === "number" ? "" : b.label;
    return aKey.localeCompare(bKey);
  });
  return suggestions;
}

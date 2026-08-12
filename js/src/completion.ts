import { CodeCompletionCore } from "antlr4-c3";
import { CommonTokenStream } from "antlr4ng";

import { CaseChangingCharStream } from "./caseChangingCharStream.js";
import { CallsLexer } from "./generated/CallsLexer.js";
import { CallsParser } from "./generated/CallsParser.js";
import tokens from "./generated/canonical-tokens.json" with { type: "json" };

const WORDS: Record<string, string> = tokens.words;

/**
 * The Defense names the rulebook does list, as canonical words.
 *
 * The grammar accepts any word at all as a Defense name (`defenseWord :
 * ~NUMBER`), so there is nothing in it left to complete against -- these are
 * offered on its behalf. Kept in shared/canonical-tokens.json rather than here
 * so the Python engine offers the same set.
 */
const DEFENSE_NAME_WORDS: string[] = tokens.defenseNameWords.map((name) => WORDS[name]);

export type Suggestion = { kind: "keyword"; label: string } | { kind: "number" };

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
  const caretToken = tokenStream.get(caretTokenIndex);
  const partial = text.slice(caretToken.start, cursor).toLowerCase();
  const partialIsDigits = /^[0-9]*$/.test(partial);

  const core = new CodeCompletionCore(parser);
  core.ignoredTokens = new Set([CallsLexer.EOF]);
  // `defenseWord` matches any token but NUMBER, so left alone the core would
  // report every keyword in the language wherever a Defense name may go.
  // Marking it preferred stops the walk at the rule instead, which is answered
  // with DEFENSE_NAME_WORDS below.
  core.preferredRules = new Set([CallsParser.RULE_defenseWord]);
  const candidates = core.collectCandidates(caretTokenIndex);

  const suggestions: Suggestion[] = [];
  if (candidates.rules.has(CallsParser.RULE_defenseWord)) {
    for (const label of DEFENSE_NAME_WORDS) {
      if (label.toLowerCase().startsWith(partial)) {
        suggestions.push({ kind: "keyword", label });
      }
    }
  }
  for (const tokenType of candidates.tokens.keys()) {
    if (tokenType === CallsLexer.NUMBER) {
      if (partialIsDigits) {
        suggestions.push({ kind: "number" });
      }
      continue;
    }
    const name = CallsLexer.symbolicNames[tokenType];
    if (name === null || name === undefined) {
      continue;
    }
    const label = WORDS[name];
    // Canonical words are capitalized; what the user has typed so far is
    // whatever they typed, lower-cased above -- so match case-insensitively
    // while still offering the canonical spelling.
    if (label !== undefined && label.toLowerCase().startsWith(partial)) {
      suggestions.push({ kind: "keyword", label });
    }
  }

  suggestions.sort((a, b) => {
    const aKey = a.kind === "number" ? "" : a.label;
    const bKey = b.kind === "number" ? "" : b.label;
    return aKey.localeCompare(bKey);
  });
  return suggestions;
}

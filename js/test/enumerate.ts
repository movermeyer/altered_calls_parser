/**
 * Exhaustive enumeration of the call language, straight off the real ATN.
 *
 * The grammar has two open slots -- the damage number (`NUMBER`) and the
 * Defense name (`defenseName : defenseWord+`, any run of words at all). Bind
 * both and the language is finite and can be written out in full.
 *
 * This is the counterpart to the Python enumerator, and the reason both exist:
 * Python's walks a hand-synced declarative mirror of the grammar
 * (`_grammar_shape.py`), so on its own it can only prove the mirror never
 * invents a call the parser rejects. `antlr4-c3` walks the ATN generated from
 * `Calls.g4` itself, so this one is the grammar's own answer, and it catches
 * the other direction -- a construct the grammar allows that the mirror has
 * fallen behind on. Both must produce `tests/fixtures/all-calls.txt`.
 *
 * A helper, not a test: `vitest.config.ts` only collects `*.test.ts`. It lives
 * under `test/` rather than `src/` because `package.json` ships only `dist`,
 * and nothing here belongs in the published package.
 */

import { CodeCompletionCore } from "antlr4-c3";
import { CommonTokenStream } from "antlr4ng";

import { CaseChangingCharStream } from "../src/caseChangingCharStream.js";
import { CallsLexer } from "../src/generated/CallsLexer.js";
import { CallsParser } from "../src/generated/CallsParser.js";
import { validate } from "../src/index.js";
import tokens from "../src/generated/canonical-tokens.json" with { type: "json" };

const WORDS: Record<string, string> = tokens.words;

/** The Defense names the rulebook lists, as canonical words. */
export const DEFAULT_DEFENSE_NAMES: string[][] = tokens.defenseNames.map((names) =>
  names.map((name) => WORDS[name]),
);

export interface Binding {
  /**
   * Values to try in every `number` position. One is enough to cover the shape;
   * more than one pins down which slot each number binds to, since a call can
   * hold two independent numbers ("Knockdown 5 3 Flesh Drain").
   */
  numbers?: string[];
  /**
   * Defense names, each as its canonical words. These stand in for a slot that
   * accepts any run of words at all, so this bounds what gets enumerated, not
   * what parses.
   */
  defenseNames?: string[][];
  /**
   * How many whole Defense names may be strung together. The grammar's
   * `defenseWord+` is unbounded, so without a cap here the search never
   * terminates -- binding a slot's values is not enough on its own.
   */
  maxNameRepeats?: number;
}

/** What may legally follow `text`, according to the real ATN. */
function successors(text: string): {
  words: string[];
  number: boolean;
  name: boolean;
} {
  const stream = new CommonTokenStream(
    new CallsLexer(new CaseChangingCharStream(text, true)),
  );
  stream.fill();
  const parser = new CallsParser(stream);
  parser.removeErrorListeners();
  // Tolerant parse: error recovery builds a best-effort tree over the partial
  // input, which is what collectCandidates needs -- the same thing suggest()
  // does in src/completion.ts.
  parser.call();

  const core = new CodeCompletionCore(parser);
  core.ignoredTokens = new Set([CallsLexer.EOF]);
  // `defenseWord` matches any token but NUMBER, so left alone the core would
  // report every keyword in the language wherever a name may go. Marking it
  // preferred stops the walk at the rule instead, which is the hook the binding
  // answers with whole names.
  core.preferredRules = new Set([CallsParser.RULE_defenseWord]);
  // The caret goes on the EOF token -- "what may come *next*". This is
  // deliberately not src/completion.ts's findCaretTokenIndex, which returns the
  // token being *typed*; using that would enumerate the wrong thing entirely.
  const candidates = core.collectCandidates(stream.getTokens().length - 1);

  const words: string[] = [];
  let number = false;
  for (const type of candidates.tokens.keys()) {
    if (type === CallsLexer.NUMBER) {
      number = true;
      continue;
    }
    const name = CallsLexer.symbolicNames[type];
    if (name !== null && name !== undefined) {
      words.push(WORDS[name]);
    }
  }
  return {
    words: words.sort(),
    number,
    name: candidates.rules.has(CallsParser.RULE_defenseWord),
  };
}

interface Prefix {
  words: string[];
  /** How many whole Defense names are down, against maxNameRepeats. */
  namesUsed: number;
}

/**
 * Every call in the language, found by searching forward one token at a time.
 *
 * The candidate set says what may come next but never that nothing needs to, so
 * acceptance is a separate question, answered by the real parser.
 */
export function enumerateByFrontier(binding: Binding = {}): Set<string> {
  const numbers = binding.numbers ?? ["5"];
  const names = binding.defenseNames ?? DEFAULT_DEFENSE_NAMES;
  const maxNameRepeats = binding.maxNameRepeats ?? 1;

  const accepted = new Set<string>();
  let frontier: Prefix[] = [{ words: [], namesUsed: 0 }];

  while (frontier.length > 0) {
    const next: Prefix[] = [];
    for (const prefix of frontier) {
      const text = prefix.words.join(" ");
      if (validate(text)) accepted.add(text);

      const { words, number, name } = successors(text);
      if (number) {
        for (const value of numbers) {
          next.push({ words: [...prefix.words, value], namesUsed: prefix.namesUsed });
        }
      }
      if (name && prefix.namesUsed < maxNameRepeats) {
        for (const candidate of names) {
          next.push({
            words: [...prefix.words, ...candidate],
            namesUsed: prefix.namesUsed + 1,
          });
        }
      }
      for (const word of words) {
        next.push({ words: [...prefix.words, word], namesUsed: prefix.namesUsed });
      }
    }
    frontier = next;
  }

  return accepted;
}

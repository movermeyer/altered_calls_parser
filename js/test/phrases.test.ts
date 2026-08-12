/**
 * Drift guard: checks the phrase tables in shared/canonical-tokens.json against
 * the real parser.
 *
 * Those tables say which keywords are one call between them, and for a Defense
 * name nothing in the grammar says so at all -- so a phrase whose words the
 * grammar never allows in that order would otherwise become a suggestion that
 * produces an invalid call.
 *
 * Two things this deliberately does not prove. A phrase naming a token that
 * doesn't exist fails earlier and louder than any assertion here, when the
 * completion engine builds its tables at import. And a *made-up* Defense name
 * ("Mitigate Receding Mind") passes, because the grammar accepts any run of
 * words as a name on purpose -- the same trade-off Calls.g4 records for a typo
 * in a known name. What is checked is that every listed name really does make a
 * call, and comes back from tokenize() as the one name it was offered as.
 */

import { describe, expect, test } from "vitest";

import calls from "../../tests/fixtures/calls.json" with { type: "json" };
import tokens from "../src/generated/canonical-tokens.json" with { type: "json" };
import { normalize, tokenize, validate } from "../src/index.js";

const WORDS: Record<string, string> = tokens.words;

const PHRASES: string[][] = tokens.phrases;
const DEFENSE_NAMES: string[][] = tokens.defenseNames;

/** How the phrase is offered as a completion, e.g. "Full Auto". */
function label(names: string[]): string {
  return names.map((name) => WORDS[name]).join(" ");
}

/** How normalize() writes the phrase, and so what one CallToken should carry. */
function canonical(names: string[]): string {
  return names.map((name) => WORDS[name]).join("-");
}

/** `[label, tokenNames]` pairs, so a failure names the phrase that broke. */
function withLabels(entries: string[][]): [string, string[]][] {
  return entries.map((names) => [label(names), names]);
}

describe("every listed Defense name is one the grammar accepts", () => {
  test.each(withLabels(DEFENSE_NAMES))("%s", (name, names) => {
    const raw = `Mitigate ${name}`;
    expect(validate(raw)).toBe(true);
    expect(normalize(raw)).toBe(`Mitigate-${canonical(names)}`);
    // And one name, however many words: a suggestion the breakdown then splits
    // in two would be describing a different call than the one offered.
    expect(tokenize(raw).map((part) => part.canonical)).toEqual([
      "Mitigate",
      canonical(names),
    ]);
    expect(tokenize(raw).map((part) => part.role)).toEqual(["mitigate", "defense-name"]);
  });
});

describe("every keyword phrase is one part of a call the grammar accepts", () => {
  // A phrase has no call of its own to be tried in -- "Full Auto" is not a call
  // until it states a number -- so each is checked against the corpus instead.
  test.each(withLabels(PHRASES))("%s", (name, names) => {
    const joined = canonical(names);
    const containing = calls.filter(
      (c) => c.valid && (c as { canonical?: string }).canonical?.includes(joined),
    );
    expect(
      containing.length,
      `no valid call in calls.json contains ${name}`,
    ).toBeGreaterThan(0);
    for (const c of containing) {
      expect(tokenize(c.raw).map((part) => part.canonical)).toContain(joined);
    }
  });
});

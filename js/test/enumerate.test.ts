/**
 * Drift guard, and the half of it the Python suite cannot provide.
 *
 * python/tests/test_grammar_shape_consistency.py enumerates the same language
 * from a hand-synced declarative mirror of the grammar, and checks the result
 * against this same fixture. That proves the mirror never invents a call the
 * parser rejects, but not the reverse: a construct Calls.g4 allows that the
 * mirror has fallen behind on is invisible to it.
 *
 * This enumeration walks the real ATN, via antlr4-c3, so it is the grammar's
 * own answer. Both suites agreeing on tests/fixtures/all-calls.txt is what
 * closes the loop in both directions.
 *
 * Run `make enumerate` to update the fixture after a deliberate grammar change.
 */

import { describe, expect, test } from "vitest";

import { normalize } from "../src/index.js";
import { enumerateByFrontier } from "./enumerate.js";
import allCalls from "../../tests/fixtures/all-calls.txt?raw";

/**
 * The trailing newline is dropped, but blank lines are kept: the empty call is
 * a real member of the language, and sorts first.
 */
const expected = allCalls.replace(/\n$/, "").split("\n");

const calls = enumerateByFrontier();

describe("enumeration over the real ATN", () => {
  test("is not trivially empty", () => {
    // Every check below is over `calls`, so they would all pass vacuously if
    // the walk silently produced nothing.
    expect(calls.size).toBe(24_400);
    expect(calls).toContain("");
    expect(calls).toContain("Withstand");
    expect(calls).toContain("Mitigate Receding Tide");
    expect(calls).toContain("5 5 Armour Drain 5 Flesh Drain");
  });

  test("matches tests/fixtures/all-calls.txt", () => {
    expect([...calls].sort()).toEqual(expected);
  });

  test("every call normalizes to its own words", () => {
    // Normalization never reorders, so a call's canonical form is just its own
    // words hyphenated.
    const failures = [...calls].filter(
      (call) => normalize(call) !== call.split(" ").filter(Boolean).join("-"),
    );
    expect(failures.slice(0, 5)).toEqual([]);
  });
});

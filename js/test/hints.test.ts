import { describe, expect, test } from "vitest";

import { didYouMean } from "../src/hints.js";
import { parse } from "../src/index.js";
import cases from "../../tests/fixtures/hints.json" with { type: "json" };
import calls from "../../tests/fixtures/calls.json" with { type: "json" };

describe("hints (shared fixture)", () => {
  test.each(cases)("$id", (c) => {
    const errors = parse(c.raw).errors;
    expect(errors.length).toBeGreaterThan(0);

    const hint = errors[0].hint;
    expect(hint.kind).toBe(c.kind);
    expect(hint.offendingText).toBe(c.offendingText);
    expect(hint.start).toBe(c.start);
    expect(hint.end).toBe(c.end);
    if ("text" in c) {
      expect(hint.text).toBe(c.text);
    }
    if ("suggestions" in c) {
      expect(hint.suggestions).toEqual(c.suggestions);
    }
  });
});

describe("hints are well-formed for every invalid fixture call", () => {
  const invalid = calls.filter((c) => !c.valid);

  test.each(invalid)("$id", (c) => {
    for (const err of parse(c.raw).errors) {
      const hint = err.hint;
      // A hint is rendered verbatim to players, so it must always be a real
      // sentence -- never empty, and never leaking ANTLR's own phrasing.
      expect(hint.text).not.toBe("");
      expect(hint.text.endsWith(".") || hint.text.endsWith("?")).toBe(true);
      expect(hint.text).not.toMatch(/mismatched|extraneous|expecting|<EOF>/);

      expect(hint.start).toBeLessThanOrEqual(hint.end);
      expect(hint.end).toBeLessThanOrEqual(c.raw.length);
      expect(hint.offendingText).toBe(c.raw.slice(hint.start, hint.end));
    }
  });
});

describe("hints point at the offending span", () => {
  test("underlines the bad word, not the whole input", () => {
    const hint = parse("knockdown 5 zzzz").errors[0].hint;
    expect(hint.start).toBe(12);
    expect(hint.end).toBe(16);
    expect(hint.offendingText).toBe("zzzz");
  });

  test("collapses to a caret at the end for an unfinished call", () => {
    const hint = parse("full auto").errors[0].hint;
    expect(hint.kind).toBe("incomplete");
    expect(hint.start).toBe(9);
    expect(hint.end).toBe(9);
    expect(hint.offendingText).toBe("");
  });
});

describe("didYouMean", () => {
  test("finds a prefix match that edit distance alone would miss", () => {
    // "knock" is 4 edits from "knockdown" -- well past the threshold -- so only
    // the prefix rule recovers the split-in-two spelling.
    expect(didYouMean("knock")).toEqual(["Knockdown", "Knockout"]);
  });

  // Whatever casing the typo arrives in, the suggestion comes back in the
  // canonical capitalized spelling -- that is what gets offered as a one-click fix.
  test("finds single-character typos", () => {
    expect(didYouMean("stmina")).toEqual(["Stamina"]);
    expect(didYouMean("knockdow")).toEqual(["Knockdown"]);
    expect(didYouMean("poisen")).toEqual(["Poison"]);
  });

  test("is case-insensitive", () => {
    expect(didYouMean("KNOCKDWN")).toEqual(["Knockdown"]);
  });

  test("holds short words to a tighter distance, to avoid nonsense matches", () => {
    // "cat" is distance 2 from "rad" but only 3 letters long, so it is rejected;
    // a 6-letter word gets the looser threshold.
    expect(didYouMean("cat")).toEqual([]);
    expect(didYouMean("stamnia")).toEqual(["Stamina"]);
  });

  test("returns nothing for a word close to nothing", () => {
    expect(didYouMean("zzzzz")).toEqual([]);
    expect(didYouMean("")).toEqual([]);
  });

  test("never suggests the word itself", () => {
    // The canonical spelling, not the typed one -- asserting the lowercase form
    // is absent would pass for free now that candidates come back capitalized.
    expect(didYouMean("stun")).not.toContain("Stun");
    expect(didYouMean("Stun")).not.toContain("Stun");
  });

  test("caps the number of candidates", () => {
    expect(didYouMean("s", 3).length).toBeLessThanOrEqual(3);
  });
});

describe("valid calls carry no errors to hint at", () => {
  test.each(calls.filter((c) => c.valid))("$id", (c) => {
    expect(parse(c.raw).errors).toEqual([]);
  });
});

import { describe, expect, test } from "vitest";

import tokens from "../src/generated/canonical-tokens.json" with { type: "json" };
import { normalize, tokenize } from "../src/index.js";
import calls from "../../tests/fixtures/calls.json" with { type: "json" };
import cases from "../../tests/fixtures/tokens.json" with { type: "json" };

const ROLE_CATEGORIES: Record<string, string> = tokens.roleCategories;
const ROLE_LABELS: Record<string, string> = tokens.roleLabels;
const ROLE_DESCRIPTIONS: Record<string, string> = tokens.roleDescriptions;
const CATEGORIES = new Set([...tokens.categoryOrder, "unknown"]);

/** Spaces and hyphens, the two separators SEP skips. */
const SEPARATORS = /^[ \t\r\n-]*$/;

describe("tokenize (shared fixture)", () => {
  test.each(cases)("$id", (c) => {
    const actual = tokenize(c.raw);
    expect(
      actual.map((t) => ({
        start: t.start,
        end: t.end,
        text: t.text,
        canonical: t.canonical,
        role: t.role,
      })),
    ).toEqual(c.tokens);
  });
});

describe("the player-facing wording is derived, never hard-coded", () => {
  test.each(cases)("$id", (c) => {
    for (const token of tokenize(c.raw)) {
      expect(token.category).toBe(ROLE_CATEGORIES[token.role]);
      expect(token.label).toBe(ROLE_LABELS[token.role]);
      expect(token.description).toBe(ROLE_DESCRIPTIONS[token.role]);
    }
  });

  // A role with a category but no sentence would reach a player as "undefined".
  test("every role map covers exactly the same roles", () => {
    const roles = Object.keys(ROLE_CATEGORIES).sort();
    expect(Object.keys(ROLE_LABELS).sort()).toEqual(roles);
    expect(Object.keys(ROLE_DESCRIPTIONS).sort()).toEqual(roles);
  });
});

describe("tokens are well-formed for every fixture call", () => {
  test.each(calls)("$id", (c) => {
    const raw = c.raw;
    const result = tokenize(raw);

    let previousEnd = 0;
    for (const token of result) {
      expect(token.start).toBeGreaterThanOrEqual(0);
      expect(token.end).toBeGreaterThan(token.start);
      expect(token.end).toBeLessThanOrEqual(raw.length);
      // The slice must be the original input, not the upper-cased view the
      // lexer matched against.
      expect(token.text).toBe(raw.slice(token.start, token.end));

      // Sorted and non-overlapping, so a caller can render them in one pass.
      expect(token.start).toBeGreaterThanOrEqual(previousEnd);
      previousEnd = token.end;

      expect(CATEGORIES.has(token.category)).toBe(true);
      // A description is rendered verbatim to players, so it must be a real
      // sentence -- never empty, and never leaking a role name.
      expect(token.description).not.toBe("");
      expect(token.description.endsWith(".")).toBe(true);
      expect(token.label).not.toBe("");
    }
  });
});

describe("a valid call is explained completely", () => {
  const valid = calls.filter((c) => c.valid);

  test.each(valid)("$id", (c) => {
    const result = tokenize(c.raw);

    // Nothing in a call that parses is left unaccounted for.
    for (const token of result) {
      expect(token.role).not.toBe("unknown");
    }

    // Everything between the tokens is separator, so a caller that puts the
    // gaps back verbatim reproduces exactly what was typed.
    let cursor = 0;
    for (const token of result) {
      expect(c.raw.slice(cursor, token.start)).toMatch(SEPARATORS);
      cursor = token.end;
    }
    expect(c.raw.slice(cursor)).toMatch(SEPARATORS);
  });

  /**
   * The tokenizer and the canonicalizer are two separate walks of the same
   * tree, so they could drift apart as the grammar grows. Joining the canonical
   * spellings has to reproduce normalize() exactly -- which pins word choice,
   * word order, and that neither walk drops or invents a word.
   */
  test.each(valid)("$id canonical words agree with normalize()", (c) => {
    const joined = tokenize(c.raw)
      .map((t) => t.canonical)
      .join("-");
    expect(joined).toBe(normalize(c.raw));
  });
});

describe("tokenize never throws", () => {
  test.each(calls)("$id", (c) => {
    expect(() => tokenize(c.raw)).not.toThrow();
  });

  test.each(["", "   ", "-", "!", "Stun!", "power word you stun", "full auto", "5 5 5 5 5"])(
    "%j",
    (raw) => {
      expect(() => tokenize(raw)).not.toThrow();
    },
  );
});

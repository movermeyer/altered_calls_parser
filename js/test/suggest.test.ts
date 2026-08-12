import { describe, expect, test } from "vitest";

import cases from "../../tests/fixtures/completions.json" with { type: "json" };
import { suggest, type KeywordSuggestion } from "../src/completion.js";

/** What a fixture pins about one suggestion: everything but its `kind`. */
type KeywordSuggestionFields = Omit<KeywordSuggestion, "kind">;

describe("suggest", () => {
  test.each(cases)("$id", (c) => {
    const results = suggest(c.raw, c.cursor);
    const keywordLabels = results.filter((r) => r.kind === "keyword").map((r) => r.label).sort();
    const hasNumber = results.some((r) => r.kind === "number");

    if (c.exhaustive) {
      expect(keywordLabels).toEqual([...c.expectedKeywordLabels].sort());
    } else {
      for (const label of c.expectedKeywordLabels) {
        expect(keywordLabels).toContain(label);
      }
    }
    expect(hasNumber).toBe(c.expectedNumberSlot ?? false);

    // Where a case pins them, the whole suggestion: which word of a multi-word
    // call the caret is on, and the range accepting it would rewrite.
    const pinned = (c as { expectedSuggestions?: KeywordSuggestionFields[] })
      .expectedSuggestions;
    for (const expected of pinned ?? []) {
      expect(results).toContainEqual({ kind: "keyword", ...expected });
    }
  });
});

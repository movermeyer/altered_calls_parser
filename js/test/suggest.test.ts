import { describe, expect, test } from "vitest";

import { suggest } from "../src/completion.js";
import cases from "../../tests/fixtures/completions.json" with { type: "json" };

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
  });
});

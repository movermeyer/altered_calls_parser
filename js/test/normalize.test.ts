import { describe, expect, test } from "vitest";

import { CallParseError, normalize } from "../src/index.js";
import cases from "../../tests/fixtures/calls.json" with { type: "json" };

const validCases = cases.filter((c) => c.valid);
const invalidCases = cases.filter((c) => !c.valid);

describe("normalize valid", () => {
  test.each(validCases)("$id", (c) => {
    expect(normalize(c.raw)).toBe(c.canonical);
  });
});

describe("normalize invalid throws", () => {
  test.each(invalidCases)("$id", (c) => {
    expect(() => normalize(c.raw)).toThrow(CallParseError);
  });
});

import { describe, expect, test } from "vitest";

import { validate } from "../src/index.js";
import cases from "../../tests/fixtures/calls.json" with { type: "json" };

describe("validate", () => {
  test.each(cases)("$id", (c) => {
    expect(validate(c.raw)).toBe(c.valid);
  });
});

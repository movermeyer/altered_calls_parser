import type { DamageCallContext, DefensiveCallContext } from "./generated/CallsParser.js";

/**
 * The two kinds of call the grammar recognizes.
 *
 * The top-level `call` rule exists only to choose between them, so it is
 * unwrapped rather than exposed: a caller wanting to know which kind it got can
 * ask with `instanceof`, which is the same question `call` would have made them
 * ask of its children.
 *
 * It lives in its own module because both tree walks (canonical.ts and
 * tokenize.ts) take it as a parameter, and so does the public ParseResult --
 * importing it from index.ts would be a cycle.
 */
export type CallTree = DamageCallContext | DefensiveCallContext;

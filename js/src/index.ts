import { CommonTokenStream } from "antlr4ng";

import { Canonicalizer } from "./canonical.js";
import { CaseChangingCharStream } from "./caseChangingCharStream.js";
import { suggest as suggestImpl, type Suggestion } from "./completion.js";
import {
  CallParseError,
  CollectingErrorListener,
  type CallHint,
  type CallHintKind,
  type CallSyntaxError,
} from "./errors.js";
import { CallsLexer } from "./generated/CallsLexer.js";
import { CallsParser, type CallContext } from "./generated/CallsParser.js";
import { tokenizeTree, type CallToken, type CallTokenRole } from "./tokenize.js";
import type { CallTree } from "./tree.js";

export {
  CallParseError,
  type CallHint,
  type CallHintKind,
  type CallSyntaxError,
  type CallToken,
  type CallTokenRole,
  type CallTree,
  type Suggestion,
};

export interface ParseResult {
  valid: boolean;
  /**
   * Null only when error recovery couldn't commit to either kind of call --
   * which needs the very first word to be unusable, as in "Zzzzz". A valid
   * parse always has a tree.
   */
  tree: CallTree | null;
  errors: CallSyntaxError[];
}

function makeParser(text: string): {
  parser: CallsParser;
  listener: CollectingErrorListener;
  tokens: CommonTokenStream;
} {
  const stream = new CaseChangingCharStream(text, true);
  const listener = new CollectingErrorListener();

  const lexer = new CallsLexer(stream);
  lexer.removeErrorListeners();
  lexer.addErrorListener(listener);

  const tokens = new CommonTokenStream(lexer);
  const parser = new CallsParser(tokens);
  parser.removeErrorListeners();
  parser.addErrorListener(listener);

  // The token stream comes back too: tokenize() needs the tokens the parser
  // rejected, which the tree alone cannot show it.
  return { parser, listener, tokens };
}

/**
 * The damage or defensive call under a `call` context, if either survived.
 *
 * Both children are checked rather than just returning whichever the grammar
 * says must be there: after error recovery the `call` rule can end up with
 * neither, since the choice between them is made on the first token.
 */
function unwrap(ctx: CallContext): CallTree | null {
  return ctx.damageCall() ?? ctx.defensiveCall() ?? null;
}

export function parse(text: string): ParseResult {
  const { parser, listener } = makeParser(text);
  const tree = unwrap(parser.call());
  const errors = listener.toErrors(text);
  return { valid: errors.length === 0, tree, errors };
}

export function validate(text: string): boolean {
  return parse(text).valid;
}

export function normalize(text: string): string {
  const result = parse(text);
  if (!result.valid || result.tree === null) {
    throw new CallParseError(result.errors);
  }
  return new Canonicalizer().canonicalize(result.tree);
}

export function suggest(text: string, cursor: number): Suggestion[] {
  return suggestImpl(text, cursor);
}

/**
 * Label each word of `text` with the part of the syntax it belongs to, for
 * showing a call broken down into its pieces.
 *
 * Unlike normalize(), this never throws: invalid input comes back with the
 * words that did parse labelled and the rest marked "unknown".
 */
export function tokenize(text: string): CallToken[] {
  const { parser, tokens } = makeParser(text);
  const tree = unwrap(parser.call());
  // The parser reads the stream lazily, so it is only fully populated once
  // call() has run -- fill() then adds nothing, but costs nothing either.
  tokens.fill();
  return tokenizeTree(text, tree, tokens);
}

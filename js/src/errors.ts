import { BaseErrorListener, Token, type RecognitionException, type Recognizer } from "antlr4ng";

import { buildHint, type CallHint, type OffendingToken } from "./hints.js";
import { CallsLexer } from "./generated/CallsLexer.js";

export type { CallHint, CallHintKind } from "./hints.js";

export interface CallSyntaxError {
  line: number;
  column: number;
  /** ANTLR's raw diagnostic. Precise, but written for developers. */
  message: string;
  /** The same problem in plain language, for showing to players. */
  hint: CallHint;
}

export class CallParseError extends Error {
  public readonly errors: CallSyntaxError[];

  constructor(errors: CallSyntaxError[]) {
    super(errors.map((e) => `${e.line}:${e.column}: ${e.message}`).join("; "));
    this.name = "CallParseError";
    this.errors = errors;
  }
}

/** One reported error, before its hint has been built. */
interface RawSyntaxError {
  line: number;
  column: number;
  message: string;
  offending: OffendingToken | null;
}

export class CollectingErrorListener extends BaseErrorListener {
  public readonly raw: RawSyntaxError[] = [];

  public override syntaxError<S extends Token>(
    _recognizer: Recognizer<never>,
    offendingSymbol: S | null,
    line: number,
    column: number,
    msg: string,
    _e: RecognitionException | null,
  ): void {
    // Lexer errors carry no token -- nothing could be tokenized in the first place.
    const offending: OffendingToken | null =
      offendingSymbol === null
        ? null
        : {
            start: offendingSymbol.start,
            end: offendingSymbol.stop + 1,
            isEof: offendingSymbol.type === Token.EOF,
            isWord: offendingSymbol.type === CallsLexer.IDENT,
          };
    this.raw.push({ line, column, message: msg, offending });
  }

  /** Attach a hint to each collected error. Needs the input text, which the listener never sees. */
  public toErrors(text: string): CallSyntaxError[] {
    return this.raw.map((e) => ({
      line: e.line,
      column: e.column,
      message: e.message,
      hint: buildHint(text, e.line, e.column, e.offending),
    }));
  }
}

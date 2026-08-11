from dataclasses import dataclass

from antlr4 import Token
from antlr4.error.ErrorListener import ErrorListener

from ._hints import CallHint, OffendingToken, build_hint
from .generated.CallsLexer import CallsLexer

__all__ = [
    "CallHint",
    "CallSyntaxError",
    "CallParseError",
    "CollectingErrorListener",
]


@dataclass(frozen=True)
class CallSyntaxError:
    line: int
    column: int
    #: ANTLR's raw diagnostic. Precise, but written for developers.
    message: str
    #: The same problem in plain language, for showing to players.
    hint: CallHint


class CallParseError(Exception):
    """Raised by normalize() when the input text is not a valid call."""

    def __init__(self, errors: list[CallSyntaxError]) -> None:
        self.errors = errors
        super().__init__("; ".join(f"{e.line}:{e.column}: {e.message}" for e in errors))


@dataclass(frozen=True)
class _RawSyntaxError:
    """One reported error, before its hint has been built."""

    line: int
    column: int
    message: str
    offending: OffendingToken | None


class CollectingErrorListener(ErrorListener):
    def __init__(self) -> None:
        super().__init__()
        self.raw: list[_RawSyntaxError] = []

    def syntaxError(
        self,
        recognizer: object,
        offendingSymbol: object,
        line: int,
        column: int,
        msg: str,
        e: object,
    ) -> None:
        # Lexer errors carry no token -- nothing could be tokenized in the first place.
        offending: OffendingToken | None = None
        if offendingSymbol is not None:
            offending = OffendingToken(
                start=offendingSymbol.start,  # type: ignore[attr-defined]
                end=offendingSymbol.stop + 1,  # type: ignore[attr-defined]
                is_eof=offendingSymbol.type == Token.EOF,  # type: ignore[attr-defined]
                is_word=offendingSymbol.type == CallsLexer.IDENT,  # type: ignore[attr-defined]
            )
        self.raw.append(
            _RawSyntaxError(line=line, column=column, message=msg, offending=offending)
        )

    def to_errors(self, text: str) -> list[CallSyntaxError]:
        """Attach a hint to each collected error.

        Needs the input text, which the listener never sees.
        """
        return [
            CallSyntaxError(
                line=e.line,
                column=e.column,
                message=e.message,
                hint=build_hint(text, e.line, e.column, e.offending),
            )
            for e in self.raw
        ]

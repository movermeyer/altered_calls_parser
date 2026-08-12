"""Unofficial, fan-made parser to parse, validate, normalize, and autocomplete Altered LARP calls.

Not affiliated with or endorsed by the creators of Altered LARP.
"""

from dataclasses import dataclass

from antlr4 import CommonTokenStream

from ._canonical import Canonicalizer
from ._case_changing_stream import CaseChangingCharStream
from ._completion import Suggestion
from ._completion import suggest as _suggest
from ._errors import CallParseError, CallSyntaxError, CollectingErrorListener
from ._hints import CallHint
from ._tokenize import CallToken
from ._tokenize import tokenize_tree as _tokenize_tree
from ._tree import CallTree
from .generated.CallsLexer import CallsLexer
from .generated.CallsParser import CallsParser

__all__ = [
    "CallHint",
    "CallParseError",
    "CallSyntaxError",
    "CallToken",
    "CallTree",
    "ParseResult",
    "Suggestion",
    "parse",
    "validate",
    "normalize",
    "suggest",
    "tokenize",
]


@dataclass
class ParseResult:
    valid: bool
    #: None only when error recovery couldn't commit to either kind of call --
    #: which needs the very first word to be unusable, as in "Zzzzz". A valid
    #: parse always has a tree.
    tree: CallTree | None
    errors: list[CallSyntaxError]


def _make_parser(
    text: str,
) -> tuple[CallsParser, CollectingErrorListener, CommonTokenStream]:
    stream = CaseChangingCharStream(text, upper=True)
    listener = CollectingErrorListener()

    lexer = CallsLexer(stream)
    lexer.removeErrorListeners()
    lexer.addErrorListener(listener)

    tokens = CommonTokenStream(lexer)
    parser = CallsParser(tokens)
    parser.removeErrorListeners()
    parser.addErrorListener(listener)

    # The token stream comes back too: tokenize() needs the tokens the parser
    # rejected, which the tree alone cannot show it.
    return parser, listener, tokens


def _unwrap(ctx: CallsParser.CallContext) -> CallTree | None:
    """The damage or defensive call under a `call` context, if either survived.

    Both children are checked for None rather than just returning whichever the
    grammar says must be there: after error recovery the `call` rule can end up
    with neither, since the choice between them is made on the first token.
    """
    damage_call: CallsParser.DamageCallContext | None = ctx.damageCall()
    if damage_call is not None:
        return damage_call
    defensive_call: CallsParser.DefensiveCallContext | None = ctx.defensiveCall()
    return defensive_call


def parse(text: str) -> ParseResult:
    """Parse `text` as a call, collecting any syntax errors instead of raising."""
    parser, listener, _tokens = _make_parser(text)
    tree = _unwrap(parser.call())
    errors = listener.to_errors(text)
    return ParseResult(valid=not errors, tree=tree, errors=errors)


def validate(text: str) -> bool:
    """Return True iff `text` is a syntactically valid call."""
    return parse(text).valid


def normalize(text: str) -> str:
    """Normalize a valid call to its canonical lowercase, hyphen-separated form.

    Raises CallParseError if `text` is not a valid call.
    """
    result = parse(text)
    if not result.valid or result.tree is None:
        raise CallParseError(result.errors)
    return Canonicalizer().canonicalize(result.tree)


def suggest(text: str, cursor: int) -> list[Suggestion]:
    """Suggest completions for `text` at caret offset `cursor` (a Python
    string index, i.e. a Unicode code point offset)."""
    return _suggest(text, cursor)


def tokenize(text: str) -> list[CallToken]:
    """Label each word of `text` with the part of the syntax it belongs to,
    for showing a call broken down into its pieces.

    Unlike normalize(), this never raises: invalid input comes back with the
    words that did parse labelled and the rest marked "unknown". That includes
    a real call word with nowhere to go -- in "Fire Stun" the grammar has no
    slot left for "Stun", so it is "unknown" despite being a real effect.

    A character the lexer cannot match at all produces no token, so the
    returned spans do not always tile the input.
    """
    parser, _listener, tokens = _make_parser(text)
    tree = _unwrap(parser.call())
    # The parser reads the stream lazily, so it is only fully populated once
    # call() has run -- fill() then adds nothing, but costs nothing either.
    tokens.fill()
    return _tokenize_tree(text, tree, tokens)

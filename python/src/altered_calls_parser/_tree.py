"""The union of call kinds the grammar recognizes.

It lives in its own module because both tree walks (_canonical.py and
_tokenize.py) take it as a parameter, and so does the public ParseResult --
importing it from __init__.py would be a cycle.
"""

from .generated.CallsParser import CallsParser

#: The top-level `call` rule exists only to choose between these two, so it is
#: unwrapped rather than exposed: a caller wanting to know which kind it got
#: can ask with isinstance, which is the same question `call` would have made
#: them ask of its children.
CallTree = CallsParser.DamageCallContext | CallsParser.DefensiveCallContext

from antlr4 import InputStream


class CaseChangingCharStream(InputStream):
    """An InputStream that upper-cases characters as seen by the lexer's
    LA() while getText() still returns the original-case source text, so
    keyword literals in the grammar can stay simple uppercase strings and
    matching becomes case-insensitive without duplicating case-fragment
    lexer rules.
    """

    def __init__(self, data: str, upper: bool = True) -> None:
        super().__init__(data)
        self._upper = upper

    def LA(self, offset: int) -> int:
        c: int = super().LA(offset)
        if c <= 0:
            return c
        ch = chr(c)
        return ord(ch.upper() if self._upper else ch.lower())

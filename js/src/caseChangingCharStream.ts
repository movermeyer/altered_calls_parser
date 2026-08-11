import { CharStream, type Interval } from "antlr4ng";

/**
 * A CharStream that upper-cases characters as seen by the lexer's LA()
 * while getTextFromRange()/getTextFromInterval() still return the
 * original-case source text, so keyword literals in the grammar can stay
 * simple uppercase strings and matching becomes case-insensitive without
 * duplicating case-fragment lexer rules.
 */
export class CaseChangingCharStream implements CharStream {
  private readonly inner: CharStream;
  private readonly upper: boolean;
  public name: string;

  constructor(text: string, upper = true) {
    this.inner = CharStream.fromString(text);
    this.upper = upper;
    this.name = this.inner.name;
  }

  public get index(): number {
    return this.inner.index;
  }

  public get size(): number {
    return this.inner.size;
  }

  public consume(): void {
    this.inner.consume();
  }

  public mark(): number {
    return this.inner.mark();
  }

  public release(marker: number): void {
    this.inner.release(marker);
  }

  public seek(index: number): void {
    this.inner.seek(index);
  }

  public getSourceName(): string {
    return this.inner.getSourceName();
  }

  public reset(): void {
    this.inner.reset();
  }

  public getTextFromRange(start: number, stop: number): string {
    return this.inner.getTextFromRange(start, stop);
  }

  public getTextFromInterval(interval: Interval): string {
    return this.inner.getTextFromInterval(interval);
  }

  public LA(offset: number): number {
    const c = this.inner.LA(offset);
    if (c <= 0) {
      return c;
    }
    const ch = String.fromCharCode(c);
    return (this.upper ? ch.toUpperCase() : ch.toLowerCase()).charCodeAt(0);
  }
}

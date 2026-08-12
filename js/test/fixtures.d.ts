/**
 * tests/fixtures/all-calls.txt is a plain text file, one call per line, so
 * unlike the JSON fixtures it can't be imported directly. Vite's `?raw` suffix
 * (Vitest runs on Vite) hands the import the file's contents as a string;
 * this declaration is only how TypeScript is told the shape of that.
 *
 * Same arrangement as demo/src/grammar.d.ts, which does this for `*.g4`.
 */
declare module "*.txt?raw" {
  const content: string;
  export default content;
}

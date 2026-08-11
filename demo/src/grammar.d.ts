/**
 * The demo shows grammar/Calls.g4 verbatim rather than a hand-written
 * paraphrase of it, so the page can never drift from the grammar the parser
 * actually runs on. esbuild's `--loader:.g4=text` (see build:demo in
 * js/package.json) is what turns the import into the file's contents at build
 * time; this declaration is only how TypeScript is told the shape of that.
 */
declare module "*.g4" {
  const content: string;
  export default content;
}

import {
  parse,
  validate,
  normalize,
  suggest,
  tokenize,
  type Suggestion,
} from "../../js/src/index.js";
import grammarSource from "../../grammar/Calls.g4";

const input = document.getElementById("call-input") as HTMLInputElement;
const underlay = document.getElementById("underlay") as HTMLDivElement;
const suggestionsEl = document.getElementById("suggestions") as HTMLUListElement;
const validBadge = document.getElementById("valid-badge") as HTMLSpanElement;
const hintEl = document.getElementById("hint") as HTMLDivElement;
const hintText = document.getElementById("hint-text") as HTMLParagraphElement;
const hintFixes = document.getElementById("hint-fixes") as HTMLDivElement;
const normalizedOutput = document.getElementById("normalized-output") as HTMLButtonElement;
const normalizedText = document.getElementById("normalized-text") as HTMLElement;
const copyLabel = document.getElementById("copy-label") as HTMLSpanElement;
const copyStatus = document.getElementById("copy-status") as HTMLSpanElement;
const breakdown = document.getElementById("breakdown") as HTMLDivElement;
const breakdownRow = document.getElementById("breakdown-row") as HTMLParagraphElement;
const grammarSourceEl = document.getElementById("grammar-source") as HTMLElement;

// textContent, not innerHTML: this is a source file being displayed as text, and
// it should stay that way whatever the grammar grows to contain.
grammarSourceEl.textContent = grammarSource;

const SEPARATORS = new Set([" ", "-"]);

/** Beyond a handful, one-click fixes stop being a shortcut and become a second wall of words. */
const MAX_FIXES = 6;

/** How long "Copied!" lingers before the button offers itself again. */
const COPIED_MS = 1200;

/** The query param carrying the call, so a page can be linked to mid-thought. */
const QUERY_PARAM = "q";

/**
 * The longest call the box will hold. The longest call anyone actually makes is
 * around forty characters, so this is not a limit a player will meet; it is here
 * because the text can now arrive from a link rather than a keyboard, and
 * everything downstream -- parse, validate, normalize, and the completion engine
 * -- runs synchronously on the main thread. Kept in step with the maxlength
 * attribute on the input.
 */
const MAX_CALL_LENGTH = 200;

/**
 * How long typing has to pause before the address bar catches up. Safari
 * rate-limits the history API to roughly a hundred calls per thirty seconds, and
 * a burst of keystrokes would otherwise spend that budget writing URLs for
 * half-typed words that nobody is reading.
 */
const URL_SYNC_MS = 250;

let suggestions: Suggestion[] = [];
let activeIndex = -1;

function isSelectable(s: Suggestion): boolean {
  return s.kind === "keyword";
}

/**
 * Underline `[start, end)` of the input text. A zero-width range (an unfinished
 * call, where the problem is what *isn't* there) marks the trailing edge instead
 * so there is still something to point at.
 */
function renderUnderlay(text: string, start: number, end: number): void {
  underlay.textContent = "";
  if (start === end) {
    underlay.append(text);
    const caret = document.createElement("mark");
    caret.className = "at-end";
    // A non-breaking space keeps the mark from collapsing to zero width.
    caret.textContent = " ";
    underlay.append(caret);
    return;
  }
  const mark = document.createElement("mark");
  mark.textContent = text.slice(start, end);
  underlay.append(text.slice(0, start), mark, text.slice(end));
}

function clearUnderlay(): void {
  underlay.textContent = "";
}

/**
 * The range `word` should replace. A call typed as two words ("knock down")
 * reports only its first half as the offending span, so replacing that alone
 * would leave the orphaned second half behind; when the two halves spell the
 * fix exactly, swallow both.
 */
function fixRange(text: string, start: number, end: number, word: string): [number, number] {
  let nextStart = end;
  while (nextStart < text.length && SEPARATORS.has(text[nextStart])) {
    nextStart++;
  }
  let nextEnd = nextStart;
  while (nextEnd < text.length && !SEPARATORS.has(text[nextEnd])) {
    nextEnd++;
  }

  const joined = text.slice(start, end) + text.slice(nextStart, nextEnd);
  return joined.toLowerCase() === word.toLowerCase() ? [start, nextEnd] : [start, end];
}

/** Replace the offending span with `word`, then put the caret after it. */
function applyFix(start: number, end: number, word: string): void {
  const text = input.value;
  const needsSpace = start === end && start > 0 && !SEPARATORS.has(text[start - 1]);
  const insert = needsSpace ? ` ${word}` : word;
  const [from, to] = fixRange(text, start, end, word);

  input.value = text.slice(0, from) + insert + text.slice(to);
  const caret = from + insert.length;
  input.setSelectionRange(caret, caret);
  input.focus();
  render();
}

function renderFixes(start: number, end: number, words: string[]): void {
  hintFixes.textContent = "";
  if (words.length === 0 || words.length > MAX_FIXES) {
    hintFixes.hidden = true;
    return;
  }

  for (const word of words) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "fix";
    button.textContent = word;
    button.addEventListener("click", () => applyFix(start, end, word));
    hintFixes.appendChild(button);
  }
  hintFixes.hidden = false;
}

let copiedTimer: number | undefined;

/**
 * `navigator.clipboard` needs a secure context, which a demo opened straight
 * from disk as file:// is not, so fall back to the deprecated `execCommand`
 * route there.
 */
function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const scratch = document.createElement("textarea");
  scratch.value = text;
  // Off-screen rather than hidden: the selection APIs ignore invisible nodes.
  scratch.style.position = "fixed";
  scratch.style.top = "-1000px";
  document.body.appendChild(scratch);
  scratch.select();
  const ok = document.execCommand("copy");
  scratch.remove();
  input.focus();
  return ok ? Promise.resolve() : Promise.reject(new Error("copy command failed"));
}

/**
 * The call carried by the current URL, if any. `URLSearchParams` accepts both
 * `+` and `%20` for the spaces, so a link typed out by hand works either way.
 */
function readQuery(): string {
  const raw = new URLSearchParams(window.location.search).get(QUERY_PARAM) ?? "";
  return raw.slice(0, MAX_CALL_LENGTH);
}

function writeQuery(text: string): void {
  const url = new URL(window.location.href);
  if (text === "") {
    // Deleting rather than blanking: an emptied box should leave a clean URL,
    // not a dangling "?q=".
    url.searchParams.delete(QUERY_PARAM);
  } else {
    url.searchParams.set(QUERY_PARAM, text);
  }

  try {
    window.history.replaceState(null, "", url);
  } catch {
    // A page opened straight from disk has an opaque origin, and browsers refuse
    // to rewrite history there. Nothing else depends on this, so the demo goes
    // on working; its address bar just stops keeping up.
  }
}

/**
 * `replaceState`, never `pushState`: a history entry per keystroke would turn
 * the back button into forty presses of escaping a single page.
 */
let lastSyncedQuery: string | null = null;
let querySyncTimer: number | undefined;

function scheduleQuerySync(text: string): void {
  // render() also runs on clicks, focus, and cursor movement, where there is
  // nothing new to say about the URL.
  if (text === lastSyncedQuery) return;

  window.clearTimeout(querySyncTimer);
  querySyncTimer = window.setTimeout(() => {
    lastSyncedQuery = text;
    writeQuery(text);
  }, URL_SYNC_MS);
}

/** Leaving the box is often the first half of reaching for the address bar. */
function flushQuerySync(): void {
  window.clearTimeout(querySyncTimer);
  lastSyncedQuery = input.value;
  writeQuery(input.value);
}

function showCopyResult(message: string): void {
  copyLabel.textContent = message;
  normalizedOutput.classList.add("copied");
  copyStatus.textContent = message;
  window.clearTimeout(copiedTimer);
  copiedTimer = window.setTimeout(() => {
    copyLabel.textContent = "Copy";
    normalizedOutput.classList.remove("copied");
    copyStatus.textContent = "";
  }, COPIED_MS);
}

function setNormalized(text: string): void {
  // A stale "Copied!" hanging over a call the user has since edited would be a
  // lie about what is on their clipboard.
  window.clearTimeout(copiedTimer);
  copyLabel.textContent = "Copy";
  normalizedOutput.classList.remove("copied");
  copyStatus.textContent = "";

  normalizedText.textContent = text;
  normalizedOutput.hidden = text === "";
  normalizedOutput.setAttribute("aria-label", `Copy ${text} to clipboard`);
}

/**
 * Show the call split into its parts, each labelled with the job it does.
 *
 * The tokens are not contiguous -- the lexer skips separators -- so whatever
 * sat in each gap goes back in untouched. Hyphens, spaces, or a run of both:
 * the row reads back as exactly what was typed.
 */
function renderBreakdown(text: string): void {
  breakdownRow.textContent = "";
  const tokens = tokenize(text);

  let cursor = 0;
  for (const token of tokens) {
    breakdownRow.append(text.slice(cursor, token.start));

    const part = document.createElement("span");
    // Colour keys off the coarse category, so a new role never needs a CSS
    // rule; the precise role rides along for anyone inspecting the page.
    part.className = "part";
    part.dataset.category = token.category;
    part.dataset.role = token.role;
    // Focusable so the explanation is reachable without a pointer -- and so a
    // touch device has something to tap.
    part.tabIndex = 0;
    part.append(token.text);

    const tip = document.createElement("span");
    tip.className = "part-tip";
    tip.setAttribute("role", "tooltip");
    const name = document.createElement("b");
    name.textContent = token.label;
    tip.append(name, token.description);
    part.append(tip);

    breakdownRow.append(part);
    cursor = token.end;
  }
  breakdownRow.append(text.slice(cursor));

  breakdown.hidden = tokens.length === 0;
}

function clearBreakdown(): void {
  breakdownRow.textContent = "";
  breakdown.hidden = true;
}

normalizedOutput.addEventListener("click", () => {
  const text = normalizedText.textContent ?? "";
  if (text === "") return;
  copyText(text).then(
    () => showCopyResult("Copied!"),
    () => showCopyResult("Press Ctrl+C"),
  );
});

function renderResults(text: string): void {
  // An empty box is not an achievement -- stay silent until there is something
  // to judge, rather than congratulating the user for a call they haven't typed.
  if (text.trim() === "") {
    validBadge.hidden = true;
    hintEl.hidden = true;
    setNormalized("");
    clearUnderlay();
    clearBreakdown();
    return;
  }

  const isValid = validate(text);
  validBadge.hidden = false;
  validBadge.textContent = isValid ? "Syntactically valid call" : "Not a call yet";
  validBadge.className = `badge ${isValid ? "valid" : "invalid"}`;

  if (isValid) {
    hintEl.hidden = true;
    setNormalized(normalize(text));
    clearUnderlay();
    renderBreakdown(text);
    return;
  }

  setNormalized("");
  clearBreakdown();
  const { hint } = parse(text).errors[0];
  hintText.textContent = hint.text;
  hintEl.hidden = false;
  renderFixes(hint.start, hint.end, hint.suggestions);
  renderUnderlay(text, hint.start, hint.end);
}

function renderSuggestions(text: string, cursor: number): void {
  // The dropdown belongs to the caret, so it only ever opens while the input
  // holds focus -- otherwise the initial render() below would pop it open on
  // page load, before the user has clicked anything.
  if (document.activeElement !== input) {
    suggestionsEl.hidden = true;
    return;
  }

  suggestions = suggest(text, cursor);
  activeIndex = suggestions.findIndex(isSelectable);

  suggestionsEl.innerHTML = "";
  if (suggestions.length === 0) {
    suggestionsEl.hidden = true;
    return;
  }

  suggestions.forEach((s, i) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    if (s.kind === "keyword") {
      li.textContent = s.label;
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        acceptSuggestion(i);
      });
    } else {
      li.textContent = "a number";
      li.classList.add("info");
    }
    if (i === activeIndex) {
      li.classList.add("active");
    }
    suggestionsEl.appendChild(li);
  });
  suggestionsEl.hidden = false;
}

function render(): void {
  const text = input.value;
  const cursor = input.selectionStart ?? text.length;
  renderResults(text);
  renderSuggestions(text, cursor);
  // Every path that changes the text -- typing, the example buttons, one-click
  // fixes, accepted suggestions -- ends here, so the URL only has to be kept up
  // to date in this one place.
  scheduleQuerySync(text);
}

function moveActive(delta: number): void {
  if (suggestions.length === 0) return;
  const selectableIndices = suggestions.map((s, i) => i).filter((i) => isSelectable(suggestions[i]));
  if (selectableIndices.length === 0) return;

  const currentPos = selectableIndices.indexOf(activeIndex);
  const nextPos =
    currentPos === -1
      ? 0
      : (currentPos + delta + selectableIndices.length) % selectableIndices.length;
  activeIndex = selectableIndices[nextPos];

  [...suggestionsEl.children].forEach((el, i) => el.classList.toggle("active", i === activeIndex));
}

/**
 * Put the accepted call in the box, in place of whatever the player had typed
 * towards it.
 *
 * The range comes from the suggestion rather than being worked out here: a
 * multi-word call reaches back over the words already typed, so a caret sitting
 * in "Shrug O" is offered "Shrug Off" replacing both words -- and searching
 * backwards for the nearest separator, as if a suggestion were always one word,
 * would leave the first of them behind.
 */
function acceptSuggestion(index: number): void {
  const s = suggestions[index];
  if (!s || s.kind !== "keyword") return;

  const text = input.value;
  const newText = text.slice(0, s.start) + s.label + " " + text.slice(s.end);
  const newCursor = s.start + s.label.length + 1;

  input.value = newText;
  input.setSelectionRange(newCursor, newCursor);
  input.focus();
  render();
}

input.addEventListener("input", render);
input.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
    render();
  }
});
input.addEventListener("click", render);
input.addEventListener("focus", render);
input.addEventListener("blur", flushQuerySync);
// The underlay does not scroll with the input on its own.
input.addEventListener("scroll", () => {
  underlay.scrollLeft = input.scrollLeft;
});

input.addEventListener("keydown", (e) => {
  if (suggestionsEl.hidden) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    moveActive(1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    moveActive(-1);
  } else if (e.key === "Enter" || e.key === "Tab") {
    if (activeIndex !== -1) {
      e.preventDefault();
      acceptSuggestion(activeIndex);
    }
  } else if (e.key === "Escape") {
    suggestionsEl.hidden = true;
  }
});

document.addEventListener("click", (e) => {
  if (!input.contains(e.target as Node) && !suggestionsEl.contains(e.target as Node)) {
    suggestionsEl.hidden = true;
  }
});

/**
 * The examples are links to their own `?q=` URLs, but a plain click fills the
 * box in place rather than reloading the page. Modified clicks fall through
 * untouched, so "open in a new tab" goes on meaning what it says.
 */
for (const link of document.querySelectorAll<HTMLAnchorElement>(".example")) {
  link.addEventListener("click", (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();

    // Read the call back out of the href rather than keeping a second copy of
    // it in an attribute: followed or intercepted, the link lands on the same
    // text either way.
    input.value = new URL(link.href).searchParams.get(QUERY_PARAM) ?? "";
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    render();
    // The link showed this URL in the status bar on hover; the address bar
    // should not then sit out the typing debounce before agreeing with it.
    flushQuerySync();
  });
}

// Deliberately no focus() here, unlike the example buttons above: the dropdown
// belongs to the caret, and following a link into the page should show the
// answer rather than an open list of completions covering it.
input.value = readQuery();
render();

# Architecture

## Phase 0 boundary
12th Fail is a static, offline-first Progressive Web App. The app shell is hosted on GitHub Pages and is cached by its same-origin service worker.

## Runtime files
- `index.html`: semantic document structure and local asset references.
- `style.css`: responsive presentation, colors, and accessible touch sizing.
- `app.js`: UI behavior and service-worker registration.
- `manifest.json`: install metadata with relative scope and start URL.
- `sw.js`: caches the static app shell and serves cached same-origin assets.
- `icons/icon.svg`: scalable local app icon.

## Trust and privacy boundaries
- No AI/LLM, online API, analytics, advertisements, login, or remote fonts.
- No application data is sent to a server.
- The service worker only handles same-origin GET requests and local cache.
- The browser must load the site over HTTPS (or localhost) for service workers.

## Offline behavior
The first successful online visit installs the service worker and caches the app shell. After activation, the cached shell can be reopened without a network connection. A first visit cannot work offline before the cache has been populated.

## Math engine boundary (Phase 2.2)
- `math/engine.js` is a deterministic BODMAS and percentage engine. It supports addition, subtraction, multiplication, division, parentheses, unary signs, finite decimals, exact fractions, and postfix percentages.
- Values are exact rational pairs using `BigInt`; no binary floating-point arithmetic is used. A percentage token divides the preceding value by exactly 100.
- A recursive-descent AST evaluator computes the primary result. A separate shunting-yard/postfix evaluator recomputes it independently. Results are returned only when both exact rational values match.
- `reasons_hi.json` contains fixed Hindi explanations keyed by operation rule, including percentage. Runtime-generated explanation text is not used.
- Unsupported syntax, division by zero, missing reasons, or failed verification returns only `यह सवाल अभी हल नहीं कर सकता`.
- `tests/bodmas-cases.json` contains 40 hand-verified arithmetic cases; `tests/percentages-cases.json` contains 30 hand-verified percentage cases. Both test suites use Node's built-in runner without third-party dependencies.
- The app loads the local engine before the UI controller; the keypad percentage key uses the deterministic engine.

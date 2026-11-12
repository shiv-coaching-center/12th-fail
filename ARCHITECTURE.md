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

## Phase 3.1 exponents and square roots
- `math/engine.js` supports exact integer powers (including zero and negative integer exponents) and exact square roots when both rational numerator and denominator are perfect squares.
- Powers use bounded exponentiation by squaring over BigInt rational values. Roots use integer square-root checks; irrational, negative, or unsupported roots are rejected.
- The AST evaluator and independent shunting-yard/postfix evaluator must agree exactly before a result is returned.
- `reasons_hi.json` supplies fixed Hindi reasons for `power` and `square_root`.
- `tests/exponents-roots-cases.json` contains 40 hand-verified cases, including unsupported and edge cases.

## Trust and privacy boundaries
- No AI/LLM, online API, analytics, advertisements, login, or remote fonts.
- No application data is sent to a server.
- The service worker only handles same-origin GET requests and local cache.
- The browser must load the site over HTTPS (or localhost) for service workers.

## Offline behavior
The first successful online visit installs the service worker and caches the app shell. After activation, the cached shell can be reopened without a network connection. A first visit cannot work offline before the cache has been populated.

## Math engine boundary (Phase 2.3)
- `math/engine.js` is a deterministic BODMAS and percentage engine. It supports addition, subtraction, multiplication, division, parentheses, unary signs, finite decimals, exact fractions, and postfix percentages.
- Values are exact rational pairs using `BigInt`; no binary floating-point arithmetic is used. A percentage token divides the preceding value by exactly 100.
- A recursive-descent AST evaluator computes the primary result. A separate shunting-yard/postfix evaluator recomputes it independently. Results are returned only when both exact rational values match.
- `reasons_hi.json` contains fixed Hindi explanations keyed by operation rule, including percentage. Runtime-generated explanation text is not used.
- Unsupported syntax, division by zero, missing reasons, or failed verification returns only `यह सवाल अभी हल नहीं कर सकता`.
- `tests/bodmas-cases.json` contains 40 hand-verified arithmetic cases; `tests/percentages-cases.json` contains 30 hand-verified percentage cases. Both test suites use Node's built-in runner without third-party dependencies.
- The app loads the local engine before the UI controller; the keypad percentage key uses the deterministic engine.


## Linear equations (Phase 2.3)
- `solveEquation` handles one-variable linear equations with exact rational coefficients, decimals, parentheses, explicit or implicit multiplication, and variables on both sides.
- Expressions are reduced to exact linear forms (ax+b). Products of variable-bearing terms, variable divisors, malformed equations, and division by zero are rejected.
- Unique solutions are verified by substituting the exact value into both original sides and by checking the reduced equation exactly. No-solution and infinite-solution cases are distinguished.
- Every displayed equation step maps to a fixed teacher-reviewable Hindi reason in `reasons_hi.json`.
- `tests/linear-equations-cases.json` contains 37 hand-verified cases, including edge cases and unsupported inputs.

## Phase 3.2 LCM and HCF
- `solveLcmHcf(first, second, reasons)` accepts signed integer strings and returns exact BigInt HCF/LCM results.
- HCF uses the Euclidean algorithm; LCM uses `abs(a) / HCF * abs(b)` to reduce intermediate growth.
- Results are verified independently by divisibility and the product/HCF identity. Decimal, malformed, or oversized inputs are rejected.
- Fixed Hindi explanations are stored in `reasons_hi.json`; 40 independent hand-verified cases are in `tests/lcm-hcf-cases.json`.

## Phase 3.3 Ratio and Proportion
- `solveRatio(first, second, reasons)` reduces a non-negative integer ratio with a positive second term using BigInt GCD and verifies the reduced terms are coprime.
- `solveProportion(first, second, third, reasons)` solves `first:second = third:x` exactly as a rational value and verifies by cross multiplication.
- Both APIs reject malformed, decimal, negative, zero-denominator, and oversized inputs; all displayed explanations use fixed entries in `reasons_hi.json`.
- Independent hand-verified cases are maintained in `tests/ratio-proportion-cases.json`.

# Changelog

## [0.8.0] - 2026-11-12

### Added
- Exact BigInt ratio simplification and missing-term proportion solver.
- Cross-multiplication verification and fixed Hindi explanations.
- 80 hand-verified ratio and proportion test cases.

## [0.7.0] - 2026-11-12

### Added
- Exact BigInt LCM/HCF engine using the Euclidean algorithm and product/HCF identity.
- Zero and negative integer handling, with independent verification.
- Fixed Hindi reasons and 40 hand-verified tests.

## [0.6.0] - 2026-11-12

### Added
- Exact integer exponents, including zero and negative powers, using bounded BigInt rational arithmetic.
- Exact square roots for perfect rational squares, including fractions and finite decimals.
- Independent AST and postfix verification plus 40 hand-verified tests.
- Fixed Hindi reasons for powers and square roots.
- Calculator keypad controls for x² and square root while retaining the equation separator.

### Safety
- Irrational roots, negative square roots, non-integer or oversized exponents, and zero to a negative power are rejected.
- No floating-point math, external dependency, or network API was added.

## [0.5.1] - 2026-11-12

### Fixed
- HTML page navigation now checks the network first and updates its cached copy; offline navigation falls back to the last cached page.
- Versioned app assets remain cache-first so the PWA continues to work offline.

## [0.5.0] - 2026-11-12

### Input
- First equals-key press inserts the equation separator after a variable expression; the next press solves it.

### Added
- Exact one-variable linear equation solving, including variables on both sides.
- Parentheses, decimals, fractions, negative coefficients, and implicit multiplication such as `2x`.
- Exact substitution verification and special handling for no-solution and infinite-solution equations.
- Fixed Hindi explanations and 37 hand-verified equation tests.
- Calculator UI routes equations to the equation solver while preserving arithmetic and percentage behavior.

### Safety
- Nonlinear expressions, variable divisors, malformed equations, and division by zero are rejected without guessing.
- No network API, external dependency, or UI redesign was introduced.

## [0.4.0] - 2026-11-12

### Added
- Exact postfix percentage calculations using BigInt rational arithmetic.
- Independent AST and shunting-yard verification for percentage operations.
- Fixed Hindi percentage explanation and 30 hand-verified percentage cases.
- Percentage support for standalone values, grouped expressions, decimals, negatives, and mixed arithmetic.

### Safety
- Unsupported percentage syntax and division by zero return the standard unsupported message.
- No floating-point arithmetic, network API, or new dependency was introduced.

## [0.3.0] - 2026-11-12

### Added
- Standalone exact-arithmetic BODMAS engine using BigInt rational values.
- Independent verification using a second shunting-yard/postfix evaluation path.
- Fixed Hindi explanation rules in `reasons_hi.json`.
- 40 hand-verified BODMAS test cases and automated tests using Node's built-in test runner.
- Safe unsupported response for invalid syntax, unsupported operators, division by zero, missing explanations, or verification mismatch.

### Scope
- Supports addition, subtraction, multiplication, division, parentheses, unary signs, and finite decimal inputs.
- Does not yet support percentages, powers, roots, variables, or natural-language questions.
- Engine remains separate from the UI until the integration phase.

## [0.2.1] - 2026-11-12

### Changed
- Simplified the calculator home screen: icon-only header, no connection badge, repeated headings, helper copy, or footer.
- Reduced the solution screen to essential content and shorter Hindi labels.
- Kept keypad actions and screen navigation unchanged.

## [0.2.0] - 2026-11-12

### Added
- Three-screen calculator and solution UI foundation.
- Four-column keypad with extras, operators, clear, parentheses, backspace, and equals.
- Expression entry and basic keypad interactions.
- Solution preview screen with tappable sample explanation rows and bottom sheet.
- Bilingual Hindi and English labels.
- Updated service-worker cache version for the new app shell.

### Notes
- The equals key does not calculate yet. Deterministic solving and verified answers are Phase 2.
- Solution rows are clearly marked as UI preview samples, not actual answers.

## [0.1.0] - 2026-11-12

### Added
- Initial bilingual Hindi and English PWA app shell.
- Responsive styles using system fonts only.
- Web app manifest and scalable SVG icon.
- Service worker with versioned app-shell cache.
- Online/offline status indicator.
- Initial architecture and test documentation.

## [0.8.1] - 2026-11-12

### Added
- Standalone Ratio / Proportion page matching the cream and green 3D calculator design.
- Multi-term ratio simplification for 2–6 values with Hindi step-by-step solution.
- Proportion input layout for `a:b = c:x` with exact answer calculation.
- Main calculator and LCM/HCF navigation links; offline app-shell caching.
- Automated integration tests for the new page and multi-term ratios.

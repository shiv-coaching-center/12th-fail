# Changelog

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

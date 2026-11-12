# Test Bank

## Rules
- Expected mathematical answers must come from an independent source (textbook answer key or hand-verified calculation), never from the application engine.
- Each math case must include a source label or `UNVERIFIED`.
- Do not ship a topic until all of its tests pass.
- Run the full existing test suite after every engine change.
- Include edge cases such as zero, negatives, division by zero, large integers, and exact decimals where relevant.

## Phase 0 manual checklist
- [x] Repository is public and default branch is `main`.
- [x] App shell loads over HTTPS.
- [x] No third-party scripts, fonts, APIs, analytics, or CDNs are requested.
- [x] Manifest is local and uses relative paths.
- [x] Service worker installs and activates.
- [x] App shell is cached.
- [x] User confirmed airplane-mode reload works.

## Phase 1 UI checklist
- [x] Home screen shows calculator display and four-column keypad.
- [x] Keypad buttons have at least 48px touch height.
- [x] Digits and operators append to the expression display.
- [x] C clears the expression.
- [x] Backspace removes the last character.
- [x] Parentheses button alternates opening and closing parentheses.
- [x] View steps opens the solution screen and carries the entered expression.
- [x] Back returns to the calculator.
- [x] Sample steps open the explanation bottom sheet.
- [x] Bottom sheet can be dismissed.
- [x] Equals does not display a fabricated answer.

## Phase 2.1 BODMAS
- [x] 40 hand-verified arithmetic cases with source labels.
- [x] Addition, subtraction, multiplication, division, and operator precedence.
- [x] Parentheses and nested parentheses.
- [x] Zero, negative values, unary signs, decimals, fractions, and large integers.
- [x] Division-by-zero and malformed/unsupported input rejection.
- [x] Exact decimal output and reduced rational fractions.
- [x] Independent result check using a second evaluation algorithm.
- [x] Every solution step maps to a fixed Hindi reason in `reasons_hi.json`.
- [x] Engine is integrated with the calculator UI and offline app shell.

## Phase 2.2 Percentages
- [ ] 30 hand-verified percentage cases with source labels.
- [ ] Standalone, negative, decimal, grouped, and mixed percentage calculations.
- [ ] Exact BigInt arithmetic and independent verification.
- [ ] Fixed Hindi reason for every percentage step.
- [ ] Phone testing of percentage keypad.

Run locally with `npm test` (Node.js 20+; no external packages).

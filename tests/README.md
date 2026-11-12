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
- [ ] Home screen shows calculator display and four-column keypad.
- [ ] All keypad buttons have at least 48px touch height.
- [ ] Digits and operators append to the expression display.
- [ ] C clears the expression.
- [ ] Backspace removes the last character.
- [ ] Parentheses button alternates opening and closing parentheses.
- [ ] View steps opens the solution screen and carries the entered expression.
- [ ] Back returns to the calculator.
- [ ] Each sample step opens the explanation bottom sheet.
- [ ] Close button, backdrop tap, and Escape close the bottom sheet.
- [ ] Make it simpler toggles the simpler explanation panel.
- [ ] Equals does not display a fabricated answer; it clearly says solving comes in Phase 2.
- [ ] Updated app shell loads after service-worker cache version changes.

## Math engine
No math correctness tests exist yet because the deterministic math engine is intentionally out of scope until Phase 2.

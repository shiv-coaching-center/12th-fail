# Test Bank

## Rules
- Expected answers must come from an independent source (textbook answer key or hand-verified calculation), never from the application engine.
- Each case must include a source label or `UNVERIFIED`.
- Do not ship a topic until all of its tests pass.
- Run the full existing test suite after every engine change.
- Include edge cases such as zero, negatives, division by zero, large integers, and exact decimals where relevant.

## Phase 0 manual checklist
- [ ] Repository is public and default branch is `main`.
- [ ] App shell loads over HTTPS.
- [ ] No third-party scripts, fonts, APIs, analytics, or CDNs are requested.
- [ ] Manifest is readable and uses only local assets.
- [ ] Service worker installs and activates.
- [ ] Cache contains the complete app shell.
- [ ] After one successful online load, airplane-mode reload shows the app shell.

No math correctness tests exist yet because the math engine is intentionally out of scope for Phase 0.

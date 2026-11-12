# Changelog

सभी महत्वपूर्ण project changes यहाँ दर्ज किए जाएँगे।

## [0.2.0] - 2026-11-12

### Added
- Installable web app manifest and local SVG app icon.
- Responsive PWA foundation screen and local stylesheet.
- Service Worker registration and connection status.
- Versioned app-shell cache with offline navigation fallback.
- User-controlled Service Worker update prompt.
- GitHub Pages deployment workflow for the static site.
- Offline, update and cache-isolation verification checklist.

### Fixed
- Removed the previous Service Worker behavior that deleted every origin cache and unregistered itself.
- Cache cleanup is now limited to old `twelfth-fail-` app caches.

### Scope
- No solving engine, external API, AI/LLM, analytics, ads, CDN or external fonts.
- UI remains a foundation placeholder until Phase 1.


## 2026-11-12 — Phase 1 UI

- Replaced the PWA placeholder with a bilingual Maths / Physics / Chemistry workspace.
- Added expression entry, keypad, subject symbol strips, sheets, templates, and device-local 20-item history.
- Added hidden solution-preview route with explicit placeholder messaging; no solver or fabricated answers.
- Added responsive mobile styling, accessibility labels, and a thumb-reach sticky keypad.
- Bumped the app-shell cache version to v1.0.0.

- Embedded the original supplied app artwork as the PWA/browser icon and workspace brand mark.
- Restored Service Worker registration and the user-approved update banner in the new UI shell.
- Added pre-deploy checks for JavaScript syntax, manifest JSON, and SVG icon XML.

- Added a one-release compatibility bridge so the previous cached PWA shell can approve the first UI update safely.
- Updated app-shell cache version to v1.0.4.

- Finalized the first-update compatibility bridge for users still running the Phase 0 cached shell; cache version is now v1.0.5.


## 2026-11-12 — UI bug-fix pass

- Fixed native-keyboard mode so it hides the app keypad and quick-symbol strip, focuses the active subject input, and can be toggled back.
- Standardized local history retention to the latest 20 entries.
- Corrected Physics formula-sheet selection and added interactive displacement, velocity, and power formula previews.
- Guarded invalid Physics calculations so the UI never displays `NaN` as a result.
- Added a working, clearly labelled placeholder solution-preview route with no fabricated result.
- Added bottom-sheet backdrop dismissal and Escape-key dismissal.
- Updated responsive interaction and preview styles; no solving engine added.


## 2026-11-12 — Minimal UI pass (v1.3.0)

- Removed always-visible symbol strip, redundant menu/history icons, decorative labels, and duplicate formula/element controls.
- Added compact subject-specific tool toggles: Math (symbols/templates), Physics (symbols/formulas), Chemistry (symbols/formulas/elements).
- Kept reference tools inside the existing on-demand bottom sheet; no symbols, formulas, or element grids are shown until requested.
- Simplified status copy and calculator footer controls across all three subjects.
- No solver or backend logic added.


## 2026-11-12 — Header and tool button polish (v1.3.5)

- Kept the 12th Fail brand on one line on narrow mobile screens.
- Replaced plain default-looking tool buttons with compact, consistent icon-and-label controls.
- Tuned spacing around the tool row, calculator and footer for small screens.
- Preserved on-demand visibility and existing subject-specific tool behavior.


## 2026-11-12 — Phase 2.1: Maths numeric arithmetic

- Added a strict standalone parser with no eval() or external dependencies.
- Added arithmetic, parentheses, powers, percentages, constants and common math functions.
- Added visible answer and validation states to the Maths workspace.
- Explicitly rejects algebraic equations and unsupported variables instead of guessing.
- Added automated parser tests to pre-deploy checks and cached the engine for offline use.


## 2026-11-12 — Phase 2.2: Linear and Quadratic Algebra

- Added a safe polynomial parser for one-variable linear and quadratic equations.
- Added quadratic formula, discriminant classification, real/complex roots, and integer factorisation hints.
- Added readable Hindi solution steps in the result panel.
- Added automated algebra tests and pre-deploy validation.

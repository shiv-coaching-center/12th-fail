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

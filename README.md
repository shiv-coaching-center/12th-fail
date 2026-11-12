# 12th Fail

Offline-first Mathematics Learning PWA for students in classes 1–12.

## Project status

- Phase 0: PWA foundation
- Initial subject: Mathematics only
- Interface languages: Hindi and English
- Runtime: plain HTML, CSS, and JavaScript
- Hosting target: GitHub Pages
- Offline support: service-worker app-shell cache
- No AI, external APIs, analytics, ads, login, or external fonts

## Run locally

Serve this folder with any static HTTP server. Opening `index.html` directly with a `file://` URL does not enable service workers.

## Offline check

1. Open the deployed site once while online.
2. Wait for the app shell to finish loading and the service worker to activate.
3. Reload once while online.
4. Enable airplane mode and reopen/reload the site.
5. Confirm the app shell still appears.

## Project structure

- `index.html`: app entry point
- `style.css`: responsive, high-contrast styles
- `app.js`: UI bootstrap only; no math engine in Phase 0
- `manifest.json`: PWA metadata
- `sw.js`: versioned offline app-shell cache
- `icons/icon.svg`: scalable app icon
- `tests/README.md`: test policy and Phase 0 checklist
- `ARCHITECTURE.md`: architecture and trust boundaries
- `CHANGELOG.md`: project changes
- `.github/workflows/pages.yml`: GitHub Pages deployment workflow

## License

No license has been selected. All rights reserved by default unless a license is added later.

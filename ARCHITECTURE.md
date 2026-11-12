# Architecture

## Phase 0 boundary
12th Fail is a static, offline-first Progressive Web App. The initial release contains only the app shell. It does not calculate or solve mathematics yet.

## Runtime files
- `index.html`: semantic document structure and local asset references.
- `style.css`: responsive presentation, colors, and accessible touch sizing.
- `app.js`: connection status and service-worker registration only.
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

## Future math engine boundary
The math engine will be deterministic and isolated from presentation code. Every supported result must be verified before display. Student-facing explanations will be loaded from a reviewed static Hindi reason file. Unsupported or failed verification must return the fixed unsupported message.

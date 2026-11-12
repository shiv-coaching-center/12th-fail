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

# 12th Fail

एक bilingual (Hindi + English), offline-first Mathematics, Physics और Chemistry PWA.

## वर्तमान चरण

- Phase 0.1: Repository documentation और project structure
- Phase 0.2: PWA manifest, versioned offline cache और safe update flow
- Phase 0.3: वास्तविक GitHub Pages deployment और offline proof
- Phase 1: UI only
- Phase 2: Solving engine (अभी scope में नहीं)

## तकनीकी नियम

- Plain HTML, CSS और JavaScript
- कोई AI/LLM, analytics, ads या remote API नहीं
- कोई external font, CDN या remote image नहीं
- Phase 0 और Phase 1 में कोई solve/result engine नहीं
- History और usage counts भविष्य में केवल इसी device पर रहेंगे
- Service Worker केवल `twelfth-fail-` prefix वाले caches manage करेगा

## Development

यह repository GitHub Pages पर static site के रूप में deploy होती है। स्थानीय परीक्षण के लिए किसी static HTTP server का उपयोग करें। `file://` से खोलने पर Service Worker उपलब्ध नहीं होता।

## Project structure

```text
/
├── index.html
├── style.css
├── app.js
├── manifest.json
├── sw.js
├── icons/
│   └── icon.svg
├── tests/
│   └── README.md
├── .github/
│   └── workflows/
│       └── pages.yml
├── ARCHITECTURE.md
├── CHANGELOG.md
└── README.md
```

## Offline check

1. GitHub Pages URL को online खोलें और Service Worker install होने दें।
2. एक बार reload करें।
3. Airplane mode चालू करके app को दोबारा खोलें।
4. App shell और local assets दिखने चाहिए।

## Scope boundary

Phase 0 और Phase 1 में कोई गणितीय, भौतिक या रासायनिक उत्तर calculate नहीं होगा। Solve action केवल निर्धारित cannot-solve state दिखाएगा।

# 12th Fail

एक bilingual (Hindi + English), offline-first Mathematics, Physics और Chemistry PWA.

## वर्तमान चरण

- Phase 0.1: Repository documentation और project structure
- Phase 0.2: GitHub Pages + PWA foundation
- Phase 0.3: Offline verification
- Phase 1: UI only
- Phase 2: Solving engine (अभी scope में नहीं)

## तकनीकी नियम

- Plain HTML, CSS और JavaScript
- कोई AI/LLM, analytics, ads या remote API नहीं
- कोई external font, CDN या remote image नहीं
- उत्तर केवल भविष्य में स्वतंत्र रूप से verify होने पर दिखाया जाएगा
- History और usage counts केवल इसी device पर रहेंगे
- Service Worker cache versioned होगा और update flow पुरानी cache को सुरक्षित तरीके से हटाएगा

## Development

यह repository GitHub Pages पर static site के रूप में deploy होगी। स्थानीय परीक्षण के लिए किसी static HTTP server का उपयोग करें। `file://` से खोलने पर Service Worker उपलब्ध नहीं होता।

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
│   ├── README.md
│   └── input.test.js
├── .github/
│   └── workflows/
│       └── pages.yml
├── ARCHITECTURE.md
├── CHANGELOG.md
└── README.md
```

## Scope boundary

Phase 0 और Phase 1 में कोई गणितीय, भौतिक या रासायनिक उत्तर calculate नहीं होगा। Equals key केवल निर्धारित cannot-solve state दिखाएगी।

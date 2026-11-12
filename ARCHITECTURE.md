# Architecture

## Product

12th Fail एक single-page, mobile-first PWA है जिसमें गणित, भौतिक विज्ञान और रसायन विज्ञान के input modes होंगे। UI Hindi और English दोनों भाषाओं का समर्थन करेगा।

## Runtime

- Static HTML, CSS और JavaScript; कोई framework या build dependency आवश्यक नहीं।
- GitHub Pages hosting और relative asset paths ताकि repository Pages URL पर भी ऐप चले।
- System fonts only; सभी icons inline SVG या text symbols होंगे।
- कोई AI/LLM, analytics, ads, remote API, CDN या external font नहीं।

## Phase boundaries

### Phase 0: Foundation

Repository structure, GitHub Pages workflow, web app manifest, versioned Service Worker और offline app-shell verification।

### Phase 1: UI only

तीन subject modes, fixed keypad, subject-specific quick strip, symbol/formula/element sheets, keyboard mode, templates, on-device history और hidden solution preview route। कोई solving engine नहीं।

### Phase 2: Solving engine

यह चरण अलग अनुमति के बाद ही शुरू होगा। कोई result तब तक नहीं दिखेगा जब तक strict parsing और independent verification सफल न हों।

## Offline and update policy

- Cache name में explicit app version होगा।
- Install के दौरान आवश्यक same-origin app-shell assets cache होंगे।
- Activate के दौरान केवल इसी app के पुराने versioned caches हटेंगे; origin के दूसरे caches नहीं।
- नया worker उपलब्ध होने पर UI update सूचना देगा।
- उपयोगकर्ता के update स्वीकार करने पर नया worker activate होगा और page reload होगा।
- Cache या network failure को verified answer नहीं माना जाएगा।

## Local data

History के अधिकतम 20 प्रश्न और quick-strip usage counts device-local storage में रहेंगे। कोई personal input server पर नहीं भेजा जाएगा।

## Trust boundary

Phase 0 और Phase 1 में सभी solve actions cannot-solve state दिखाएँगे। कोई sample answer सामान्य route पर नहीं दिखेगा। Solution preview केवल hidden preview route पर होगा और स्पष्ट रूप से test-only रहेगा।

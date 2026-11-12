# Architecture

## Product

12th Fail एक mobile-first, bilingual (Hindi + English) learning PWA है। विषय: Mathematics, Physics और Chemistry.

## Runtime

- Static HTML, CSS और JavaScript; कोई framework या build dependency आवश्यक नहीं।
- GitHub Pages hosting और relative asset paths ताकि repository subpath पर भी ऐप चले।
- System fonts only; local SVG icons.
- कोई AI/LLM, analytics, ads, remote API, CDN या external font नहीं।

## Phase boundaries

### Phase 0: Foundation

Repository structure, GitHub Pages workflow, web app manifest, versioned Service Worker और offline app-shell verification।

### Phase 1: UI only

तीन subject modes, fixed keypad, subject-specific quick strip, symbol/formula/element sheets, keyboard mode, templates, on-device history और hidden solution preview route। कोई solving engine नहीं।

### Phase 2: Solving engine

यह चरण अलग अनुमति के बाद ही शुरू होगा। कोई result तब तक नहीं दिखेगा जब तक strict parsing और independent verification सफल न हों।

## Offline and update policy

- Cache name में explicit app version होगा: `twelfth-fail-v0.2.0`.
- Install के दौरान जरूरी same-origin app-shell assets cache होंगे।
- Activate के दौरान केवल `twelfth-fail-` prefix वाले पुराने caches हटेंगे।
- किसी दूसरे app या origin के caches delete नहीं होंगे।
- नया worker उपलब्ध होने पर UI update prompt दिखाएगा।
- नया worker तभी activate होगा जब उपयोगकर्ता Update चुनेगा।
- Navigation network-first है और offline में cached app shell fallback होगा।
- Local static assets cache-first हैं।
- Service Worker खुद को unregister नहीं करेगा।

## Local data

भविष्य की History और quick-strip usage counts device-local storage में रहेंगे। कोई personal input server पर नहीं भेजा जाएगा।

## Trust boundary

Phase 0 और Phase 1 में कोई solving engine नहीं होगा। Solve action verified result का दिखावा नहीं करेगा। कोई sample answer सामान्य route पर नहीं दिखेगा। Solution preview केवल hidden preview route पर होगा और स्पष्ट रूप से test-only रहेगा।


## Phase 1 UI surface

- Single-page workspace with Maths, Physics, and Chemistry subject tabs.
- Expression input and explicit cannot-solve state. The UI never invents an answer.
- Normal document-flow keypad; keyboard mode hides the app keypad and quick-symbol strip, then focuses the native keyboard.
- Subject-specific symbol strip, symbol/formula/chemistry element sheets, and sample templates.
- Last 20 questions stored only in localStorage on the device.
- `#preview-solution` UI route with verified-answer visual treatment, numbered step cards, a step-detail bottom sheet, and optional device-local speech only when a local voice exists. All preview content is explicitly marked as placeholder, not a real solution.
- Responsive layout target: 320–430px mobile widths; system fonts; no external assets or runtime network dependencies.


## Phase 2.1 — Mathematics arithmetic engine

- Strict, dependency-free parser for numeric arithmetic: addition, subtraction, multiplication, division, parentheses, powers, percentages, constants π/e, and sqrt, sin, cos, tan, log, ln, abs.
- No eval(), Function(), network calls, or external libraries.
- Algebraic variables and equations are explicitly rejected until a later algebra-solving phase.
- Parser guards input length, token count, nesting, division by zero, and non-finite results.
- Local Node test suite runs before every Pages deployment.


## Phase 2.2 — Linear and Quadratic Algebra

- Supports one-variable linear and quadratic equations in x or y, including parentheses, implicit multiplication, and constants on either side of a single equality.
- Uses a polynomial parser with degree capped at two; no eval() or external dependencies.
- Returns linear roots, quadratic roots via the quadratic formula, discriminant classification, and readable Hindi solution steps.
- Explicitly rejects higher-degree, mixed-variable, and unsupported equation forms.


## Phase 2.3 — LCM and HCF

- Supports LCM(...) and HCF(...) for 2–20 non-negative integer inputs up to 1,000,000,000.
- Uses BigInt for exact integer results, prime factorisation for LCM, and Euclidean algorithm for HCF.
- Displays readable Hindi working steps; rejects decimals, malformed inputs, oversized values and undefined HCF(0, 0).
- No eval(), network calls, or external dependencies.

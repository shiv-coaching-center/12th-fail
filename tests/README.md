# Phase 0.2 PWA verification

## Online install check

1. Open the deployed GitHub Pages URL over HTTPS.
2. Wait for the page to finish loading.
3. In browser site settings, confirm the service worker is registered.
4. Confirm the app manifest is detected and the app can be installed where supported.

## Offline proof

1. Open the app once while online and wait for the service worker to install.
2. Reload once while online so the page is controlled by the service worker.
3. Enable airplane mode.
4. Reload the same app URL.
5. Confirm the app shell, CSS, icon, and JavaScript status still load.

## Update check

1. Deploy a new app-shell version and update CACHE_VERSION in sw.js.
2. Open the site while online.
3. Confirm the new worker installs without immediately replacing the active worker.
4. Confirm the update prompt appears.
5. Select Update and confirm the new worker activates and the page reloads.

## Cache isolation

The service worker may delete only caches whose names start with `twelfth-fail-`. It must never clear unrelated origin caches or unregister itself.


## Phase 1 UI checks

- [ ] Load the workspace at 320px, 360px, 390px, and 430px viewport widths.
- [ ] Switch between Maths, Physics, and Chemistry; verify each subject strip changes.
- [ ] Insert keypad and quick-strip symbols at the cursor position.
- [ ] Switch to native keyboard mode; confirm the app keypad and quick-symbol strip are hidden and the correct subject input receives focus.
- [ ] Tap the keyboard toggle again; confirm the app keypad returns.
- [ ] Open More, Symbols, Formula sheet, Chemistry Elements, and Templates sheets; insert an item.
- [ ] Submit an expression; verify the UI shows the explicit "solver not included" state and never fabricates a numeric answer.
- [ ] Save more than 20 expressions; verify only the latest 20 remain in local history.
- [ ] Reload and confirm history persists on the same device; no account or network sync is used.
- [ ] Open `#preview-solution`; verify the placeholder disclaimer and numbered placeholder step cards; confirm no answer is presented as calculated.
- [ ] Confirm the supplied original app icon appears in the header and is referenced by the PWA manifest.
- [ ] Confirm the app remains usable offline after a successful online load.

- [ ] Confirm the app prompts before activating a waiting Service Worker update.


## Minimal UI checks (v1.3.0)
- [ ] On first load, no symbol chips, formula library, or element grid is visible.
- [ ] Maths shows only Symbols and Templates actions.
- [ ] Physics shows Symbols and Formulas actions; formula list opens only on demand and selecting a formula updates the fields.
- [ ] Chemistry shows Symbols, Formulas and Elements actions; each opens only on demand and selected items insert into the reaction input.
- [ ] Switching subjects updates the visible actions without leaving stale controls from the previous subject.
- [ ] Keypad, History, clear and keyboard controls remain usable.

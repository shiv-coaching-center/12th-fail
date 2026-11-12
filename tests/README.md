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

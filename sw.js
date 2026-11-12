/* 12th Fail service worker — verified BODMAS engine v6. */
"use strict";
const CACHE_NAME = "12th-fail-shell-v31";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css?v=0.4.1",
  "./app.js?v=0.4.4",
  "./math/engine.js?v=0.4.1",
  "./reasons_hi.json?v=0.4.0",
  "./manifest.json",
  "./icons/icon.svg",
  "./app-menu.css?v=1.0.1",
  "./app-menu.js?v=1.0.2",
  "./lcm-hcf.html",
  "./lcm-hcf.css?v=1.0.3",
  "./lcm-hcf.js?v=1.0.3",
  "./ratio-proportion.html",
  "./ratio-proportion.css?v=1.0.0",
  "./ratio-proportion.js?v=1.0.3",
  "./fractions.html",
  "./fractions.css?v=1.0.0",
  "./fractions.js?v=1.0.0"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith("12th-fail-") && key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // HTML navigation must be network-first so a published update is not hidden
  // behind an old app shell. If offline, fall back to the last cached page.
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
        }
        return response;
      }).catch(async () => {
        return (await caches.match(request)) || (await caches.match("./index.html")) ||
          new Response("ऑफलाइन पेज उपलब्ध नहीं", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      })
    );
    return;
  }

  // Versioned CSS/JS and other app assets remain cache-first for full offline use.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => new Response("", { status: 504, statusText: "Offline and not cached" }));
    })
  );
});

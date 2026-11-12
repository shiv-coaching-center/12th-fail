/* 12th Fail service worker — verified BODMAS engine v6. */
"use strict";
const CACHE_NAME = "12th-fail-shell-v10";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css?v=0.4.1",
  "./app.js?v=0.3.2",
  "./math/engine.js?v=0.2.1",
  "./reasons_hi.json?v=0.2.0",
  "./manifest.json",
  "./icons/icon.svg"
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

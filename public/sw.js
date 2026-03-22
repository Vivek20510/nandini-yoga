const CACHE_NAME = "ybn-meditation-cache-v3";
const PRECACHE_URLS = [
  "/",
  "/meditation",
  "/logo.png",
  "/meditation/ambient/rain.wav",
  "/meditation/ambient/tanpura.wav",
  "/meditation/audio/intro-arrive.mp3",
  "/meditation/audio/ground-body.mp3",
  "/meditation/audio/breath-soft-46.mp3",
  "/meditation/audio/breath-box.mp3",
  "/meditation/audio/transition-soften.mp3",
  "/meditation/audio/stress-release.mp3",
  "/meditation/audio/overthinking-clear.mp3",
  "/meditation/audio/sleep-rest.mp3",
  "/meditation/audio/morning-rise.mp3",
  "/meditation/audio/focus-center.mp3",
  "/meditation/audio/anger-cool.mp3",
  "/meditation/audio/basics-awareness.mp3",
  "/meditation/audio/closing-gratitude.mp3",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  const isMeditationAsset =
    url.pathname === "/meditation" ||
    url.pathname.startsWith("/meditation/ambient/") ||
    url.pathname.startsWith("/meditation/audio/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png");

  if (!isMeditationAsset) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});

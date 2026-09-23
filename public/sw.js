const CACHE_PREFIX = "play-lab-";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.registration.unregister()),
  );
});

self.addEventListener("fetch", () => {
  // Intentionally empty. This worker exists only to replace and retire
  // previously installed PLAY / LAB service workers.
});

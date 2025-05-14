const CACHE_NAME = "pwa-cache-v1";
const ASSETS_TO_CACHE = [
  "/pwa-demo/",
  "/pwa-demo/index.html",
  "/pwa-demo/css/styles.css",
  "/pwa-demo/js/app.js",
  "/pwa-demo/manifest.json",
  "/pwa-demo/images/icon-192x192.png",
];

// Install event - precache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - cache-first strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Message event - handle communication from clients
self.addEventListener("message", (event) => {
  // Update cache event - update cache when online (update all assets)
  if (event.data === "updateCache") {
    event.waitUntil(
      // Re-cache all assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log("Updating cache based on client request ✅");
        return Promise.all(
          ASSETS_TO_CACHE.map((url) => {
            return fetch(url)
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return cache.put(url, response);
              })
              .catch((error) => {
                console.error("Failed to update cache for:", url, error);
              });
          })
        );
      })
    );
  }
});

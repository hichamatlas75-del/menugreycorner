/**
 * GREY CORNER — WAITER SERVICE WORKER (waiter-sw.js)
 * Offline Asset Caching, Native Push Notifications & Keep-Alive Daemon
 */

const CACHE_NAME = "grey-waiter-cache-v1";
const OFFLINE_ASSETS = [
  "/waiter.html",
  "/waiter.css",
  "/waiter.js",
  "/images/logo-gold.webp",
  "/images/logo-gold.png",
  "/images/favicon.ico"
];

// Installation : mise en cache des assets essentiels
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("👷 [SW] Pre-caching offline waiter assets...");
      return cache.addAll(OFFLINE_ASSETS).catch((err) => {
        console.warn("⚠️ [SW] Failed to pre-cache some assets:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🧹 [SW] Clearing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch : Cache first avec fallback réseau pour les assets mis en cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isTargetAsset = OFFLINE_ASSETS.some((asset) => url.pathname.endsWith(asset));

  if (isTargetAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalider en arrière-plan (Stale-while-revalidate)
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
  }
});

// Gestion des événements PUSH (FCM & Système)
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "Grey Corner — Alerte Serveur", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "🔔 Grey Corner — Appel Serveur";
  const options = {
    body: data.body || data.message || "Nouvelle demande client en salle !",
    icon: "/images/logo-gold.png",
    badge: "/images/logo-gold.png",
    vibrate: [400, 150, 400, 150, 800],
    data: { url: "/waiter.html", ...data },
    tag: data.tag || "waiter-call-" + Date.now(),
    renotify: true,
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gestion du clic sur notification : focus ou ouverture de waiter.html
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/waiter.html";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("waiter.html") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Réponse aux messages KEEP_ALIVE
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "KEEP_ALIVE") {
    if (event.source && event.source.postMessage) {
      event.source.postMessage({
        type: "KEEP_ALIVE_ACK",
        status: "alive",
        timestamp: Date.now()
      });
    }
  }
});

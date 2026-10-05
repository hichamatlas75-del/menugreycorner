// ============================================================================
// GREY CORNER — WAITER SERVICE WORKER (waiter-sw.js)
// Rôle : Maintien du processus en arrière-plan, relais des notifications push
//        et cache offline pour l'interface serveur.
// ============================================================================

const SW_VERSION = "waiter-sw-v6.0";
const CACHE_NAME = SW_VERSION;

// Ressources statiques à mettre en cache pour fonctionnement offline
const STATIC_ASSETS = [
    "/waiter.html",
    "/waiter.css",
    "/waiter.js",
    "/images/logo-gold.png",
    "/images/android-chrome-192x192.png",
];

// ── INSTALL ────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
    console.log(`[${SW_VERSION}] Installation du service worker.`);
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch(() => {
                // Ne pas bloquer l'installation si une ressource manque
            });
        }).then(() => {
            // Forcer l'activation immédiate sans attendre la fermeture des anciens onglets
            return self.skipWaiting();
        })
    );
});

// ── ACTIVATE ───────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
    console.log(`[${SW_VERSION}] Service worker activé.`);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log(`[${SW_VERSION}] Suppression de l'ancien cache: ${name}`);
                        return caches.delete(name);
                    })
            );
        }).then(() => {
            // Prendre le contrôle immédiat de tous les clients (onglets/WebViews)
            return self.clients.claim();
        })
    );
});

// ── FETCH (Network-first avec fallback cache) ──────────────────────────────
self.addEventListener("fetch", (event) => {
    // Ignorer les requêtes non-GET et les requêtes Firebase/externes
    if (event.request.method !== "GET") return;
    const url = new URL(event.request.url);
    if (url.hostname !== self.location.hostname) return;

    const isHtmlOrJs = event.request.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith(".js");

    event.respondWith(
        fetch(event.request, isHtmlOrJs ? { cache: "no-cache" } : {})
            .then((response) => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});

// ── PUSH NOTIFICATIONS (FCM Push via WebPush) ──────────────────────────────
self.addEventListener("push", (event) => {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        data = { title: "🔔 Grey Corner", body: event.data ? event.data.text() : "Nouvel appel serveur" };
    }

    const title = data.title || "🔔 Grey Corner — Serveur";
    const options = {
        body: data.body || "Un client a besoin d'assistance.",
        icon: "/images/android-chrome-192x192.png",
        badge: "/images/android-chrome-192x192.png",
        vibrate: [400, 150, 400, 150, 800],
        tag: data.tag || "waiter-alert",
        renotify: true,
        requireInteraction: true,
        data: {
            url: data.url || "/waiter.html",
            callId: data.callId || null,
            type: data.type || "call"
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// ── NOTIFICATION CLICK ──────────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) || "/waiter.html";

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            // Si un onglet waiter.html est déjà ouvert, le mettre en focus
            for (const client of clientList) {
                if (client.url.includes("waiter") && "focus" in client) {
                    return client.focus().then((c) => c.navigate(targetUrl));
                }
            }
            // Sinon ouvrir un nouvel onglet
            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        })
    );
});

// ── MESSAGE depuis la page (keep-alive ping, skip waiting) ─────────────────
self.addEventListener("message", (event) => {
    if (!event.data) return;

    if (event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }

    if (event.data.type === "KEEP_ALIVE") {
        // Répondre au ping keep-alive pour confirmer que le SW est vivant
        if (event.source && event.source.postMessage) {
            event.source.postMessage({ type: "KEEP_ALIVE_ACK", timestamp: Date.now() });
        }
    }
});

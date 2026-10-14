/**
 * ============================================================================
 * GREY CORNER — FIREBASE CLOUD FUNCTIONS (Firestore Triggers)
 * Déclencheurs automatiques pour notifications FCM Serveurs en arrière-plan
 * ============================================================================
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

try {
    const serviceAccount = require("./serviceAccountKey.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (e) {
    admin.initializeApp();
}

/**
 * Récupère tous les tokens FCM des serveurs actuellement actifs dans Firestore
 */
async function getActiveWaiterTokens() {
    try {
        const snapshot = await admin.firestore().collection("waiter_fcm_tokens")
            .where("active", "==", true)
            .get();

        const tokenDocs = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data && data.token) {
                tokenDocs.push({ id: doc.id, token: data.token });
            }
        });
        return tokenDocs;
    } catch (e) {
        console.error("❌ Erreur lecture tokens serveurs:", e);
        return [];
    }
}

/**
 * Nettoie les tokens FCM devenus invalides ou désenregistrés
 */
async function cleanupInvalidTokens(failedTokenDocs) {
    if (!failedTokenDocs || failedTokenDocs.length === 0) return;
    const batch = admin.firestore().batch();
    failedTokenDocs.forEach(({ id }) => {
        const ref = admin.firestore().collection("waiter_fcm_tokens").doc(id);
        batch.update(ref, { active: false, unregisterReason: "invalid_or_expired" });
    });
    try {
        await batch.commit();
        console.log(`🧹 ${failedTokenDocs.length} token(s) obsolète(s) désactivé(s).`);
    } catch (e) {
        console.error("Erreur nettoyage tokens:", e);
    }
}

/**
 * TRIGGER 1 : Nouvel appel client (waiters_calls)
 */
exports.onWaiterCallCreated = functions.firestore
    .document("waiters_calls/{callId}")
    .onCreate(async (snap, context) => {
        const call = snap.data();
        if (!call) return null;

        const tableNum = call.table || "Inconnue";
        const typeLabels = {
            waiter: "Appel Serveur",
            water: "Besoin d'Eau",
            bill: "L'Addition"
        };
        const typeLabel = typeLabels[call.type] || "Appel";

        const waiterTokens = await getActiveWaiterTokens();
        if (waiterTokens.length === 0) {
            console.log("ℹ️ Aucun token de serveur enregistré pour l'appel.");
            return null;
        }

        const tokens = waiterTokens.map(t => t.token);
        const callTitle = `🔔 Table ${tableNum} — ${typeLabel}`;
        const callBody = `Demande reçue à ${new Date().toLocaleTimeString("fr-FR", { timeZone: "Africa/Casablanca" })}`;

        const multicastMessage = {
            tokens: tokens,
            data: {
                title: callTitle,
                body: callBody,
                callId: context.params.callId,
                docId: context.params.callId,
                table: String(tableNum),
                tableId: String(tableNum),
                type: String(call.type || "call"),
                url: "/waiter.html"
            },
            android: {
                priority: "high",
                ttl: 0
            },
            webpush: {
                headers: {
                    Urgency: "high"
                },
                notification: {
                    title: callTitle,
                    body: callBody,
                    icon: "/images/android-chrome-192x192.png",
                    badge: "/images/android-chrome-192x192.png",
                    vibrate: [500, 200, 500, 200, 1000],
                    requireInteraction: true,
                    tag: `call-${context.params.callId}`
                }
            }
        };

        try {
            const response = await admin.messaging().sendEachForMulticast(multicastMessage);
            console.log(`📡 Appel FCM envoyé: ${response.successCount} succès, ${response.failureCount} échecs.`);

            // Envoi de secours sur le topic "waiters" pour réveiller les APKs natives
            admin.messaging().send({
                topic: "waiters",
                data: multicastMessage.data,
                android: { priority: "high", ttl: 0 }
            }).catch(e => console.warn("Erreur broadcast topic waiters (call):", e));

            if (response.failureCount > 0) {
                const failed = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        const errCode = resp.error ? resp.error.code : "";
                        if (errCode === "messaging/registration-token-not-registered" || errCode === "messaging/invalid-registration-token") {
                            failed.push(waiterTokens[idx]);
                        }
                    }
                });
                await cleanupInvalidTokens(failed);
            }
        } catch (e) {
            console.error("❌ Erreur envoi FCM appel:", e);
        }

        return null;
    });

/**
 * TRIGGER 2 : Nouvelle précommande (pre_orders)
 */
exports.onPreOrderCreated = functions.firestore
    .document("pre_orders/{orderId}")
    .onCreate(async (snap, context) => {
        const order = snap.data();
        if (!order) return null;

        const tableNum = order.table || "Inconnue";
        const total = order.totalPrice || 0;
        const itemCount = Array.isArray(order.items) ? order.items.length : 0;
        const orderTitle = `👨‍🍳 Nouvelle Commande — Table ${tableNum}`;
        const orderBody = `Total : ${total} MAD (${itemCount} article${itemCount > 1 ? "s" : ""})`;

        const waiterTokens = await getActiveWaiterTokens();
        if (waiterTokens.length === 0) {
            console.log("ℹ️ Aucun token de serveur enregistré pour la précommande.");
            // Envoi de secours quand même sur le topic "waiters"
            admin.messaging().send({
                topic: "waiters",
                data: {
                    title: orderTitle,
                    body: orderBody,
                    orderId: context.params.orderId,
                    docId: context.params.orderId,
                    table: String(tableNum),
                    tableId: String(tableNum),
                    type: "order",
                    url: "/waiter.html"
                },
                android: { priority: "high", ttl: 0 }
            }).catch(() => {});
            return null;
        }

        const tokens = waiterTokens.map(t => t.token);
        const multicastMessage = {
            tokens: tokens,
            data: {
                title: orderTitle,
                body: orderBody,
                orderId: context.params.orderId,
                docId: context.params.orderId,
                table: String(tableNum),
                tableId: String(tableNum),
                type: "order",
                url: "/waiter.html"
            },
            android: {
                priority: "high",
                ttl: 0
            },
            webpush: {
                headers: {
                    Urgency: "high"
                },
                notification: {
                    title: orderTitle,
                    body: orderBody,
                    icon: "/images/android-chrome-192x192.png",
                    badge: "/images/android-chrome-192x192.png",
                    vibrate: [500, 200, 500, 200, 1000],
                    requireInteraction: true,
                    tag: `order-${context.params.orderId}`
                }
            }
        };

        try {
            const response = await admin.messaging().sendEachForMulticast(multicastMessage);
            console.log(`📡 Commande FCM envoyée: ${response.successCount} succès, ${response.failureCount} échecs.`);

            // Envoi de secours sur le topic "waiters" pour réveiller les APKs natives
            admin.messaging().send({
                topic: "waiters",
                data: multicastMessage.data,
                android: { priority: "high", ttl: 0 }
            }).catch(e => console.warn("Erreur broadcast topic waiters (order):", e));

            if (response.failureCount > 0) {
                const failed = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        const errCode = resp.error ? resp.error.code : "";
                        if (errCode === "messaging/registration-token-not-registered" || errCode === "messaging/invalid-registration-token") {
                            failed.push(waiterTokens[idx]);
                        }
                    }
                });
                await cleanupInvalidTokens(failed);
            }
        } catch (e) {
            console.error("❌ Erreur envoi FCM précommande:", e);
        }

        return null;
    });

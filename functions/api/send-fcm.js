/**
 * ============================================================================
 * GREY CORNER — CLOUDFLARE PAGES FUNCTION : FCM HTTP v1 DISPATCHER
 * Route : POST /api/send-fcm
 * ============================================================================
 * Envoie des notifications Push vers l'API Google Firebase Cloud Messaging v1
 * aux smartphones des serveurs même si l'application est totalement FERMÉE.
 */

// Helper : Convertit une clé PEM RSA en ArrayBuffer pour Web Crypto
function pemToArrayBuffer(pem) {
    const cleanPem = pem
        .replace(/-----BEGIN[ A-Z_-]+-----/g, "")
        .replace(/-----END[ A-Z_-]+-----/g, "")
        .replace(/\s+/g, "");
    const binary = atob(cleanPem);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
}

// Helper : Base64URL encoder
function base64UrlEncode(str) {
    const b64 = typeof str === "string" ? btoa(str) : btoa(String.fromCharCode(...new Uint8Array(str)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Génère un jeton Google OAuth2 Bearer via l'API Web Crypto (RS256)
async function getGoogleOAuth2Token(serviceAccount) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const claimSet = {
        iss: serviceAccount.client_email,
        scope: "https://www.googleapis.com/auth/firebase.messaging https://www.googleapis.com/auth/datastore",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaim = base64UrlEncode(JSON.stringify(claimSet));
    const unsignedToken = `${encodedHeader}.${encodedClaim}`;

    const keyBuffer = pemToArrayBuffer(serviceAccount.private_key);
    const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        keyBuffer,
        { name: "RSASSA-PKPKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signature = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        cryptoKey,
        new TextEncoder().encode(unsignedToken)
    );

    const jwt = `${unsignedToken}.${base64UrlEncode(signature)}`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwt
        })
    });

    if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        throw new Error(`Google OAuth2 error (${tokenRes.status}): ${errText}`);
    }

    const tokenData = await tokenRes.json();
    return tokenData.access_token;
}

// Récupère les tokens FCM enregistrés dans Firestore via l'API REST
async function getActiveWaiterTokens(projectId, accessToken) {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/waiter_fcm_tokens`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) {
        console.warn(`Firestore tokens read status: ${res.status}`);
        return [];
    }

    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) return [];

    const tokens = [];
    data.documents.forEach((doc) => {
        const fields = doc.fields || {};
        const isActive = fields.active ? fields.active.booleanValue : true;
        const token = fields.token ? fields.token.stringValue : null;
        if (isActive && token) {
            tokens.push({ token, name: doc.name });
        }
    });

    return tokens;
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const payload = await request.json();
        const { type, title, body, tableId, docId } = payload;

        // Récupérer le compte de service depuis la variable secrète Cloudflare Pages
        let serviceAccount = null;
        if (env && env.FIREBASE_SERVICE_ACCOUNT) {
            try {
                serviceAccount = typeof env.FIREBASE_SERVICE_ACCOUNT === "string"
                    ? JSON.parse(env.FIREBASE_SERVICE_ACCOUNT)
                    : env.FIREBASE_SERVICE_ACCOUNT;
            } catch (e) {
                console.warn("⚠️ Erreur de parsing de FIREBASE_SERVICE_ACCOUNT:", e);
            }
        }

        if (!serviceAccount) {
            return new Response(JSON.stringify({
                status: "skipped",
                message: "FIREBASE_SERVICE_ACCOUNT secret not configured in Cloudflare Pages. Push queued for client/firebase fallback."
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        const projectId = serviceAccount.project_id || "grey-corner-restaurant";
        const accessToken = await getGoogleOAuth2Token(serviceAccount);
        const waiterTokens = await getActiveWaiterTokens(projectId, accessToken);

        if (waiterTokens.length === 0) {
            return new Response(JSON.stringify({
                status: "ok",
                sent: 0,
                message: "No active waiter device registered in Firestore yet."
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        const results = await Promise.all(
            waiterTokens.map(async ({ token }) => {
                const fcmUrl = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
                const message = {
                    message: {
                        token: token,
                        notification: {
                            title: title || "🔔 Grey Corner — Appel Serveur",
                            body: body || `Table ${tableId} sollicite le service.`
                        },
                        data: {
                            type: String(type || "call"),
                            tableId: String(tableId || ""),
                            docId: String(docId || ""),
                            url: "/waiter.html"
                        },
                        webpush: {
                            headers: {
                                Urgency: "high"
                            },
                            notification: {
                                icon: "/images/android-chrome-192x192.png",
                                badge: "/images/android-chrome-192x192.png",
                                vibrate: [500, 200, 500, 200, 1000],
                                tag: `waiter-${type}-${tableId || Date.now()}`,
                                renotify: true,
                                requireInteraction: true
                            }
                        }
                    }
                };

                const pushRes = await fetch(fcmUrl, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(message)
                });

                return pushRes.ok;
            })
        );

        const successCount = results.filter(Boolean).length;

        return new Response(JSON.stringify({
            status: "success",
            sent: successCount,
            total: waiterTokens.length
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        console.error("❌ Erreur traitement /api/send-fcm:", err);
        return new Response(JSON.stringify({ error: err.message || String(err) }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

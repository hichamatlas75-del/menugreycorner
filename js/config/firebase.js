/**
 * ============================================================================
 * GREY CORNER — FIREBASE CONFIGURATION & DUAL-MODE SERVICE LAYER (ES Module)
 * ============================================================================
 */

export const firebaseConfig = {
    apiKey: "AIzaSyAoINLpUCCic9Xz9_PnM3al9Iu69q1FQpY",
    authDomain: "grey-corner-restaurant.firebaseapp.com",
    projectId: "grey-corner-restaurant",
    storageBucket: "grey-corner-restaurant.firebasestorage.app",
    messagingSenderId: "251703175568",
    appId: "1:251703175568:web:8d693adc297eb869d12b15",
    measurementId: "G-3HVHB0EELC"
};

export let isFirebaseActive = false;
export let db = null;

function hasValidFirebaseKeys() {
    return true;
}

if (typeof firebase !== "undefined" && hasValidFirebaseKeys()) {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        db.enablePersistence({ synchronizeTabs: true }).catch(err => {
            console.warn("⚠️ Persistence disabled:", err.code);
        });
        isFirebaseActive = true;
        console.log("🔥 Firebase Connected");
    } catch (e) {
        console.error("❌ Firebase Init Error:", e);
        isFirebaseActive = false;
    }
} else {
    console.log("ℹ️ Simulation Mode Active");
}

let _authReady = false;
let _authReadyQueue = [];

export function whenAuthReady(fn) {
    if (_authReady) {
        fn();
    } else {
        _authReadyQueue.push(fn);
    }
}

if (isFirebaseActive && typeof firebase !== "undefined") {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            _authReady = true;
            console.log("🔓 Auth anonyme OK — UID:", user.uid);
            _authReadyQueue.forEach(fn => { try { fn(); } catch(e) { console.error(e); } });
            _authReadyQueue = [];
        }
    });

    firebase.auth().signInAnonymously()
        .catch(e => console.warn("⚠️ signInAnonymously échoué:", e));
} else {
    _authReady = true;
}

const SIM_CHANNEL = "grey_corner_restaurant_channel";
const simBroadcast = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(SIM_CHANNEL) : null;

const DEFAULT_WAITERS = [
    { id: "karim", name: "Karim", email: "karim@greycorner.com", active: true },
    { id: "yassine", name: "Yassine", email: "yassine@greycorner.com", active: true }
];

const DEFAULT_TABLES = {};
const allTablesList = [
    ...Array.from({ length: 15 }, (_, i) => 101 + i), // Salle 101-115
    ...Array.from({ length: 19 }, (_, i) => 201 + i), // Loge 201-219
    ...Array.from({ length: 23 }, (_, i) => 301 + i)  // Terrasse 301-323
];
allTablesList.forEach((num, idx) => {
    DEFAULT_TABLES[num] = {
        tableNumber: num,
        assignedTo: idx % 2 === 0 ? "karim" : "yassine",
        active: true
    };
});

export function getLocalCollection(name, defaultVal = []) {
    const val = localStorage.getItem(`sim_${name}`);
    if (!val) {
        localStorage.setItem(`sim_${name}`, JSON.stringify(defaultVal));
        return defaultVal;
    }
    try {
        return JSON.parse(val);
    } catch (e) {
        console.error("❌ JSON Parse Error:", name);
        return defaultVal;
    }
}

export function setLocalCollection(name, data) {
    localStorage.setItem(`sim_${name}`, JSON.stringify(data));
    if (simBroadcast) {
        simBroadcast.postMessage({ type: "SYNC", collection: name, data: data });
    }
    if (typeof dbService !== "undefined" && dbService._simListeners) {
        dbService._simListeners.forEach(listener => {
            try { listener(name, data); } catch (e) { console.error(e); }
        });
    }
}


export function normalizePhone(rawPhone) {
    if (!rawPhone) return "";
    let clean = String(rawPhone).replace(/[^\d+]/g, "").trim();
    if (clean.startsWith("+212")) {
        clean = "0" + clean.substring(4);
    } else if (clean.startsWith("212")) {
        clean = "0" + clean.substring(3);
    } else if (clean.startsWith("00212")) {
        clean = "0" + clean.substring(5);
    }
    clean = clean.replace(/\D/g, "");
    return clean;
}
if (!isFirebaseActive) {
    getLocalCollection("waiters", DEFAULT_WAITERS);
    getLocalCollection("tables", DEFAULT_TABLES);
    getLocalCollection("calls", []);
    getLocalCollection("pre_orders", []);
    getLocalCollection("loyalty_members", []);
    getLocalCollection("loyalty_transactions", []);
    getLocalCollection("loyalty_settings", { rewardThreshold: 500, welcomeBonus: 50, pointsPerDH: 1 });
}

export function getTableZoneName(tableNum) {
    const num = parseInt(tableNum, 10);
    if (isNaN(num)) return `Table ${tableNum}`;
    if (num >= 101 && num <= 115) return `Salle (Table ${num})`;
    if (num >= 201 && num <= 219) return `Loge (Table ${num})`;
    if (num >= 301 && num <= 323) return `Terrasse (Table ${num})`;
    return `Table ${num}`;
}

export const FIREBASE_VAPID_KEY = "BO5FSWfM-nUZt6OZV4uGCbTmEi_dErg_FCVW52oxYi8Y__v0dBreH3KTY1Eo4NjzhZ83g09dESoSlegDI3vBH1I";
if (typeof window !== "undefined") {
    window.FIREBASE_VAPID_KEY = FIREBASE_VAPID_KEY;
}

export const WORKER_URL = "https://greycorner-fcm.hichamatlas75.workers.dev";
export const WORKER_SECRET = "greycorner_secure_2026";

export function sendFcmToWaiters(type, title, body, tableId, docId) {
    if (typeof fetch === "undefined") return;

    const payload = {
        type: type,
        title: title,
        body: body,
        table: String(tableId),
        tableId: String(tableId),
        docId: String(docId)
    };

    // 1. Appel du Worker Cloudflare opérationnel (greycorner-fcm)
    fetch(WORKER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${WORKER_SECRET}`
        },
        body: JSON.stringify(payload)
    }).then(res => {
        if (res.ok) {
            console.log("🚀 FCM Push relayé avec succès via greycorner-fcm Worker");
        } else {
            console.warn("⚠️ Worker greycorner-fcm a renvoyé:", res.status, "— repli sur /api/send-fcm");
            fetch("/api/send-fcm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).catch(() => {});
        }
    }).catch(err => {
        console.warn("⚠️ Échec réseau greycorner-fcm:", err.message, "— repli sur /api/send-fcm");
        fetch("/api/send-fcm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).catch(() => {});
    });
}

export const dbService = {
    isCloud() { return isFirebaseActive; },
    getWaiters(callback) { return this.onWaitersChange(callback); },
    getTables(callback) { return this.onTablesChange(callback); },
    _simListeners: [],
    registerSimListener(cb) { this._simListeners.push(cb); },
    initSimBroadcastListener() {
        if (simBroadcast) {
            simBroadcast.onmessage = (e) => {
                if (e.data && e.data.type === "SYNC") {
                    this._simListeners.forEach(cb => {
                        try { cb(e.data.collection, e.data.data); } catch (err) { console.error(err); }
                    });
                }
            };
        }
        window.addEventListener("storage", (e) => {
            if (e.key && e.key.startsWith("sim_")) {
                const colName = e.key.replace("sim_", "");
                try {
                    const data = JSON.parse(e.newValue || "[]");
                    this._simListeners.forEach(cb => {
                        try { cb(colName, data); } catch (err) { console.error(err); }
                    });
                } catch (err) {}
            }
        });
    },
    onWaitersChange(callback) {
        if (isFirebaseActive) {
            return db.collection("waiters").onSnapshot(snapshot => {
                const waiters = [];
                snapshot.forEach(doc => waiters.push({ id: doc.id, ...doc.data() }));
                callback(waiters);
            }, err => console.error("❌ Waiters stream error:", err));
        } else {
            callback(getLocalCollection("waiters"));
            this.registerSimListener((col, data) => { if (col === "waiters") callback(data); });
            return () => {};
        }
    },
    onTablesChange(callback) {
        if (isFirebaseActive) {
            return db.collection("tables").onSnapshot(snapshot => {
                const tables = {};
                snapshot.forEach(doc => { tables[doc.id] = doc.data(); });
                callback(tables);
            }, err => console.error("❌ Tables stream error:", err));
        } else {
            callback(getLocalCollection("tables"));
            this.registerSimListener((col, data) => { if (col === "tables") callback(data); });
            return () => {};
        }
    },
    assignTable(tableId, waiterId, callback) {
        const data = {
            tableNumber: parseInt(tableId),
            assignedTo: waiterId,
            active: true,
            lastUpdated: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
        };
        if (isFirebaseActive) {
            db.collection("tables").doc(String(tableId)).set(data, { merge: true })
                .then(() => { if (callback) callback(true); })
                .catch(e => { console.error(e); if (callback) callback(false); });
        } else {
            const tables = getLocalCollection("tables");
            tables[tableId] = data;
            setLocalCollection("tables", tables);
            if (callback) callback(true);
        }
    },
    sendCall(tableId, type, extraData, callback) {
        if (typeof extraData === "function") {
            callback = extraData;
            extraData = null;
        }
        whenAuthReady(() => {
            const execute = (waiterId) => {
                const data = {
                    table: parseInt(tableId),
                    assignedTo: waiterId || "",
                    type: type,
                    status: "pending",
                    createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
                    acceptedAt: null,
                    completedAt: null,
                    ...(extraData || {})
                };
                if (isFirebaseActive) {
                    db.collection("waiters_calls").add(data)
                        .then(docRef => {
                            const zoneName = getTableZoneName(tableId);
                            const typeLabels = { waiter: "Appel Serveur", water: "Besoin d'Eau", bill: "L'Addition", reward: "🎁 Consommation Gratuite (500 pts)" };
                            const typeLabel = typeLabels[type] || "Appel";
                            sendFcmToWaiters("CALL", `🔔 ${typeLabel} : ${zoneName}`, `Table ${tableId} demande de l'assistance`, tableId, docRef.id);

                            // Mirror to 'waiter_calls' for Android native APK background poller compatibility
                            try {
                                db.collection("waiter_calls").doc(docRef.id).set({
                                    ...data,
                                    id: docRef.id
                                }).catch(() => {});
                            } catch (e) {
                                console.warn("Mirroring call to waiter_calls failed:", e);
                            }

                            // Notification de secours à 25s si l'appel est toujours en attente
                            setTimeout(() => {
                                if (isFirebaseActive && db) {
                                    db.collection("waiters_calls").doc(docRef.id).get().then(snap => {
                                        if (snap.exists && snap.data() && snap.data().status === "pending") {
                                            console.log("🚨 RAPPEL DE SECOURS (25s) : Appel table toujours en attente !");
                                            sendFcmToWaiters("CALL", `⚠️ RAPPEL DE SECOURS — ${zoneName}`, `Table ${tableId} attend toujours (${typeLabel})`, tableId, docRef.id);
                                        }
                                    }).catch(() => {});
                                }
                            }, 25000);

                            if (callback) callback(true, docRef.id);
                        })
                        .catch(e => { console.error(e); if (callback) callback(false); });
                } else {
                    const calls = getLocalCollection("calls");
                    const id = "call_" + Math.random().toString(36).substring(2, 9);
                    calls.push({ id, ...data });
                    setLocalCollection("calls", calls);
                    if (callback) callback(true, id);
                }
            };
            if (isFirebaseActive) {
                db.collection("tables").doc(String(tableId)).get()
                    .then(doc => { execute(doc.exists ? doc.data().assignedTo : ""); })
                    .catch(() => execute(""));
            } else {
                const tables = getLocalCollection("tables");
                execute(tables[tableId] ? tables[tableId].assignedTo : "");
            }
        });
    },
    onSingleCallChange(callId, callback) {
        if (!callId) return () => {};
        if (isFirebaseActive && db) {
            return db.collection("waiters_calls").doc(String(callId))
                .onSnapshot(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        callback({
                            id: doc.id,
                            ...data,
                            createdAt: data.createdAt ? (typeof data.createdAt.toDate === "function" ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
                        });
                    }
                }, err => console.warn("Single call stream error:", err));
        } else {
            const check = () => {
                const calls = getLocalCollection("calls");
                const found = calls.find(c => String(c.id) === String(callId));
                if (found) callback(found);
            };
            check();
            this.registerSimListener(col => { if (col === "calls") check(); });
            return () => {};
        }
    },
    onCallsChange(callback) {
        if (isFirebaseActive) {
            const activeCallsMap = new Map();
            const emit = () => {
                const calls = Array.from(activeCallsMap.values());
                calls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                callback(calls);
            };

            const unsubWaiters = db.collection("waiters_calls")
                .orderBy("createdAt", "desc")
                .limit(50)
                .onSnapshot(snapshot => {
                    activeCallsMap.clear();
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        activeCallsMap.set(doc.id, {
                            id: doc.id,
                            ...data,
                            createdAt: data.createdAt ? (typeof data.createdAt.toDate === "function" ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
                        });
                    });
                    emit();
                }, err => console.error("❌ Calls stream error (waiters_calls):", err));

            // Sync from waiter_calls in case native Android APK accepted via notification
            const unsubNative = db.collection("waiter_calls")
                .orderBy("createdAt", "desc")
                .limit(50)
                .onSnapshot(snapshot => {
                    let hasChange = false;
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const existing = activeCallsMap.get(doc.id);
                        if (existing && existing.status !== data.status) {
                            existing.status = data.status;
                            if (data.assignedTo) existing.assignedTo = data.assignedTo;
                            hasChange = true;
                            // Propagate back to waiters_calls
                            db.collection("waiters_calls").doc(doc.id).update({
                                status: data.status,
                                assignedTo: data.assignedTo || existing.assignedTo || ""
                            }).catch(() => {});
                        }
                    });
                    if (hasChange) emit();
                }, () => {});

            return () => {
                unsubWaiters();
                unsubNative();
            };
        } else {
            const trigger = () => {
                const calls = getLocalCollection("calls");
                calls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                callback(calls);
            };
            trigger();
            this.registerSimListener(col => { if (col === "calls") trigger(); });
            return () => {};
        }
    },
    updateCallStatus(callId, status, waiterId, callback) {
        if (typeof waiterId === "function") { callback = waiterId; waiterId = null; }
        const updateData = {
            status: status,
            acceptedAt: status === "accepted" ? (isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()) : null,
            completedAt: status === "completed" ? (isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()) : null
        };
        if (waiterId) updateData.assignedTo = waiterId;
        if (isFirebaseActive) {
            db.collection("waiters_calls").doc(callId).update(updateData)
                .then(() => {
                    try {
                        db.collection("waiter_calls").doc(callId).update(updateData).catch(() => {});
                    } catch (e) {}
                    if (callback) callback(true);
                })
                .catch(e => { console.error(e); if (callback) callback(false); });
        } else {
            const calls = getLocalCollection("calls");
            const idx = calls.findIndex(c => c.id === callId);
            if (idx !== -1) {
                calls[idx] = { ...calls[idx], ...updateData };
                setLocalCollection("calls", calls);
                if (callback) callback(true);
            } else { if (callback) callback(false); }
        }
    },
    sendPreOrder(tableId, items, note, totalPrice, loyaltyInfo, callback) {
        if (typeof loyaltyInfo === "function") {
            callback = loyaltyInfo;
            loyaltyInfo = null;
        }
        whenAuthReady(() => {
            const execute = (waiterId) => {
                const data = {
                    table: parseInt(tableId),
                    assignedTo: waiterId || "",
                    items: items,
                    note: note || "",
                    totalPrice: parseFloat(totalPrice),
                    status: "pending",
                    createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
                    acceptedAt: null,
                    loyaltyPhone: loyaltyInfo && loyaltyInfo.phone ? loyaltyInfo.phone : "",
                    loyaltyName: loyaltyInfo && loyaltyInfo.name ? loyaltyInfo.name : "",
                    loyaltyPoints: loyaltyInfo && typeof loyaltyInfo.points === "number" ? loyaltyInfo.points : null
                };
                if (isFirebaseActive) {
                    db.collection("pre_orders").add(data)
                        .then(docRef => {
                            const zoneName = getTableZoneName(tableId);
                            let itemsSummary = "";
                            if (Array.isArray(items) && items.length > 0) {
                                const preview = items.slice(0, 3).map(it => `${it.qty || 1}x ${it.name || "Article"}`).join(", ");
                                const extra = items.length > 3 ? ` (+${items.length - 3})` : "";
                                itemsSummary = `${preview}${extra} • `;
                            }
                            sendFcmToWaiters("PRE_ORDER", `👨‍🍳 Nouvelle Précommande : ${zoneName}`, `${itemsSummary}Total : ${totalPrice} MAD`, tableId, docRef.id);
                            if (callback) callback(true, docRef.id);
                        })
                        .catch(e => { console.error(e); if (callback) callback(false); });
                } else {
                    const orders = getLocalCollection("pre_orders");
                    const id = "order_" + Math.random().toString(36).substring(2, 9);
                    orders.push({ id, ...data });
                    setLocalCollection("pre_orders", orders);
                    if (callback) callback(true, id);
                }
            };
            if (isFirebaseActive) {
                db.collection("tables").doc(String(tableId)).get()
                    .then(doc => { execute(doc.exists ? doc.data().assignedTo : ""); })
                    .catch(() => execute(""));
            } else {
                const tables = getLocalCollection("tables");
                execute(tables[tableId] ? tables[tableId].assignedTo : "");
            }
        });
    },
    onSinglePreOrderChange(orderId, callback) {
        if (!orderId) return () => {};
        if (isFirebaseActive && db) {
            return db.collection("pre_orders").doc(String(orderId))
                .onSnapshot(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        callback({
                            id: doc.id,
                            ...data,
                            createdAt: data.createdAt ? (typeof data.createdAt.toDate === "function" ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
                        });
                    }
                }, err => console.warn("Single pre_order stream error:", err));
        } else {
            const check = () => {
                const orders = getLocalCollection("pre_orders");
                const found = orders.find(o => String(o.id) === String(orderId));
                if (found) callback(found);
            };
            check();
            this.registerSimListener(col => { if (col === "pre_orders") check(); });
            return () => {};
        }
    },
    onPreOrdersChange(callback) {
        if (isFirebaseActive) {
            return db.collection("pre_orders")
                .orderBy("createdAt", "desc")
                .limit(50)
                .onSnapshot(snapshot => {
                    const orders = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        orders.push({
                            id: doc.id,
                            ...data,
                            createdAt: data.createdAt ? (typeof data.createdAt.toDate === "function" ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
                        });
                    });
                    callback(orders);
                }, err => console.error("❌ PreOrders stream error:", err));
        } else {
            const trigger = () => {
                const orders = getLocalCollection("pre_orders");
                orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                callback(orders);
            };
            trigger();
            this.registerSimListener(col => { if (col === "pre_orders") trigger(); });
            return () => {};
        }
    },
    updatePreOrderStatus(orderId, status, waiterId, callback) {
        if (typeof waiterId === "function") { callback = waiterId; waiterId = null; }
        const updateData = {
            status: status,
            acceptedAt: status === "accepted" ? (isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()) : null
        };
        if (waiterId) updateData.assignedTo = waiterId;
        if (isFirebaseActive) {
            db.collection("pre_orders").doc(orderId).update(updateData)
                .then(() => { if (callback) callback(true); })
                .catch(e => { console.error(e); if (callback) callback(false); });
        } else {
            const orders = getLocalCollection("pre_orders");
            const idx = orders.findIndex(o => o.id === orderId);
            if (idx !== -1) {
                orders[idx] = { ...orders[idx], ...updateData };
                setLocalCollection("pre_orders", orders);
                if (callback) callback(true);
            } else { if (callback) callback(false); }
        }
    },
    onSystemFreezeChange(callback) {
        if (isFirebaseActive) {
            return db.collection("system").doc("config")
                .onSnapshot(doc => {
                    const frozen = doc.exists && doc.data() && doc.data().frozen === true;
                    callback(frozen);
                }, err => console.error("❌ SystemFreeze stream error:", err));
        } else {
            const trigger = () => {
                const config = getLocalCollection("system_config", { frozen: false });
                callback(config.frozen === true);
            };
            trigger();
            this.registerSimListener(col => { if (col === "system_config") trigger(); });
            return () => {};
        }
    },
    setSystemFreeze(frozen, callback) {
        if (isFirebaseActive) {
            db.collection("system").doc("config").set({
                frozen: frozen,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true })
                .then(() => { if (callback) callback(true); })
                .catch(e => { console.error("❌ Freeze Error:", e); if (callback) callback(false, e.message || String(e)); });
        } else {
            setLocalCollection("system_config", { frozen: frozen, updatedAt: new Date().toISOString() });
            if (callback) callback(true);
        }
    },
    cleanupOldData(callback) {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (isFirebaseActive && db) {
            db.collection("waiters_calls").where("createdAt", "<", cutoff).limit(400).get()
                .then(snapshot => {
                    if (snapshot.empty) return;
                    const batch = db.batch();
                    snapshot.forEach(doc => batch.delete(doc.ref));
                    return batch.commit();
                })
                .then(() => db.collection("waiter_calls").where("createdAt", "<", cutoff).limit(400).get())
                .then(snapshot => {
                    if (!snapshot || snapshot.empty) return;
                    const batch = db.batch();
                    snapshot.forEach(doc => batch.delete(doc.ref));
                    return batch.commit();
                })
                .then(() => db.collection("pre_orders").where("createdAt", "<", cutoff).limit(400).get())
                .then(snapshot => {
                    if (!snapshot || snapshot.empty) return;
                    const batch = db.batch();
                    snapshot.forEach(doc => batch.delete(doc.ref));
                    return batch.commit();
                })
                .then(() => { if (callback) callback(true); })
                .catch(e => { console.error("❌ Cleanup error:", e); if (callback) callback(false); });
        } else {
            const calls = getLocalCollection("calls").filter(c => new Date(c.createdAt) >= cutoff);
            setLocalCollection("calls", calls);
            const orders = getLocalCollection("pre_orders").filter(o => new Date(o.createdAt) >= cutoff);
            setLocalCollection("pre_orders", orders);
            if (callback) callback(true);
        }
    },
    getLoyaltyMember(rawPhone, callback) {
        const phone = normalizePhone(rawPhone);
        if (!phone) { if (callback) callback(null); return; }

        const checkLocal = () => {
            const members = getLocalCollection("loyalty_members", []);
            const found = members.find(m => m.phone === phone);
            if (found) return { ...found };
            const storedPhone = typeof localStorage !== "undefined" ? localStorage.getItem("gc_loyalty_phone") : null;
            if (storedPhone === phone) {
                return {
                    phone: phone,
                    firstName: localStorage.getItem("gc_loyalty_name") || "Client",
                    points: parseInt(localStorage.getItem("gc_loyalty_pts")) || 50,
                    totalEarned: 50,
                    rewardsClaimed: 0,
                    source: "qr_menu"
                };
            }
            return null;
        };

        if (isFirebaseActive && db) {
            whenAuthReady(() => {
                db.collection("loyalty_members").doc(phone).get()
                    .then(doc => {
                        if (doc.exists) {
                            const data = { phone: doc.id, ...doc.data() };
                            const members = getLocalCollection("loyalty_members", []);
                            const idx = members.findIndex(m => m.phone === phone);
                            if (idx >= 0) members[idx] = data; else members.push(data);
                            setLocalCollection("loyalty_members", members);
                            if (callback) callback(data);
                        } else {
                            if (callback) callback(checkLocal());
                        }
                    })
                    .catch(err => {
                        console.warn("⚠️ getLoyaltyMember Firestore error (repli local):", err.message || err);
                        if (callback) callback(checkLocal());
                    });
            });
        } else {
            if (callback) callback(checkLocal());
        }
    },
    onLoyaltyMemberChange(rawPhone, callback) {
        const phone = normalizePhone(rawPhone);
        if (!phone) return () => {};

        const checkLocal = () => {
            const members = getLocalCollection("loyalty_members", []);
            const found = members.find(m => m.phone === phone);
            if (found) { callback(found); return; }
            const storedPhone = typeof localStorage !== "undefined" ? localStorage.getItem("gc_loyalty_phone") : null;
            if (storedPhone === phone) {
                callback({
                    phone: phone,
                    firstName: localStorage.getItem("gc_loyalty_name") || "Client",
                    points: parseInt(localStorage.getItem("gc_loyalty_pts")) || 50,
                    totalEarned: 50,
                    rewardsClaimed: 0,
                    source: "qr_menu"
                });
            }
        };

        if (isFirebaseActive && db) {
            let unsub = () => {};
            whenAuthReady(() => {
                unsub = db.collection("loyalty_members").doc(phone)
                    .onSnapshot(doc => {
                        if (doc.exists) {
                            const data = { phone: doc.id, ...doc.data() };
                            callback(data);
                        } else {
                            checkLocal();
                        }
                    }, err => {
                        console.warn("⚠️ onLoyaltyMemberChange error (repli local):", err.message || err);
                        checkLocal();
                    });
            });
            checkLocal();
            return () => { try { unsub(); } catch(e) {} };
        } else {
            checkLocal();
            this.registerSimListener(col => { if (col === "loyalty_members") checkLocal(); });
            return () => {};
        }
    },
    createOrGetLoyaltyMember(rawPhone, firstName, source, callback) {
        const phone = normalizePhone(rawPhone);
        if (!phone) { if (callback) callback(false, null, false); return; }
        const cleanName = (firstName || "Client").trim();
        const src = source || "qr_menu"; // 'qr_menu' | 'waiter_direct' | 'admin'

        const welcomePts = 50;
        const newMember = {
            phone: phone,
            firstName: cleanName,
            points: welcomePts,
            totalEarned: welcomePts,
            rewardsClaimed: 0,
            source: src,
            createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
            updatedAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
        };

        const tx = {
            phone: phone,
            type: "WELCOME",
            pointsDelta: welcomePts,
            amountDH: 0,
            validatedBy: src === "waiter_direct" ? "waiter" : (src === "admin" ? "admin" : "system"),
            note: "Cadeau de bienvenue (+50 pts offerts)",
            createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
        };

        const saveLocalFallback = (existing) => {
            const members = getLocalCollection("loyalty_members", []);
            let target = existing;
            if (!target) {
                target = {
                    ...newMember,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                const idx = members.findIndex(m => m.phone === phone);
                if (idx >= 0) members[idx] = target; else members.push(target);
                setLocalCollection("loyalty_members", members);

                const txs = getLocalCollection("loyalty_transactions", []);
                txs.push({ id: "tx_" + Date.now(), ...tx });
                setLocalCollection("loyalty_transactions", txs);
            }
            try {
                localStorage.setItem("gc_loyalty_phone", target.phone);
                localStorage.setItem("gc_loyalty_name", target.firstName);
                localStorage.setItem("gc_loyalty_pts", String(target.points || welcomePts));
            } catch(e) {}
            if (callback) callback(true, target, !existing);
        };

        whenAuthReady(() => {
            this.getLoyaltyMember(phone, (existing) => {
                if (existing) {
                    saveLocalFallback(existing);
                    return;
                }

                if (isFirebaseActive && db) {
                    db.collection("loyalty_members").doc(phone).set(newMember)
                        .then(() => db.collection("loyalty_transactions").add(tx))
                        .then(() => {
                            console.log(`👑 Membre fidélité créé : ${cleanName} (${phone}) +50 pts`);
                            const saved = { ...newMember, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
                            saveLocalFallback(saved);
                        })
                        .catch(err => {
                            console.warn("⚠️ Erreur Firestore (quota/réseau) lors de la création membre fidélité:", err.message || err);
                            saveLocalFallback(null);
                        });
                } else {
                    saveLocalFallback(null);
                }
            });
        });
    },
    creditLoyaltyPoints(rawPhone, amountDH, tableNumber, validatedBy, orderId, callback) {
        if (typeof orderId === "function") {
            callback = orderId;
            orderId = null;
        }
        const phone = normalizePhone(rawPhone);
        if (!phone) { if (callback) callback(false, "Numéro invalide"); return; }
        const amount = parseFloat(amountDH) || 0;
        const pointsToAdd = Math.max(1, Math.round(amount)); // 1 DH = 1 pt

        const tx = {
            phone: phone,
            type: "EARN",
            pointsDelta: pointsToAdd,
            amountDH: amount,
            tableNumber: tableNumber ? String(tableNumber) : "",
            orderId: orderId || "",
            validatedBy: validatedBy || "waiter",
            note: `Encaissement ${amount} DH (+${pointsToAdd} pts)`,
            createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
        };

        const updateLocal = () => {
            const members = getLocalCollection("loyalty_members", []);
            let idx = members.findIndex(m => m.phone === phone);
            let newTotal = pointsToAdd;
            if (idx >= 0) {
                members[idx].points = (members[idx].points || 0) + pointsToAdd;
                members[idx].totalEarned = (members[idx].totalEarned || 0) + pointsToAdd;
                members[idx].updatedAt = new Date().toISOString();
                newTotal = members[idx].points;
            } else {
                newTotal = 50 + pointsToAdd;
                members.push({
                    phone: phone,
                    firstName: "Client",
                    points: newTotal,
                    totalEarned: newTotal,
                    rewardsClaimed: 0,
                    source: "waiter_direct",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            }
            setLocalCollection("loyalty_members", members);

            const txs = getLocalCollection("loyalty_transactions", []);
            txs.push({ id: "tx_" + Date.now(), ...tx });
            setLocalCollection("loyalty_transactions", txs);

            try {
                if (localStorage.getItem("gc_loyalty_phone") === phone) {
                    localStorage.setItem("gc_loyalty_pts", String(newTotal));
                }
            } catch(e) {}

            if (callback) callback(true, pointsToAdd, newTotal);
        };

        if (isFirebaseActive && db) {
            whenAuthReady(() => {
                const memberRef = db.collection("loyalty_members").doc(phone);
                memberRef.update({
                    points: firebase.firestore.FieldValue.increment(pointsToAdd),
                    totalEarned: firebase.firestore.FieldValue.increment(pointsToAdd),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => db.collection("loyalty_transactions").add(tx))
                .then(() => {
                    if (orderId) {
                        db.collection("pre_orders").doc(orderId).update({ loyaltyCredited: true }).catch(() => {});
                    }
                    return memberRef.get();
                })
                .then(doc => {
                    updateLocal();
                })
                .catch(err => {
                    console.warn("⚠️ creditLoyaltyPoints Firestore error (repli local):", err.message || err);
                    updateLocal();
                });
            });
        } else {
            updateLocal();
        }
    },
    redeemLoyaltyReward(rawPhone, waiterName, callback) {
        const phone = normalizePhone(rawPhone);
        if (!phone) { if (callback) callback(false, "Numéro invalide"); return; }
        const cost = 500;

        const tx = {
            phone: phone,
            type: "REDEEM",
            pointsDelta: -cost,
            amountDH: 0,
            validatedBy: waiterName || "waiter",
            note: "Consommation gratuite offerte (-500 pts)",
            createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
        };

        const updateLocal = () => {
            const members = getLocalCollection("loyalty_members", []);
            const idx = members.findIndex(m => m.phone === phone);
            let resPts = 0;
            if (idx >= 0) {
                if ((members[idx].points || 0) < cost) {
                    if (callback) callback(false, "Solde insuffisant (minimum 500 pts)");
                    return;
                }
                members[idx].points = Math.max(0, (members[idx].points || 0) - cost);
                members[idx].rewardsClaimed = (members[idx].rewardsClaimed || 0) + 1;
                members[idx].updatedAt = new Date().toISOString();
                resPts = members[idx].points;
                setLocalCollection("loyalty_members", members);
            }
            const txs = getLocalCollection("loyalty_transactions", []);
            txs.push({ id: "tx_" + Date.now(), ...tx });
            setLocalCollection("loyalty_transactions", txs);

            try {
                if (localStorage.getItem("gc_loyalty_phone") === phone) {
                    localStorage.setItem("gc_loyalty_pts", String(resPts));
                }
            } catch(e) {}

            if (callback) callback(true, resPts);
        };

        if (isFirebaseActive && db) {
            whenAuthReady(() => {
                const memberRef = db.collection("loyalty_members").doc(phone);
                memberRef.get().then(doc => {
                    if (!doc.exists) { updateLocal(); return; }
                    const currentPts = doc.data().points || 0;
                    if (currentPts < cost) {
                        if (callback) callback(false, "Solde insuffisant (minimum 500 pts)");
                        return;
                    }
                    memberRef.update({
                        points: firebase.firestore.FieldValue.increment(-cost),
                        rewardsClaimed: firebase.firestore.FieldValue.increment(1),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => db.collection("loyalty_transactions").add(tx))
                    .then(() => {
                        updateLocal();
                    })
                    .catch(err => {
                        console.warn("⚠️ redeemLoyaltyReward error (repli local):", err.message || err);
                        updateLocal();
                    });
                }).catch(err => {
                    console.warn("⚠️ redeemLoyaltyReward get error (repli local):", err.message || err);
                    updateLocal();
                });
            });
        } else {
            updateLocal();
        }
    },
    adjustLoyaltyPoints(rawPhone, delta, reason, adminName, callback) {
        const phone = normalizePhone(rawPhone);
        if (!phone) { if (callback) callback(false, "Numéro invalide"); return; }
        const pointsDelta = parseInt(delta) || 0;

        const tx = {
            phone: phone,
            type: "ADMIN_ADJUST",
            pointsDelta: pointsDelta,
            amountDH: 0,
            validatedBy: adminName || "admin",
            note: reason || `Ajustement manuel (${pointsDelta >= 0 ? "+" : ""}${pointsDelta} pts)`,
            createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
        };

        const updateLocal = () => {
            const members = getLocalCollection("loyalty_members", []);
            const idx = members.findIndex(m => m.phone === phone);
            let resPts = 0;
            if (idx >= 0) {
                members[idx].points = Math.max(0, (members[idx].points || 0) + pointsDelta);
                if (pointsDelta > 0) {
                    members[idx].totalEarned = (members[idx].totalEarned || 0) + pointsDelta;
                }
                members[idx].updatedAt = new Date().toISOString();
                resPts = members[idx].points;
                setLocalCollection("loyalty_members", members);
            }
            const txs = getLocalCollection("loyalty_transactions", []);
            txs.push({ id: "tx_" + Date.now(), ...tx });
            setLocalCollection("loyalty_transactions", txs);
            if (callback) callback(true, resPts);
        };

        if (isFirebaseActive && db) {
            whenAuthReady(() => {
                const memberRef = db.collection("loyalty_members").doc(phone);
                const updates = {
                    points: firebase.firestore.FieldValue.increment(pointsDelta),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                if (pointsDelta > 0) {
                    updates.totalEarned = firebase.firestore.FieldValue.increment(pointsDelta);
                }
                memberRef.update(updates)
                    .then(() => db.collection("loyalty_transactions").add(tx))
                    .then(() => memberRef.get())
                    .then(doc => updateLocal())
                    .catch(err => {
                        console.warn("⚠️ adjustLoyaltyPoints error (repli local):", err.message || err);
                        updateLocal();
                    });
            });
        } else {
            updateLocal();
        }
    },
    onAllLoyaltyMembersChange(callback) {
        const triggerLocal = () => {
            const members = getLocalCollection("loyalty_members", []);
            callback(members);
        };

        if (isFirebaseActive && db) {
            let unsub = () => {};
            whenAuthReady(() => {
                unsub = db.collection("loyalty_members")
                    .onSnapshot(snapshot => {
                        const list = [];
                        snapshot.forEach(doc => {
                            list.push({ phone: doc.id, ...doc.data() });
                        });
                        setLocalCollection("loyalty_members", list);
                        callback(list);
                    }, err => {
                        console.warn("⚠️ onAllLoyaltyMembersChange error (repli local):", err.message || err);
                        triggerLocal();
                    });
            });
            triggerLocal();
            return () => { try { unsub(); } catch(e) {} };
        } else {
            triggerLocal();
            this.registerSimListener(col => { if (col === "loyalty_members") triggerLocal(); });
            return () => {};
        }
    },
    getLoyaltyTransactions(rawPhone, callback) {
        const phone = normalizePhone(rawPhone);
        const triggerLocal = () => {
            let txs = getLocalCollection("loyalty_transactions", []);
            if (phone) {
                txs = txs.filter(t => t.phone === phone);
            }
            txs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            if (callback) callback(txs);
        };

        if (isFirebaseActive && db) {
            whenAuthReady(() => {
                let q = db.collection("loyalty_transactions");
                if (phone) {
                    q = q.where("phone", "==", phone);
                }
                q.limit(100).get().then(snapshot => {
                    const list = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        list.push({
                            id: doc.id,
                            ...data,
                            createdAt: data.createdAt ? (typeof data.createdAt.toDate === "function" ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
                        });
                    });
                    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    if (callback) callback(list);
                }).catch(err => {
                    console.warn("⚠️ getLoyaltyTransactions error (repli local):", err.message || err);
                    triggerLocal();
                });
            });
        } else {
            triggerLocal();
        }
    },
    onLoyaltySettingsChange(callback) {
        const triggerLocal = () => {
            const cfg = getLocalCollection("loyalty_settings", { rewardThreshold: 500, welcomeBonus: 50, pointsPerDH: 1 });
            callback(cfg);
        };

        if (isFirebaseActive && db) {
            let unsub = () => {};
            whenAuthReady(() => {
                unsub = db.collection("system").doc("loyalty_config")
                    .onSnapshot(doc => {
                        const data = doc.exists ? doc.data() : { rewardThreshold: 500, welcomeBonus: 50, pointsPerDH: 1 };
                        setLocalCollection("loyalty_settings", data);
                        callback(data);
                    }, err => {
                        console.warn("⚠️ onLoyaltySettingsChange error (repli local):", err.message || err);
                        triggerLocal();
                    });
            });
            triggerLocal();
            return () => { try { unsub(); } catch(e) {} };
        } else {
            triggerLocal();
            this.registerSimListener(col => { if (col === "loyalty_settings") triggerLocal(); });
            return () => {};
        }
    },
    setLoyaltySettings(settings, callback) {
        const data = {
            rewardThreshold: parseInt(settings.rewardThreshold) || 500,
            welcomeBonus: parseInt(settings.welcomeBonus) || 50,
            pointsPerDH: parseFloat(settings.pointsPerDH) || 1,
            updatedAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
        };
        setLocalCollection("loyalty_settings", data);

        if (isFirebaseActive && db) {
            whenAuthReady(() => {
                db.collection("system").doc("loyalty_config").set(data, { merge: true })
                    .then(() => { if (callback) callback(true); })
                    .catch(err => {
                        console.warn("⚠️ setLoyaltySettings error:", err.message || err);
                        if (callback) callback(true);
                    });
            });
        } else {
            if (callback) callback(true);
        }
    },
    claimLoyaltyRewardRequest(rawPhone, tableId, clientName, callback) {
        const phone = normalizePhone(rawPhone);
        this.sendCall(tableId, "reward", {
            loyaltyPhone: phone,
            loyaltyName: clientName || "",
            note: "🎁 Consommation Gratuite (500 pts)"
        }, callback);
    }
};

if (!isFirebaseActive) {
    dbService.initSimBroadcastListener();
}

// Bind to window for backwards compatibility
window.isFirebaseActive = isFirebaseActive;
window.db = db;
window.whenAuthReady = whenAuthReady;
window.dbService = dbService;
window.getTableZoneName = getTableZoneName;
window.normalizePhone = normalizePhone;

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
        db.enablePersistence().catch(err => {
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

if (!isFirebaseActive) {
    getLocalCollection("waiters", DEFAULT_WAITERS);
    getLocalCollection("tables", DEFAULT_TABLES);
    getLocalCollection("calls", []);
    getLocalCollection("pre_orders", []);
}

export function getTableZoneName(tableNum) {
    const num = parseInt(tableNum, 10);
    if (isNaN(num)) return `Table ${tableNum}`;
    if (num >= 101 && num <= 115) return `Salle (Table ${num})`;
    if (num >= 201 && num <= 219) return `Loge (Table ${num})`;
    if (num >= 301 && num <= 323) return `Terrasse (Table ${num})`;
    return `Table ${num}`;
}

export function sendFcmToWaiters(type, title, body, tableId, docId) {
    fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            to: "/topics/waiters",
            notification: { title: title, body: body, sound: "default" },
            data: { type: type, tableId: String(tableId), docId: String(docId) }
        })
    }).catch(e => console.warn("⚠️ FCM notification error:", e));
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
    sendCall(tableId, type, callback) {
        whenAuthReady(() => {
            const execute = (waiterId) => {
                const data = {
                    table: parseInt(tableId),
                    assignedTo: waiterId || "",
                    type: type,
                    status: "pending",
                    createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
                    acceptedAt: null,
                    completedAt: null
                };
                if (isFirebaseActive) {
                    db.collection("waiters_calls").add(data)
                        .then(docRef => {
                            const zoneName = getTableZoneName(tableId);
                            const typeLabels = { waiter: "Appel Serveur", water: "Besoin d'Eau", bill: "L'Addition" };
                            const typeLabel = typeLabels[type] || "Appel";
                            sendFcmToWaiters("WAITER_CALL", `🔔 Nouveau Appel : ${zoneName}`, `Demande : ${typeLabel}`, tableId, docRef.id);
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
    onCallsChange(callback) {
        if (isFirebaseActive) {
            return db.collection("waiters_calls")
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    const calls = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        calls.push({
                            id: doc.id,
                            ...data,
                            createdAt: data.createdAt ? (typeof data.createdAt.toDate === "function" ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString()
                        });
                    });
                    callback(calls);
                }, err => console.error("❌ Calls stream error:", err));
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
                .then(() => { if (callback) callback(true); })
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
    sendPreOrder(tableId, items, note, totalPrice, callback) {
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
                    acceptedAt: null
                };
                if (isFirebaseActive) {
                    db.collection("pre_orders").add(data)
                        .then(docRef => {
                            const zoneName = getTableZoneName(tableId);
                            sendFcmToWaiters("PRE_ORDER", `👨‍🍳 Nouvelle Précommande : ${zoneName}`, `Total : ${totalPrice} MAD`, tableId, docRef.id);
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
    onPreOrdersChange(callback) {
        if (isFirebaseActive) {
            return db.collection("pre_orders")
                .orderBy("createdAt", "desc")
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
        if (isFirebaseActive) {
            db.collection("waiters_calls").where("createdAt", "<", cutoff).get()
                .then(snapshot => {
                    const batch = db.batch();
                    snapshot.forEach(doc => batch.delete(doc.ref));
                    return batch.commit();
                })
                .then(() => db.collection("pre_orders").where("createdAt", "<", cutoff).get())
                .then(snapshot => {
                    const batch = db.batch();
                    snapshot.forEach(doc => batch.delete(doc.ref));
                    return batch.commit();
                })
                .then(() => { if (callback) callback(true); })
                .catch(e => { console.error(e); if (callback) callback(false); });
        } else {
            const calls = getLocalCollection("calls").filter(c => new Date(c.createdAt) >= cutoff);
            setLocalCollection("calls", calls);
            const orders = getLocalCollection("pre_orders").filter(o => new Date(o.createdAt) >= cutoff);
            setLocalCollection("pre_orders", orders);
            if (callback) callback(true);
        }
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

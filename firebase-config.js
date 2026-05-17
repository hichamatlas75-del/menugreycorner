/**
 * ============================================================================
 * GREY CORNER — FIREBASE CONFIGURATION & DUAL-MODE SERVICE LAYER
 * ============================================================================
 * This file provides a unified database service layer (`dbService`).
 * It automatically detects if real Firebase keys are configured.
 * - If keys are configured, it initializes Firebase and Firestore.
 * - If keys are left as placeholders, it falls back to Simulation Mode (using
 *   BroadcastChannel and LocalStorage) so you can test all tabs in real-time
 *   instantly without setting up a backend!
 */

// --- 1. FIREBASE CONFIGURATION KEYS ---
// Replace placeholders with your real Firebase web app credentials to connect to Cloud.
const firebaseConfig = {
    apiKey: "AIzaSyAoINLpUCCic9Xz9_PnM3al9Iu69q1FQpY",
    authDomain: "grey-corner-restaurant.firebaseapp.com",
    projectId: "grey-corner-restaurant",
    storageBucket: "grey-corner-restaurant.firebasestorage.app",
    messagingSenderId: "251703175568",
    appId: "1:251703175568:web:8d693adc297eb869d12b15",
    measurementId: "G-3HVHB0EELC"
};
// --- 2. INITIALIZATION & DUAL-MODE DETECTION ---
let isFirebaseActive = false;
let db = null;

// Helper to check if credentials are valid
function hasValidFirebaseKeys() {
    return firebaseConfig.apiKey && firebaseConfig.apiKey.trim() !== "" &&
        firebaseConfig.projectId && firebaseConfig.projectId.trim() !== "";
}

if (hasValidFirebaseKeys()) {
    try {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        // Enable offline persistence for low internet conditions
        db.enablePersistence().catch(err => {
            console.warn("⚠️ Firestore offline persistence not enabled:", err.code);
        });
        isFirebaseActive = true;
        console.log("🔥 Firebase Cloud Mode Active (Firestore Connected)");
    } catch (e) {
        console.error("❌ Failed to initialize real Firebase. Falling back to Simulation Mode:", e);
    }
} else {
    console.log("ℹ️ No Firebase keys detected. Running in Local Simulation Mode.");
}

// --- 3. LOCAL SIMULATION EMULATION (BroadcastChannel / LocalStorage) ---
const SIM_CHANNEL = "grey_corner_restaurant_channel";
const simBroadcast = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(SIM_CHANNEL) : null;

// Initialize mock collections in LocalStorage if empty
const DEFAULT_WAITERS = [
    { id: "karim", name: "Karim", email: "karim@greycorner.com", active: true },
    { id: "yassine", name: "Yassine", email: "yassine@greycorner.com", active: true }
];

const DEFAULT_TABLES = {};
for (let i = 1; i <= 24; i++) {
    DEFAULT_TABLES[i] = {
        tableNumber: i,
        assignedTo: i <= 8 ? "karim" : (i <= 16 ? "yassine" : ""), // default: Karim gets 1-8, Yassine gets 9-16, others unassigned
        active: true
    };
}

function getLocalCollection(name, defaultVal = []) {
    const val = localStorage.getItem(`sim_${name}`);
    if (!val) {
        localStorage.setItem(`sim_${name}`, JSON.stringify(defaultVal));
        return defaultVal;
    }
    return JSON.parse(val);
}

function setLocalCollection(name, data) {
    localStorage.setItem(`sim_${name}`, JSON.stringify(data));
    // Broadcast changes to other browser tabs
    if (simBroadcast) {
        simBroadcast.postMessage({ type: "SYNC", collection: name, data: data });
    }
    // Also trigger local simulation listeners for instant same-tab rendering
    if (typeof dbService !== "undefined" && dbService._simListeners) {
        dbService._simListeners.forEach(listener => {
            try {
                listener(name, data);
            } catch (e) {}
        });
    }
}

// Ensure default data is initialized for simulation
if (!isFirebaseActive) {
    getLocalCollection("servers", DEFAULT_WAITERS);
    getLocalCollection("tables", DEFAULT_TABLES);
    getLocalCollection("calls", []);
    getLocalCollection("pre_orders", []);
}

// --- 4. UNIFIED UNIFIED DATABASE SERVICE LAYER (dbService) ---
const dbService = {
    // Check mode
    isCloud() { return isFirebaseActive; },

    // Listeners registry for local simulation
    _simListeners: [],
    registerSimListener(callback) {
        this._simListeners.push(callback);
    },

    // Initialize local listener
    initSimBroadcastListener() {
        if (simBroadcast) {
            simBroadcast.onmessage = (event) => {
                if (event.data && event.data.type === "SYNC") {
                    localStorage.setItem(`sim_${event.data.collection}`, JSON.stringify(event.data.data));
                    // Trigger registered listeners
                    this._simListeners.forEach(listener => listener(event.data.collection, event.data.data));
                }
            };
        }
    },

    // ==========================================
    // SERVERS (WAITERS) API
    // ==========================================
    getWaiters(callback) {
        if (isFirebaseActive) {
            return db.collection("servers").where("active", "==", true).onSnapshot(snapshot => {
                const waiters = [];
                snapshot.forEach(doc => waiters.push({ id: doc.id, ...doc.data() }));
                callback(waiters);
            });
        } else {
            const waiters = getLocalCollection("servers");
            callback(waiters);
            // Register for updates
            this.registerSimListener((collection, data) => {
                if (collection === "servers") callback(data);
            });
            return () => { }; // return unsubscriber stub
        }
    },

    // ==========================================
    // TABLES API
    // ==========================================
    getTables(callback) {
        if (isFirebaseActive) {
            return db.collection("tables").onSnapshot(snapshot => {
                const tables = {};
                snapshot.forEach(doc => {
                    tables[doc.id] = { tableNumber: parseInt(doc.id), ...doc.data() };
                });
                callback(tables);
            });
        } else {
            const tables = getLocalCollection("tables");
            callback(tables);
            this.registerSimListener((collection, data) => {
                if (collection === "tables") callback(data);
            });
            return () => { };
        }
    },

    assignTable(tableId, waiterId, callback) {
        if (isFirebaseActive) {
            db.collection("tables").doc(String(tableId)).set({
                assignedTo: waiterId,
                active: true,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true })
                .then(() => { if (callback) callback(true); })
                .catch(e => { console.error(e); if (callback) callback(false); });
        } else {
            const tables = getLocalCollection("tables");
            tables[tableId] = {
                tableNumber: parseInt(tableId),
                assignedTo: waiterId,
                active: true,
                lastUpdated: new Date().toISOString()
            };
            setLocalCollection("tables", tables);
            if (callback) callback(true);
        }
    },

    // ==========================================
    // WAITER CALLS API
    // ==========================================
    sendCall(tableId, type, callback) {
        // First determine assigned waiter
        const getAssigneeAndSend = (waiterId) => {
            const callData = {
                table: parseInt(tableId),
                assignedTo: waiterId || "",
                type: type, // 'waiter' | 'bill' | 'water' | 'assistance'
                status: "pending",
                createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
                acceptedAt: null,
                completedAt: null
            };

            if (isFirebaseActive) {
                db.collection("waiter_calls").add(callData)
                    .then((docRef) => { if (callback) callback(true, docRef.id); })
                    .catch(e => { console.error(e); if (callback) callback(false); });
            } else {
                const calls = getLocalCollection("calls");
                const callId = "call_" + Math.random().toString(36).substring(2, 9);
                const localCall = { id: callId, ...callData };
                calls.push(localCall);
                setLocalCollection("calls", calls);
                if (callback) callback(true, callId);
            }
        };

        // Fetch assigned waiter for this table
        if (isFirebaseActive) {
            db.collection("tables").doc(String(tableId)).get()
                .then(doc => {
                    const waiterId = (doc.exists && doc.data()) ? doc.data().assignedTo : "";
                    getAssigneeAndSend(waiterId);
                })
                .catch(() => getAssigneeAndSend(""));
        } else {
            const tables = getLocalCollection("tables");
            const waiterId = tables[tableId] ? tables[tableId].assignedTo : "";
            getAssigneeAndSend(waiterId);
        }
    },

    onCallsChange(callback) {
        if (isFirebaseActive) {
            return db.collection("waiter_calls")
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    const calls = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        // Format Firestore Timestamp to string
                        const createdAt = data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString();
                        calls.push({ id: doc.id, ...data, createdAt });
                    });
                    callback(calls);
                });
        } else {
            const trigger = () => {
                const calls = getLocalCollection("calls");
                // Sort desc
                calls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                callback(calls);
            };
            trigger();
            this.registerSimListener((collection) => {
                if (collection === "calls") trigger();
            });
            return () => { };
        }
    },

    updateCallStatus(callId, status, waiterId, callback) {
        if (typeof waiterId === "function") {
            callback = waiterId;
            waiterId = null;
        }

        const updateData = {
            status: status, // 'pending' | 'accepted' | 'completed' | 'ignored'
            acceptedAt: status === "accepted" ? (isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()) : null,
            completedAt: status === "completed" ? (isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()) : null
        };

        if (waiterId) {
            updateData.assignedTo = waiterId;
        }

        if (isFirebaseActive) {
            db.collection("waiter_calls").doc(callId).update(updateData)
                .then(() => { if (callback) callback(true); })
                .catch(e => { console.error(e); if (callback) callback(false); });
        } else {
            const calls = getLocalCollection("calls");
            const idx = calls.findIndex(c => c.id === callId);
            if (idx !== -1) {
                calls[idx] = { ...calls[idx], ...updateData };
                setLocalCollection("calls", calls);
                if (callback) callback(true);
            } else {
                if (callback) callback(false);
            }
        }
    },

    // ==========================================
    // PRE-ORDERS API
    // ==========================================
    sendPreOrder(tableId, items, note, totalPrice, callback) {
        const getAssigneeAndSend = (waiterId) => {
            const orderData = {
                table: parseInt(tableId),
                assignedTo: waiterId || "",
                items: items,
                note: note || "",
                totalPrice: parseFloat(totalPrice),
                status: "pending", // 'pending' | 'accepted' | 'completed' | 'cancelled'
                createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
                acceptedAt: null
            };

            if (isFirebaseActive) {
                db.collection("pre_orders").add(orderData)
                    .then((docRef) => { if (callback) callback(true, docRef.id); })
                    .catch(e => { console.error(e); if (callback) callback(false); });
            } else {
                const orders = getLocalCollection("pre_orders");
                const orderId = "order_" + Math.random().toString(36).substring(2, 9);
                const localOrder = { id: orderId, ...orderData };
                orders.push(localOrder);
                setLocalCollection("pre_orders", orders);
                if (callback) callback(true, orderId);
            }
        };

        if (isFirebaseActive) {
            db.collection("tables").doc(String(tableId)).get()
                .then(doc => {
                    const waiterId = (doc.exists && doc.data()) ? doc.data().assignedTo : "";
                    getAssigneeAndSend(waiterId);
                })
                .catch(() => getAssigneeAndSend(""));
        } else {
            const tables = getLocalCollection("tables");
            const waiterId = tables[tableId] ? tables[tableId].assignedTo : "";
            getAssigneeAndSend(waiterId);
        }
    },

    onPreOrdersChange(callback) {
        if (isFirebaseActive) {
            return db.collection("pre_orders")
                .orderBy("createdAt", "desc")
                .onSnapshot(snapshot => {
                    const orders = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const createdAt = data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : new Date().toISOString();
                        orders.push({ id: doc.id, ...data, createdAt });
                    });
                    callback(orders);
                });
        } else {
            const trigger = () => {
                const orders = getLocalCollection("pre_orders");
                orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                callback(orders);
            };
            trigger();
            this.registerSimListener((collection) => {
                if (collection === "pre_orders") trigger();
            });
            return () => { };
        }
    },

    updatePreOrderStatus(orderId, status, waiterId, callback) {
        if (typeof waiterId === "function") {
            callback = waiterId;
            waiterId = null;
        }

        const updateData = {
            status: status,
            acceptedAt: status === "accepted" ? (isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()) : null
        };

        if (waiterId) {
            updateData.assignedTo = waiterId;
        }

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
            } else {
                if (callback) callback(false);
            }
        }
    },

    // ==========================================
    // MAINTENANCE / DATA CLEANUP
    // ==========================================
    cleanupOldData(callback) {
        const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

        if (isFirebaseActive) {
            // In production, we clean up completed or older entries to keep Firestore inside Spark's Free Tier
            let operations = [];

            // Delete old calls
            db.collection("waiter_calls").where("createdAt", "<", cutoffTime).get()
                .then(snapshot => {
                    let batch = db.batch();
                    snapshot.forEach(doc => batch.delete(doc.ref));
                    return batch.commit();
                })
                .then(() => {
                    // Delete old pre_orders
                    return db.collection("pre_orders").where("createdAt", "<", cutoffTime).get();
                })
                .then(snapshot => {
                    let batch = db.batch();
                    snapshot.forEach(doc => batch.delete(doc.ref));
                    return batch.commit();
                })
                .then(() => { if (callback) callback(true); })
                .catch(e => { console.error(e); if (callback) callback(false); });
        } else {
            // Local cleanup
            const calls = getLocalCollection("calls");
            const newCalls = calls.filter(c => new Date(c.createdAt) >= cutoffTime);
            setLocalCollection("calls", newCalls);

            const orders = getLocalCollection("pre_orders");
            const newOrders = orders.filter(o => new Date(o.createdAt) >= cutoffTime);
            setLocalCollection("pre_orders", newOrders);

            if (callback) callback(true);
        }
    }
};

// Initialize the simulation Broadcast Channel Listener
if (!isFirebaseActive) {
    dbService.initSimBroadcastListener();
}

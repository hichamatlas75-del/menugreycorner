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
                    const docRef = db.collection("waiters_calls").doc();
                    const callId = docRef.id;
                    Promise.all([
                        docRef.set(data),
                        db.collection("waiter_calls").doc(callId).set(data)
                    ])
                    .then(() => {
                        const zoneName = getTableZoneName(tableId);
                        const typeLabels = { waiter: "Appel Serveur", water: "Besoin d'Eau", bill: "L'Addition", reward: "🎁 Consommation Gratuite (500 pts)" };
                        const typeLabel = typeLabels[type] || "Appel";
                        sendFcmToWaiters("WAITER_CALL", `🔔 Nouveau Appel : ${zoneName}`, `Demande : ${typeLabel}`, tableId, callId);
                        if (callback) callback(true, callId);
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
            const callsMap = new Map();

            const notify = () => {
                const calls = Array.from(callsMap.values());
                calls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                callback(calls);
            };

            const processSnap = (snapshot, sourceCol) => {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const existing = callsMap.get(doc.id);
                    const createdAtIso = data.createdAt 
                        ? (typeof data.createdAt.toDate === "function" ? data.createdAt.toDate().toISOString() : data.createdAt) 
                        : (existing?.createdAt || new Date().toISOString());

                    // Synchronisation bidirectionnelle : si un statut est différent entre les deux collections
                    if (existing && existing.status !== data.status) {
                        const targetCol = sourceCol === "waiters_calls" ? "waiter_calls" : "waiters_calls";
                        db.collection(targetCol).doc(doc.id).update({
                            status: data.status,
                            acceptedAt: data.acceptedAt || null,
                            completedAt: data.completedAt || null
                        }).catch(() => {});
                    }

                    callsMap.set(doc.id, {
                        id: doc.id,
                        ...existing,
                        ...data,
                        createdAt: createdAtIso
                    });
                });
                notify();
            };

            const unsub1 = db.collection("waiters_calls")
                .orderBy("createdAt", "desc")
                .onSnapshot(s => processSnap(s, "waiters_calls"), err => console.error("❌ Waiters_calls stream error:", err));

            const unsub2 = db.collection("waiter_calls")
                .orderBy("createdAt", "desc")
                .onSnapshot(s => processSnap(s, "waiter_calls"), err => console.error("❌ Waiter_calls stream error:", err));

            return () => {
                if (unsub1) unsub1();
                if (unsub2) unsub2();
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
            Promise.all([
                db.collection("waiters_calls").doc(callId).update(updateData).catch(() => {}),
                db.collection("waiter_calls").doc(callId).update(updateData).catch(() => {})
            ])
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
                    loyaltyPoints: loyaltyInfo && typeof loyaltyInfo.points === "number" ? loyaltyInfo.points : null,
                    loyaltyCredited: false
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
    },
    normalizePhone(raw) {
        return normalizePhone(raw);
    },
    getLoyaltyMember(rawPhone, callback) {
        const phone = normalizePhone(rawPhone);
        if (!phone) { if (callback) callback(null); return; }
        if (isFirebaseActive) {
            db.collection("loyalty_members").doc(phone).get()
                .then(doc => {
                    if (doc.exists) {
                        callback({ phone: doc.id, ...doc.data() });
                    } else {
                        callback(null);
                    }
                })
                .catch(err => {
                    console.error("❌ getLoyaltyMember error:", err);
                    if (callback) callback(null);
                });
        } else {
            const members = getLocalCollection("loyalty_members", []);
            const found = members.find(m => m.phone === phone);
            if (callback) callback(found ? { ...found } : null);
        }
    },
    onLoyaltyMemberChange(rawPhone, callback) {
        const phone = normalizePhone(rawPhone);
        if (!phone) return () => {};
        if (isFirebaseActive) {
            return db.collection("loyalty_members").doc(phone)
                .onSnapshot(doc => {
                    if (doc.exists) {
                        callback({ phone: doc.id, ...doc.data() });
                    } else {
                        callback(null);
                    }
                }, err => {
                    console.error("❌ onLoyaltyMemberChange error:", err);
                });
        } else {
            const trigger = () => {
                const members = getLocalCollection("loyalty_members", []);
                const found = members.find(m => m.phone === phone);
                callback(found ? { ...found } : null);
            };
            trigger();
            this.registerSimListener(col => { if (col === "loyalty_members") trigger(); });
            return () => {};
        }
    },
    createOrGetLoyaltyMember(rawPhone, firstName, source, callback) {
        const phone = normalizePhone(rawPhone);
        if (!phone) { if (callback) callback(false, null, false); return; }
        const cleanName = (firstName || "Client").trim();
        const src = source || "qr_menu"; // 'qr_menu' | 'waiter_direct' | 'admin'

        this.getLoyaltyMember(phone, (existing) => {
            if (existing) {
                // Déjà existant — pas de second bonus de bienvenue
                if (callback) callback(true, existing, false);
                return;
            }

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

            if (isFirebaseActive) {
                db.collection("loyalty_members").doc(phone).set(newMember)
                    .then(() => db.collection("loyalty_transactions").add(tx))
                    .then(() => {
                        console.log(`👑 Membre fidélité créé : ${cleanName} (${phone}) +50 pts`);
                        if (callback) callback(true, { ...newMember, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, true);
                    })
                    .catch(err => {
                        console.error("❌ Erreur création membre fidélité:", err);
                        if (callback) callback(false, err, false);
                    });
            } else {
                const members = getLocalCollection("loyalty_members", []);
                members.push(newMember);
                setLocalCollection("loyalty_members", members);

                const txs = getLocalCollection("loyalty_transactions", []);
                txs.push({ id: "tx_" + Date.now(), ...tx });
                setLocalCollection("loyalty_transactions", txs);

                if (callback) callback(true, newMember, true);
            }
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
        const pointsToAdd = Math.max(1, Math.round(amount)); // Règle 1 DH = 1 pt

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

        if (isFirebaseActive) {
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
                const updatedData = doc.exists ? doc.data() : null;
                if (callback) callback(true, pointsToAdd, updatedData ? updatedData.points : null);
            })
            .catch(err => {
                console.error("❌ creditLoyaltyPoints error:", err);
                if (callback) callback(false, err);
            });
        } else {
            const members = getLocalCollection("loyalty_members", []);
            const idx = members.findIndex(m => m.phone === phone);
            let newPts = 0;
            if (idx !== -1) {
                members[idx].points = (members[idx].points || 0) + pointsToAdd;
                members[idx].totalEarned = (members[idx].totalEarned || 0) + pointsToAdd;
                members[idx].updatedAt = new Date().toISOString();
                newPts = members[idx].points;
                setLocalCollection("loyalty_members", members);
            }
            const txs = getLocalCollection("loyalty_transactions", []);
            txs.push({ id: "tx_" + Date.now(), ...tx });
            setLocalCollection("loyalty_transactions", txs);

            if (orderId) {
                const orders = getLocalCollection("pre_orders", []);
                const oIdx = orders.findIndex(o => o.id === orderId);
                if (oIdx !== -1) {
                    orders[oIdx].loyaltyCredited = true;
                    setLocalCollection("pre_orders", orders);
                }
            }
            if (callback) callback(true, pointsToAdd, newPts);
        }
    },
    redeemLoyaltyReward(rawPhone, validatedBy, callback) {
        const phone = normalizePhone(rawPhone);
        if (!phone) { if (callback) callback(false, "Numéro invalide"); return; }
        const cost = 500; // Seuil 500 points

        const tx = {
            phone: phone,
            type: "REDEEM",
            pointsDelta: -cost,
            amountDH: 0,
            validatedBy: validatedBy || "waiter",
            note: "Consommation gratuite offerte (-500 pts)",
            createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
        };

        if (isFirebaseActive) {
            const memberRef = db.collection("loyalty_members").doc(phone);
            memberRef.update({
                points: firebase.firestore.FieldValue.increment(-cost),
                rewardsClaimed: firebase.firestore.FieldValue.increment(1),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => db.collection("loyalty_transactions").add(tx))
            .then(() => memberRef.get())
            .then(doc => {
                const updated = doc.exists ? doc.data() : null;
                if (callback) callback(true, updated ? updated.points : null);
            })
            .catch(err => {
                console.error("❌ redeemLoyaltyReward error:", err);
                if (callback) callback(false, err);
            });
        } else {
            const members = getLocalCollection("loyalty_members", []);
            const idx = members.findIndex(m => m.phone === phone);
            let remaining = 0;
            if (idx !== -1) {
                members[idx].points = Math.max(0, (members[idx].points || 0) - cost);
                members[idx].rewardsClaimed = (members[idx].rewardsClaimed || 0) + 1;
                members[idx].updatedAt = new Date().toISOString();
                remaining = members[idx].points;
                setLocalCollection("loyalty_members", members);
            }
            const txs = getLocalCollection("loyalty_transactions", []);
            txs.push({ id: "tx_" + Date.now(), ...tx });
            setLocalCollection("loyalty_transactions", txs);

            if (callback) callback(true, remaining);
        }
    },
    adjustLoyaltyPoints(rawPhone, deltaPoints, reason, validatedBy, callback) {
        const phone = normalizePhone(rawPhone);
        if (!phone) { if (callback) callback(false, "Numéro invalide"); return; }
        const delta = parseInt(deltaPoints, 10);
        if (isNaN(delta) || delta === 0) { if (callback) callback(false, "Delta invalide"); return; }

        const tx = {
            phone: phone,
            type: "ADMIN_ADJUST",
            pointsDelta: delta,
            amountDH: 0,
            validatedBy: validatedBy || "admin",
            note: reason || `Ajustement manuel admin (${delta > 0 ? "+" : ""}${delta} pts)`,
            createdAt: isFirebaseActive ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
        };

        if (isFirebaseActive) {
            const memberRef = db.collection("loyalty_members").doc(phone);
            const updateObj = {
                points: firebase.firestore.FieldValue.increment(delta),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            if (delta > 0) {
                updateObj.totalEarned = firebase.firestore.FieldValue.increment(delta);
            }
            memberRef.update(updateObj)
                .then(() => db.collection("loyalty_transactions").add(tx))
                .then(() => memberRef.get())
                .then(doc => {
                    const updated = doc.exists ? doc.data() : null;
                    if (callback) callback(true, updated ? updated.points : null);
                })
                .catch(err => {
                    console.error("❌ adjustLoyaltyPoints error:", err);
                    if (callback) callback(false, err);
                });
        } else {
            const members = getLocalCollection("loyalty_members", []);
            const idx = members.findIndex(m => m.phone === phone);
            let resPts = 0;
            if (idx !== -1) {
                members[idx].points = Math.max(0, (members[idx].points || 0) + delta);
                if (delta > 0) {
                    members[idx].totalEarned = (members[idx].totalEarned || 0) + delta;
                }
                members[idx].updatedAt = new Date().toISOString();
                resPts = members[idx].points;
                setLocalCollection("loyalty_members", members);
            }
            const txs = getLocalCollection("loyalty_transactions", []);
            txs.push({ id: "tx_" + Date.now(), ...tx });
            setLocalCollection("loyalty_transactions", txs);

            if (callback) callback(true, resPts);
        }
    },
    onAllLoyaltyMembersChange(callback) {
        if (isFirebaseActive) {
            return db.collection("loyalty_members")
                .onSnapshot(snapshot => {
                    const list = [];
                    snapshot.forEach(doc => {
                        list.push({ phone: doc.id, ...doc.data() });
                    });
                    callback(list);
                }, err => {
                    console.error("❌ onAllLoyaltyMembersChange error:", err);
                });
        } else {
            const trigger = () => {
                const members = getLocalCollection("loyalty_members", []);
                callback(members);
            };
            trigger();
            this.registerSimListener(col => { if (col === "loyalty_members") trigger(); });
            return () => {};
        }
    },
    getLoyaltyTransactions(rawPhone, callback) {
        const phone = normalizePhone(rawPhone);
        if (isFirebaseActive) {
            let q = db.collection("loyalty_transactions");
            if (phone) {
                q = q.where("phone", "==", phone);
            }
            q.get().then(snapshot => {
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
                console.error("❌ getLoyaltyTransactions error:", err);
                if (callback) callback([]);
            });
        } else {
            let txs = getLocalCollection("loyalty_transactions", []);
            if (phone) {
                txs = txs.filter(t => t.phone === phone);
            }
            txs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            if (callback) callback(txs);
        }
    },
    onLoyaltySettingsChange(callback) {
        if (isFirebaseActive) {
            return db.collection("system").doc("loyalty_config")
                .onSnapshot(doc => {
                    const data = doc.exists ? doc.data() : { rewardThreshold: 500, welcomeBonus: 50, pointsPerDH: 1 };
                    callback(data);
                }, err => console.error("❌ onLoyaltySettingsChange error:", err));
        } else {
            const trigger = () => {
                const cfg = getLocalCollection("loyalty_settings", { rewardThreshold: 500, welcomeBonus: 50, pointsPerDH: 1 });
                callback(cfg);
            };
            trigger();
            this.registerSimListener(col => { if (col === "loyalty_settings") trigger(); });
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
        if (isFirebaseActive) {
            db.collection("system").doc("loyalty_config").set(data, { merge: true })
                .then(() => { if (callback) callback(true); })
                .catch(err => { console.error(err); if (callback) callback(false, err); });
        } else {
            setLocalCollection("loyalty_settings", data);
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

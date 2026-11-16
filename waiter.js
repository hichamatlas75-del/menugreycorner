// ============================================================================
// DEVICE IDENTITY — ID anonyme persistant pour le verrouillage coopératif
// ============================================================================

const myDeviceId = (() => {
    let id = localStorage.getItem("waiter_device_id");
    if (!id) {
        id = "srv_" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("waiter_device_id", id);
    }
    return id;
})();

const activeWaiterId = myDeviceId;
const activeWaiterName = "Serveur";

// ============================================================================
// STATE — Listeners Firestore actifs
// ============================================================================

function parseSafeDate(input) {
    if (!input) return new Date();
    if (typeof input.toDate === "function") return input.toDate();
    const d = new Date(input);
    return isNaN(d.getTime()) ? new Date() : d;
}

function savePreOrdersCache(newOrders) {
    const todayStr = new Date().toDateString();
    let currentCache = [];
    try {
        const cached = localStorage.getItem("grey_preorders_cache");
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.date === todayStr) {
                currentCache = parsed.orders || [];
            }
        }
    } catch (e) {
        console.error("Error reading cache in savePreOrdersCache:", e);
    }

    newOrders.forEach(newO => {
        if (!newO || !newO.id) return;

        // Éviter de stocker les commandes des jours précédents dans le cache quotidien
        const orderDateStr = newO.createdAt ? parseSafeDate(newO.createdAt).toDateString() : todayStr;
        if (orderDateStr !== todayStr) return;

        const existingIdx = currentCache.findIndex(o => o.id === newO.id);
        if (existingIdx > -1) {
            currentCache[existingIdx] = { ...currentCache[existingIdx], ...newO };
        } else {
            currentCache.push(newO);
        }
    });

    // Éliminer les éventuels doublons par ID
    const uniqueOrders = [];
    const seenIds = new Set();
    currentCache.forEach(o => {
        if (o && o.id && !seenIds.has(o.id)) {
            seenIds.add(o.id);
            uniqueOrders.push(o);
        }
    });

    const cache = {
        date: todayStr,
        orders: uniqueOrders
    };
    localStorage.setItem("grey_preorders_cache", JSON.stringify(cache));
}

function loadPreOrdersCache() {
    try {
        const cached = localStorage.getItem("grey_preorders_cache");
        if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.date === new Date().toDateString()) {
                const uniqueOrders = [];
                const seenIds = new Set();
                (parsed.orders || []).forEach(o => {
                    if (o && o.id && !seenIds.has(o.id)) {
                        seenIds.add(o.id);
                        uniqueOrders.push(o);
                    }
                });
                return uniqueOrders;
            } else {
                localStorage.removeItem("grey_preorders_cache");
            }
        }
    } catch (e) {
        console.error("Error reading preorders cache:", e);
    }
    return [];
}

let unsubCalls = null;
let unsubOrders = null;

const knownCallIds = new Set();
const knownOrderIds = new Set();
let isCallsInitialLoad = true;
let isOrdersInitialLoad = true;

let activeCallsList = [];
let activePreOrdersList = loadPreOrdersCache();
let globalWaiters = [];

let isReconnecting = false;

// ============================================================================
// AUDIO & VIBRATION
// ============================================================================

const alertChime = new Audio("https://assets.mixkit.co/active_storage/sfx/911/911-200.wav");
alertChime.volume = 0.55;

let audioUnlocked = false;
let waiterAudioCtx = null;

function getWaiterAudioContext() {
    if (!waiterAudioCtx && typeof window !== "undefined") {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            waiterAudioCtx = new AudioContextClass();
        }
    }
    if (waiterAudioCtx && waiterAudioCtx.state === "suspended") {
        waiterAudioCtx.resume().catch(() => {});
    }
    return waiterAudioCtx;
}

function unlockWaiterAudio() {
    if (audioUnlocked) return;
    try {
        const ctx = getWaiterAudioContext();
        if (ctx) {
            const buf = ctx.createBuffer(1, 1, 22050);
            const src = ctx.createBufferSource();
            src.buffer = buf;
            src.connect(ctx.destination);
            src.start(0);
        }
    } catch (e) {}

    alertChime.play().then(() => {
        alertChime.pause();
        alertChime.currentTime = 0;
        audioUnlocked = true;
    }).catch(() => {});
    document.removeEventListener("touchstart", unlockWaiterAudio);
    document.removeEventListener("click", unlockWaiterAudio);
}

if (typeof window !== "undefined") {
    document.addEventListener("touchstart", unlockWaiterAudio, { once: true });
    document.addEventListener("click", unlockWaiterAudio, { once: true });
}

function triggerHapticVibrate() {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([400, 150, 400, 150, 800]);
    }
}

function playAlertSound() {
    // 1. Synthétiseur Web Audio API offline (bip double 880 Hz et 1320 Hz)
    try {
        const ctx = getWaiterAudioContext();
        if (ctx) {
            const now = ctx.currentTime;

            // Bip 1: 880 Hz
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(880, now);
            gain1.gain.setValueAtTime(0.45, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.18);

            // Bip 2: 1320 Hz
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(1320, now + 0.15);
            gain2.gain.setValueAtTime(0.5, now + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.40);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.15);
            osc2.stop(now + 0.40);
            return;
        }
    } catch (e) {
        console.warn("⚠️ Web Audio synth error, fallback to audio element:", e);
    }

    // Fallback élément Audio
    try {
        alertChime.currentTime = 0;
        alertChime.play().catch(() => {
            console.warn("🔊 Autoplay audio bloqué par le navigateur.");
        });
    } catch (e) {}
}

// ============================================================================
// SCREEN WAKE LOCK API — Maintien écran actif
// ============================================================================

let screenWakeLock = null;

async function requestScreenWakeLock() {
    try {
        if ("wakeLock" in navigator) {
            screenWakeLock = await navigator.wakeLock.request("screen");
            console.log("🔒 Screen Wake Lock activé avec succès.");
            screenWakeLock.addEventListener("release", () => {
                console.log("🔓 Screen Wake Lock relâché.");
            });
        }
    } catch (err) {
        console.warn("⚠️ Échec activation Screen Wake Lock:", err);
    }
}

// ============================================================================
// ANDROID NATIVE BRIDGE & KEEP-ALIVE DAEMON (25 secondes)
// ============================================================================

function triggerAndroidAlert(id, type, title, message) {
    if (typeof AndroidInterface === "undefined") return;
    try {
        if (typeof AndroidInterface.triggerActionAlert === "function") {
            AndroidInterface.triggerActionAlert(id, type, title, message);
        } else if (typeof AndroidInterface.triggerNativeAlert === "function") {
            AndroidInterface.triggerNativeAlert(title, message);
        }
    } catch (e) {
        console.error("❌ Android bridge error:", e);
    }
}

function startKeepAliveDaemon() {
    const INTERVAL_MS = 25 * 1000; // 25 secondes

    setInterval(() => {
        // Ping Android Native Java
        if (typeof AndroidInterface !== "undefined" && typeof AndroidInterface.keepAlive === "function") {
            try {
                AndroidInterface.keepAlive();
                console.log("💓 Keep-alive envoyé au service Android (25s).");
            } catch (e) {
                console.warn("⚠️ Keep-alive Android error:", e);
            }
        }
        // Ping Service Worker
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
            try {
                navigator.serviceWorker.controller.postMessage({ type: "KEEP_ALIVE" });
                console.log("💓 Keep-alive envoyé au Service Worker (25s).");
            } catch (e) {
                console.warn("⚠️ Keep-alive SW error:", e);
            }
        }
    }, INTERVAL_MS);
}

// ============================================================================
// HELPERS
// ============================================================================

function getTableZoneName(tableNum) {
    const num = parseInt(tableNum);
    if (num >= 101 && num <= 115) return "Salle";
    if (num >= 201 && num <= 219) return "Loge";
    if (num >= 301 && num <= 323) return "Terrasse";
    return "Table";
}

function getElapsedTimeMarkup(createdAtString) {
    if (!createdAtString) return "À l'instant";
    const created = new Date(createdAtString);
    if (isNaN(created.getTime())) return "À l'instant";
    const diffMins = Math.floor((Date.now() - created.getTime()) / 60000);
    if (diffMins < 1) return "À l'instant";
    return `Il y a ${diffMins} min`;
}

function getWaiterName(waiterId) {
    const waiter = globalWaiters.find(w => w.id === waiterId);
    return waiter ? waiter.name : "Un serveur";
}

// ============================================================================
// CONNEXION TEMPS RÉEL — Subscribe / Unsubscribe / Reconnect
// ============================================================================

function stopRealtimeHub() {
    if (unsubCalls) { unsubCalls(); unsubCalls = null; }
    if (unsubOrders) { unsubOrders(); unsubOrders = null; }
    console.log("🔌 Listeners Firestore arrêtés.");
}

function resetState() {
    knownCallIds.clear();
    knownOrderIds.clear();
    isCallsInitialLoad = true;
    isOrdersInitialLoad = true;
    activeCallsList = [];
    activePreOrdersList = loadPreOrdersCache();
    renderHistoryFeed();
}

function startRealtimeHub() {
    isCallsInitialLoad = true;
    isOrdersInitialLoad = true;

    // Load initial cached data to prevent empty screen or flash
    activePreOrdersList = loadPreOrdersCache();
    if (activePreOrdersList.length > 0) {
        processPreOrdersFeed(activePreOrdersList);
        renderHistoryFeed();
        updateMyTablesStats();
    }

    unsubCalls = dbService.onCallsChange((calls) => {
        const todayStr = new Date().toDateString();
        const todayCalls = calls.filter(c => {
            const dateStr = c.createdAt ? parseSafeDate(c.createdAt).toDateString() : todayStr;
            return dateStr === todayStr;
        });
        activeCallsList = todayCalls;
        processCallsFeed(todayCalls);
        updateMyTablesStats();
    });

    unsubOrders = dbService.onPreOrdersChange((orders) => {
        savePreOrdersCache(orders);
        activePreOrdersList = loadPreOrdersCache();
        processPreOrdersFeed(activePreOrdersList);
        renderHistoryFeed();
        updateMyTablesStats();
    });

    console.log("✅ Listeners Firestore démarrés.");
}

async function reconnectHub() {
    if (isReconnecting) return;
    isReconnecting = true;

    console.log("🔄 Reconnexion du hub temps réel...");
    stopRealtimeHub();
    resetState();

    await new Promise(r => setTimeout(r, 1500));

    try {
        if (typeof dbService !== "undefined" && dbService.isCloud()) {
            const user = firebase.auth().currentUser;
            if (!user) {
                await firebase.auth().signInAnonymously();
                console.log("🔒 Ré-authentification anonyme réussie.");
            }
        }
        startRealtimeHub();
    } catch (e) {
        console.error("❌ Reconnexion échouée, fallback sans auth:", e);
        startRealtimeHub();
    } finally {
        isReconnecting = false;
    }
}

function updateMyTablesStats() {
    const activeTables = new Set();
    activeCallsList.forEach(c => {
        if (c.status !== "completed") activeTables.add(c.table);
    });
    activePreOrdersList.forEach(o => {
        if (o.status !== "completed" && o.status !== "cancelled") activeTables.add(o.table);
    });
    const el = document.getElementById("statMyTables");
    if (el) el.textContent = activeTables.size;
}

// ============================================================================
// PIPELINE 1 — APPELS SERVEUR
// ============================================================================

function processCallsFeed(calls) {
    const feed = document.getElementById("callsFeed");
    if (!feed) return;

    feed.innerHTML = "";

    let myActiveCallsCount = 0;
    let newPendingDetected = false;

    calls.forEach(call => {
        if (call.status === "completed" || call.status === "ignored") return;

        const isAccepted = call.status === "accepted";
        const isAcceptedByMe = isAccepted && call.assignedTo === activeWaiterId;
        const isAcceptedByOther = isAccepted && call.assignedTo !== activeWaiterId;

        if (call.status === "pending") {
            myActiveCallsCount++;
            const callAgeMs = Date.now() - parseSafeDate(call.createdAt).getTime();
            const isRecentPending = callAgeMs < 10 * 60 * 1000;

            if (!knownCallIds.has(call.id)) {
                knownCallIds.add(call.id);
                if (!isCallsInitialLoad || isRecentPending) {
                    newPendingDetected = true;
                    const zoneName    = getTableZoneName(call.table);
                    const typeLabels  = { waiter: "Appel Serveur", water: "Besoin d'Eau", bill: "L'Addition" };
                    const typeLabel   = typeLabels[call.type] || "Appel";
                    const alertTitle  = `🔔 Nouveau Appel : ${zoneName} ${call.table}`;
                    const alertBody   = `Demande : ${typeLabel}`;
                    triggerAndroidAlert(call.id, "call", alertTitle, alertBody);
                }
            }
        } else {
            knownCallIds.add(call.id);
            if (isAcceptedByMe) myActiveCallsCount++;
        }

        const card = document.createElement("div");
        card.className = `alert-card ${call.status === "pending" ? "call-pending" : "call-accepted"} ${isAcceptedByOther ? "unassigned-card" : ""}`;
        card.dataset.id = call.id;

        const typeLabels = { waiter: "Appel Serveur", water: "Besoin d'Eau", bill: "L'Addition", reward: "🎁 Conso Gratuite (500 pts)" };
        const badgeClasses = { waiter: "badge-waiter", water: "badge-water", bill: "badge-bill", reward: "badge-reward" };

        const rewardClientInfo = (call.type === "reward" && call.loyaltyPhone) 
            ? `<div style="font-size:0.82rem; color:#2ecc71; margin-top:4px; font-weight:600;">👑 Client: ${call.loyaltyName || ""} (${call.loyaltyPhone})</div>` 
            : "";

        card.innerHTML = `
            <div class="card-top">
                <div class="card-title-wrap">
                    <div class="table-circle" style="width:auto;padding:0 10px;border-radius:12px;font-size:0.8rem;font-weight:700;height:32px;">
                        ${getTableZoneName(call.table)} ${call.table}
                    </div>
                    <span class="request-badge ${badgeClasses[call.type] || "badge-waiter"}">${typeLabels[call.type] || call.type}</span>
                </div>
                <span class="time-elapsed" data-created="${call.createdAt}">${getElapsedTimeMarkup(call.createdAt)}</span>
            </div>
            ${rewardClientInfo}
            <div class="card-actions">
                ${call.status === "pending"
                ? `<button class="action-btn-accept accept-call-btn" data-id="${call.id}">S'y Rendre</button>`
                : (isAcceptedByMe
                    ? `<div class="accepted-status-badge"><span class="mini-pulse"></span> En cours...</div>
                           ${call.type === "reward" && call.loyaltyPhone ? `<button class="action-btn-complete redeem-call-btn" style="background:#27ae60;" data-id="${call.id}" data-phone="${call.loyaltyPhone}">🎁 Offrir (-500 pts)</button>` : ""}
                           <button class="action-btn-complete complete-call-btn" data-id="${call.id}">Terminer</button>`
                    : `<div class="accepted-status-badge" style="color:var(--muted);">
                             <span>👨‍🍳 Pris en charge</span>
                           </div>`
                )
            }
            </div>
        `;

        const btnAccept = card.querySelector(".accept-call-btn");
        const btnComplete = card.querySelector(".complete-call-btn");
        const btnRedeemCall = card.querySelector(".redeem-call-btn");

        if (btnAccept) {
            btnAccept.addEventListener("click", () => {
                dbService.updateCallStatus(call.id, "accepted", activeWaiterId);
            });
        }
        if (btnRedeemCall) {
            btnRedeemCall.addEventListener("click", () => {
                if (confirm(`Confirmer la déduction de 500 points pour ${call.loyaltyPhone} ?`)) {
                    btnRedeemCall.disabled = true;
                    dbService.redeemLoyaltyReward(call.loyaltyPhone, activeWaiterId, (ok, newTotal) => {
                        if (ok) {
                            playAlertSound();
                            triggerHapticVibrate();
                            alert(`🎉 Consommation offerte accordée ! Nouveau solde: ${newTotal} pts`);
                            dbService.updateCallStatus(call.id, "completed");
                        } else {
                            btnRedeemCall.disabled = false;
                            alert("Erreur lors de la déduction des points.");
                        }
                    });
                }
            });
        }
        if (btnComplete) {
            btnComplete.addEventListener("click", () => {
                dbService.updateCallStatus(call.id, "completed");
            });
        }

        feed.appendChild(card);
    });

    if (feed.children.length === 0) {
        feed.innerHTML = '<div class="feed-empty-state">Aucun appel actif pour le moment.</div>';
    }

    const statCallEl = document.getElementById("statActiveCalls");
    const badgeTabEl = document.getElementById("badgeTabCalls");

    if (statCallEl) {
        statCallEl.textContent = myActiveCallsCount;
        const parentCard = statCallEl.closest(".stat-card");
        if (parentCard) {
            parentCard.classList.toggle("pulse-active", myActiveCallsCount > 0);
        }
    }
    if (badgeTabEl) {
        badgeTabEl.textContent = myActiveCallsCount;
        badgeTabEl.style.display = myActiveCallsCount > 0 ? "flex" : "none";
    }

    if (newPendingDetected) {
        triggerHapticVibrate();
        playAlertSound();
    }

    isCallsInitialLoad = false;
}

// ============================================================================
// PIPELINE 2 — PRÉCOMMANDES
// ============================================================================

function processPreOrdersFeed(orders) {
    const feed = document.getElementById("ordersFeed");
    if (!feed) return;

    feed.innerHTML = "";

    let myActiveOrdersCount = 0;
    let newOrderDetected = false;

    orders.forEach(order => {
        if (order.status === "completed" || order.status === "cancelled") return;

        const isAccepted = order.status === "accepted";
        const isAcceptedByMe = isAccepted && order.assignedTo === activeWaiterId;
        const isAcceptedByOther = isAccepted && order.assignedTo !== activeWaiterId;

        if (order.status === "pending") {
            myActiveOrdersCount++;
            const orderAgeMs = Date.now() - parseSafeDate(order.createdAt).getTime();
            const isRecentPending = orderAgeMs < 10 * 60 * 1000;

            if (!knownOrderIds.has(order.id)) {
                knownOrderIds.add(order.id);
                if (!isOrdersInitialLoad || isRecentPending) {
                    newOrderDetected = true;
                    const zoneName   = getTableZoneName(order.table);
                    const alertTitle = `👨‍🍳 Nouvelle Précommande : ${zoneName} ${order.table}`;
                    const alertBody  = `Total : ${order.totalPrice} MAD`;
                    triggerAndroidAlert(order.id, "order", alertTitle, alertBody);
                }
            }
        } else {
            knownOrderIds.add(order.id);
            if (isAcceptedByMe) myActiveOrdersCount++;
        }

        const card = document.createElement("div");
        card.className = `alert-card ${order.status === "pending" ? "call-pending" : "call-accepted"} ${isAcceptedByOther ? "unassigned-card" : ""}`;
        card.dataset.id = order.id;

        let itemsHtml = "";
        order.items.forEach(it => {
            const catBadge = it.category ? ` <span style="font-size: 0.72rem; color: var(--gold); margin-left: 6px; font-weight: 500;">(${it.category})</span>` : "";
            itemsHtml += `
                <div class="order-item-row">
                    <div>
                        <span class="item-qty-lbl">${it.qty}x</span>
                        <span class="item-name-lbl">${it.name_lang}${catBadge}</span>
                    </div>
                    <span class="item-price-lbl">${it.price} MAD</span>
                </div>
            `;
        });

        let loyaltySnippet = "";
        if (order.loyaltyPhone) {
            const ptsToAdd = Math.floor(order.totalPrice || 0);
            loyaltySnippet = `
                <div class="order-loyalty-banner">
                    <div>
                        <span style="font-weight:700; color:var(--gold);">👑 ${order.loyaltyName || "Client Club"}</span>
                        <span style="font-size:0.75rem; color:var(--muted); margin-left:4px;">(${order.loyaltyPhone})</span>
                    </div>
                    <div id="loyaltyPointsBadge_${order.id}">
                        ${order.loyaltyCredited 
                            ? `<span style="color:#2ecc71; font-weight:700; font-size:0.82rem;">✓ Points crédités (+${ptsToAdd} pts)</span>`
                            : `<button type="button" class="action-btn-credit-loyalty" data-order-id="${order.id}" data-phone="${order.loyaltyPhone}" data-amount="${order.totalPrice}" style="padding:4px 10px; cursor:pointer;">✅ Encaisser & Créditer (+${ptsToAdd} pts)</button>`
                        }
                    </div>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-top">
                <div class="card-title-wrap">
                    <div class="table-circle" style="width:auto;padding:0 10px;border-radius:12px;font-size:0.8rem;font-weight:700;height:32px;">
                        ${getTableZoneName(order.table)} ${order.table}
                    </div>
                    <span class="request-badge badge-order">Précommande</span>
                </div>
                <span class="time-elapsed" data-created="${order.createdAt}">${getElapsedTimeMarkup(order.createdAt)}</span>
            </div>
            <div class="order-items-list">
                ${itemsHtml}
                ${order.note ? `<div class="order-comments"><strong>Note :</strong> ${order.note}</div>` : ""}
                <div class="order-total-bar">
                    <span>Total</span>
                    <span class="order-total-price">${order.totalPrice} MAD</span>
                </div>
            </div>
            ${loyaltySnippet}
            <div class="card-actions">
                ${order.status === "pending"
                ? `<button class="action-btn-accept accept-order-btn" data-id="${order.id}">Valider & POS</button>`
                : (isAcceptedByMe
                    ? `<div class="accepted-status-badge"><span class="mini-pulse"></span> Commande Validée</div>
                           <button class="action-btn-complete complete-order-btn" data-id="${order.id}">Servi</button>`
                    : `<div class="accepted-status-badge" style="color:var(--muted);">
                             <span>👨‍🍳 Commande Validée</span>
                           </div>`
                )
            }
            </div>
        `;

        const btnAccept = card.querySelector(".accept-order-btn");
        const btnComplete = card.querySelector(".complete-order-btn");
        const btnCreditLoyalty = card.querySelector(".action-btn-credit-loyalty");

        if (btnCreditLoyalty) {
            btnCreditLoyalty.addEventListener("click", () => {
                const phone = btnCreditLoyalty.dataset.phone;
                const amount = parseFloat(btnCreditLoyalty.dataset.amount) || 0;
                btnCreditLoyalty.disabled = true;
                btnCreditLoyalty.textContent = "Crédit en cours...";

                dbService.creditLoyaltyPoints(phone, amount, order.table, activeWaiterId, order.id, (ok, added, newTotal) => {
                    if (ok) {
                        playAlertSound();
                        triggerHapticVibrate();
                        order.loyaltyCredited = true;
                        const container = document.getElementById(`loyaltyPointsBadge_${order.id}`);
                        if (container) {
                            container.innerHTML = `<span style="color:#2ecc71; font-weight:700; font-size:0.82rem;">✓ Points crédités (+${added} pts) • Solde: ${newTotal} pts</span>`;
                        }
                        alert(`✅ Points crédités avec succès !\nClient : ${order.loyaltyName || phone}\n+${added} points ajoutés\nNouveau solde : ${newTotal} / 500 pts`);
                    } else {
                        btnCreditLoyalty.disabled = false;
                        btnCreditLoyalty.textContent = "Erreur, réessayer";
                    }
                });
            });
        }

        if (btnAccept) {
            btnAccept.addEventListener("click", () => {
                dbService.updatePreOrderStatus(order.id, "accepted", activeWaiterId);
            });
        }
        if (btnComplete) {
            btnComplete.addEventListener("click", () => {
                dbService.updatePreOrderStatus(order.id, "completed");
            });
        }

        feed.appendChild(card);
    });

    if (feed.children.length === 0) {
        feed.innerHTML = '<div class="feed-empty-state">Aucune précommande en attente.</div>';
    }

    const statOrderEl = document.getElementById("statActiveOrders");
    const badgeTabEl = document.getElementById("badgeTabOrders");

    if (statOrderEl) {
        statOrderEl.textContent = myActiveOrdersCount;
        const parentCard = statOrderEl.closest(".stat-card");
        if (parentCard) {
            parentCard.classList.toggle("pulse-active", myActiveOrdersCount > 0);
        }
    }
    if (badgeTabEl) {
        badgeTabEl.textContent = myActiveOrdersCount;
        badgeTabEl.style.display = myActiveOrdersCount > 0 ? "flex" : "none";
    }

    if (newOrderDetected) {
        triggerHapticVibrate();
        playAlertSound();
    }

    isOrdersInitialLoad = false;
}

// ============================================================================
// PIPELINE 3 — HISTORIQUE DES PRÉCOMMANDES
// ============================================================================

function renderHistoryFeed() {
    const feed = document.getElementById("historyFeed");
    if (!feed) return;

    feed.innerHTML = "";

    // Trier toutes les précommandes du jour J par date de création décroissante
    const sortedOrders = [...activePreOrdersList].sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const db = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return db - da;
    });

    if (sortedOrders.length === 0) {
        feed.innerHTML = '<div class="feed-empty-state">Aucune précommande aujourd\'hui.</div>';
        return;
    }

    sortedOrders.forEach(order => {
        let itemsHtml = "";
        order.items.forEach(it => {
            const catBadge = it.category ? ` <span style="font-size: 0.72rem; color: var(--gold); margin-left: 6px; font-weight: 500;">(${it.category})</span>` : "";
            itemsHtml += `
                <div class="order-item-row">
                    <div>
                        <span class="item-qty-lbl">${it.qty}x</span>
                        <span class="item-name-lbl">${it.name_lang}${catBadge}</span>
                    </div>
                    <span class="item-price-lbl">${it.price} MAD</span>
                </div>
            `;
        });

        // Styles de statut
        let statusText = "En attente";
        let statusStyle = "";

        if (order.status === "pending") {
            statusText = "En attente";
            statusStyle = "color: #f39c12; background: rgba(243, 156, 18, 0.12); border: 1px solid rgba(243, 156, 18, 0.25);";
        } else if (order.status === "accepted") {
            statusText = "Validée";
            statusStyle = "color: var(--sc-gold-light); background: rgba(201, 168, 76, 0.12); border: 1px solid rgba(201, 168, 76, 0.3);";
        } else if (order.status === "completed") {
            statusText = "Servie";
            statusStyle = "color: var(--success); background: rgba(46, 204, 113, 0.12); border: 1px solid rgba(46, 204, 113, 0.25);";
        } else if (order.status === "cancelled") {
            statusText = "Annulée";
            statusStyle = "color: var(--alert); background: rgba(231, 76, 60, 0.12); border: 1px solid rgba(231, 76, 60, 0.25);";
        }

        const card = document.createElement("div");
        card.className = "alert-card";
        card.style.borderColor = "rgba(255, 255, 255, 0.04)";
        card.style.background = "rgba(18, 26, 42, 0.4)";

        const waiterInfo = (order.assignedTo && globalWaiters) ? getWaiterName(order.assignedTo) : "";
        const waiterMarkup = waiterInfo ? `<div style="font-size: 0.72rem; color: var(--muted); margin-top: 6px;">Prise en charge par : ${waiterInfo}</div>` : "";

        card.innerHTML = `
            <div class="card-top">
                <div class="card-title-wrap">
                    <div class="table-circle" style="width:auto;padding:0 10px;border-radius:12px;font-size:0.8rem;font-weight:700;height:32px;">
                        ${getTableZoneName(order.table)} ${order.table}
                    </div>
                    <span class="request-badge" style="${statusStyle}">${statusText}</span>
                </div>
                <span class="time-elapsed" data-created="${order.createdAt}">${getElapsedTimeMarkup(order.createdAt)}</span>
            </div>
            <div class="order-items-list">
                ${itemsHtml}
                ${order.note ? `<div class="order-comments"><strong>Note :</strong> ${order.note}</div>` : ""}
                <div class="order-total-bar">
                    <span>Total</span>
                    <span class="order-total-price">${order.totalPrice} MAD</span>
                </div>
            </div>
            ${waiterMarkup}
        `;

        feed.appendChild(card);
    });
}

// ============================================================================

// ============================================================================
// TIMERS PÉRIODIQUES
// ============================================================================

setInterval(() => {
    document.querySelectorAll(".time-elapsed").forEach(el => {
        const createdStr = el.getAttribute("data-created");
        if (createdStr) el.textContent = getElapsedTimeMarkup(createdStr);
    });
}, 30000);

// ============================================================================
// NAVIGATION TABS
// ============================================================================

function initTabNavigation() {
    const tabs = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetId = tab.getAttribute("data-tab");
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            panels.forEach(p => p.classList.toggle("active", p.id === targetId));
        });
    });
}

// ============================================================================
// RÉSEAU & VISIBILITÉ — Reconnexion automatique
// ============================================================================

window.addEventListener("online", () => {
    console.log("🌐 Réseau rétabli → reconnexion...");
    reconnectHub();
});

window.addEventListener("offline", () => {
    console.warn("📴 Réseau perdu → arrêt des listeners.");
    stopRealtimeHub();
});

let hiddenAt = null;
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        hiddenAt = Date.now();
    } else {
        const hiddenDuration = hiddenAt ? Date.now() - hiddenAt : 0;
        console.log(`👁️ Écran visible (inactif: ${Math.round(hiddenDuration / 1000)}s)`);

        // Réactivation audio & Screen Wake Lock immédiat
        getWaiterAudioContext();
        requestScreenWakeLock();

        // Seuil ramené à 30 secondes pour reconnexion automatique
        if (hiddenDuration > 30 * 1000) {
            console.log(`🔄 Inactivité > 30s → reconnexion automatique du Hub.`);
            reconnectHub();
        }
        hiddenAt = null;
    }
});

window.addEventListener("beforeunload", () => {
    stopRealtimeHub();
});

// ============================================================================
// MODULE FIDÉLITÉ DIRECTE — SCÉNARIO B (CLIENT SANS QR CODE)
// ============================================================================

function initDirectLoyaltyModule() {
    const modal = document.getElementById("directLoyaltyModal");
    const btnOpen = document.getElementById("btnOpenDirectLoyalty");
    const btnClose = document.getElementById("btnCloseDirectLoyalty");
    const searchInput = document.getElementById("directLoyaltySearchInput");
    const searchBtn = document.getElementById("directLoyaltySearchBtn");
    const contentArea = document.getElementById("directLoyaltyContentArea");

    if (!modal || !btnOpen) return;

    const openModal = () => {
        modal.style.display = "flex";
        if (searchInput) {
            searchInput.value = "";
            setTimeout(() => searchInput.focus(), 150);
        }
        contentArea.innerHTML = `
            <div style="text-align: center; color: var(--muted); padding: 24px 10px; font-size: 0.9rem;">
                💡 Saisissez le numéro de téléphone pour créditer les points de l'addition ou offrir la boisson gratuite.
            </div>
        `;
    };

    const closeModal = () => {
        modal.style.display = "none";
    };

    btnOpen.addEventListener("click", openModal);
    if (btnClose) btnClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    const performSearch = () => {
        const query = (searchInput.value || "").trim();
        if (!query) return;

        contentArea.innerHTML = `<div style="text-align:center; padding:20px; color:var(--gold);">Recherche en cours...</div>`;

        const clean = window.normalizePhone ? window.normalizePhone(query) : query.replace(/\D/g, "");

        dbService.getLoyaltyMember(clean, (member) => {
            if (member) {
                renderMemberDetails(member);
            } else {
                dbService.onAllLoyaltyMembersChange((allMembers) => {
                    const found = allMembers.find(m => 
                        (m.phone && (m.phone === clean || m.phone.endsWith(clean))) || 
                        (m.firstName && m.firstName.toLowerCase().includes(query.toLowerCase()))
                    );
                    if (found) {
                        renderMemberDetails(found);
                    } else {
                        renderCreateMemberForm(clean);
                    }
                });
            }
        });
    };

    if (searchBtn) searchBtn.addEventListener("click", performSearch);
    if (searchInput) {
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") performSearch();
        });
    }

    function renderMemberDetails(member) {
        const pts = member.points || 0;
        const pct = Math.min(100, Math.max(0, (pts / 500) * 100));
        const canRedeem = pts >= 500;

        contentArea.innerHTML = `
            <div class="loyalty-member-card">
                <div class="loyalty-card-head">
                    <div>
                        <div class="member-name-tag">👑 ${member.firstName || "Client"}</div>
                        <div class="member-phone-sub">📱 ${member.phone}</div>
                    </div>
                    <div class="member-points-pill">
                        <div class="member-points-big" id="directModalPts">${pts}</div>
                        <div class="member-points-target">/ 500 points</div>
                    </div>
                </div>

                <div class="loyalty-card-progress">
                    <div class="loyalty-card-fill" id="directModalFill" style="width: ${pct}%;"></div>
                </div>

                <div id="directRewardAlertContainer">
                    ${canRedeem ? `
                        <div class="direct-reward-alert">
                            <div class="reward-alert-title">🎉 CE CLIENT A DROIT À 1 CONSOMMATION GRATUITE !</div>
                            <button type="button" class="btn-direct-redeem" id="btnModalRedeem">🎁 Offrir la consommation (-500 pts)</button>
                        </div>
                    ` : `
                        <div style="font-size:0.85rem; color:var(--muted); margin-bottom:10px;">
                            Plus que <strong>${500 - pts} points</strong> avant la prochaine consommation gratuite.
                        </div>
                    `}
                </div>

                <!-- Encaissement direct de l'addition -->
                <div class="direct-action-block">
                    <div style="font-weight:700; color:#ffffff; font-size:0.92rem; margin-bottom:8px;">
                        💳 Encaisser l'addition (1 DH = 1 Point) :
                    </div>
                    <div class="direct-inputs-grid">
                        <input type="number" id="directBillAmount" class="direct-input" placeholder="Montant en DH (ex: 120)" min="1" step="1" />
                        <input type="number" id="directBillTable" class="direct-input" placeholder="Table (opt)" />
                    </div>
                    <button type="button" id="btnModalCredit" class="btn-direct-credit">
                        <span>+ Créditer les points (1 DH = 1 pt)</span>
                    </button>
                    <div id="directAnnouncementMsg" style="display:none;" class="announcement-box"></div>
                </div>
            </div>
        `;

        const btnCredit = document.getElementById("btnModalCredit");
        const amountInput = document.getElementById("directBillAmount");
        const tableInput = document.getElementById("directBillTable");
        const announceMsg = document.getElementById("directAnnouncementMsg");

        if (btnCredit) {
            btnCredit.addEventListener("click", () => {
                const amount = parseFloat(amountInput.value);
                if (isNaN(amount) || amount <= 0) {
                    alert("Veuillez saisir un montant d'addition valide.");
                    amountInput.focus();
                    return;
                }
                btnCredit.disabled = true;
                btnCredit.textContent = "Crédit en cours...";

                dbService.creditLoyaltyPoints(member.phone, amount, tableInput.value || null, activeWaiterId, null, (ok, added, newTotal) => {
                    btnCredit.disabled = false;
                    btnCredit.textContent = "+ Créditer les points (1 DH = 1 pt)";

                    if (ok) {
                        playAlertSound();
                        triggerHapticVibrate();
                        member.points = newTotal;

                        const ptsEl = document.getElementById("directModalPts");
                        const fillEl = document.getElementById("directModalFill");
                        if (ptsEl) ptsEl.textContent = newTotal;
                        if (fillEl) fillEl.style.width = `${Math.min(100, (newTotal / 500) * 100)}%`;

                        amountInput.value = "";

                        if (announceMsg) {
                            announceMsg.style.display = "block";
                            announceMsg.innerHTML = `🗣️ <strong>À annoncer au client :</strong> « Merci ! Vous avez gagné +${added} points. Votre solde est maintenant de <strong>${newTotal} points sur 500</strong> ! »`;
                        }

                        if (newTotal >= 500) {
                            const alertBox = document.getElementById("directRewardAlertContainer");
                            if (alertBox) {
                                alertBox.innerHTML = `
                                    <div class="direct-reward-alert">
                                        <div class="reward-alert-title">🎉 CE CLIENT A DROIT À 1 CONSOMMATION GRATUITE !</div>
                                        <button type="button" class="btn-direct-redeem" id="btnModalRedeem">🎁 Offrir la consommation (-500 pts)</button>
                                    </div>
                                `;
                                bindRedeemBtn(member);
                            }
                        }
                    } else {
                        alert("Erreur lors de l'ajout des points.");
                    }
                });
            });
        }

        bindRedeemBtn(member);
    }

    function bindRedeemBtn(member) {
        const btnRedeem = document.getElementById("btnModalRedeem");
        if (btnRedeem && !btnRedeem._bound) {
            btnRedeem._bound = true;
            btnRedeem.addEventListener("click", () => {
                if (!confirm(`Confirmer l'offre de la consommation gratuite pour ${member.firstName} ?\n(500 points seront déduits de son solde).`)) {
                    return;
                }
                btnRedeem.disabled = true;
                btnRedeem.textContent = "Validation en cours...";

                dbService.redeemLoyaltyReward(member.phone, activeWaiterId, (ok, newTotal) => {
                    btnRedeem.disabled = false;
                    if (ok) {
                        playAlertSound();
                        triggerHapticVibrate();
                        member.points = newTotal;
                        alert(`🎉 Félicitations ! Consommation gratuite accordée.\nNouveau solde du client : ${newTotal} points.`);
                        renderMemberDetails(member);
                    } else {
                        alert("Erreur lors de la déduction des points.");
                    }
                });
            });
        }
    }

    function renderCreateMemberForm(phone) {
        contentArea.innerHTML = `
            <div class="loyalty-create-box">
                <div class="create-box-title">Nouveau Client Fidélité</div>
                <div class="create-box-desc">
                    Numéro <strong>${phone || "inconnu"}</strong> non inscrit.<br>
                    Créez son compte en 5 secondes avec <strong>+50 points offerts</strong> !
                </div>
                <input type="text" id="directNewFirstName" class="direct-input" style="width:100%; margin-bottom:10px;" placeholder="Prénom du client (ex: Yassine)" autocomplete="off" />
                <button type="button" id="btnConfirmCreate" class="btn-create-account">
                    🎁 Créer compte (+50 pts) & Continuer
                </button>
            </div>
        `;

        const btnCreate = document.getElementById("btnConfirmCreate");
        const nameInput = document.getElementById("directNewFirstName");
        if (btnCreate) {
            btnCreate.addEventListener("click", () => {
                const name = (nameInput.value || "").trim();
                if (!name) {
                    alert("Veuillez saisir le prénom du client.");
                    nameInput.focus();
                    return;
                }
                btnCreate.disabled = true;
                btnCreate.textContent = "Création du compte...";

                dbService.createOrGetLoyaltyMember(phone, name, "waiter_direct", (ok, newMember) => {
                    btnCreate.disabled = false;
                    if (ok && newMember) {
                        playAlertSound();
                        triggerHapticVibrate();
                        renderMemberDetails(newMember);
                    } else {
                        alert("Erreur lors de la création du compte.");
                    }
                });
            });
        }
    }
}

// ============================================================================
// INITIALISATION
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
    initTabNavigation();
    initDirectLoyaltyModule();

    // Enregistrement du Service Worker
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/waiter-sw.js", { scope: "/" })
            .then(reg => console.log("👷 [Waiter] Service Worker enregistré avec succès:", reg.scope))
            .catch(err => console.warn("⚠️ [Waiter] Échec enregistrement Service Worker:", err));
    }

    // Maintien écran allumé
    requestScreenWakeLock();

    // Déverrouillage audio sur premier geste
    document.addEventListener("click", () => {
        unlockWaiterAudio();
    }, { once: true });

    // Démarrage daemon Keep-Alive 25s (Android Java + Service Worker)
    startKeepAliveDaemon();

    if (typeof dbService !== "undefined" && dbService.isCloud()) {
        firebase.auth().signInAnonymously()
            .then(() => {
                console.log("🔒 Authentification anonyme réussie.");
                startRealtimeHub();
            })
            .catch(e => {
                console.error("❌ Auth échouée, démarrage en mode fallback:", e);
                startRealtimeHub();
            });
    } else {
        startRealtimeHub();
    }
});
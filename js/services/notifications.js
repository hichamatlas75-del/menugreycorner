/**
 * GREY CORNER — NOTIFICATIONS & WAITER CALLS SERVICE (ES Module)
 */

import { currentLang } from './i18n.js';
import { showToast } from './cart.js';
import { dbService } from '../config/firebase.js';
import { showTableSelectorModal, setPendingActionAfterTableSelect } from '../ui/modals.js';

export let memoryNotifications = [];
const cooldowns = {};
let unsubscribersList = [];
const notifiedCallIds = new Set();
const notifiedOrderIds = new Set();
let isFirstCallsSnapshot = true;
let isFirstOrdersSnapshot = true;

export function checkCallCooldown(type) {
  const lastTime = cooldowns[type] || 0;
  const elapsed = (Date.now() - lastTime) / 1000;
  if (elapsed < 60) {
    return Math.ceil(60 - elapsed);
  }
  return 0;
}

export function setCallCooldown(type) {
  cooldowns[type] = Date.now();
}

export function triggerQuickServiceCall(clientTable, type) {
  if (!clientTable) {
    const tableMsgs = {
      fr: "Veuillez choisir votre numéro de table.",
      en: "Please select your table number.",
      de: "Bitte wählen Sie Ihre Tischnummer."
    };
    showToast(tableMsgs[currentLang] || tableMsgs.fr);
    setPendingActionAfterTableSelect((selectedTable) => triggerQuickServiceCall(selectedTable, type));
    showTableSelectorModal();
    return;
  }

  const waitRemaining = checkCallCooldown(type);
  if (waitRemaining > 0) {
    const errorMsgs = {
      fr: `Veuillez attendre ${waitRemaining}s avant de renouveler cet appel.`,
      en: `Please wait ${waitRemaining}s before repeating this request.`,
      de: `Bitte warten Sie ${waitRemaining}s, bevor Sie diese Anfrage wiederholen.`
    };
    showToast(errorMsgs[currentLang] || errorMsgs.fr);
    return;
  }

  const btnId = type === "waiter" ? "cabCallWaiter" : (type === "water" ? "cabRequestWater" : "cabRequestBill");
  const btn = document.getElementById(btnId);
  if (btn) btn.classList.add("active");

  dbService.sendCall(clientTable, type, (success, callId) => {
    if (btn) btn.classList.remove("active");

    if (success) {
      setCallCooldown(type);

      const okMsgs = {
        fr: "Appel envoyé ! Votre serveur a été alerté.",
        en: "Call sent! Your waiter has been alerted.",
        de: "Anruf gesendet! Ihr Kellner wurde benachrichtigt."
      };
      showToast(okMsgs[currentLang] || okMsgs.fr);
      if (callId) localStorage.setItem(`last_call_${type}`, callId);

      // Subscribe to real-time status changes
      subscribeToActiveWaiterEvents(clientTable);
    } else {
      showToast("Erreur de connexion. Veuillez réessayer.");
    }
  });
}

export function addNotificationToHistory(message, tableId) {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  memoryNotifications.push({
    id: Math.random().toString(36).substr(2, 9),
    time: timeStr,
    title: "Service Grey Corner",
    message: message,
    table: tableId
  });

  if (memoryNotifications.length > 25) {
    memoryNotifications.shift();
  }

  const bellBadge = document.getElementById("bellBadge");
  if (bellBadge) {
    bellBadge.style.display = "block";
  }
}

export function playChimeSound() {
  try {
    const chime = new Audio("https://assets.mixkit.co/active_storage/sfx/911/911-200.wav");
    chime.volume = 0.5;
    chime.play();
  } catch (e) {}
}

export function subscribeToActiveWaiterEvents(clientTable) {
  unsubscribersList.forEach(unsub => {
    try { unsub(); } catch (e) {}
  });
  unsubscribersList = [];

  if (!clientTable) return;

  isFirstCallsSnapshot = true;
  isFirstOrdersSnapshot = true;

  // 1. Listen to Calls (Appel serveur, besoin d'eau, addition)
  const unsubCalls = dbService.onCallsChange((calls) => {
    if (!Array.isArray(calls)) return;

    if (isFirstCallsSnapshot) {
      // Record already accepted calls on initial snapshot so old calls don't re-trigger
      calls.forEach(c => {
        if (String(c.table) === String(clientTable) && c.status === "accepted") {
          notifiedCallIds.add(c.id);
        }
      });
      isFirstCallsSnapshot = false;
      return;
    }

    calls.forEach(c => {
      if (String(c.table) === String(clientTable) && c.status === "accepted" && !notifiedCallIds.has(c.id)) {
        notifiedCallIds.add(c.id);

        const typeNames = {
          waiter: "Appel serveur",
          water: "Demande d'eau",
          bill: "Demande d'addition"
        };
        const typeLabel = typeNames[c.type] || "Demande";
        const acceptedMsgs = {
          fr: `🔔 Le serveur a accepté votre ${typeLabel} et arrive à votre table !`,
          en: `🔔 The waiter accepted your ${typeLabel} and is coming to your table!`,
          de: `🔔 Ihr Kellner hat Ihre ${typeLabel} angenommen und kommt zu Ihrem Tisch!`
        };
        const msg = acceptedMsgs[currentLang] || acceptedMsgs.fr;
        showToast(msg);
        playChimeSound();
        addNotificationToHistory(msg, clientTable);
      }
    });
  });
  if (typeof unsubCalls === "function") unsubscribersList.push(unsubCalls);

  // 2. Listen to Pre-orders (Validation de précommande)
  const unsubOrders = dbService.onPreOrdersChange((orders) => {
    if (!Array.isArray(orders)) return;

    if (isFirstOrdersSnapshot) {
      // Record already accepted orders on initial snapshot so old orders don't re-trigger
      orders.forEach(o => {
        if (String(o.table) === String(clientTable) && o.status === "accepted") {
          notifiedOrderIds.add(o.id);
        }
      });
      isFirstOrdersSnapshot = false;
      return;
    }

    orders.forEach(o => {
      if (String(o.table) === String(clientTable) && o.status === "accepted" && !notifiedOrderIds.has(o.id)) {
        notifiedOrderIds.add(o.id);

        const acceptedMsgs = {
          fr: "👨‍🍳 Le serveur a validé votre précommande !",
          en: "👨‍🍳 The waiter confirmed your pre-order!",
          de: "👨‍🍳 Der Kellner hat Ihre Vorbestellung bestätigt!"
        };
        const msg = acceptedMsgs[currentLang] || acceptedMsgs.fr;
        showToast(msg);
        playChimeSound();
        addNotificationToHistory(msg, clientTable);
      }
    });
  });
  if (typeof unsubOrders === "function") unsubscribersList.push(unsubOrders);
}

export function renderNotificationHistory(clientTable) {
  const ndContentFeed = document.getElementById("ndContentFeed");
  if (!ndContentFeed) return;
  ndContentFeed.innerHTML = "";

  const tableNotifications = memoryNotifications.filter(n => String(n.table) === String(clientTable));

  if (tableNotifications.length === 0) {
    ndContentFeed.innerHTML = `
      <div style="text-align: center; color: rgba(240, 234, 216, 0.4); padding: 40px 20px; font-size: 0.85rem;">
        Aucune notification récente
      </div>
    `;
    return;
  }

  tableNotifications.forEach(notif => {
    const card = document.createElement("div");
    card.className = "nd-card";
    card.innerHTML = `
      <div class="nd-card-header">
        <span class="nd-card-title">${notif.title}</span>
        <span class="nd-card-time">${notif.time}</span>
      </div>
      <div class="nd-card-body">${notif.message}</div>
    `;
    ndContentFeed.appendChild(card);
  });
}

export function setupNotificationDrawer(getClientTable) {
  const bellBtn = document.getElementById("notificationBellBtn");
  const ndOverlay = document.getElementById("notificationDrawerOverlay");
  const ndCloseBtn = document.getElementById("ndCloseBtn");
  const bellBadge = document.getElementById("bellBadge");

  if (bellBtn) {
    bellBtn.onclick = () => {
      if (bellBadge) bellBadge.style.display = "none";
      if (ndOverlay) ndOverlay.classList.add("active");
      const currentTable = typeof getClientTable === "function" ? getClientTable() : getClientTable;
      renderNotificationHistory(currentTable);
    };
  }

  if (ndCloseBtn) {
    ndCloseBtn.onclick = () => {
      if (ndOverlay) ndOverlay.classList.remove("active");
    };
  }

  if (ndOverlay) {
    ndOverlay.onclick = (e) => {
      if (e.target === ndOverlay) {
        ndOverlay.classList.remove("active");
      }
    };
  }
}

window.triggerQuickServiceCall = triggerQuickServiceCall;
window.renderNotificationHistory = renderNotificationHistory;
window.subscribeToActiveWaiterEvents = subscribeToActiveWaiterEvents;

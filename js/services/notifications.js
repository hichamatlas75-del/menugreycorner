/**
 * GREY CORNER — NOTIFICATIONS & WAITER CALLS SERVICE (ES Module)
 */

import { currentLang } from './i18n.js';
import { showToast } from './cart.js';
import { dbService } from '../config/firebase.js';

export let memoryNotifications = [];

const cooldowns = {};

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
  if (!clientTable) return;

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
      localStorage.setItem(`last_call_${type}`, callId);
    } else {
      showToast("Erreur de connexion. Veuillez réessayer.");
    }
  });
}

export function renderNotificationHistory(clientTable) {
  const ndContentFeed = document.getElementById("ndContentFeed");
  if (!ndContentFeed) return;
  ndContentFeed.innerHTML = "";

  const tableNotifications = memoryNotifications.filter(n => n.table === clientTable);

  if (tableNotifications.length === 0) {
    ndContentFeed.innerHTML = `
      <div style="text-align: center; color: rgba(240, 234, 216, 0.4); padding: 40px 20px; font-size: 0.85rem;">
        Aucune notification recente
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

window.triggerQuickServiceCall = triggerQuickServiceCall;
window.renderNotificationHistory = renderNotificationHistory;

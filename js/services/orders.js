/**
 * GREY CORNER — ORDERS SERVICE (ES Module)
 */

import { currentLang } from './i18n.js';
import { clientCart, saveClientCart, clearCart, showToast } from './cart.js';
import { dbService } from '../config/firebase.js';
import { showTableSelectorModal, setPendingActionAfterTableSelect } from '../ui/modals.js';
import { subscribeToActiveWaiterEvents } from './notifications.js';

export function submitPreOrder(clientTable, onComplete) {
  if (!clientCart || clientCart.length === 0) return;

  const btn = document.getElementById("cdSubmitBtn");
  const spinner = document.getElementById("cdSubmitSpinner");

  const resetBtn = () => {
    if (btn) btn.disabled = false;
    if (spinner) spinner.style.display = "none";
    if (onComplete) onComplete();
  };

  // CHECK: If no table is chosen, prompt the user to pick their table first!
  if (!clientTable) {
    resetBtn();
    const tableMsgs = {
      fr: "Veuillez choisir votre numéro de table avant d'envoyer la commande.",
      en: "Please select your table number before sending the order.",
      de: "Bitte wählen Sie Ihre Tischnummer, bevor Sie die Bestellung senden."
    };
    showToast(tableMsgs[currentLang] || tableMsgs.fr);
    setPendingActionAfterTableSelect((selectedTable) => submitPreOrder(selectedTable, onComplete));
    showTableSelectorModal();
    return;
  }

  if (btn) {
    if (btn.disabled) return;
    btn.disabled = true;
  }
  if (spinner) spinner.style.display = "block";

  const note = document.getElementById("cdSpecialNote") ? document.getElementById("cdSpecialNote").value : "";
  const totalPrice = clientCart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const itemsList = clientCart.map(c => {
    let nameFr = c.name.fr || c.name;
    if (c.drinkChoices && c.drinkChoices.length > 0) {
      nameFr += ` (${c.drinkChoices.join(', ')})`;
    }
    return {
      name: nameFr,
      name_lang: nameFr,
      category: c.categoryNameFr || "",
      price: c.price.toString(),
      qty: c.qty,
      note: c.note || ""
    };
  });

  dbService.sendPreOrder(clientTable, itemsList, note, totalPrice, (success, orderId) => {
    resetBtn();
    if (success) {
      try {
        const chime = new Audio("https://assets.mixkit.co/active_storage/sfx/911/911-200.wav");
        chime.volume = 0.4;
        chime.play();
      } catch (e) {}

      const okMsgs = {
        fr: "Précommande envoyée ! Le serveur arrive la confirmer.",
        en: "Pre-order sent! The waiter is coming to confirm.",
        de: "Vorbestellung gesendet! Der Kellner kommt zur Bestätigung."
      };
      showToast(okMsgs[currentLang] || okMsgs.fr);

      clearCart();
      if (document.getElementById("cdSpecialNote")) {
        document.getElementById("cdSpecialNote").value = "";
      }

      const cdOverlay = document.getElementById("cartDrawerOverlay");
      const cdDrawer = document.getElementById("cartDrawer");
      if (cdOverlay) cdOverlay.classList.remove("active");
      if (cdDrawer) cdDrawer.classList.remove("active");
      document.body.classList.remove("no-scroll");

      localStorage.setItem("last_pre_order_id", orderId);

      // Subscribe to real-time status updates from waiter
      subscribeToActiveWaiterEvents(clientTable);
    } else {
      showToast("Erreur de connexion. Veuillez réessayer.");
    }
  });
}

window.submitPreOrder = submitPreOrder;

/**
 * GREY CORNER — ORDERS SERVICE (ES Module)
 */

import { currentLang } from './i18n.js';
import { clientCart, saveClientCart, clearCart, showToast } from './cart.js';
import { dbService } from '../config/firebase.js';

export function submitPreOrder(clientTable, onComplete) {
  if (!clientCart || clientCart.length === 0) return;

  const btn = document.getElementById("cdSubmitBtn");
  const spinner = document.getElementById("cdSubmitSpinner");

  if (btn) {
    if (btn.disabled) return;
    btn.disabled = true;
  }
  if (spinner) spinner.style.display = "block";

  const resetBtn = () => {
    if (btn) btn.disabled = false;
    if (spinner) spinner.style.display = "none";
    if (onComplete) onComplete();
  };

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
      if (cdOverlay) cdOverlay.classList.remove("active");

      localStorage.setItem("last_pre_order_id", orderId);
    } else {
      showToast("Erreur de connexion. Veuillez réessayer.");
    }
  });
}

window.submitPreOrder = submitPreOrder;

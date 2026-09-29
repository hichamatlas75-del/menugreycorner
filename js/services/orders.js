/**
 * GREY CORNER — ORDERS SERVICE (ES Module)
 */

import { currentLang } from './i18n.js';
import { clientCart, saveClientCart, clearCart, showToast } from './cart.js';
import { dbService } from '../config/firebase.js';
import { showTableSelectorModal, setPendingActionAfterTableSelect } from '../ui/modals.js';
import { subscribeToActiveWaiterEvents } from './notifications.js';

export const WHATSAPP_NUMBER = '212666265160';

export function GC_sendWhatsApp() {
  if (!clientCart || clientCart.length === 0) {
    const emptyMsgs = {
      fr: 'Votre panier est vide.',
      en: 'Your cart is empty.',
      de: 'Ihr Warenkorb ist leer.',
      ar: 'سلتكم فارغة.'
    };
    alert(emptyMsgs[currentLang] || emptyMsgs.fr);
    return;
  }
  const lang = currentLang || localStorage.getItem('lang') || 'fr';
  const modeLabel = window.GC_preorderMode === 'pickup'
    ? 'À emporter (comptoir)'
    : ('À table' + (window.GC_preorderTable ? ' n°' + window.GC_preorderTable : " — numéro à préciser à l'arrivée"));
  let lines = '', total = 0;
  clientCart.forEach(item => {
    const qty = item.qty || 1;
    const price = item.price || 0;
    const sub = price * qty;
    total += sub;
    const name = (item.name && typeof item.name === 'object')
      ? (item.name[lang] || item.name.fr || Object.values(item.name)[0])
      : (item.name || 'Article');
    const drinkInfo = (item.drinkChoices && item.drinkChoices.length > 0)
      ? ' (' + item.drinkChoices.join(', ') + ')'
      : '';
    lines += `• ${name}${drinkInfo}${qty > 1 ? ' x' + qty : ''} — ${sub} MAD\n`;
  });
  const noteEl = document.getElementById('cdSpecialNote');
  const noteText = noteEl && noteEl.value.trim() ? '\n📝 Note : ' + noteEl.value.trim() : '';
  const msg = `🛒 *Précommande Grey Corner*\nMode : ${modeLabel}\n─────────────────────\n${lines}─────────────────────\n💰 Total : ${total} MAD${noteText}`;
  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
  setTimeout(() => {
    clearCart();
    if (noteEl) noteEl.value = '';
    const ov = document.getElementById('cartDrawerOverlay');
    const dr = document.getElementById('cartDrawer');
    if (ov) ov.classList.remove('active');
    if (dr) dr.classList.remove('active');
    document.body.style.overflow = '';
  }, 600);
}

export function submitOrderOrWhatsApp(clientTable, onComplete) {
  if (window.GC_isPreorder) {
    GC_sendWhatsApp();
    if (onComplete) onComplete();
    return;
  }
  submitPreOrder(clientTable, onComplete);
}

export function submitPreOrder(clientTable, onComplete) {
  if (!clientCart || clientCart.length === 0) return;

  const btn = document.getElementById("cdSubmitBtn");
  const spinner = document.getElementById("cdSubmitSpinner");

  const resetBtn = () => {
    if (btn) btn.disabled = false;
    if (spinner) spinner.style.display = "none";
    if (onComplete) onComplete();
  };

  if (window.systemFrozen) {
    const frozenMsgs = {
      fr: "Le service est temporairement suspendu (mode rush). Merci de patienter un instant.",
      en: "Service is temporarily paused (rush mode). Please wait a moment.",
      de: "Der Service ist vorübergehend pausiert (Stoßzeit). Bitte warten Sie einen Moment.",
      ar: "الخدمة معلقة مؤقتاً (فترة الذروة). يرجى الانتظار لحظات."
    };
    showToast(frozenMsgs[currentLang] || frozenMsgs.fr);
    return;
  }

  if (!clientTable) {
    resetBtn();
    const tableMsgs = {
      fr: "Veuillez choisir votre numéro de table avant d'envoyer la commande.",
      en: "Please select your table number before sending the order.",
      de: "Bitte wählen Sie Ihre Tischnummer, bevor Sie die Bestellung senden.",
      ar: "يرجى اختيار رقم طاولتك قبل إرسال الطلب."
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
        de: "Vorbestellung gesendet! Der Kellner kommt zur Bestätigung.",
        ar: "تم إرسال الطلب المسبق ! النادل قادم لتأكيده."
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
window.submitOrderOrWhatsApp = submitOrderOrWhatsApp;
window.GC_sendWhatsApp = GC_sendWhatsApp;

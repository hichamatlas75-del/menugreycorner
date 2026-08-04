/**
 * GREY CORNER — MAIN CLIENT ENTRY POINT (ES Module)
 */

import { isFirebaseActive, db, dbService, whenAuthReady } from './config/firebase.js';
import { menuData } from './data/menu-data.js';
import { currentLang, setLanguage, updatePrixInfo, applyLanguageToStaticTexts, t } from './services/i18n.js';
import { GPSService } from './services/gps.js';
import { initClientCart, saveClientCart, clearCart, addToCart, updateCartUI, showToast } from './services/cart.js';
import { submitPreOrder } from './services/orders.js';
import { triggerQuickServiceCall, renderNotificationHistory, subscribeToActiveWaiterEvents, setupNotificationDrawer } from './services/notifications.js';
import {
  openCartDrawer, closeCartDrawer, openTableModal, closeTableModal,
  showTableSelectorModal, parseTableFromUrl, clientTable,
  setupBurgerMenu,
  GC_showGpsBlocked, GC_hideGpsBlocked, GC_switchGpsTab, GC_dismissGpsBlocked,
  GC_showPreorderModal, GC_hidePreorderModal
} from './ui/modals.js';
import { renderMenu, toggleCategoryDrawer, openDrawer, closeDrawer, updateFloatingButtons, setupFloatingButtons } from './ui/menu-render.js';

document.addEventListener("DOMContentLoaded", () => {
  const table = parseTableFromUrl();
  initClientCart();
  applyLanguageToStaticTexts();
  renderMenu();
  setupBurgerMenu();
  setupFloatingButtons();
  setupNotificationDrawer(() => clientTable);
  updatePrixInfo();
  GPSService.init();

  if (table) {
    subscribeToActiveWaiterEvents(table);
  }

  // Active language button state on load
  document.querySelectorAll(".lang-button[data-lang]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (setLanguage(lang)) {
        document.querySelectorAll(".lang-button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu();
        updateCartUI();
      }
    });
  });

  const gtBtn = document.getElementById("googleTranslateBtn");
  if (gtBtn) {
    gtBtn.addEventListener("click", () => {
      const gEl = document.getElementById("google_translate_element");
      if (gEl) {
        const isShown = gEl.style.display === "block";
        gEl.style.display = isShown ? "none" : "block";
      }
    });
  }

  // Allow clicking table badge in cart header to pick/change table
  const tableBadge = document.getElementById("cdTableBadge");
  if (tableBadge) {
    tableBadge.addEventListener("click", showTableSelectorModal);
  }

  // Action Bar & Cart buttons
  const btnCall = document.getElementById("cabCallWaiter");
  const btnWater = document.getElementById("cabRequestWater");
  const btnBill = document.getElementById("cabRequestBill");
  const btnOpenCart = document.getElementById("cabOpenCart");
  const btnCloseCart = document.getElementById("cdCloseBtn");
  const overlayCart = document.getElementById("cartDrawerOverlay");
  const btnSubmitOrder = document.getElementById("cdSubmitBtn");

  if (btnCall) btnCall.addEventListener("click", () => triggerQuickServiceCall(clientTable, "waiter"));
  if (btnWater) btnWater.addEventListener("click", () => triggerQuickServiceCall(clientTable, "water"));
  if (btnBill) btnBill.addEventListener("click", () => triggerQuickServiceCall(clientTable, "bill"));

  if (btnOpenCart) btnOpenCart.addEventListener("click", openCartDrawer);
  if (btnCloseCart) btnCloseCart.addEventListener("click", closeCartDrawer);
  if (overlayCart) overlayCart.addEventListener("click", closeCartDrawer);

  if (btnSubmitOrder) btnSubmitOrder.addEventListener("click", () => submitPreOrder(clientTable));

  console.log("🚀 Main ES Module initialized successfully.");
});

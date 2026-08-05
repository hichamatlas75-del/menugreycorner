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

  // Language selector modal setup
  const langModalOverlay = document.getElementById("langModalOverlay");
  const langCloseBtn = document.getElementById("langCloseBtn");

  function openLangModal() {
    if (langModalOverlay) langModalOverlay.style.display = "flex";
  }

  function closeLangModal() {
    if (langModalOverlay) langModalOverlay.style.display = "none";
  }

  if (langCloseBtn) {
    langCloseBtn.addEventListener("click", closeLangModal);
  }

  if (langModalOverlay) {
    langModalOverlay.addEventListener("click", (e) => {
      if (e.target === langModalOverlay) closeLangModal();
    });
  }

  document.querySelectorAll(".lang-button").forEach(btn => {
    btn.addEventListener("click", openLangModal);
  });

  document.querySelectorAll(".lang-option-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetBtn = e.target.closest(".lang-option-btn") || btn;
      const code = targetBtn.dataset.langCode;
      closeLangModal();

      if (["fr", "en", "de"].includes(code)) {
        // Reset Google translate if previously active
        const select = document.querySelector(".goog-te-combo");
        if (select) {
          select.value = "fr";
          select.dispatchEvent(new Event("change"));
        }
        if (setLanguage(code)) {
          document.querySelectorAll(".lang-button[data-lang]").forEach(b => {
            b.classList.toggle("active", b.dataset.lang === code);
          });
          renderMenu();
          updateCartUI();
        }
      } else {
        // Programmatically trigger Google Translate for ar, es, zh-CN, hi, ja, ru
        const select = document.querySelector(".goog-te-combo");
        if (select) {
          select.value = code;
          select.dispatchEvent(new Event("change"));
        } else {
          document.cookie = `googtrans=/fr/${code}; path=/`;
          const checkInterval = setInterval(() => {
            const s = document.querySelector(".goog-te-combo");
            if (s) {
              s.value = code;
              s.dispatchEvent(new Event("change"));
              clearInterval(checkInterval);
            }
          }, 150);
          setTimeout(() => clearInterval(checkInterval), 2500);
        }
      }
    });
  });

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

/**
 * GREY CORNER — MAIN CLIENT ENTRY POINT (ES Module)
 */

import { isFirebaseActive, db, dbService, whenAuthReady } from './config/firebase.js';
import { menuData } from './data/menu-data.js';
import { currentLang, setLanguage, updatePrixInfo, t } from './services/i18n.js';
import { GPSService } from './services/gps.js';
import { initClientCart, saveClientCart, clearCart, addToCart, updateCartUI, showToast } from './services/cart.js';
import { submitPreOrder } from './services/orders.js';
import { triggerQuickServiceCall, renderNotificationHistory } from './services/notifications.js';
import {
  openCartDrawer, closeCartDrawer, openTableModal, closeTableModal,
  setupBurgerMenu,
  GC_showGpsBlocked, GC_hideGpsBlocked, GC_switchGpsTab, GC_dismissGpsBlocked,
  GC_showPreorderModal, GC_hidePreorderModal
} from './ui/modals.js';
import { renderMenu, toggleCategoryDrawer, openDrawer, closeDrawer, updateFloatingButtons, setupFloatingButtons } from './ui/menu-render.js';

let clientTable = null;

function parseTableFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const table = params.get("table") || params.get("t");
  if (table) {
    clientTable = table;
    localStorage.setItem("grey_corner_table", table);
  } else {
    clientTable = localStorage.getItem("grey_corner_table");
  }
  updateTableUI();
}

function updateTableUI() {
  const badge = document.getElementById("cdTableBadge");
  if (badge) {
    badge.textContent = clientTable ? `Table ${clientTable}` : "Sélectionner Table";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  parseTableFromUrl();
  initClientCart();
  renderMenu();
  setupBurgerMenu();
  setupFloatingButtons();
  updatePrixInfo();
  GPSService.init();

  // Language buttons
  document.querySelectorAll(".lang-button").forEach(btn => {
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

  // Action Bar buttons
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

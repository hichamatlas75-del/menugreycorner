/**
 * GREY CORNER — MAIN CLIENT ENTRY POINT (ES Module)
 */

import { isFirebaseActive, db, dbService, whenAuthReady } from './config/firebase.js';
import { menuData } from './data/menu-data.js';
import { currentLang, setLanguage, updatePrixInfo, applyLanguageToStaticTexts, t, detectPhoneLanguage, initialDetectedLang } from './services/i18n.js';
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

  // Set initial active flag state based on currentLang
  document.querySelectorAll(".lang-button[data-lang]").forEach(b => {
    b.classList.toggle("active", b.dataset.lang === currentLang);
  });

  renderMenu();
  setupBurgerMenu();
  setupFloatingButtons();
  setupNotificationDrawer(() => clientTable);
  updatePrixInfo();
  GPSService.init();

  if (table) {
    subscribeToActiveWaiterEvents(table);
  }

  // ============================================================
  //  LANGUAGE SYSTEM — Clean separation: Internal i18n vs Google Translate
  // ============================================================

  /**
   * Reset Google Translate back to original (French).
   * Removes the googtrans cookie and resets the combo.
   * Returns a Promise that resolves after GT has been reset.
   */
  function resetGoogleTranslate() {
    return new Promise((resolve) => {
      // Clear googtrans cookies
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname;

      const select = document.querySelector(".goog-te-combo");
      if (select && select.value && select.value !== "") {
        select.value = "";
        select.dispatchEvent(new Event("change"));
        // Give Google Translate time to revert the DOM
        setTimeout(resolve, 350);
      } else {
        resolve();
      }
    });
  }

  /**
   * Trigger Google Translate to a specific language code.
   */
  function triggerGoogleTranslate(langCode) {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      // GT not loaded yet — set cookie and poll
      document.cookie = `googtrans=/fr/${langCode}; path=/`;
      const poll = setInterval(() => {
        const s = document.querySelector(".goog-te-combo");
        if (s) {
          s.value = langCode;
          s.dispatchEvent(new Event("change"));
          clearInterval(poll);
        }
      }, 200);
      setTimeout(() => clearInterval(poll), 5000);
    }
  }

  /**
   * Switch to an internal language (fr, en, de).
   * First resets Google Translate if active, then applies internal i18n.
   */
  function switchToInternalLang(lang) {
    sessionStorage.setItem("manual_lang", lang);

    resetGoogleTranslate().then(() => {
      if (setLanguage(lang)) {
        document.querySelectorAll(".lang-button[data-lang]").forEach(b => {
          b.classList.toggle("active", b.dataset.lang === lang);
        });
        renderMenu();
        updateCartUI();
      }
    });
  }

  /**
   * Switch to a Google Translate language (ar, es, zh-CN, hi, ja, ru).
   * Sets internal lang to "fr" first, then triggers GT.
   */
  function switchToGoogleTranslateLang(langCode) {
    sessionStorage.setItem("manual_lang", langCode);

    // Ensure internal state is French (base for GT)
    setLanguage("fr");
    document.querySelectorAll(".lang-button[data-lang]").forEach(b => {
      b.classList.remove("active");
    });
    renderMenu();
    updateCartUI();

    // Then trigger Google Translate on the fresh French DOM
    setTimeout(() => triggerGoogleTranslate(langCode), 100);
  }

  // --- Modal setup ---
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

  // --- Direct flag buttons (🇫🇷 🇬🇧 🇩🇪) → translate DIRECTLY ---
  document.querySelectorAll(".lang-button[data-lang]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      switchToInternalLang(btn.dataset.lang);
    });
  });

  // --- Globe button (🌐) → opens modal ---
  const gtBtn = document.getElementById("googleTranslateBtn");
  if (gtBtn) {
    gtBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openLangModal();
    });
  }

  // --- Modal language buttons ---
  document.querySelectorAll(".lang-option-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetBtn = e.target.closest(".lang-option-btn") || btn;
      const code = targetBtn.dataset.langCode;
      closeLangModal();

      if (["fr", "en", "de"].includes(code)) {
        switchToInternalLang(code);
      } else {
        switchToGoogleTranslateLang(code);
      }
    });
  });

  // --- Automatic startup: match phone language ---
  const initialLang = initialDetectedLang;
  if (!sessionStorage.getItem("manual_lang") && initialLang !== "fr") {
    if (["en", "de"].includes(initialLang)) {
      switchToInternalLang(initialLang);
    } else {
      // ar, es, zh-CN, hi, ja, ru → wait for GT to load
      const waitForGT = setInterval(() => {
        const s = document.querySelector(".goog-te-combo");
        if (s) {
          s.value = initialLang;
          s.dispatchEvent(new Event("change"));
          clearInterval(waitForGT);
        }
      }, 200);
      setTimeout(() => clearInterval(waitForGT), 5000);
    }
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

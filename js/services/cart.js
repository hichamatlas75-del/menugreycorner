/**
 * GREY CORNER — CLIENT BASKET / CART SERVICE (ES Module)
 */

import { currentLang } from './i18n.js';

export let clientCart = [];

export function initClientCart() {
  try {
    clientCart = JSON.parse(localStorage.getItem("grey_cart") || "[]");
  } catch (e) {
    clientCart = [];
  }
  updateCartUI();
}

export function saveClientCart() {
  localStorage.setItem("grey_cart", JSON.stringify(clientCart));
  updateCartUI();
}

export function clearCart() {
  clientCart = [];
  saveClientCart();
}

export function showToast(message) {
  let toast = document.getElementById("toastNotification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotification";
    toast.className = "toast-notification";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

export function addToCart(menuItem) {
  const existingIndex = clientCart.findIndex(item => item.id === menuItem.name.fr);
  if (existingIndex !== -1) {
    clientCart[existingIndex].qty += 1;
  } else {
    clientCart.push({
      id: menuItem.name.fr,
      name: menuItem.name,
      categoryNameFr: menuItem.categoryNameFr || "",
      price: parseFloat(menuItem.price) || 0,
      image: menuItem.image,
      qty: 1,
      note: ""
    });
  }
  saveClientCart();
  const toastMsgs = {
    fr: "Ajouté au panier !",
    en: "Added to basket !",
    de: "In den Korb gelegt !"
  };
  showToast(`${menuItem.name[currentLang] || menuItem.name.fr} — ${toastMsgs[currentLang] || toastMsgs.fr}`);
}

export function updateCartUI() {
  const badge = document.getElementById("cabCartBadge");
  const totalItems = clientCart.reduce((sum, item) => sum + item.qty, 0);

  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }

  const cdItemsList = document.getElementById("cdItemsList");
  const cdEmptyState = document.getElementById("cdEmptyState");
  const cdNotesSection = document.getElementById("cdNotesSection");
  const cdFooter = document.getElementById("cdFooter");
  const cdTotalPrice = document.getElementById("cdTotalPrice");

  if (cdItemsList) {
    if (clientCart.length === 0) {
      cdItemsList.innerHTML = "";
      if (cdEmptyState) cdEmptyState.style.display = "flex";
      if (cdNotesSection) cdNotesSection.style.display = "none";
      if (cdFooter) cdFooter.style.display = "none";
    } else {
      if (cdEmptyState) cdEmptyState.style.display = "none";
      if (cdNotesSection) cdNotesSection.style.display = "flex";
      if (cdFooter) cdFooter.style.display = "block";

      cdItemsList.innerHTML = "";
      clientCart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cd-item";
        const drinkChoicesStr = item.drinkChoices && item.drinkChoices.length > 0
          ? `<div style="font-size:0.75rem; color:var(--sc-gold-light); margin-top:2px;">☕ ${item.drinkChoices.join(', ')}</div>`
          : '';

        itemDiv.innerHTML = `
          <div class="cd-item-img" style="background-image: url('${item.image}')"></div>
          <div class="cd-item-details">
            <h4 class="cd-item-name">${item.name[currentLang] || item.name.fr || item.name}</h4>
            ${drinkChoicesStr}
            <span class="cd-item-price">${item.price * item.qty} MAD</span>
          </div>
          <div class="cd-item-actions">
            <div class="cd-qty-wrap">
              <button class="cd-qty-btn cd-dec" data-id="${item.id}">-</button>
              <span class="cd-qty-num">${item.qty}</span>
              <button class="cd-qty-btn cd-inc" data-id="${item.id}">+</button>
            </div>
            <button class="cd-remove-btn" data-id="${item.id}" title="Supprimer">🗑️</button>
          </div>
        `;

        itemDiv.querySelector(".cd-dec").addEventListener("click", () => {
          const idx = clientCart.findIndex(c => c.id === item.id);
          if (idx !== -1) {
            if (clientCart[idx].qty > 1) {
              clientCart[idx].qty -= 1;
            } else {
              clientCart.splice(idx, 1);
            }
            saveClientCart();
          }
        });

        itemDiv.querySelector(".cd-inc").addEventListener("click", () => {
          const idx = clientCart.findIndex(c => c.id === item.id);
          if (idx !== -1) {
            clientCart[idx].qty += 1;
            saveClientCart();
          }
        });

        itemDiv.querySelector(".cd-remove-btn").addEventListener("click", () => {
          const idx = clientCart.findIndex(c => c.id === item.id);
          if (idx !== -1) {
            clientCart.splice(idx, 1);
            saveClientCart();
          }
        });

        cdItemsList.appendChild(itemDiv);
      });

      const totalPrice = clientCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      if (cdTotalPrice) cdTotalPrice.textContent = `${totalPrice} MAD`;
    }
  }
}

// Bind to window for backwards compatibility
window.clientCart = clientCart;
window.initClientCart = initClientCart;
window.saveClientCart = saveClientCart;
window.clearCart = clearCart;
window.addToCart = addToCart;
window.updateCartUI = updateCartUI;
window.showToast = showToast;

/**
 * GREY CORNER — MENU RENDERING & DRAWER UI COMPONENT (ES Module)
 */

import { menuData } from '../data/menu-data.js';
import { currentLang } from '../services/i18n.js';
import { addToCart } from '../services/cart.js';

export function updateFloatingButtons() {
  const openDrawerElement = document.querySelector(".category-drawer.open");
  const floatingCloseCategory = document.getElementById("floatingCloseCategory");
  const backToTop = document.getElementById("backToTop");

  if (openDrawerElement) {
    if (floatingCloseCategory) floatingCloseCategory.classList.add("show");
    if (backToTop) backToTop.classList.remove("show");
  } else {
    if (floatingCloseCategory) floatingCloseCategory.classList.remove("show");
    if (backToTop) {
      backToTop.classList.toggle("show", window.scrollY > 400);
    }
  }
}

export function openDrawer(drawer, scrollToFirst = false) {
  const body = drawer.querySelector(".category-drawer-body");
  if (!body) return;

  drawer.classList.add("open");
  body.style.maxHeight = body.scrollHeight + "px";

  const onTransitionEnd = () => {
    if (drawer.classList.contains("open")) {
      body.style.maxHeight = "none";
    }
    body.removeEventListener("transitionend", onTransitionEnd);
  };
  body.addEventListener("transitionend", onTransitionEnd);

  updateFloatingButtons();

  if (scrollToFirst) {
    const firstItem = drawer.querySelector(".menu-item");
    if (firstItem) {
      setTimeout(() => {
        firstItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    } else {
      setTimeout(() => {
        drawer.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }
}

export function closeDrawer(drawer) {
  const body = drawer.querySelector(".category-drawer-body");
  if (!body) return;

  body.style.maxHeight = body.scrollHeight + "px";
  body.offsetHeight; // force reflow

  drawer.classList.remove("open");
  body.style.maxHeight = "0";

  updateFloatingButtons();
}

export function toggleCategoryDrawer(drawerIdOrElement) {
  const drawer = typeof drawerIdOrElement === "string"
    ? document.getElementById(drawerIdOrElement)
    : drawerIdOrElement;
  if (!drawer) return;

  const isOpen = drawer.classList.contains("open");

  if (!isOpen) {
    document.querySelectorAll(".category-drawer.open").forEach(other => {
      if (other !== drawer) {
        closeDrawer(other);
      }
    });
    openDrawer(drawer, true);
  } else {
    closeDrawer(drawer);
  }
}

export function renderMenu() {
  const menuGrid = document.getElementById("menu-grid");
  if (!menuData || !Array.isArray(menuData) || !menuGrid) {
    return;
  }

  menuGrid.innerHTML = "";

  menuData.forEach((category, catIndex) => {
    const categoryId = category.id || category.category.fr.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const bannerImg = (category.items && category.items.length > 0)
        ? category.items[0].image
        : "images/logo-gold.png";

    const drawer = document.createElement("div");
    drawer.className = "category-drawer";
    drawer.id = categoryId;

    drawer.innerHTML = `
      <div class="category-drawer-header">
        <div class="category-drawer-header-bg" style="background-image: url('${bannerImg}')"></div>
        <div class="category-drawer-header-overlay"></div>
        <div class="category-drawer-header-content">
          <h2 class="category-drawer-title">${category.category[currentLang] || category.category.fr}</h2>
          <span class="category-drawer-chevron">
            <svg viewBox="0 0 24 24">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="category-drawer-body">
        <div class="category-drawer-grid items"></div>
      </div>
    `;

    const header = drawer.querySelector(".category-drawer-header");
    header.addEventListener("click", () => {
      toggleCategoryDrawer(drawer);
    });

    const itemsContainer = drawer.querySelector(".items");

    category.items.forEach((item, itemIndex) => {
      item.categoryId = categoryId;
      item.categoryNameFr = category.category.fr;
      const card = document.createElement("article");
      card.className = "menu-item";
      card.id = `item-${categoryId}-${itemIndex}`;
      card.style.setProperty("--item-index", itemIndex);
      card._menuItem = item;

      if (item.isNew === true) {
        card.classList.add("nouveau-flash");
        const badgeText = currentLang === "en" ? "NEW"
          : currentLang === "de" ? "NEU"
            : "NOUVEAU";
        card.setAttribute("data-badge", badgeText);
      }

      card.dataset.img = item.image;
      card.dataset.alt = item.name[currentLang] || item.name.fr;

      const btnText = currentLang === "en" ? "+ Add"
        : currentLang === "de" ? "+ Hinzufügen"
          : "+ Ajouter";

      card.innerHTML = `
        <div class="item-img-wrapper" style="background-image: url('${item.image}')"></div>
        <div class="item-info">
            <div class="item-price-line">
                <h3 class="item-name">${item.name[currentLang] || item.name.fr}</h3>
                <span class="item-price">${item.price}</span>
            </div>
            <p class="item-desc">${item.description[currentLang] || item.description.fr}</p>
            <button class="add-to-cart-btn" aria-label="Ajouter au panier">${btnText}</button>
        </div>
      `;

      const addBtn = card.querySelector(".add-to-cart-btn");
      if (addBtn) {
        addBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          addToCart(item);
        });
      }

      itemsContainer.appendChild(card);
    });

    menuGrid.appendChild(drawer);
  });
}

// Bind to window for backwards compatibility
window.renderMenu = renderMenu;
window.toggleCategoryDrawer = toggleCategoryDrawer;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.updateFloatingButtons = updateFloatingButtons;

/**
 * GREY CORNER — MENU RENDERING, NAVIGATION & DRAWER UI COMPONENT (ES Module)
 */

import { menuData } from '../data/menu-data.js';
import { currentLang } from '../services/i18n.js';
import { addToCart } from '../services/cart.js';
import { closeBurgerMenu, checkItemOptionsAndAdd } from './modals.js';

let imagesProtected = false;

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

export function handleHashNavigation() {
  const hash = window.location.hash;
  if (!hash) return;

  const targetId = hash.substring(1);
  const targetDrawer = document.getElementById(targetId);
  if (targetDrawer && targetDrawer.classList.contains("category-drawer")) {
    if (targetDrawer.classList.contains("open")) return;

    document.querySelectorAll(".category-drawer.open").forEach(other => {
      if (other !== targetDrawer) {
        closeDrawer(other);
      }
    });

    openDrawer(targetDrawer, true);
  }
}

export function setupNavigationListeners() {
  window.addEventListener("hashchange", handleHashNavigation);

  // Bind category navigation links (both horizontal scrollbar & burger menu links)
  const navLinks = document.querySelectorAll(".categories-horizontal a, #burgerNav a");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const targetId = href.substring(1);
        const targetDrawer = document.getElementById(targetId);
        if (targetDrawer && targetDrawer.classList.contains("category-drawer")) {
          e.preventDefault();

          // Close burger menu if open
          closeBurgerMenu();

          // Accordion: close other drawers
          document.querySelectorAll(".category-drawer.open").forEach(other => {
            if (other !== targetDrawer) {
              closeDrawer(other);
            }
          });

          openDrawer(targetDrawer, true);

          if (window.location.hash !== href) {
            history.pushState(null, "", href);
          }
        }
      }
    });
  });

  if (window.location.hash) {
    setTimeout(handleHashNavigation, 300);
  }
}

export function setupFloatingButtons() {
  window.addEventListener("scroll", updateFloatingButtons, { passive: true });

  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const floatingCloseCategory = document.getElementById("floatingCloseCategory");
  if (floatingCloseCategory) {
    floatingCloseCategory.addEventListener("click", () => {
      const openDrawerElement = document.querySelector(".category-drawer.open");
      if (openDrawerElement) {
        closeDrawer(openDrawerElement);
        setTimeout(() => {
          openDrawerElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    });
  }
}

export function applySearchFilter() {
  const input = document.getElementById("searchInput");
  const clearBtn = document.getElementById("searchClearBtn");
  if (!input) return;

  const term = (input.value || "").toLowerCase().trim();
  if (clearBtn) {
    clearBtn.style.display = term ? "flex" : "none";
  }

  const cards = document.querySelectorAll(".menu-item");

  cards.forEach(card => {
    const title = (card.querySelector(".item-name")?.textContent || "").toLowerCase();
    const desc = (card.querySelector(".item-desc")?.textContent || "").toLowerCase();
    const match = !term || title.includes(term) || desc.includes(term);
    card.style.display = match ? "" : "none";
  });

  const drawers = document.querySelectorAll(".category-drawer");
  drawers.forEach(drawer => {
    const body = drawer.querySelector(".category-drawer-body");
    const visibles = drawer.querySelectorAll(".menu-item:not([style*='display: none'])");

    if (term) {
      if (visibles.length > 0) {
        drawer.style.display = "";
        drawer.classList.add("open");
        if (body) body.style.maxHeight = "none";
      } else {
        drawer.style.display = "none";
        drawer.classList.remove("open");
        if (body) body.style.maxHeight = "0";
      }
    } else {
      drawer.style.display = "";
      drawer.classList.remove("open");
      if (body) body.style.maxHeight = "0";
    }
  });
}

export function activateSearch() {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("searchClearBtn");
  if (!searchInput) return;

  searchInput.removeEventListener("input", applySearchFilter);
  searchInput.addEventListener("input", applySearchFilter);

  if (clearBtn && !clearBtn._hasClickListener) {
    clearBtn._hasClickListener = true;
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      applySearchFilter();
      searchInput.focus();
    });
  }
}

export function closeLightbox() {
  const secureLightbox = document.getElementById("secureLightbox");
  const secureLightboxContent = document.querySelector(".secure-lightbox-content");
  if (!secureLightbox) return;

  secureLightbox.classList.remove("active");
  if (secureLightboxContent) secureLightboxContent.style.backgroundImage = "";

  const lbAddBtn = document.getElementById("secureLightboxAddBtn");
  if (lbAddBtn) lbAddBtn.style.display = "none";

  const lbCaption = document.getElementById("secureLightboxCaption");
  if (lbCaption) lbCaption.textContent = "";

  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
}

let activeLightboxItem = null;

export function openLightboxForItem(item, imgUrl) {
  const secureLightbox = document.getElementById("secureLightbox");
  const secureLightboxContent = document.querySelector(".secure-lightbox-content");
  if (!secureLightbox || !secureLightboxContent || !imgUrl) return;

  const lbAddBtn = document.getElementById("secureLightboxAddBtn");
  const lbCaption = document.getElementById("secureLightboxCaption");
  activeLightboxItem = item;

  secureLightboxContent.style.backgroundImage = `url("${imgUrl}")`;

  if (item && lbCaption) {
    lbCaption.textContent = `${item.name[currentLang] || item.name.fr} — ${item.price}`;
  } else if (lbCaption) {
    lbCaption.textContent = "";
  }

  if (item && lbAddBtn) {
    lbAddBtn.style.display = "block";
    const btnText = currentLang === "en" ? "+ Add to cart"
      : currentLang === "de" ? "+ In den Warenkorb"
        : "+ Ajouter au panier";
    lbAddBtn.textContent = btnText;
  } else if (lbAddBtn) {
    lbAddBtn.style.display = "none";
  }

  secureLightbox.classList.add("active");
  document.body.classList.add("no-scroll");
  document.documentElement.classList.add("no-scroll");
}

export function enableSecureLightbox() {
  const secureLightbox = document.getElementById("secureLightbox");
  const secureLightboxContent = document.querySelector(".secure-lightbox-content");
  if (!secureLightbox || !secureLightboxContent) return;

  const lbAddBtn = document.getElementById("secureLightboxAddBtn");

  if (lbAddBtn && !lbAddBtn._hasClickListener) {
    lbAddBtn._hasClickListener = true;
    lbAddBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (activeLightboxItem) {
        closeLightbox();
        checkItemOptionsAndAdd(activeLightboxItem);
      }
    });
  }

  if (!secureLightbox._hasCloseListeners) {
    secureLightbox._hasCloseListeners = true;
    secureLightbox.addEventListener("click", e => {
      if (e.target === secureLightbox) closeLightbox();
    });

    const closeBtn = secureLightboxContent.querySelector(".close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeLightbox);
    }

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && secureLightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }
}

export function protectImages() {
  if (imagesProtected) return;
  imagesProtected = true;

  document.addEventListener("contextmenu", e => e.preventDefault());
  document.body.style.userSelect = "none";
  document.body.style.webkitUserSelect = "none";
  document.body.style.webkitTouchCallout = "none";
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
        : "images/logo-gold.webp";

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

      itemsContainer.appendChild(card);
    });

    menuGrid.appendChild(drawer);
  });

  if (!menuGrid._hasDelegatedListener) {
    menuGrid._hasDelegatedListener = true;
    menuGrid.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".add-to-cart-btn");
      if (addBtn) {
        e.stopPropagation();
        const card = addBtn.closest(".menu-item");
        if (card && card._menuItem) {
          checkItemOptionsAndAdd(card._menuItem);
        }
        return;
      }
      const card = e.target.closest(".menu-item");
      if (card && card._menuItem) {
        openLightboxForItem(card._menuItem, card.dataset.img);
      }
    });
  }

  setupNavigationListeners();
  activateSearch();
  enableSecureLightbox();
  protectImages();
}

// Bind to window for backwards compatibility
window.renderMenu = renderMenu;
window.toggleCategoryDrawer = toggleCategoryDrawer;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.updateFloatingButtons = updateFloatingButtons;
window.enableSecureLightbox = enableSecureLightbox;
window.closeLightbox = closeLightbox;
window.setupNavigationListeners = setupNavigationListeners;

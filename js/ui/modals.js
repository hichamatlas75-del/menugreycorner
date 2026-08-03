/**
 * GREY CORNER — UI MODALS & DRAWERS (ES Module)
 */

import { updateCartUI } from '../services/cart.js';

export let clientTable = null;
export let pendingActionAfterTableSelect = null;

export function setPendingActionAfterTableSelect(action) {
  pendingActionAfterTableSelect = action;
}

export function parseTableFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const table = params.get("table") || params.get("t");
  if (table) {
    clientTable = table;
    localStorage.setItem("grey_corner_table", table);
  } else {
    clientTable = localStorage.getItem("grey_corner_table");
  }
  updateTableUI();
  return clientTable;
}

export function updateTableUI() {
  const badge = document.getElementById("cdTableBadge");
  if (badge) {
    badge.textContent = clientTable ? `Table ${clientTable}` : "Sélectionner Table";
    badge.style.cursor = "pointer";
  }
  const ndTableBadge = document.getElementById("ndTableBadge");
  if (ndTableBadge) {
    ndTableBadge.textContent = clientTable ? `Table ${clientTable}` : "Table non définie";
  }
}

export function setTable(num) {
  clientTable = String(num);
  localStorage.setItem("grey_corner_table", clientTable);
  updateTableUI();

  try {
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?table=${num}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  } catch (e) {}

  closeTableModal();

  if (typeof pendingActionAfterTableSelect === "function") {
    const action = pendingActionAfterTableSelect;
    pendingActionAfterTableSelect = null;
    setTimeout(() => action(clientTable), 150);
  }
}

export function showTableSelectorModal() {
  const modal = document.getElementById("tableModalOverlay");
  const grid = document.getElementById("tableGridSelect");

  if (!modal || !grid) return;

  modal.style.display = "flex";
  grid.innerHTML = "";

  const zones = [
    { name: "Terrasse (Tables 1 à 8)", start: 1, end: 8 },
    { name: "Salle Principale (Tables 9 à 16)", start: 9, end: 16 },
    { name: "Mezzanine (Tables 17 à 24)", start: 17, end: 24 }
  ];

  zones.forEach(zone => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "8px";
    wrapper.style.width = "100%";
    wrapper.style.marginBottom = "14px";

    const title = document.createElement("div");
    title.style.fontFamily = "'DM Sans', sans-serif";
    title.style.fontSize = "0.75rem";
    title.style.fontWeight = "700";
    title.style.letterSpacing = "0.08em";
    title.style.color = "var(--sc-gold-light)";
    title.style.textTransform = "uppercase";
    title.style.textAlign = "left";
    title.style.borderBottom = "1px solid var(--sc-border)";
    title.style.paddingBottom = "4px";
    title.style.marginBottom = "6px";
    title.textContent = zone.name;

    const btnGrid = document.createElement("div");
    btnGrid.style.display = "grid";
    btnGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
    btnGrid.style.gap = "8px";

    for (let i = zone.start; i <= zone.end; i++) {
      const btn = document.createElement("button");
      btn.className = "tgs-btn";
      btn.textContent = `T. ${i}`;
      if (String(clientTable) === String(i)) {
        btn.classList.add("active");
        btn.style.background = "var(--sc-gold-light)";
        btn.style.color = "#000";
        btn.style.fontWeight = "bold";
      }
      btn.onclick = () => setTable(i);
      btnGrid.appendChild(btn);
    }

    wrapper.appendChild(title);
    wrapper.appendChild(btnGrid);
    grid.appendChild(wrapper);
  });
}

export function openCartDrawer() {
  const overlay = document.getElementById("cartDrawerOverlay");
  const drawer = document.getElementById("cartDrawer");

  if (typeof updateCartUI === "function") {
    updateCartUI();
  }

  if (overlay && drawer) {
    overlay.classList.add("active");
    drawer.classList.add("active");
    document.body.classList.add("no-scroll");
  }
}

export function closeCartDrawer() {
  const overlay = document.getElementById("cartDrawerOverlay");
  const drawer = document.getElementById("cartDrawer");

  if (overlay && drawer) {
    overlay.classList.remove("active");
    drawer.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
}

export function openTableModal() {
  showTableSelectorModal();
}

export function closeTableModal() {
  const overlay = document.getElementById("tableModalOverlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

// ── BURGER MENU ──
export function openBurgerMenu() {
  const burger = document.getElementById("burger");
  const burgerNav = document.getElementById("burgerNav");
  const burgerOverlay = document.getElementById("burgerOverlay");

  if (!burger || !burgerNav || !burgerOverlay) return;
  burger.classList.add("active");
  burger.setAttribute("aria-expanded", "true");
  burgerNav.classList.add("active");
  burgerOverlay.classList.add("active");
  document.body.classList.add("no-scroll");
  document.documentElement.classList.add("no-scroll");
}

export function closeBurgerMenu() {
  const burger = document.getElementById("burger");
  const burgerNav = document.getElementById("burgerNav");
  const burgerOverlay = document.getElementById("burgerOverlay");

  if (!burger || !burgerNav || !burgerOverlay) return;
  burger.classList.remove("active");
  burger.setAttribute("aria-expanded", "false");
  burgerNav.classList.remove("active");
  burgerOverlay.classList.remove("active");
  document.body.classList.remove("no-scroll");
  document.documentElement.classList.remove("no-scroll");
}

export function setupBurgerMenu() {
  const burger = document.getElementById("burger");
  const burgerNav = document.getElementById("burgerNav");
  const burgerOverlay = document.getElementById("burgerOverlay");

  if (burger && burgerNav && burgerOverlay) {
    burger.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = burgerNav.classList.contains("active");
      isOpen ? closeBurgerMenu() : openBurgerMenu();
    };

    burgerOverlay.onclick = () => closeBurgerMenu();

    burgerNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => closeBurgerMenu());
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && burgerNav.classList.contains("active")) {
        closeBurgerMenu();
      }
    });
  }
}

// ── MODAL GPS BLOQUÉ (Multi-Mobile) ──
export function GC_switchGpsTab(type) {
  const btnAndroid = document.getElementById('gpsTabAndroid');
  const btnIos = document.getElementById('gpsTabIos');
  const guideAndroid = document.getElementById('gpsGuideAndroid');
  const guideIos = document.getElementById('gpsGuideIos');

  if (!btnAndroid || !btnIos || !guideAndroid || !guideIos) return;

  const ACTIVE_BG = 'rgba(201,168,76,0.18)';
  const ACTIVE_COLOR = '#C9A84C';
  const INACTIVE_BG = 'transparent';
  const INACTIVE_COLOR = 'rgba(240,234,216,0.5)';

  if (type === 'ios') {
    btnIos.style.background = ACTIVE_BG;
    btnIos.style.color = ACTIVE_COLOR;
    btnIos.style.fontWeight = '700';

    btnAndroid.style.background = INACTIVE_BG;
    btnAndroid.style.color = INACTIVE_COLOR;
    btnAndroid.style.fontWeight = '600';

    guideIos.style.display = 'flex';
    guideAndroid.style.display = 'none';
  } else {
    btnAndroid.style.background = ACTIVE_BG;
    btnAndroid.style.color = ACTIVE_COLOR;
    btnAndroid.style.fontWeight = '700';

    btnIos.style.background = INACTIVE_BG;
    btnIos.style.color = INACTIVE_COLOR;
    btnIos.style.fontWeight = '600';

    guideAndroid.style.display = 'flex';
    guideIos.style.display = 'none';
  }
}

export function GC_showGpsBlocked() {
  const overlay = document.getElementById('gpsBlockedOverlay');
  const sheet   = document.getElementById('gpsBlockedSheet');
  if (!overlay) return;

  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  GC_switchGpsTab(isIOS ? 'ios' : 'android');

  overlay.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (sheet) sheet.style.transform = 'translateY(0)';
  }));
}

export function GC_hideGpsBlocked() {
  const overlay = document.getElementById('gpsBlockedOverlay');
  const sheet   = document.getElementById('gpsBlockedSheet');
  if (!overlay) return;
  if (sheet) sheet.style.transform = 'translateY(100%)';
  setTimeout(() => { overlay.style.display = 'none'; }, 380);
}

export function GC_dismissGpsBlocked() {
  GC_hideGpsBlocked();
  const bar = document.getElementById('clientActionBar');
  if (bar) bar.style.display = 'none';
}

export function GC_showPreorderModal() {
  const overlay = document.getElementById('preorderModeOverlay');
  const sheet   = document.getElementById('preorderModeSheet');
  if (!overlay) return;
  overlay.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (sheet) sheet.style.transform = 'translateY(0)';
  }));
}

export function GC_hidePreorderModal() {
  const overlay = document.getElementById('preorderModeOverlay');
  const sheet   = document.getElementById('preorderModeSheet');
  if (!overlay) return;
  if (sheet) sheet.style.transform = 'translateY(100%)';
  setTimeout(() => { overlay.style.display = 'none'; }, 380);
}

// Bind to window for backwards compatibility with inline HTML onclicks
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.openTableModal = openTableModal;
window.closeTableModal = closeTableModal;
window.showTableSelectorModal = showTableSelectorModal;
window.setTable = setTable;
window.openBurgerMenu = openBurgerMenu;
window.closeBurgerMenu = closeBurgerMenu;
window.setupBurgerMenu = setupBurgerMenu;
window.GC_switchGpsTab = GC_switchGpsTab;
window.GC_showGpsBlocked = GC_showGpsBlocked;
window.GC_hideGpsBlocked = GC_hideGpsBlocked;
window.GC_dismissGpsBlocked = GC_dismissGpsBlocked;
window.GC_showPreorderModal = GC_showPreorderModal;
window.GC_hidePreorderModal = GC_hidePreorderModal;

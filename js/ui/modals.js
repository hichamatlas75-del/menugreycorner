import { updateCartUI, addToCart } from '../services/cart.js';
import { getTableZoneName } from '../config/firebase.js';
import { currentLang } from '../services/i18n.js';

export let clientTable = null;
export let pendingActionAfterTableSelect = null;

export const HOT_DRINKS_OPTIONS = [
  { fr: "Café Séparé", en: "Separated Coffee", de: "Getrennter Kaffee" },
  { fr: "Lait Froid", en: "Cold Milk", de: "Kalte Milch" },
  { fr: "Lait Chaud", en: "Hot Milk", de: "Warme Milch" },
  { fr: "Café Noir", en: "Black Coffee", de: "Schwarzer Kaffee" },
  { fr: "Cappuccino Italien", en: "Italian Cappuccino", de: "Italienischer Cappuccino" },
  { fr: "Café Cassé", en: "Café Cassé", de: "Café Cassé" },
  { fr: "Jus d'Orange", en: "Orange Juice", de: "Orangensaft" },
  { fr: "Lait Cassé", en: "Lait Cassé", de: "Lait Cassé" },
  { fr: "Café Moitié", en: "Half Coffee", de: "Halber Kaffee" },
  { fr: "Chocolat au Lait", en: "Milk Chocolate", de: "Milchschokolade" },
  { fr: "Café Américain", en: "Americano Coffee", de: "Kaffee Americano" },
  { fr: "Café au Lait", en: "Coffee with Milk", de: "Milchkaffee" },
  { fr: "Thé à la Menthe", en: "Mint Tea", de: "Minztee" },
  { fr: "Thé Noir", en: "Black Tea", de: "Schwarzer Tee" },
  { fr: "Thé Noir au Lait", en: "Black Tea with Milk", de: "Schwarzer Tee mit Milch" },
  { fr: "Verveine", en: "Verbena Infusion", de: "Eisenkraut Tee" }
];

export const SIDES_OPTIONS = [
  { fr: "Légumes sautés", en: "Sautéed vegetables", de: "Sautiertes Gemüse" },
  { fr: "Riz", en: "Rice", de: "Reis" },
  { fr: "Frites", en: "French Fries", de: "Pommes Frites" },
  { fr: "Purée pomme de terre", en: "Mashed potatoes", de: "Kartoffelpüree" },
  { fr: "Potatos", en: "Potato Wedges", de: "Spaltenkartoffeln" }
];

export const PASTA_OPTIONS = [
  { fr: "Rigatoni", en: "Rigatoni", de: "Rigatoni" },
  { fr: "Tagliatelles", en: "Tagliatelle", de: "Tagliatelle" },
  { fr: "Spaghettis", en: "Spaghetti", de: "Spaghetti" },
  { fr: "Linguines", en: "Linguine", de: "Linguine" }
];

let selectedOptionMenuItem = null;

function renderOptionList(listContainerId, counterId, confirmBtnId, optionsArray, limit, modalEl) {
  const listContainer = document.getElementById(listContainerId);
  if (!listContainer) return;
  listContainer.innerHTML = "";

  const counts = {};
  optionsArray.forEach((_, idx) => { counts[idx] = 0; });

  function updateListUI() {
    const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);

    const counterEl = document.getElementById(counterId);
    const counterTexts = {
      fr: `Sélection : ${totalSelected} / ${limit}`,
      en: `Selection: ${totalSelected} / ${limit}`,
      de: `Auswahl: ${totalSelected} / ${limit}`
    };
    if (counterEl) {
      counterEl.textContent = counterTexts[currentLang] || counterTexts.fr;
    }

    const confirmBtn = document.getElementById(confirmBtnId);
    if (confirmBtn) {
      confirmBtn.disabled = (totalSelected !== limit);
    }

    optionsArray.forEach((opt, idx) => {
      const row = listContainer.querySelector(`[data-index="${idx}"]`);
      if (row) {
        const countVal = counts[idx];
        const countDisplay = row.querySelector(".hdo-qty");
        const decBtn = row.querySelector(".hdo-dec");
        const incBtn = row.querySelector(".hdo-inc");

        if (countDisplay) countDisplay.textContent = countVal;
        if (countVal > 0) {
          row.classList.add("selected");
        } else {
          row.classList.remove("selected");
        }

        if (decBtn) decBtn.disabled = (countVal === 0);
        if (incBtn) incBtn.disabled = (totalSelected >= limit);
      }
    });
  }

  optionsArray.forEach((opt, idx) => {
    const item = document.createElement("div");
    item.className = "hdo-item";
    item.dataset.index = idx;

    item.innerHTML = `
      <div class="hdo-name">${opt[currentLang] || opt.fr}</div>
      <div style="display: flex; align-items: center; gap: 12px; z-index: 10;">
        <button class="tgs-btn hdo-dec" style="width: 28px; height: 28px; border-radius: 6px; font-size: 1rem; line-height: 1; aspect-ratio: auto; font-weight: bold; background: var(--bg);" disabled>-</button>
        <span class="hdo-qty" style="font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: 600; color: var(--text); min-width: 14px; text-align: center;">0</span>
        <button class="tgs-btn hdo-inc" style="width: 28px; height: 28px; border-radius: 6px; font-size: 1rem; line-height: 1; aspect-ratio: auto; font-weight: bold; background: var(--bg);">+</button>
      </div>
    `;

    const decBtn = item.querySelector(".hdo-dec");
    const incBtn = item.querySelector(".hdo-inc");

    decBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (counts[idx] > 0) {
        counts[idx]--;
        updateListUI();
      }
    });

    incBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);
      if (totalSelected < limit) {
        counts[idx]++;
        updateListUI();
      } else if (limit === 1) {
        optionsArray.forEach((_, i) => { counts[i] = 0; });
        counts[idx] = 1;
        updateListUI();
      }
    });

    listContainer.appendChild(item);
  });

  updateListUI();

  const confirmBtn = document.getElementById(confirmBtnId);
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      const finalChoices = [];
      optionsArray.forEach((opt, idx) => {
        const qty = counts[idx];
        for (let k = 0; k < qty; k++) {
          finalChoices.push(opt[currentLang] || opt.fr);
        }
      });

      if (modalEl) modalEl.style.display = "none";
      if (selectedOptionMenuItem) {
        addToCart(selectedOptionMenuItem, finalChoices);
      }
    };
  }
}

export function openHotDrinkSelectorModal(menuItem) {
  selectedOptionMenuItem = menuItem;
  const modal = document.getElementById("hotDrinkModalOverlay");
  if (!modal) return;

  modal.style.display = "flex";

  const isBrunchDuo = (menuItem.name && menuItem.name.fr === "BRUNCH DUO");
  const limit = isBrunchDuo ? 2 : 1;

  const titleEl = document.getElementById("hotDrinkModalTitle");
  const subtitleEl = document.getElementById("hotDrinkModalSubtitle");

  const titles = {
    fr: isBrunchDuo ? "Sélectionnez 2 Boissons Chaudes" : "Choisissez votre Boisson Chaude",
    en: isBrunchDuo ? "Select 2 Hot Beverages" : "Choose Your Hot Beverage",
    de: isBrunchDuo ? "Wählen Sie 2 Heißgetränke" : "Wählen Sie Ihr Heißgetränk"
  };

  const subtitles = {
    fr: `Votre menu "${menuItem.name[currentLang] || menuItem.name.fr}" comprend ${limit} boisson(s) chaude(s) au choix.`,
    en: `Your "${menuItem.name[currentLang] || menuItem.name.fr}" menu includes ${limit} choice(s) of hot beverage.`,
    de: `Ihr Menü "${menuItem.name[currentLang] || menuItem.name.fr}" beinhaltet ${limit} Heißgetränk(e) nach Wahl.`
  };

  if (titleEl) titleEl.textContent = titles[currentLang] || titles.fr;
  if (subtitleEl) subtitleEl.textContent = subtitles[currentLang] || subtitles.fr;

  const closeBtn = document.getElementById("hotDrinkCloseBtn");
  if (closeBtn) {
    closeBtn.onclick = () => { modal.style.display = "none"; };
  }

  renderOptionList("hotDrinksList", "hotDrinkCounter", "hotDrinkConfirmBtn", HOT_DRINKS_OPTIONS, limit, modal);
}

export function openSidesSelectorModal(menuItem) {
  selectedOptionMenuItem = menuItem;
  const modal = document.getElementById("sidesModalOverlay");
  if (!modal) return;

  modal.style.display = "flex";

  const limit = 2;

  const titleEl = document.getElementById("sidesModalTitle");
  const subtitleEl = document.getElementById("sidesModalSubtitle");

  const titles = {
    fr: "Choisissez 2 Accompagnements",
    en: "Choose 2 Accompaniments",
    de: "Wählen Sie 2 Beilagen"
  };

  const subtitles = {
    fr: `Veuillez sélectionner 2 accompagnements de votre choix pour "${menuItem.name[currentLang] || menuItem.name.fr}".`,
    en: `Please select 2 accompaniments of your choice for "${menuItem.name[currentLang] || menuItem.name.fr}".`,
    de: `Bitte wählen Sie 2 Beilagen Ihrer Wahl für "${menuItem.name[currentLang] || menuItem.name.fr}".`
  };

  if (titleEl) titleEl.textContent = titles[currentLang] || titles.fr;
  if (subtitleEl) subtitleEl.textContent = subtitles[currentLang] || subtitles.fr;

  const closeBtn = document.getElementById("sidesCloseBtn");
  if (closeBtn) {
    closeBtn.onclick = () => { modal.style.display = "none"; };
  }

  renderOptionList("sidesList", "sidesCounter", "sidesConfirmBtn", SIDES_OPTIONS, limit, modal);
}

export function openPastaSelectorModal(menuItem) {
  selectedOptionMenuItem = menuItem;
  const modal = document.getElementById("pastaModalOverlay");
  if (!modal) return;

  modal.style.display = "flex";

  const limit = 1;

  const titleEl = document.getElementById("pastaModalTitle");
  const subtitleEl = document.getElementById("pastaModalSubtitle");

  const titles = {
    fr: "Choisissez votre type de pâtes",
    en: "Choose your type of pasta",
    de: "Wählen Sie Ihre Nudelsorte"
  };

  const subtitles = {
    fr: `Veuillez sélectionner le type de pâtes pour votre plat "${menuItem.name[currentLang] || menuItem.name.fr}".`,
    en: `Please select the pasta type for your "${menuItem.name[currentLang] || menuItem.name.fr}" dish.`,
    de: `Bitte wählen Sie die Nudelsorte für Ihr Gericht "${menuItem.name[currentLang] || menuItem.name.fr}".`
  };

  if (titleEl) titleEl.textContent = titles[currentLang] || titles.fr;
  if (subtitleEl) subtitleEl.textContent = subtitles[currentLang] || subtitles.fr;

  const closeBtn = document.getElementById("pastaCloseBtn");
  if (closeBtn) {
    closeBtn.onclick = () => { modal.style.display = "none"; };
  }

  renderOptionList("pastaList", "pastaCounter", "pastaConfirmBtn", PASTA_OPTIONS, limit, modal);
}

export function checkItemOptionsAndAdd(menuItem) {
  if (!menuItem) return;
  const nameFr = menuItem.name && menuItem.name.fr ? menuItem.name.fr : String(menuItem.name || "");
  const upperName = nameFr.toUpperCase();
  const catId = menuItem.categoryId || "";

  // 1. PETIT DÉJEUNER (Breakfast) -> Hot drink selection
  if (catId === "petit-dejeuner" && upperName !== "MENU ENFANT") {
    openHotDrinkSelectorModal(menuItem);
    return;
  }

  // 2. PASTA -> Pasta type selection
  if (catId === "pasta" && !upperName.includes("LASAGNE") && !upperName.includes("SPAGHETTIS NOIRS")) {
    openPastaSelectorModal(menuItem);
    return;
  }

  // 3. PLATS / ACCOMPAGNEMENTS -> 2 Sides selection
  if (catId === "plats" || upperName.includes("ACCOMPAGN")) {
    openSidesSelectorModal(menuItem);
    return;
  }

  // Default: Direct add
  addToCart(menuItem);
}

export function setPendingActionAfterTableSelect(action) {
  pendingActionAfterTableSelect = action;
}

export function parseTableFromUrl() {
  localStorage.removeItem("grey_corner_table");
  const params = new URLSearchParams(window.location.search);
  const table = params.get("table") || params.get("t");
  if (table) {
    clientTable = table;
  } else {
    clientTable = null;
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
    ndTableBadge.textContent = clientTable ? getTableZoneName(clientTable) : "Table non définie";
  }
  const bellBtn = document.getElementById("notificationBellBtn");
  if (bellBtn && clientTable) {
    bellBtn.style.display = "flex";
  }
}

export function setTable(num) {
  clientTable = String(num);
  updateTableUI();

  try {
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?table=${num}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  } catch (e) {}

  closeTableModal();

  if (typeof window.subscribeToActiveWaiterEvents === "function") {
    window._currentSubscribedTable = null;
    window.subscribeToActiveWaiterEvents(clientTable);
  }

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
    { name: "Salle", start: 101, end: 115 },
    { name: "Loge", start: 201, end: 219 },
    { name: "Terrasse", start: 301, end: 323 }
  ];

  zones.forEach(zone => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "8px";
    wrapper.style.width = "100%";

    const title = document.createElement("div");
    title.style.fontFamily = "'DM Sans', sans-serif";
    title.style.fontSize = "0.78rem";
    title.style.fontWeight = "700";
    title.style.letterSpacing = "0.08em";
    title.style.color = "var(--sc-gold-light)";
    title.style.textTransform = "uppercase";
    title.style.textAlign = "left";
    title.style.borderBottom = "1px solid var(--sc-border)";
    title.style.paddingBottom = "4px";
    title.style.marginBottom = "4px";
    title.textContent = zone.name;

    const btnGrid = document.createElement("div");
    btnGrid.style.display = "grid";
    btnGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
    btnGrid.style.gap = "8px";

    for (let i = zone.start; i <= zone.end; i++) {
      const btn = document.createElement("button");
      btn.className = "tgs-btn";
      btn.textContent = i;
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

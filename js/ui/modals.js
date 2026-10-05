import { updateCartUI, addToCart, showToast } from '../services/cart.js';
import { getTableZoneName } from '../config/firebase.js';
import { currentLang } from '../services/i18n.js';
import {
  isBreakfastAvailable,
  isKitchenAvailable,
  isKitchenCategory,
  getKitchenBlockedMessage,
  getBreakfastBlockedMessage
} from '../services/schedule.js';

export let clientTable = null;
export let pendingActionAfterTableSelect = null;

export const HOT_DRINKS_OPTIONS = [
  { fr: "Café Séparé", en: "Separated Coffee", de: "Getrennter Kaffee", es: "Café Separado", ar: "قهوة مفصولة" },
  { fr: "Lait Froid", en: "Cold Milk", de: "Kalte Milch", es: "Leche Fría", ar: "حليب بارد" },
  { fr: "Lait Chaud", en: "Hot Milk", de: "Warme Milch", es: "Leche Caliente", ar: "حليب ساخن" },
  { fr: "Café Noir", en: "Black Coffee", de: "Schwarzer Kaffee", es: "Café Solo", ar: "قهوة سوداء" },
  { fr: "Cappuccino Italien", en: "Italian Cappuccino", de: "Italienischer Cappuccino", es: "Capuchino Italiano", ar: "كابتشينو إيطالي" },
  { fr: "Café Cassé", en: "Café Cassé", de: "Café Cassé", es: "Café Cortado", ar: "قهوة مكسورة (كاسي)" },
  { fr: "Jus d'Orange", en: "Orange Juice", de: "Orangensaft", es: "Zumo de Naranja", ar: "عصير برتقال" },
  { fr: "Lait Cassé", en: "Lait Cassé", de: "Lait Cassé", es: "Leche Manchada", ar: "حليب مكسور" },
  { fr: "Café Moitié", en: "Half Coffee", de: "Halber Kaffee", es: "Café Mitad y Mitad", ar: "قهوة نصف نصف" },
  { fr: "Chocolat au Lait", en: "Milk Chocolate", de: "Milchschokolade", es: "Chocolate con Leche", ar: "شوكولاتة بالحليب" },
  { fr: "Café Américain", en: "Americano Coffee", de: "Kaffee Americano", es: "Café Americano", ar: "قهوة أمريكية" },
  { fr: "Café au Lait", en: "Coffee with Milk", de: "Milchkaffee", es: "Café con Leche", ar: "قهوة بالحليب" },
  { fr: "Thé à la Menthe", en: "Mint Tea", de: "Minztee", es: "Té a la Menta", ar: "شاي مغربي بالنعناع" },
  { fr: "Thé Noir", en: "Black Tea", de: "Schwarzer Tee", es: "Té Negro", ar: "شاي أسود" },
  { fr: "Thé Noir au Lait", en: "Black Tea with Milk", de: "Schwarzer Tee mit Milch", es: "Té Negro con Leche", ar: "شاي أسود بالحليب" },
  { fr: "Verveine", en: "Verbena Infusion", de: "Eisenkraut Tee", es: "Infusión de Hierbaluisa", ar: "لويزة" }
];

export const SIDES_OPTIONS = [
  { fr: "Légumes sautés", en: "Sautéed vegetables", de: "Sautiertes Gemüse", es: "Verduras salteadas", ar: "خضار سوتيه" },
  { fr: "Riz", en: "Rice", de: "Reis", es: "Arroz", ar: "أرز" },
  { fr: "Frites", en: "French Fries", de: "Pommes Frites", es: "Patatas fritas", ar: "بطاطس مقلية" },
  { fr: "Purée pomme de terre", en: "Mashed potatoes", de: "Kartoffelpüree", es: "Puré de patatas", ar: "بطاطس مهروسة (بوريه)" },
  { fr: "Potatos", en: "Potato Wedges", de: "Spaltenkartoffeln", es: "Patatas gajo", ar: "بطاطس ويدجز (بوتاتوس)" }
];

export const PASTA_OPTIONS = [
  { fr: "Rigatoni", en: "Rigatoni", de: "Rigatoni", es: "Rigatoni", ar: "ريغاتوني" },
  { fr: "Tagliatelles", en: "Tagliatelle", de: "Tagliatelle", es: "Tagliatelle", ar: "تالياتيلي" },
  { fr: "Spaghettis", en: "Spaghetti", de: "Spaghetti", es: "Espaguetis", ar: "سباغيتي" },
  { fr: "Linguines", en: "Linguine", de: "Linguine", es: "Linguine", ar: "لينغويني" }
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
      de: `Auswahl: ${totalSelected} / ${limit}`,
      es: `Selección: ${totalSelected} / ${limit}`,
      ar: `المحدد: ${totalSelected} / ${limit}`
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
    de: isBrunchDuo ? "Wählen Sie 2 Heißgetränke" : "Wählen Sie Ihr Heißgetränk",
    es: isBrunchDuo ? "Seleccione 2 Bebidas Calientes" : "Elija su Bebida Caliente",
    ar: isBrunchDuo ? "اختر مشروبين ساخنين" : "اختر مشروبك الساخن"
  };

  const subtitles = {
    fr: `Votre menu "${menuItem.name[currentLang] || menuItem.name.fr}" comprend ${limit} boisson(s) chaude(s) au choix.`,
    en: `Your "${menuItem.name[currentLang] || menuItem.name.fr}" menu includes ${limit} choice(s) of hot beverage.`,
    de: `Ihr Menü "${menuItem.name[currentLang] || menuItem.name.fr}" beinhaltet ${limit} Heißgetränk(e) nach Wahl.`,
    es: `Su menú "${menuItem.name[currentLang] || menuItem.name.fr}" incluye ${limit} bebida(s) caliente(s) a elegir.`,
    ar: `قائمتك "${menuItem.name[currentLang] || menuItem.name.fr}" تتضمن ${limit} مشروب(ات) ساخنة من اختيارك.`
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
    de: "Wählen Sie 2 Beilagen",
    es: "Elija 2 Guarniciones",
    ar: "اختر مرافقتين"
  };

  const subtitles = {
    fr: `Veuillez sélectionner 2 accompagnements de votre choix pour "${menuItem.name[currentLang] || menuItem.name.fr}".`,
    en: `Please select 2 accompaniments of your choice for "${menuItem.name[currentLang] || menuItem.name.fr}".`,
    de: `Bitte wählen Sie 2 Beilagen Ihrer Wahl für "${menuItem.name[currentLang] || menuItem.name.fr}".`,
    es: `Por favor, seleccione 2 guarniciones a su elección para "${menuItem.name[currentLang] || menuItem.name.fr}".`,
    ar: `يرجى اختيار مرافقتين من اختيارك لطبق "${menuItem.name[currentLang] || menuItem.name.fr}".`
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
    de: "Wählen Sie Ihre Nudelsorte",
    es: "Elija su tipo de pasta",
    ar: "اختر نوع المعكرونة"
  };

  const subtitles = {
    fr: `Veuillez sélectionner le type de pâtes pour votre plat "${menuItem.name[currentLang] || menuItem.name.fr}".`,
    en: `Please select the pasta type for your "${menuItem.name[currentLang] || menuItem.name.fr}" dish.`,
    de: `Bitte wählen Sie die Nudelsorte für Ihr Gericht "${menuItem.name[currentLang] || menuItem.name.fr}".`,
    es: `Por favor, seleccione el tipo de pasta para su plato "${menuItem.name[currentLang] || menuItem.name.fr}".`,
    ar: `يرجى اختيار نوع المعكرونة لطبق "${menuItem.name[currentLang] || menuItem.name.fr}".`
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
  const upperName = nameFr.toUpperCase().trim();
  const catId = menuItem.categoryId || "";

  // If item is ACCOMPAGNEMENTS (informational item with price 'Inclus'), do not add or prompt
  if (upperName === "ACCOMPAGNEMENTS" && (menuItem.price === "Inclus" || isNaN(parseFloat(menuItem.price)))) {
    return;
  }

  // 0. Security check: Block kitchen items outside kitchen hours
  if (isKitchenCategory(catId) && !isKitchenAvailable()) {
    showToast(getKitchenBlockedMessage(currentLang));
    return;
  }

  // 1. PETIT DÉJEUNER (Breakfast) -> Hot drink selection (excluding Menu Enfant)
  if (catId === "petit-dejeuner") {
    if (!isBreakfastAvailable()) {
      showToast(getBreakfastBlockedMessage(currentLang));
      return;
    }
    if (upperName !== "MENU ENFANT") {
      openHotDrinkSelectorModal(menuItem);
      return;
    }
  }

  // 2. PASTA -> Pasta type selection
  if (catId === "pasta" && !upperName.includes("LASAGNE") && !upperName.includes("SPAGHETTIS NOIRS")) {
    openPastaSelectorModal(menuItem);
    return;
  }

  // 3. PLATS -> 2 Sides selection (excluding Menu Enfant)
  if (catId === "plats" && upperName !== "MENU ENFANT") {
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
  // Purger impérativement toute table persistée dans le localStorage du portable
  try { localStorage.removeItem("grey_corner_table"); } catch(e) {}

  const params = new URLSearchParams(window.location.search);
  const table = params.get("table") || params.get("t");

  if (table) {
    clientTable = String(table);
    // Mémoriser uniquement pour cet onglet / session active (< 2h)
    try {
      sessionStorage.setItem("gc_session_table", clientTable);
      sessionStorage.setItem("gc_session_table_time", String(Date.now()));
    } catch(e) {}
  } else {
    // Si pas de paramètre dans l'URL, vérifier si la session active dans l'onglet est récente (< 2h)
    try {
      const sessTable = sessionStorage.getItem("gc_session_table");
      const sessTime = parseInt(sessionStorage.getItem("gc_session_table_time") || "0", 10);
      const isFresh = sessTime && (Date.now() - sessTime < 2 * 60 * 60 * 1000);
      if (sessTable && isFresh) {
        clientTable = String(sessTable);
      } else {
        clientTable = null;
        sessionStorage.removeItem("gc_session_table");
        sessionStorage.removeItem("gc_session_table_time");
      }
    } catch(e) {
      clientTable = null;
    }
  }

  updateTableUI();
  return clientTable;
}

export function updateTableUI() {
  const badge = document.getElementById("cdTableBadge");
  if (badge) {
    const lang = window.currentLang || "fr";
    const selectText = {
      fr: "Sélectionner Table",
      en: "Select Table",
      de: "Tisch wählen",
      es: "Seleccionar Mesa",
      ar: "اختر الطاولة"
    };
    const tableText = {
      fr: "Table",
      en: "Table",
      de: "Tisch",
      es: "Mesa",
      ar: "طاولة"
    };
    badge.textContent = clientTable ? `${tableText[lang] || "Table"} ${clientTable}` : (selectText[lang] || "Sélectionner Table");
    badge.style.cursor = "pointer";
  }
  const ndTableBadge = document.getElementById("ndTableBadge");
  if (ndTableBadge) {
    const lang = window.currentLang || "fr";
    const noTableText = {
      fr: "Table non définie",
      en: "Table not defined",
      de: "Tisch nicht definiert",
      es: "Mesa no definida",
      ar: "طاولة غير محددة"
    };
    ndTableBadge.textContent = clientTable ? getTableZoneName(clientTable) : (noTableText[lang] || "Table non définie");
  }
  const bellBtn = document.getElementById("notificationBellBtn");
  if (bellBtn) {
    bellBtn.style.display = "none";
  }
}

export function setTable(num) {
  clientTable = String(num);

  // Sécurité : Ne jamais persister dans le localStorage du smartphone client
  try { localStorage.removeItem("grey_corner_table"); } catch(e) {}

  // Garder uniquement pour la session courante du repas (< 2h)
  try {
    sessionStorage.setItem("gc_session_table", clientTable);
    sessionStorage.setItem("gc_session_table_time", String(Date.now()));
  } catch(e) {}

  updateTableUI();

  // Ne pas pousser ?table= dans l'historique du navigateur afin d'éviter qu'il soit mémorisé dans les favoris / historique
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

  if (!modal._hasBackdropListener) {
    modal._hasBackdropListener = true;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeTableModal();
    });
  }

  const closeBtn = document.getElementById("tableModalCloseBtn");
  if (closeBtn && !closeBtn._hasListener) {
    closeBtn._hasListener = true;
    closeBtn.addEventListener("click", closeTableModal);
  }

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

export function GC_selectMode(mode) {
  window.GC_preorderMode = mode;
  const p = document.getElementById('pmPickup');
  const t = document.getElementById('pmTable');
  const w = document.getElementById('pmTableNumWrap');
  const c = document.getElementById('pmConfirm');
  const GOLD = 'rgba(201,168,76,0.18)', DIM = 'rgba(201,168,76,0.07)';
  if (p) {
    p.style.background  = mode === 'pickup' ? GOLD : DIM;
    p.style.borderColor = mode === 'pickup' ? '#C9A84C' : 'rgba(201,168,76,0.2)';
  }
  if (t) {
    t.style.background  = mode === 'table'  ? GOLD : DIM;
    t.style.borderColor = mode === 'table'  ? '#C9A84C' : 'rgba(201,168,76,0.2)';
  }
  if (w) w.style.display = mode === 'table' ? 'block' : 'none';
  if (c) {
    c.disabled = false;
    c.style.background  = 'rgba(201,168,76,0.18)';
    c.style.borderColor = '#C9A84C';
    c.style.color       = '#f0ead8';
    c.style.cursor      = 'pointer';
  }
}

export function GC_confirmMode() {
  if (!window.GC_preorderMode) return;
  const inp = document.getElementById('pmTableNumInput');
  window.GC_preorderTable = inp && inp.value.trim() ? inp.value.trim() : null;
  window.GC_isPreorder    = true;
  GC_hidePreorderModal();
  GC_applyPreorderUI();
}

export function GC_dismissModal() {
  GC_hidePreorderModal();
  GC_applyReadonlyUI();
}

export function GC_requestGpsAgain() {
  if (!navigator.geolocation) { return; }
  navigator.geolocation.getCurrentPosition(
    () => {
      GC_hideGpsBlocked();
      if (typeof window.GPSService !== 'undefined' && typeof window.GPSService.checkLocation === 'function') {
        window.GPSService.checkLocation();
      } else {
        location.reload();
      }
    },
    (err) => {
      if (err.code === 1) {
        const hint = document.getElementById('gpsBlockedHint');
        if (hint) {
          hint.style.display = 'block';
          hint.style.color = '#e87c3e';
        }
      } else {
        location.reload();
      }
    },
    { timeout: 8000, enableHighAccuracy: true }
  );
}

export function GC_patchSubmitButton() {
  const btn = document.getElementById('cdSubmitBtn');
  if (!btn) return false;
  btn.innerHTML = `<span style="display:flex;align-items:center;justify-content:center;gap:8px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.522 5.85L0 24l6.335-1.502A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 01-5.007-1.373l-.36-.214-3.727.883.936-3.619-.234-.373A9.818 9.818 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/>
      </svg>
      Commander via WhatsApp
  </span>`;
  btn.style.background    = 'linear-gradient(135deg,#25D366,#128C7E)';
  btn.style.borderColor   = '#25D366';
  btn.style.color         = '#fff';
  btn.style.opacity       = '1';
  btn.style.pointerEvents = 'auto';
  btn.disabled            = false;
  btn.removeAttribute('disabled');
  btn.classList.remove('disabled-gps', 'frozen-disabled');
  document.querySelectorAll('.cd-warning-text').forEach(el => el.style.display = 'none');
  return true;
}

export function GC_applyPreorderUI() {
  const badge = document.getElementById('gpsStatusBadge');
  const text  = document.getElementById('gpsStatusText');
  if (badge) {
    badge.className = 'gps-status-badge';
    badge.style.background = 'rgba(201,168,76,0.15)';
    badge.style.borderColor = 'rgba(201,168,76,0.4)';
  }
  if (text) text.textContent = '🟡 Précommande';
  const cdBadge = document.getElementById('cdTableBadge');
  if (cdBadge) {
    cdBadge.textContent = window.GC_preorderMode === 'pickup'
      ? 'À emporter'
      : (window.GC_preorderTable ? 'Table ' + window.GC_preorderTable : 'À table');
  }
  ['cabCallWaiter','cabRequestWater','cabRequestBill'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const bar = document.getElementById('clientActionBar');
  if (bar) bar.style.display = 'block';
  GC_patchSubmitButton();
}

export function GC_applyReadonlyUI() {
  const bar = document.getElementById('clientActionBar');
  if (bar) bar.style.display = 'none';
}

// Bind to window for backwards compatibility with inline HTML onclicks
window.GC_preorderMode  = window.GC_preorderMode || null;
window.GC_preorderTable = window.GC_preorderTable || null;
window.GC_isPreorder    = window.GC_isPreorder || false;

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
window.GC_selectMode = GC_selectMode;
window.GC_confirmMode = GC_confirmMode;
window.GC_dismissModal = GC_dismissModal;
window.GC_requestGpsAgain = GC_requestGpsAgain;
window.GC_patchSubmitButton = GC_patchSubmitButton;
window.GC_applyPreorderUI = GC_applyPreorderUI;
window.GC_applyReadonlyUI = GC_applyReadonlyUI;

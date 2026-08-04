/**
 * GREY CORNER — TRILINGUAL I18N SERVICE (ES Module)
 * (Français, English, Deutsch)
 */

export function detectPhoneLanguage() {
  const userLangs = navigator.languages || [navigator.language || navigator.userLanguage || ""];
  for (const l of userLangs) {
    const code = (l || "").toLowerCase();
    if (code.startsWith("en")) return "en";
    if (code.startsWith("de")) return "de";
    if (code.startsWith("fr")) return "fr";
  }
  return "fr";
}

export let currentLang = localStorage.getItem("lang") || detectPhoneLanguage();

export const PRIX_TEXTS = {
  fr: "★ Tous les prix sont en dirhams marocains (MAD)",
  en: "★ All prices are in Moroccan Dirhams (MAD)",
  de: "★ Alle Preise sind in Marokkanischen Dirham (MAD)"
};

export function applyLanguageToStaticTexts() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const value = el.getAttribute(`data-${currentLang}`)
      || el.getAttribute("data-fr");
    if (value !== null) el.textContent = value;
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    const placeholders = {
      fr: "Rechercher un plat...",
      en: "Search a dish...",
      de: "Gericht suchen..."
    };
    searchInput.placeholder = placeholders[currentLang] || placeholders.fr;
  }
}

export function setLanguage(lang) {
  if (["fr", "en", "de"].includes(lang)) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    applyLanguageToStaticTexts();
    updatePrixInfo();
    return true;
  }
  return false;
}

export function updatePrixInfo() {
  const el = document.getElementById("prixInfo");
  if (el) el.textContent = PRIX_TEXTS[currentLang] || PRIX_TEXTS.fr;
}

export function t(key) {
  const dictionary = {
    add: { fr: "+ Ajouter", en: "+ Add", de: "+ Hinzufügen" },
    cart: { fr: "Mon Panier", en: "My Cart", de: "Mein Warenkorb" },
    emptyCart: { fr: "Votre panier est vide", en: "Your cart is empty", de: "Ihr Warenkorb ist leer" },
    total: { fr: "Total", en: "Total", de: "Gesamt" },
    order: { fr: "Commander", en: "Order", de: "Bestellen" },
    table: { fr: "Table", en: "Table", de: "Tisch" },
    callWaiter: { fr: "Appeler serveur", en: "Call waiter", de: "Kellner rufen" },
    requestWater: { fr: "Demander de l'eau", en: "Request water", de: "Wasser bestellen" },
    requestBill: { fr: "Demander l'addition", en: "Request bill", de: "Rechnung anfordern" }
  };
  if (dictionary[key]) {
    return dictionary[key][currentLang] || dictionary[key].fr;
  }
  return key;
}

// Bind to window for backwards compatibility
window.currentLang = currentLang;
window.setLanguage = setLanguage;
window.updatePrixInfo = updatePrixInfo;
window.applyLanguageToStaticTexts = applyLanguageToStaticTexts;

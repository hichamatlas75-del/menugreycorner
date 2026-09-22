/**
 * GREY CORNER — MULTILINGUAL I18N SERVICE (ES Module)
 * Pure FR / EN / DE / AR (Maroc 🇲🇦) — No Google Translate dependency
 */

export function detectPhoneLanguage() {
  const userLangs = navigator.languages || [navigator.language || navigator.userLanguage || ""];
  for (const l of userLangs) {
    const code = (l || "").toLowerCase();
    if (code.startsWith("ar")) return "ar";
    if (code.startsWith("en")) return "en";
    if (code.startsWith("de")) return "de";
    if (code.startsWith("fr")) return "fr";
  }
  return "fr";
}

const manualLang = sessionStorage.getItem("manual_lang");
export let currentLang = manualLang || detectPhoneLanguage();

export const PRIX_TEXTS = {
  fr: "★ Tous les prix sont en dirhams marocains (MAD)",
  en: "★ All prices are in Moroccan Dirhams (MAD)",
  de: "★ Alle Preise sind in Marokkanischen Dirham (MAD)",
  ar: "★ جميع الأسعار بالدرهم المغربي (MAD)"
};

export function applyLanguageToStaticTexts() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const value = el.getAttribute(`data-${currentLang}`)
      || el.getAttribute("data-fr");
    if (value !== null) el.textContent = value;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const value = el.getAttribute(`data-placeholder-${currentLang}`)
      || el.getAttribute("data-placeholder-fr");
    if (value !== null) el.placeholder = value;
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    const placeholders = {
      fr: "Rechercher un plat...",
      en: "Search a dish...",
      de: "Gericht suchen...",
      ar: "ابحث عن طبق..."
    };
    searchInput.placeholder = placeholders[currentLang] || placeholders.fr;
  }
}

export function setLanguage(lang) {
  if (["fr", "en", "de", "ar"].includes(lang)) {
    currentLang = lang;
    window.currentLang = lang;
    sessionStorage.setItem("manual_lang", lang);
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === "ar" ? "rtl" : "ltr");
    document.documentElement.classList.toggle("rtl-mode", lang === "ar");
    applyLanguageToStaticTexts();
    updatePrixInfo();
    if (typeof window.updateFeedbackTexts === "function") {
      window.updateFeedbackTexts();
    }
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
    add: { fr: "+ Ajouter", en: "+ Add", de: "+ Hinzufügen", ar: "+ أضف" },
    cart: { fr: "Mon Panier", en: "My Cart", de: "Mein Warenkorb", ar: "سلتي" },
    emptyCart: { fr: "Votre panier est vide", en: "Your cart is empty", de: "Ihr Warenkorb ist leer", ar: "سلتك فارغة" },
    total: { fr: "Total", en: "Total", de: "Gesamt", ar: "المجموع" },
    order: { fr: "Commander", en: "Order", de: "Bestellen", ar: "طلب" },
    table: { fr: "Table", en: "Table", de: "Tisch", ar: "طاولة" },
    callWaiter: { fr: "Appeler serveur", en: "Call waiter", de: "Kellner rufen", ar: "نداء النادل" },
    requestWater: { fr: "Demander de l'eau", en: "Request water", de: "Wasser bestellen", ar: "طلب الماء" },
    requestBill: { fr: "Demander l'addition", en: "Request bill", de: "Rechnung anfordern", ar: "طلب الحساب" }
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

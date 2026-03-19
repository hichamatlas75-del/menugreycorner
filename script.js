// ==========================================
// ============= GLOBAL SETTINGS ============
// ==========================================

'use strict';

// DOM
const menuGrid      = document.getElementById("menu-grid");
const langButtons   = document.querySelectorAll(".lang-button");
const burger        = document.getElementById("burger");
const burgerNav     = document.getElementById("burgerNav");
const burgerOverlay = document.getElementById("burgerOverlay");
const backToTop     = document.getElementById("backToTop");

// LIGHTBOX PROTÉGÉE
const secureLightbox        = document.getElementById("secureLightbox");
const secureLightboxContent = document.querySelector(".secure-lightbox-content");

// Langue actuelle
let currentLang = localStorage.getItem("lang") || "fr";

// Flag pour éviter d'attacher plusieurs fois les listeners de protection
let imagesProtected = false;

// ==========================================
// ========= TEXTE PRIX EN DIRHAMS ==========
// ==========================================

const PRIX_TEXTS = {
    fr: "★ Tous les prix sont en dirhams marocains (MAD)",
    en: "★ All prices are in Moroccan Dirhams (MAD)",
    de: "★ Alle Preise sind in Marokkanischen Dirham (MAD)"
};

function updatePrixInfo() {
    const el = document.getElementById("prixInfo");
    if (el) el.textContent = PRIX_TEXTS[currentLang] || PRIX_TEXTS.fr;
}

// ==========================================
// =========== RENDER MENU DYNAMIC ==========
// ==========================================

function renderMenu() {
    if (!menuData || !Array.isArray(menuData) || !menuGrid) {
        console.error("❌ ERREUR : menuData ou menuGrid manquant.");
        return;
    }

    menuGrid.innerHTML = "";

    menuData.forEach(category => {
        const section = document.createElement("section");
        section.className = "menu-section";
        if (category.id) section.id = category.id;

        section.innerHTML = `
            <h2 class="section-title">${category.category[currentLang]}</h2>
            <div class="items"></div>
        `;

        const itemsContainer = section.querySelector(".items");

        category.items.forEach(item => {
            const card = document.createElement("article");
            card.className = "menu-item";

            // Badge NEW / NOUVEAU / NEU
            if (item.isNew === true) {
                card.classList.add("nouveau-flash");
                const badgeText = currentLang === "en" ? "NEW"
                                : currentLang === "de" ? "NEU"
                                : "NOUVEAU";
                card.setAttribute("data-badge", badgeText);
            }

            // Configuration lightbox
            card.dataset.img = item.image;
            card.dataset.alt = item.name[currentLang];

            card.innerHTML = `
                <div class="item-img-wrapper"
                    style="background-image: url('${item.image}')">
                </div>
                <div class="item-info">
                    <div class="item-price-line">
                        <h3 class="item-name">${item.name[currentLang]}</h3>
                        <span class="item-price">${item.price}</span>
                    </div>
                    <p class="item-desc">${item.description[currentLang]}</p>
                </div>
            `;

            itemsContainer.appendChild(card);
        });

        menuGrid.appendChild(section);
    });

    enableSecureLightbox();
    protectImages();
}

// ==========================================
// ======= LIGHTBOX PROTÉGÉE (SECURE) =======
// ==========================================

function enableSecureLightbox() {
    if (!secureLightbox || !secureLightboxContent) return;

    document.querySelectorAll(".menu-item").forEach(card => {
        card.addEventListener("click", () => {
            const url = card.dataset.img;
            if (!url) return;
            secureLightboxContent.style.backgroundImage = `url("${url}")`;
            secureLightbox.classList.add("active");
            document.body.classList.add("no-scroll");
            document.documentElement.classList.add("no-scroll");
        });
    });

    // Fermer au clic sur le fond
    secureLightbox.addEventListener("click", e => {
        if (e.target === secureLightbox) closeLightbox();
    });

    // Bouton fermer
    const closeBtn = secureLightboxContent.querySelector(".close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeLightbox);
    }

    // Fermer avec Escape
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && secureLightbox.classList.contains("active")) {
            closeLightbox();
        }
    });
}

function closeLightbox() {
    if (!secureLightbox) return;
    secureLightbox.classList.remove("active");
    if (secureLightboxContent) secureLightboxContent.style.backgroundImage = "";
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
}

// ==========================================
// ======= PROTECTION DES IMAGES ============
// ==========================================

function protectImages() {
    if (imagesProtected) return;

    document.addEventListener("contextmenu", e => e.preventDefault());

    document.body.style.userSelect         = "none";
    document.body.style.webkitUserSelect   = "none";
    document.body.style.webkitTouchCallout = "none";

    document.addEventListener("keydown", e => {
        const key = (e.key || "").toLowerCase();
        if (
            (e.ctrlKey && key === "s") ||
            (e.ctrlKey && key === "u") ||
            (e.ctrlKey && e.shiftKey && key === "i")
        ) {
            e.preventDefault();
        }
    });

    imagesProtected = true;
}

// ==========================================
// ============== LANG SWITCH ===============
// ==========================================

function applyLanguageToStaticTexts() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const value = el.getAttribute(`data-${currentLang}`)
                   || el.getAttribute("data-fr");
        if (value !== null) el.textContent = value;
    });
}

function setLanguage(lang) {
    if (!["fr","en","de"].includes(lang)) lang = "fr";
    currentLang = lang;
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;

    // Mettre à jour les boutons actifs
    langButtons.forEach(b => {
        b.classList.toggle("active", b.dataset.lang === lang);
    });

    applyLanguageToStaticTexts();
    updatePrixInfo();
    renderMenu();
    setTimeout(activateSearch, 50);
}

// Init boutons langue
langButtons.forEach(btn => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

// Marquer le bouton actif au chargement
langButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
});

// ==========================================
// ============ POPUP ÉVÉNEMENT =============
// ==========================================

const eventBtn   = document.getElementById("eventBtn");
const eventPopup = document.getElementById("eventPopup");
const closePopup = document.getElementById("closePopup");

if (eventBtn && eventPopup && closePopup) {
    eventBtn.addEventListener("click", () => {
        eventPopup.style.display = "flex";
    });
    closePopup.addEventListener("click", () => {
        eventPopup.style.display = "none";
    });
    eventPopup.addEventListener("click", e => {
        if (e.target === eventPopup) eventPopup.style.display = "none";
    });
}

// ==========================================
// ============== BURGER MENU ===============
// ==========================================

function closeBurgerMenu() {
    if (!burger || !burgerNav || !burgerOverlay) return;
    burger.classList.remove("active");
    burger.setAttribute("aria-expanded", "false");
    burgerNav.classList.remove("active");
    burgerOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
}

if (burger && burgerNav && burgerOverlay) {
    burger.addEventListener("click", () => {
        const isOpen = burgerNav.classList.contains("active");
        isOpen ? closeBurgerMenu() : openBurgerMenu();
    });

    burgerOverlay.addEventListener("click", closeBurgerMenu);

    burgerNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeBurgerMenu);
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && burgerNav.classList.contains("active")) {
            closeBurgerMenu();
        }
    });
}

function openBurgerMenu() {
    if (!burger || !burgerNav || !burgerOverlay) return;
    burger.classList.add("active");
    burger.setAttribute("aria-expanded", "true");
    burgerNav.classList.add("active");
    burgerOverlay.classList.add("active");
    document.body.classList.add("no-scroll");
    document.documentElement.classList.add("no-scroll");
}

// ==========================================
// ========= BOUTON REMONTER EN HAUT ========
// ==========================================

if (backToTop) {
    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ==========================================
// ============ BARRE DE RECHERCHE ==========
// ==========================================

function applySearchFilter() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    const term  = (input.value || "").toLowerCase().trim();
    const cards = document.querySelectorAll(".menu-item");

    cards.forEach(card => {
        const title = (card.querySelector(".item-name")?.textContent || "").toLowerCase();
        const desc  = (card.querySelector(".item-desc")?.textContent  || "").toLowerCase();
        const match = !term || title.includes(term) || desc.includes(term);
        card.style.display = match ? "" : "none";
    });

    // Masquer les sections vides
    document.querySelectorAll(".menu-section").forEach(section => {
        const visibles = section.querySelectorAll(".menu-item:not([style*='display: none'])");
        section.style.display = visibles.length === 0 ? "none" : "";
    });
}

function activateSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    // Éviter les doublons de listeners
    searchInput.removeEventListener("input", applySearchFilter);
    searchInput.addEventListener("input", applySearchFilter);

    // Placeholder selon langue
    const placeholders = {
        fr: "Rechercher un plat...",
        en: "Search a dish...",
        de: "Gericht suchen..."
    };
    searchInput.placeholder = placeholders[currentLang] || placeholders.fr;
}

// ==========================================
// ======= BANDE D'ÉVÉNEMENT (LIGHTBOX) =====
// ==========================================

function activateEventBanner() {
    const eventBanner = document.getElementById("eventBanner");
    if (!eventBanner) return;

    const eventImageSrc = eventBanner.dataset.eventImg;
    if (!eventImageSrc) return;

    eventBanner.addEventListener("click", () => {
        const lb        = document.getElementById("secureLightbox");
        const lbContent = document.querySelector(".secure-lightbox-content");
        const lbCaption = document.getElementById("secureLightboxCaption");

        if (lb && lbContent) {
            lbContent.style.backgroundImage = `url('${eventImageSrc}')`;

            if (lbCaption) {
                const txt = eventBanner.querySelector(".event-text");
                lbCaption.textContent = txt ? txt.textContent : "Événement Spécial";
            }

            lb.classList.add("active");
            document.body.classList.add("no-scroll");
            document.documentElement.classList.add("no-scroll");
        }
    });
}

// ==========================================
// =========== BOUTON PARTAGER ==============
// ==========================================

const SHARE_TEXTS = {
    fr: {
        title:   "Grey Corner — Menu",
        text:    "🍽️ Découvrez le menu Grey Corner Café à Fès !",
        copied:  "Lien copié ✓"
    },
    en: {
        title:   "Grey Corner — Menu",
        text:    "🍽️ Discover the Grey Corner Café menu in Fès!",
        copied:  "Link copied ✓"
    },
    de: {
        title:   "Grey Corner — Menü",
        text:    "🍽️ Entdecken Sie das Menü des Grey Corner Café in Fès!",
        copied:  "Link kopiert ✓"
    }
};

function showToast(msg) {
    const toast = document.getElementById("scToast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2400);
}

async function partagerMenu() {
    const url = window.location.href;
    const s   = SHARE_TEXTS[currentLang] || SHARE_TEXTS.fr;

    // Web Share API (mobile natif — WhatsApp, SMS, AirDrop…)
    if (navigator.share) {
        try {
            await navigator.share({ title: s.title, text: s.text, url });
            return;
        } catch (e) {
            // Annulé par l'utilisateur → rien à faire
            return;
        }
    }

    // Fallback desktop : copier dans le presse-papier
    try {
        await navigator.clipboard.writeText(url);
    } catch {
        // Dernier recours pour vieux navigateurs
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.cssText = "position:fixed;opacity:0;top:0;left:0;";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
    }

    showToast(s.copied);
}

// Attacher le bouton partager (défini dans le HTML)
const shareBtn = document.getElementById("shareMenu");
if (shareBtn) {
    shareBtn.addEventListener("click", partagerMenu);
}

// ==========================================
// ================ INITIAL LOAD ============
// ==========================================

// Appliquer la langue détectée dès le départ
applyLanguageToStaticTexts();
updatePrixInfo();

// Rendre le menu
renderMenu();

// Activer la recherche après render
setTimeout(activateSearch, 50);

// Activer la bannière événement
activateEventBanner();

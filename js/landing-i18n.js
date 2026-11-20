/**
 * GREY CORNER — LANDING PAGES I18N CONTROLLER
 * Assure la même politique multilingue que le menu interactif :
 * 5 langues (FR, EN, DE, ES, AR) avec persistance partagée (sessionStorage / localStorage),
 * détection automatique, support RTL complet et mise à jour dynamique du titre & meta description.
 */

(function () {
  'use strict';

  var LANG_META = {
    fr: { code: 'FR', flag: '🇫🇷', name: 'Français' },
    en: { code: 'EN', flag: '🇬🇧', name: 'English' },
    de: { code: 'DE', flag: '🇩🇪', name: 'Deutsch' },
    es: { code: 'ES', flag: '🇪🇸', name: 'Español' },
    ar: { code: 'AR', flag: '🇲🇦', name: 'العربية' }
  };

  var VALID_LANGS = ['fr', 'en', 'de', 'es', 'ar'];

  function detectPhoneLanguage() {
    var userLangs = navigator.languages || [navigator.language || navigator.userLanguage || ''];
    for (var i = 0; i < userLangs.length; i++) {
      var code = (userLangs[i] || '').toLowerCase();
      if (code.indexOf('ar') === 0) return 'ar';
      if (code.indexOf('es') === 0) return 'es';
      if (code.indexOf('en') === 0) return 'en';
      if (code.indexOf('de') === 0) return 'de';
      if (code.indexOf('fr') === 0) return 'fr';
    }
    return 'fr';
  }

  function getInitialLanguage() {
    try {
      var manual = sessionStorage.getItem('manual_lang');
      if (manual && VALID_LANGS.indexOf(manual) !== -1) return manual;
      var stored = localStorage.getItem('lang');
      if (stored && VALID_LANGS.indexOf(stored) !== -1) return stored;
    } catch (e) {}
    return detectPhoneLanguage();
  }

  var currentLang = getInitialLanguage();

  function applyLanguage(lang) {
    if (VALID_LANGS.indexOf(lang) === -1) return;
    currentLang = lang;

    try {
      sessionStorage.setItem('manual_lang', lang);
      localStorage.setItem('lang', lang);
    } catch (e) {}

    var isRTL = (lang === 'ar');
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('rtl-mode', isRTL);

    // 1. Textes statiques avec [data-i18n]
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var val = el.getAttribute('data-' + lang) || el.getAttribute('data-fr');
      if (val !== null) {
        if (val.indexOf('<') !== -1 && val.indexOf('>') !== -1) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    }

    // 2. Attributs d'accessibilité / titres (aria-label, title)
    var ariaEls = document.querySelectorAll('[data-i18n-aria]');
    for (var j = 0; j < ariaEls.length; j++) {
      var aEl = ariaEls[j];
      var aVal = aEl.getAttribute('data-aria-' + lang) || aEl.getAttribute('data-aria-fr');
      if (aVal !== null) aEl.setAttribute('aria-label', aVal);
    }

    // 3. Mise à jour dynamique du <title> et meta description
    var titleMeta = document.querySelector('meta[name="title-' + lang + '"]');
    if (titleMeta && titleMeta.getAttribute('content')) {
      document.title = titleMeta.getAttribute('content');
    }

    var descMeta = document.querySelector('meta[name="desc-' + lang + '"]');
    var defaultDesc = document.querySelector('meta[name="description"]');
    if (descMeta && defaultDesc && descMeta.getAttribute('content')) {
      defaultDesc.setAttribute('content', descMeta.getAttribute('content'));
    }

    // 4. Mise à jour de l'UI du sélecteur de langue dans le header
    var meta = LANG_META[lang] || LANG_META.fr;
    var flagEl = document.getElementById('headerActiveFlag');
    var codeEl = document.getElementById('headerActiveCode');
    if (flagEl) flagEl.textContent = meta.flag;
    if (codeEl) codeEl.textContent = meta.code;

    var buttons = document.querySelectorAll('.header-lang-dropdown .lang-button[data-lang]');
    for (var k = 0; k < buttons.length; k++) {
      var btn = buttons[k];
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    }
  }

  function initHeaderLangDropdown() {
    var wrapper = document.getElementById('headerLangWrapper');
    var btn = document.getElementById('headerLangBtn');
    var dropdown = document.getElementById('headerLangDropdown');

    if (!wrapper || !btn || !dropdown) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = wrapper.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    dropdown.addEventListener('click', function (e) {
      var target = e.target;
      while (target && target !== dropdown) {
        if (target.classList && target.classList.contains('lang-button') && target.getAttribute('data-lang')) {
          e.stopPropagation();
          var selected = target.getAttribute('data-lang');
          applyLanguage(selected);
          wrapper.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          return;
        }
        target = target.parentNode;
      }
    });

    document.addEventListener('click', function (e) {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && wrapper.classList.contains('open')) {
        wrapper.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Application immédiate avant le rendu complet pour éviter le FOUT
  try {
    var initLang = getInitialLanguage();
    document.documentElement.lang = initLang;
    document.documentElement.dir = (initLang === 'ar') ? 'rtl' : 'ltr';
    if (initLang === 'ar') document.documentElement.classList.add('rtl-mode');
  } catch (e) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyLanguage(currentLang);
      initHeaderLangDropdown();
    });
  } else {
    applyLanguage(currentLang);
    initHeaderLangDropdown();
  }

  window.setLanguage = applyLanguage;
  window.currentLang = currentLang;
})();

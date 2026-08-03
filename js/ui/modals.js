/**
 * GREY CORNER — UI MODALS & DRAWERS (ES Module)
 */

export function openCartDrawer() {
  const overlay = document.getElementById("cartDrawerOverlay");
  if (overlay) {
    overlay.classList.add("active");
  }
}

export function closeCartDrawer() {
  const overlay = document.getElementById("cartDrawerOverlay");
  if (overlay) {
    overlay.classList.remove("active");
  }
}

export function openTableModal() {
  const overlay = document.getElementById("tableModalOverlay");
  if (overlay) {
    overlay.style.display = "flex";
  }
}

export function closeTableModal() {
  const overlay = document.getElementById("tableModalOverlay");
  if (overlay) {
    overlay.style.display = "none";
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
window.GC_switchGpsTab = GC_switchGpsTab;
window.GC_showGpsBlocked = GC_showGpsBlocked;
window.GC_hideGpsBlocked = GC_hideGpsBlocked;
window.GC_dismissGpsBlocked = GC_dismissGpsBlocked;
window.GC_showPreorderModal = GC_showPreorderModal;
window.GC_hidePreorderModal = GC_hidePreorderModal;

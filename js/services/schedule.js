/**
 * GREY CORNER — DYNAMIC SCHEDULE & SERVICE HOURS SERVICE (ES Module)
 * - Restaurant Opening Hours: 07:00 – 23:00 daily
 * - Breakfast Service Hours:
 *     * Monday – Friday: 07:00 – 13:00
 *     * Saturday – Sunday (Week-end): 07:00 – 14:00
 * All times based on Africa/Casablanca (Morocco) timezone.
 */

import { currentLang } from './i18n.js';

export function getMoroccoDateTime() {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Casablanca',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    let weekday = "Mon";
    let hour = 12;
    let minute = 0;
    for (const p of parts) {
      if (p.type === 'weekday') weekday = p.value;
      if (p.type === 'hour') hour = parseInt(p.value, 10);
      if (p.type === 'minute') minute = parseInt(p.value, 10);
    }
    return {
      weekday,
      hour,
      minute,
      decimalHour: hour + (minute / 60),
      isWeekend: (weekday === "Sat" || weekday === "Sun")
    };
  } catch (e) {
    // Fallback to local device time
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    return {
      weekday: (day === 0 ? "Sun" : day === 6 ? "Sat" : "Mon"),
      hour,
      minute,
      decimalHour: hour + (minute / 60),
      isWeekend: (day === 0 || day === 6)
    };
  }
}

/**
 * Check if the restaurant is currently open (07:00 - 23:00)
 */
export function isRestaurantOpen() {
  const { decimalHour } = getMoroccoDateTime();
  return decimalHour >= 7 && decimalHour < 23;
}

/**
 * Check if breakfast service is currently available
 * - Mon - Fri: until 13:00
 * - Sat - Sun: until 14:00
 */
export function isBreakfastAvailable() {
  const { isWeekend, decimalHour } = getMoroccoDateTime();
  const cutoff = isWeekend ? 14 : 13;
  return decimalHour >= 7 && decimalHour < cutoff;
}

/**
 * Text messages for opening status
 */
const STATUS_TEXTS = {
  open: {
    fr: "Ouvert actuellement jusqu'à 23h00",
    en: "Open now until 23:00",
    de: "Jetzt geöffnet bis 23:00",
    es: "Abierto ahora hasta las 23:00",
    ar: "مفتوح الآن حتى 23:00"
  },
  closed: {
    fr: "Fermé actuellement • Ouvre à 07h00",
    en: "Closed now • Opens at 07:00",
    de: "Geschlossen • Öffnet um 07:00",
    es: "Cerrado ahora • Abre a las 07:00",
    ar: "مغلق الآن • يفتح عند 07:00"
  }
};

/**
 * Update the dynamic opening badge in the header
 */
export function updateScheduleUI() {
  const badge = document.getElementById("headerStatusBadge");
  const textEl = document.getElementById("headerStatusText");
  if (!badge || !textEl) return;

  const open = isRestaurantOpen();
  badge.classList.toggle("status-open", open);
  badge.classList.toggle("status-closed", !open);

  const stateKey = open ? "open" : "closed";
  const dict = STATUS_TEXTS[stateKey];
  const lang = currentLang || "fr";
  textEl.textContent = dict[lang] || dict.fr;
}

// Global binding for backwards compatibility
window.isRestaurantOpen = isRestaurantOpen;
window.isBreakfastAvailable = isBreakfastAvailable;
window.updateScheduleUI = updateScheduleUI;

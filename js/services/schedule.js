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
 * Localized Day of Week Names
 */
export const WEEKDAY_NAMES = {
  Mon: { fr: "Lundi", en: "Monday", es: "Lunes", de: "Montag", ar: "الإثنين" },
  Tue: { fr: "Mardi", en: "Tuesday", es: "Martes", de: "Dienstag", ar: "الثلاثاء" },
  Wed: { fr: "Mercredi", en: "Wednesday", es: "Miércoles", de: "Mittwoch", ar: "الأربعاء" },
  Thu: { fr: "Jeudi", en: "Thursday", es: "Jueves", de: "Donnerstag", ar: "الخميس" },
  Fri: { fr: "Vendredi", en: "Friday", es: "Viernes", de: "Freitag", ar: "الجمعة" },
  Sat: { fr: "Samedi", en: "Saturday", es: "Sábado", de: "Samstag", ar: "السبت" },
  Sun: { fr: "Dimanche", en: "Sunday", es: "Domingo", de: "Sonntag", ar: "الأحد" }
};

/**
 * Detect current day and point kitchen service start time
 * - Mon - Fri: starts at 12:00
 * - Saturday: starts at 13:00
 * - Sunday: starts at 14:00
 * - Daily closing: 23:00
 */
export function getKitchenScheduleInfo() {
  const { weekday, decimalHour } = getMoroccoDateTime();

  let startHour = 12;
  let dayType = "weekday";

  if (weekday === "Sat") {
    startHour = 13;
    dayType = "saturday";
  } else if (weekday === "Sun") {
    startHour = 14;
    dayType = "sunday";
  } else {
    startHour = 12;
    dayType = "weekday";
  }

  const isBefore = (decimalHour < startHour);
  const isOpen = (decimalHour >= startHour && decimalHour < 23);
  const isClosed = (decimalHour >= 23 || decimalHour < 7);

  return {
    weekday,
    dayType,
    startHour,
    isBefore,
    isOpen,
    isClosed
  };
}

/**
 * Generate HTML content for the dynamic kitchen notice above cold starters
 */
export function getKitchenNoticeInner(lang = "fr") {
  const info = getKitchenScheduleInfo();
  const dayName = WEEKDAY_NAMES[info.weekday]?.[lang] || WEEKDAY_NAMES[info.weekday]?.fr || info.weekday;

  const todayLabel = {
    fr: "Aujourd'hui",
    en: "Today",
    es: "Hoy",
    de: "Heute",
    ar: "اليوم"
  }[lang] || "Aujourd'hui";

  let statusText = "";
  if (info.isBefore) {
    const beforeTexts = {
      fr: `Le service cuisine commence à ${info.startHour}h00`,
      en: `Kitchen service starts at ${info.startHour}:00`,
      es: `El servicio de cocina comienza a las ${info.startHour}:00`,
      de: `Küchenservice beginnt um ${info.startHour}:00 Uhr`,
      ar: `يبدأ عمل المطبخ عند الساعة ${info.startHour}:00`
    };
    statusText = beforeTexts[lang] || beforeTexts.fr;
  } else if (info.isOpen) {
    const openTexts = {
      fr: `Service cuisine ouvert (débuté à ${info.startHour}h00)`,
      en: `Kitchen service open (started at ${info.startHour}:00)`,
      es: `Servicio de cocina abierto (iniciado a las ${info.startHour}:00)`,
      de: `Küchenservice geöffnet (ab ${info.startHour}:00 Uhr)`,
      ar: `خدمة المطبخ مفتوحة (بدأت عند ${info.startHour}:00)`
    };
    statusText = openTexts[lang] || openTexts.fr;
  } else {
    const closedTexts = {
      fr: `Service cuisine fermé • Reprise à ${info.startHour}h00`,
      en: `Kitchen service closed • Reopens at ${info.startHour}:00`,
      es: `Servicio de cocina cerrado • Abre a las ${info.startHour}:00`,
      de: `Küchenservice geschlossen • Öffnet um ${info.startHour}:00 Uhr`,
      ar: `المطبخ مغلق حالياً • يفتح عند ${info.startHour}:00`
    };
    statusText = closedTexts[lang] || closedTexts.fr;
  }

  const slotLabels = {
    weekday: { fr: "Semaine", en: "Weekdays", es: "Semana", de: "Werktags", ar: "الأسبوع" },
    saturday: { fr: "Samedi", en: "Saturday", es: "Sábado", de: "Samstag", ar: "السبت" },
    sunday: { fr: "Dimanche", en: "Sunday", es: "Domingo", de: "Sonntag", ar: "الأحد" }
  };

  const isWk = info.dayType === "weekday";
  const isSat = info.dayType === "saturday";
  const isSun = info.dayType === "sunday";

  return `
    <div class="esn-card-inner">
      <div class="esn-primary-row">
        <span class="esn-icon">🕒</span>
        <div class="esn-title-group">
          <span class="esn-badge-today">${todayLabel} (${dayName})</span>
          <strong class="esn-main-status">${statusText}</strong>
        </div>
      </div>
      <div class="esn-schedule-pills">
        <span class="esn-pill ${isWk ? 'esn-pill-active' : ''}">
          ${isWk ? '<span class="esn-pin">📍</span>' : ''}${slotLabels.weekday[lang] || slotLabels.weekday.fr} : 12h00
        </span>
        <span class="esn-pill ${isSat ? 'esn-pill-active' : ''}">
          ${isSat ? '<span class="esn-pin">📍</span>' : ''}${slotLabels.saturday[lang] || slotLabels.saturday.fr} : 13h00
        </span>
        <span class="esn-pill ${isSun ? 'esn-pill-active' : ''}">
          ${isSun ? '<span class="esn-pin">📍</span>' : ''}${slotLabels.sunday[lang] || slotLabels.sunday.fr} : 14h00
        </span>
      </div>
    </div>
  `;
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
  const lang = currentLang || "fr";

  if (badge && textEl) {
    const open = isRestaurantOpen();
    badge.classList.toggle("status-open", open);
    badge.classList.toggle("status-closed", !open);

    const stateKey = open ? "open" : "closed";
    const dict = STATUS_TEXTS[stateKey];
    textEl.textContent = dict[lang] || dict.fr;
  }

  // Also dynamically update any entrees notices on page
  const entreesNotices = document.querySelectorAll(".entrees-service-notice");
  if (entreesNotices.length > 0) {
    const innerHtml = getKitchenNoticeInner(lang);
    entreesNotices.forEach(el => {
      el.innerHTML = innerHtml;
    });
  }
}

// Global binding for backwards compatibility
window.isRestaurantOpen = isRestaurantOpen;
window.isBreakfastAvailable = isBreakfastAvailable;
window.updateScheduleUI = updateScheduleUI;
window.getKitchenScheduleInfo = getKitchenScheduleInfo;
window.getKitchenNoticeInner = getKitchenNoticeInner;

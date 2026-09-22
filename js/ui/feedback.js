/**
 * GREY CORNER — SMART FEEDBACK & WHATSAPP ROUTING MODULE
 * Traitement qualitatif :
 *  - Notes 1 à 3 (mécontent/moyen) -> Manager WhatsApp direct (+212666265160) pour recontact immédiat
 *  - Notes 4 et 5 (satisfait) -> Page Google Reviews pour avis 5 étoiles + option WhatsApp
 */

import { currentLang } from '../services/i18n.js';
import { clientTable } from './modals.js';

const MANAGER_PHONE = "212666265160";
const GOOGLE_REVIEW_URL = "https://g.page/r/CXF0QNm04m-ZEAE/review";

const FEEDBACK_I18N = {
  fr: {
    fabLabel: "Avis & Service",
    fabSub: "Donnez votre avis",
    title: "Votre avis compte pour nous",
    subtitle: "Comment s'est passée votre expérience chez Grey Corner ?",
    note1: "Décevant",
    note2: "Passable",
    note3: "Moyen",
    note4: "Très bien",
    note5: "Excellent !",
    stepUnhappyTitle: "Prise en charge immédiate",
    stepUnhappyText: "Nous sommes sincèrement désolés. Notre manager prend personnellement en charge votre message sur WhatsApp pour vous répondre dans la minute.",
    openWhatsAppBtn: "Contacter le Manager sur WhatsApp 💬",
    stepHappyTitle: "Merci infiniment ! 😍",
    stepHappyText: "Votre satisfaction est notre plus belle récompense. Soutenez notre équipe en publiant votre avis 5 étoiles sur Google !",
    googleBtn: "Publier mon avis sur Google ⭐",
    whatsappHappyBtn: "Envoyer un message au Manager 💬",
    tableNone: "Non précisée",
    waUnhappyPrefix: "Bonjour Grey Corner, je vous écris suite à ma visite",
    waHappyPrefix: "Bonjour Grey Corner, félicitations pour votre accueil et votre service !",
    waRatingLabel: "Note",
    waTableLabel: "Table",
    waCommentPrompt: "Mon retour / commentaire : "
  },
  ar: {
    fabLabel: "رأيكم وخدمتكم",
    fabSub: "شاركنا تقييمك",
    title: "رأيكم يهمنا جداً",
    subtitle: "كيف كانت تجربتكم اليوم في غري كورنر ؟",
    note1: "مخيب للأمل",
    note2: "مقبول",
    note3: "متوسط",
    note4: "جيد جداً",
    note5: "ممتاز !",
    stepUnhappyTitle: "تواصل مباشر مع الإدارة",
    stepUnhappyText: "نعتذر بشدة عن أي تقصير. المسؤول المباشر جاهز الآن للرد عليكم عبر واتساب ومعالجة الأمر في الحال.",
    openWhatsAppBtn: "التحدث مع المدير عبر واتساب 💬",
    stepHappyTitle: "شكراً جزيلاً لكم ! 😍",
    stepHappyText: "سعادتكم هي أكبر مكافأة لنا. ساعدوا فريقنا بمشاركة تقييمكم الممتاز 5 نجوم على جوجل !",
    googleBtn: "نشر تقييمي على جوجل ⭐",
    whatsappHappyBtn: "إرسال رسالة شكر للمدير 💬",
    tableNone: "غير محددة",
    waUnhappyPrefix: "مرحباً غري كورنر، أتواصل معكم بخصوص زيارتي",
    waHappyPrefix: "مرحباً غري كورنر، شكراً لكم على حسن الاستقبال والخدمة الراقية !",
    waRatingLabel: "التقييم",
    waTableLabel: "الطاولة",
    waCommentPrompt: "ملاحظاتي : "
  },
  en: {
    fabLabel: "Review & Service",
    fabSub: "Give your feedback",
    title: "Your feedback matters",
    subtitle: "How was your experience at Grey Corner today?",
    note1: "Disappointing",
    note2: "Fair",
    note3: "Average",
    note4: "Very good",
    note5: "Excellent!",
    stepUnhappyTitle: "Immediate Manager Support",
    stepUnhappyText: "We are truly sorry. Our manager is personally handling your feedback via WhatsApp to assist you within the minute.",
    openWhatsAppBtn: "Chat with Manager on WhatsApp 💬",
    stepHappyTitle: "Thank you so much! 😍",
    stepHappyText: "Your satisfaction is our greatest reward. Please support our team by leaving a 5-star review on Google!",
    googleBtn: "Leave a 5-Star Review on Google ⭐",
    whatsappHappyBtn: "Send a message to the Manager 💬",
    tableNone: "Not specified",
    waUnhappyPrefix: "Hello Grey Corner, I am writing regarding my visit",
    waHappyPrefix: "Hello Grey Corner, congratulations on your great welcome and service!",
    waRatingLabel: "Rating",
    waTableLabel: "Table",
    waCommentPrompt: "My feedback / comment: "
  },
  de: {
    fabLabel: "Feedback & Service",
    fabSub: "Ihre Bewertung",
    title: "Ihre Meinung ist uns wichtig",
    subtitle: "Wie war Ihr Erlebnis heute bei Grey Corner?",
    note1: "Enttäuschend",
    note2: "Ausreichend",
    note3: "Mittelmäßig",
    note4: "Sehr gut",
    note5: "Ausgezeichnet!",
    stepUnhappyTitle: "Direkter Manager-Support",
    stepUnhappyText: "Es tut uns aufrichtig leid. Unser Manager kümmert sich persönlich über WhatsApp um Ihr Anliegen, um sofort zu reagieren.",
    openWhatsAppBtn: "Manager auf WhatsApp kontaktieren 💬",
    stepHappyTitle: "Vielen Dank! 😍",
    stepHappyText: "Ihre Zufriedenheit ist unsere schönste Belohnung. Unterstützen Sie unser Team mit 5 Sternen auf Google!",
    googleBtn: "5-Sterne-Bewertung auf Google abgeben ⭐",
    whatsappHappyBtn: "Nachricht an den Manager senden 💬",
    tableNone: "Nicht angegeben",
    waUnhappyPrefix: "Hallo Grey Corner, ich schreibe Ihnen bezüglich meines Besuchs",
    waHappyPrefix: "Hallo Grey Corner, herzlichen Glückwunsch zu Ihrem hervorragenden Service!",
    waRatingLabel: "Bewertung",
    waTableLabel: "Tisch",
    waCommentPrompt: "Mein Kommentar / Feedback: "
  }
};

const RATING_EMOJIS = {
  1: "😡",
  2: "🙁",
  3: "😐",
  4: "🙂",
  5: "😍"
};

let currentSelectedRating = null;

export function getFeedbackTexts() {
  return FEEDBACK_I18N[currentLang] || FEEDBACK_I18N.fr;
}

export function openFeedbackModal() {
  const modal = document.getElementById("feedbackModal");
  if (!modal) return;

  currentSelectedRating = null;
  resetFeedbackModalView();
  updateFeedbackTexts();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

export function closeFeedbackModal() {
  const modal = document.getElementById("feedbackModal");
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function resetFeedbackModalView() {
  const stepRating = document.getElementById("fbStepRating");
  const stepUnhappy = document.getElementById("fbStepUnhappy");
  const stepHappy = document.getElementById("fbStepHappy");

  if (stepRating) stepRating.style.display = "block";
  if (stepUnhappy) stepUnhappy.style.display = "none";
  if (stepHappy) stepHappy.style.display = "none";
}

export function updateFeedbackTexts() {
  const t = getFeedbackTexts();

  // Update FAB text
  const fabLabel = document.querySelector(".fb-fab-label");
  if (fabLabel) fabLabel.textContent = t.fabLabel;

  // Update modal header
  const titleEl = document.getElementById("fbModalTitle");
  if (titleEl) titleEl.textContent = t.title;

  const subtitleEl = document.getElementById("fbModalSubtitle");
  if (subtitleEl) subtitleEl.textContent = t.subtitle;

  // Update rating label texts
  for (let i = 1; i <= 5; i++) {
    const lbl = document.getElementById(`fbRateLabel${i}`);
    if (lbl && t[`note${i}`]) lbl.textContent = t[`note${i}`];
  }

  // Update unhappy step
  const unhTitle = document.getElementById("fbUnhappyTitle");
  if (unhTitle) unhTitle.textContent = t.stepUnhappyTitle;

  const unhText = document.getElementById("fbUnhappyText");
  if (unhText) unhText.textContent = t.stepUnhappyText;

  const waBtn = document.getElementById("fbOpenWhatsAppBtn");
  if (waBtn) waBtn.textContent = t.openWhatsAppBtn;

  // Update happy step
  const hapTitle = document.getElementById("fbHappyTitle");
  if (hapTitle) hapTitle.textContent = t.stepHappyTitle;

  const hapText = document.getElementById("fbHappyText");
  if (hapText) hapText.textContent = t.stepHappyText;

  const googleBtn = document.getElementById("fbGoogleReviewBtn");
  if (googleBtn) googleBtn.textContent = t.googleBtn;

  const waHappyBtn = document.getElementById("fbWhatsAppHappyBtn");
  if (waHappyBtn) waHappyBtn.textContent = t.whatsappHappyBtn;
}

export function handleFeedbackRating(stars) {
  currentSelectedRating = stars;
  const t = getFeedbackTexts();

  const stepRating = document.getElementById("fbStepRating");
  const stepUnhappy = document.getElementById("fbStepUnhappy");
  const stepHappy = document.getElementById("fbStepHappy");

  if (stars <= 3) {
    // Note 1 à 3 : mécontent ou moyen -> Manager WhatsApp direct
    if (stepRating) stepRating.style.display = "none";
    if (stepHappy) stepHappy.style.display = "none";
    if (stepUnhappy) stepUnhappy.style.display = "block";

    // Build WhatsApp URL
    const waUrl = buildWhatsAppUrl(stars, false);

    const waBtn = document.getElementById("fbOpenWhatsAppBtn");
    if (waBtn) {
      waBtn.onclick = () => {
        window.open(waUrl, "_blank", "noopener");
        closeFeedbackModal();
      };
    }

    // Auto-redirect après 1.2s pour une réactivité maximale tout en laissant lire le message
    setTimeout(() => {
      // Si la modale est toujours ouverte sur cette étape
      const modal = document.getElementById("feedbackModal");
      if (modal && modal.classList.contains("open") && stepUnhappy && stepUnhappy.style.display === "block") {
        window.open(waUrl, "_blank", "noopener");
        closeFeedbackModal();
      }
    }, 1200);

  } else {
    // Note 4 ou 5 : satisfait -> Google Reviews + Option WhatsApp
    if (stepRating) stepRating.style.display = "none";
    if (stepUnhappy) stepUnhappy.style.display = "none";
    if (stepHappy) stepHappy.style.display = "block";

    const googleBtn = document.getElementById("fbGoogleReviewBtn");
    if (googleBtn) {
      googleBtn.onclick = () => {
        window.open(GOOGLE_REVIEW_URL, "_blank", "noopener");
        closeFeedbackModal();
      };
    }

    const waHappyBtn = document.getElementById("fbWhatsAppHappyBtn");
    if (waHappyBtn) {
      const waUrl = buildWhatsAppUrl(stars, true);
      waHappyBtn.onclick = () => {
        window.open(waUrl, "_blank", "noopener");
        closeFeedbackModal();
      };
    }
  }
}

function buildWhatsAppUrl(stars, isHappy) {
  const t = getFeedbackTexts();
  const emoji = RATING_EMOJIS[stars] || "⭐";
  const starsStr = "★".repeat(stars) + "☆".repeat(5 - stars);

  // Table number if set
  const tableVal = clientTable || window.clientTable || getUrlTableParam();
  const tableDisplay = tableVal ? `${tableVal}` : t.tableNone;

  let message = "";
  if (!isHappy) {
    message = `${t.waUnhappyPrefix} (${t.waRatingLabel} : ${stars}/5 ${emoji} ${starsStr}).\n`;
    message += `📍 ${t.waTableLabel} : ${tableDisplay}\n\n`;
    message += `${t.waCommentPrompt}`;
  } else {
    message = `${t.waHappyPrefix} (${t.waRatingLabel} : ${stars}/5 ${emoji} ${starsStr}).\n`;
    message += `📍 ${t.waTableLabel} : ${tableDisplay}\n\n`;
    message += `${t.waCommentPrompt}`;
  }

  return `https://wa.me/${MANAGER_PHONE}?text=${encodeURIComponent(message)}`;
}

function getUrlTableParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("table") || params.get("t") || null;
  } catch (e) {
    return null;
  }
}

export function initFeedbackWidget() {
  const fab = document.getElementById("feedbackFab");
  if (fab) {
    fab.addEventListener("click", (e) => {
      e.preventDefault();
      openFeedbackModal();
    });
  }

  const modal = document.getElementById("feedbackModal");
  if (!modal) return;

  const closeBtn = document.getElementById("fbCloseModalBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeFeedbackModal);
  }

  const backdrop = modal.querySelector(".fb-modal-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", closeFeedbackModal);
  }

  // Rating buttons 1 to 5
  modal.querySelectorAll(".fb-rate-btn[data-rating]").forEach(btn => {
    btn.addEventListener("click", () => {
      const rating = parseInt(btn.dataset.rating, 10);
      if (rating >= 1 && rating <= 5) {
        handleFeedbackRating(rating);
      }
    });
  });

  // Escape key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeFeedbackModal();
    }
  });

  // Initial text update
  updateFeedbackTexts();
}

// Bind to window for global access / language switch callbacks
window.initFeedbackWidget = initFeedbackWidget;
window.openFeedbackModal = openFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.updateFeedbackTexts = updateFeedbackTexts;

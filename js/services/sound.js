/**
 * GREY CORNER — ELEGANT SOUND SERVICE (Web Audio API)
 * Micro-synthèse sonore haute fidélité pour une expérience tactile et auditive luxueuse.
 */

let audioCtx = null;
let isMuted = false;

// Initialiser l'état depuis le localStorage
try {
  isMuted = localStorage.getItem("gc_sound_muted") === "true";
} catch (e) {
  isMuted = false;
}

/**
 * Récupère ou instancie l'AudioContext singleton
 */
function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Déverrouille l'AudioContext silencieusement lors du premier geste utilisateur
 */
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state !== "running") {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
        ctx.resume().catch(() => {});
      }
    } catch (e) {}

    document.removeEventListener("touchstart", unlockAudio);
    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("pointerdown", unlockAudio);
  };

  document.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
  document.addEventListener("click", unlockAudio, { once: true, passive: true });
  document.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });
}

/**
 * Déclenche une micro-vibration haptique subtile (Android)
 */
function triggerHaptic(duration = 15) {
  if (isMuted) return;
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(duration);
    } catch (e) {}
  }
}

/**
 * 1. CLIC & TOUCHER LÉGER (Soft Wood Tap)
 * Pour +, -, ouvrir/fermer le panier, déplier catégorie.
 * Onde sinusoïdale très douce avec pitch sweep 400Hz -> 200Hz sur 35ms.
 */
export function playTapSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.035);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
    triggerHaptic(10);
  } catch (e) {}
}

/**
 * 2. AJOUTER UN ARTICLE AU PANIER (Marimba Chime)
 * Deux notes douces ascendantes et rondes : F#4 (370Hz) -> C#5 (554Hz)
 * Toucher gourmand et velouté.
 */
export function playAddToCartSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Note 1 : F#4 (369.99 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(369.99, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.23);

    // Note 2 : C#5 (554.37 Hz) avec léger décalage (80ms)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(554.37, now + 0.08);
    gain2.gain.setValueAtTime(0.22, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.39);

    triggerHaptic(18);
  } catch (e) {}
}

/**
 * 3. CHOISIR SA TABLE (Pure Crystal Ping)
 * Résonance cristalline très pure (A5 - 880Hz), apaisante et nette.
 */
export function playTableSelectSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now); // A5

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);

    triggerHaptic(16);
  } catch (e) {}
}

/**
 * 4. APPEL SERVEUR / EAU / ADDITION (Concierge Bell)
 * Clochette de majordome argentée : Mi6 (1318Hz) + harmonique Mi7 (2637Hz)
 * Style hôtel de prestige, raffiné et poli.
 */
export function playServiceCallSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Fondamentale : E6 (1318.51 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1318.51, now);
    gain1.gain.setValueAtTime(0.20, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.66);

    // Harmonique claire : E7 (2637.02 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(2637.02, now);
    gain2.gain.setValueAtTime(0.08, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.36);

    triggerHaptic([15, 30, 15]);
  } catch (e) {}
}

/**
 * 5. CONFIRMATION & ENVOI DE LA COMMANDE (Golden Arpeggio)
 * Arpège triphonique majeur céleste : Do5 (523Hz) -> Mi5 (659Hz) -> Sol5 (784Hz) -> Do6 (1046Hz)
 * Chaleureux, rassurant et noble.
 */
export function playOrderSuccessSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.45, gain: 0.16 }, // C5
      { freq: 659.25, time: 0.09, dur: 0.48, gain: 0.18 }, // E5
      { freq: 783.99, time: 0.18, dur: 0.52, gain: 0.20 }, // G5
      { freq: 1046.50, time: 0.27, dur: 0.75, gain: 0.22 } // C6
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(n.freq, now + n.time);
      gain.gain.setValueAtTime(n.gain, now + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    });

    triggerHaptic([25, 35, 25]);
  } catch (e) {}
}

/**
 * Basculer l'état muet / sonore
 */
export function toggleSoundMute() {
  isMuted = !isMuted;
  try {
    localStorage.setItem("gc_sound_muted", isMuted ? "true" : "false");
  } catch (e) {}
  updateSoundUI();
  return isMuted;
}

export function isSoundMuted() {
  return isMuted;
}

export function updateSoundUI() {
  if (typeof document === "undefined") return;
  const btns = document.querySelectorAll(".gc-sound-toggle-btn");
  btns.forEach(btn => {
    btn.innerHTML = isMuted ? "🔇" : "🔊";
    btn.setAttribute("aria-label", isMuted ? "Activer le son" : "Couper le son");
    btn.classList.toggle("muted", isMuted);
  });
}

// Exposer globalement sur window pour un usage universel
if (typeof window !== "undefined") {
  window.GC_Sound = {
    playTap: playTapSound,
    playAddToCart: playAddToCartSound,
    playTableSelect: playTableSelectSound,
    playServiceCall: playServiceCallSound,
    playOrderSuccess: playOrderSuccessSound,
    toggleMute: toggleSoundMute,
    isMuted: isSoundMuted,
    updateUI: updateSoundUI
  };
}

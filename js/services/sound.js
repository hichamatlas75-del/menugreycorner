/**
 * GREY CORNER — ELEGANT SOUND SERVICE (Web Audio API - Pre-rendered PCM Buffers)
 * Architecture audio de précision pour garantir une régularité absolue des sons,
 * sans décalage, sans coupure et avec reprise instantanée lors de la réactivation.
 */

let audioCtx = null;
let masterGain = null;
let masterCompressor = null;
let isMuted = false;

// Cache des buffers audio pré-synthétisés en mémoire
const soundBuffers = {
  tap: null,
  addToCart: null,
  tableSelect: null,
  serviceCall: null,
  orderSuccess: null
};

// Initialiser l'état sourdine depuis le localStorage
try {
  isMuted = localStorage.getItem("gc_sound_muted") === "true";
} catch (e) {
  isMuted = false;
}

/**
 * Récupère ou instancie l'AudioContext singleton avec chaîne Master Gain + Compresseur
 */
function getAudioContext() {
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();

      // Limiteur / Compresseur pour éliminer toute saturation lors de clics rapides
      masterCompressor = audioCtx.createDynamicsCompressor();
      masterCompressor.threshold.setValueAtTime(-18, audioCtx.currentTime);
      masterCompressor.knee.setValueAtTime(12, audioCtx.currentTime);
      masterCompressor.ratio.setValueAtTime(10, audioCtx.currentTime);
      masterCompressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
      masterCompressor.release.setValueAtTime(0.15, audioCtx.currentTime);
      masterCompressor.connect(audioCtx.destination);

      // Master Gain
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 1, audioCtx.currentTime);
      masterGain.connect(masterCompressor);

      // Générer immédiatement les formes d'ondes en mémoire
      buildAllSoundBuffers(audioCtx);
    }
  }

  return audioCtx;
}

/**
 * Pré-génération mathématique des 5 sons (formes d'ondes PCM 100% stables et régulières)
 */
function buildAllSoundBuffers(ctx) {
  if (!ctx) return;
  const sampleRate = ctx.sampleRate || 44100;

  // 1. TAP (Soft Wood Tap - 45ms)
  try {
    const dur = 0.045;
    const len = Math.floor(sampleRate * dur);
    const buf = ctx.createBuffer(1, len, sampleRate);
    const d = buf.getChannelData(0);
    let phase = 0;
    for (let i = 0; i < len; i++) {
      const t = i / sampleRate;
      const freq = 420 - (200 * (t / dur));
      phase += (2 * Math.PI * freq) / sampleRate;
      const attack = Math.min(1, i / (sampleRate * 0.002));
      const decay = Math.exp(-t * 90);
      d[i] = Math.sin(phase) * attack * decay * 0.15;
    }
    soundBuffers.tap = buf;
  } catch (e) {}

  // 2. ADD TO CART (Marimba Chime - 360ms, F#4 -> C#5)
  try {
    const dur = 0.36;
    const len = Math.floor(sampleRate * dur);
    const buf = ctx.createBuffer(1, len, sampleRate);
    const d = buf.getChannelData(0);
    let p1 = 0;
    let p2 = 0;
    const note2Start = 0.07;
    for (let i = 0; i < len; i++) {
      const t = i / sampleRate;
      let s = 0;
      if (t < 0.24) {
        p1 += (2 * Math.PI * 369.99) / sampleRate;
        const a1 = Math.min(1, t / 0.003);
        const dec1 = Math.exp(-t * 22);
        s += (Math.sin(p1) + 0.14 * Math.sin(p1 * 2)) * a1 * dec1 * 0.18;
      }
      if (t >= note2Start) {
        const t2 = t - note2Start;
        p2 += (2 * Math.PI * 554.37) / sampleRate;
        const a2 = Math.min(1, t2 / 0.003);
        const dec2 = Math.exp(-t2 * 14);
        s += (Math.sin(p2) + 0.12 * Math.sin(p2 * 2)) * a2 * dec2 * 0.22;
      }
      d[i] = s;
    }
    soundBuffers.addToCart = buf;
  } catch (e) {}

  // 3. TABLE SELECT (Crystal Ping - 250ms, 880Hz)
  try {
    const dur = 0.25;
    const len = Math.floor(sampleRate * dur);
    const buf = ctx.createBuffer(1, len, sampleRate);
    const d = buf.getChannelData(0);
    let p = 0;
    for (let i = 0; i < len; i++) {
      const t = i / sampleRate;
      p += (2 * Math.PI * 880) / sampleRate;
      const attack = Math.min(1, t / 0.002);
      const decay = Math.exp(-t * 18);
      d[i] = Math.sin(p) * attack * decay * 0.16;
    }
    soundBuffers.tableSelect = buf;
  } catch (e) {}

  // 4. SERVICE CALL (Concierge Bell - 600ms, E6 1318Hz + E7 2637Hz)
  try {
    const dur = 0.60;
    const len = Math.floor(sampleRate * dur);
    const buf = ctx.createBuffer(1, len, sampleRate);
    const d = buf.getChannelData(0);
    let p1 = 0;
    let p2 = 0;
    for (let i = 0; i < len; i++) {
      const t = i / sampleRate;
      p1 += (2 * Math.PI * 1318.51) / sampleRate;
      p2 += (2 * Math.PI * 2637.02) / sampleRate;
      const attack = Math.min(1, t / 0.002);
      const d1 = Math.exp(-t * 6.5);
      const d2 = Math.exp(-t * 12);
      d[i] = (Math.sin(p1) * d1 * 0.19 + Math.sin(p2) * d2 * 0.08) * attack;
    }
    soundBuffers.serviceCall = buf;
  } catch (e) {}

  // 5. ORDER SUCCESS (Golden Triad Arpeggio - 850ms, C5 -> E5 -> G5 -> C6)
  try {
    const dur = 0.85;
    const len = Math.floor(sampleRate * dur);
    const buf = ctx.createBuffer(1, len, sampleRate);
    const d = buf.getChannelData(0);

    const notes = [
      { freq: 523.25, start: 0.00, gain: 0.15, decay: 7 },
      { freq: 659.25, start: 0.09, gain: 0.17, decay: 6.5 },
      { freq: 783.99, start: 0.18, gain: 0.19, decay: 6 },
      { freq: 1046.50, start: 0.27, gain: 0.22, decay: 4.5 }
    ];

    notes.forEach(n => {
      let phase = 0;
      const startIndex = Math.floor(n.start * sampleRate);
      for (let i = startIndex; i < len; i++) {
        const t = (i - startIndex) / sampleRate;
        phase += (2 * Math.PI * n.freq) / sampleRate;
        const attack = Math.min(1, t / 0.003);
        const dec = Math.exp(-t * n.decay);
        d[i] += Math.sin(phase) * attack * dec * n.gain;
      }
    });
    soundBuffers.orderSuccess = buf;
  } catch (e) {}
}

/**
 * Déverrouille l'AudioContext silencieusement lors du premier geste utilisateur
 */
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === "suspended") {
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
 * Joue un buffer PCM pré-calculé avec réveil garanti de l'AudioContext
 */
function playBuffer(buf, hapticDuration = 12) {
  if (isMuted) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Si les buffers n'étaient pas encore prêts, les générer
  if (!buf) {
    buildAllSoundBuffers(ctx);
  }

  const targetBuf = buf;
  if (!targetBuf) return;

  // Si le contexte s'est mis en veille (ex: après un temps sans son ou réveil d'onglet)
  if (ctx.state === "suspended") {
    ctx.resume().then(() => {
      actuallyPlayBuffer(ctx, targetBuf, hapticDuration);
    }).catch(() => {});
    return;
  }

  actuallyPlayBuffer(ctx, targetBuf, hapticDuration);
}

/**
 * Déclenchement instantané du buffer sans latence
 */
function actuallyPlayBuffer(ctx, buffer, hapticDuration) {
  if (isMuted || !buffer) return;

  try {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(masterGain || ctx.destination);
    source.start(0);

    // Déconnexion propre pour éviter toute accumulation en mémoire
    source.onended = () => {
      try { source.disconnect(); } catch (e) {}
    };

    if (hapticDuration && typeof navigator !== "undefined" && navigator.vibrate) {
      try { navigator.vibrate(hapticDuration); } catch (e) {}
    }
  } catch (e) {
    console.warn("Audio buffer play error:", e);
  }
}

// ── FONCTIONS EXPORTÉES ──────────────────────────────────────────────────────

export function playTapSound() {
  playBuffer(soundBuffers.tap, 10);
}

export function playAddToCartSound() {
  playBuffer(soundBuffers.addToCart, 18);
}

export function playTableSelectSound() {
  playBuffer(soundBuffers.tableSelect, 16);
}

export function playServiceCallSound() {
  playBuffer(soundBuffers.serviceCall, [15, 30, 15]);
}

export function playOrderSuccessSound() {
  playBuffer(soundBuffers.orderSuccess, [25, 35, 25]);
}

/**
 * Basculer l'état muet / sonore de manière propre et réactive
 */
export async function toggleSoundMute() {
  isMuted = !isMuted;

  try {
    localStorage.setItem("gc_sound_muted", isMuted ? "true" : "false");
  } catch (e) {}

  const ctx = getAudioContext();
  if (ctx) {
    if (masterGain) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : 1, ctx.currentTime);
    }
    // Si on réactive le son, réveiller immédiatement le contexte audio suspendu
    if (!isMuted && ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (e) {}
    }
  }

  updateSoundUI();

  // Signal sonore doux de confirmation lors de la réactivation
  if (!isMuted) {
    playTapSound();
  }

  return isMuted;
}

export function isSoundMuted() {
  return isMuted;
}

/**
 * Met à jour tous les boutons d'affichage son (Header & Panier)
 */
export function updateSoundUI() {
  if (typeof document === "undefined") return;

  const btns = document.querySelectorAll(".gc-sound-toggle-btn");
  btns.forEach(btn => {
    const iconEl = btn.querySelector(".gc-sound-icon");
    const iconText = isMuted ? "🔇" : "🔊";

    if (iconEl) {
      iconEl.textContent = iconText;
    } else {
      btn.innerHTML = iconText;
    }

    btn.setAttribute("aria-label", isMuted ? "Activer le son" : "Couper le son");
    btn.classList.toggle("muted", isMuted);
  });
}

// Exposer globalement sur window pour rétrocompatibilité
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

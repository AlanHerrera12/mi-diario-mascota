/**
 * Programmatic sounds via Web Audio API — no files needed, works on web.
 * Each function is a no-op on React Native native (no AudioContext).
 */

type OscType = 'sine' | 'triangle' | 'square' | 'sawtooth';

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const W = window as any;
  const Ctor = W.AudioContext ?? W.webkitAudioContext;
  if (!Ctor) return null;
  try { return new Ctor(); } catch { return null; }
}

function tone(
  ctx: AudioContext,
  freq: number,
  startAt: number,
  duration: number,
  gain = 0.18,
  type: OscType = 'sine',
) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
  gainNode.gain.setValueAtTime(0, ctx.currentTime + startAt);
  gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + startAt + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + duration);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + duration + 0.05);
}

/** 3-note ascending arpeggio — shop purchase */
export function playPurchaseSound() {
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 523, 0.00, 0.18);   // C5
  tone(ctx, 659, 0.12, 0.18);   // E5
  tone(ctx, 784, 0.24, 0.28);   // G5
}

/** Soft two-note chime — equip item */
export function playEquipSound() {
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 659, 0.00, 0.14);   // E5
  tone(ctx, 880, 0.10, 0.20);   // A5
}

/** 4-note rising fanfare — achievement / streak milestone */
export function playAchievementSound() {
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 523, 0.00, 0.15);   // C5
  tone(ctx, 659, 0.12, 0.15);   // E5
  tone(ctx, 784, 0.24, 0.15);   // G5
  tone(ctx, 1046, 0.36, 0.35);  // C6
}

/** Gentle low inhale tone — breathing start */
export function playInhaleSound() {
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 220, 0.00, 0.6, 0.10, 'sine');  // A3 soft
}

/** Gentle descending exhale tone */
export function playExhaleSound() {
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 196, 0.00, 0.6, 0.10, 'sine');  // G3 soft
}

/** Soft ding — star caught in game */
export function playStarSound() {
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 880, 0.00, 0.12, 0.12, 'triangle');
  tone(ctx, 1046, 0.08, 0.12, 0.10, 'triangle');
}

/** Memory card flip */
export function playCardFlipSound() {
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 440, 0.00, 0.08, 0.08, 'triangle');
}

/** Memory card match */
export function playCardMatchSound() {
  const ctx = getCtx();
  if (!ctx) return;
  tone(ctx, 659, 0.00, 0.12);
  tone(ctx, 880, 0.10, 0.20);
}

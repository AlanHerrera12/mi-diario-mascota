import type { PetSpecies } from '../types';

/**
 * Pet registry — metadata only.
 * Visual rendering is handled by PetAvatar → individual SVG components.
 *
 * Categories:
 *  common    — dog, cat, rabbit          (free, choosable at start)
 *  epic      — polar-bear, tiger         (shop or 100-day streak)
 *  legendary — dragon, unicorn           (shop only)
 */

export type PetCategory = 'common' | 'epic' | 'legendary';

export interface PetInfo {
  species: PetSpecies;
  label: string;
  category: PetCategory;
  /** Short unlock description shown when locked */
  unlockHint?: string;
}

export const PET_LIST: PetInfo[] = [
  // ── Comunes ──────────────────────────────────────────────
  { species: 'dog',        label: 'Perro',     category: 'common'    },
  { species: 'cat',        label: 'Gato',      category: 'common'    },
  { species: 'rabbit',     label: 'Conejo',    category: 'common'    },
  // ── Épicas ───────────────────────────────────────────────
  { species: 'polar-bear', label: 'Oso Polar', category: 'epic',      unlockHint: '100 días de racha o tienda' },
  { species: 'tiger',      label: 'Tigre',     category: 'epic',      unlockHint: 'Disponible en la tienda'    },
  // ── Legendarias ──────────────────────────────────────────
  { species: 'dragon',     label: 'Dragón',    category: 'legendary', unlockHint: 'Disponible en la tienda'    },
  { species: 'unicorn',    label: 'Unicornio', category: 'legendary', unlockHint: 'Disponible en la tienda'    },
];

/** Quick lookup by species key */
export const PET_MAP: Record<PetSpecies, PetInfo> = Object.fromEntries(
  PET_LIST.map(p => [p.species, p]),
) as Record<PetSpecies, PetInfo>;

/** Category metadata (colors, labels, icons) */
export const CATEGORY_META: Record<PetCategory, { label: string; color: string; glow: string; badge: string }> = {
  common:    { label: 'Comunes',     color: '#818CF8', glow: 'rgba(129,140,248,0.25)', badge: '⭐'  },
  epic:      { label: 'Épicas',      color: '#F59E0B', glow: 'rgba(245,158,11,0.30)',  badge: '💎'  },
  legendary: { label: 'Legendarias', color: '#EC4899', glow: 'rgba(236,72,153,0.35)',  badge: '👑'  },
};

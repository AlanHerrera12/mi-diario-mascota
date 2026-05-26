import type { PetSpecies } from '../types';

/**
 * Central registry of pet PNG assets.
 * All images are 400×400 px, compressed to ~30–55 KB each.
 *
 * Categories:
 *  COMMON  — dog, cat, rabbit          (free, choosable at start)
 *  EPIC    — polar-bear, tiger         (shop or 100-day streak)
 *  LEGENDARY — dragon, unicorn         (shop)
 */

export type PetCategory = 'common' | 'epic' | 'legendary';

export interface PetInfo {
  species: PetSpecies;
  label: string;
  category: PetCategory;
  image: ReturnType<typeof require>;
  /** Short unlock description shown when locked */
  unlockHint?: string;
}

export const PET_LIST: PetInfo[] = [
  // ── Comunes ──────────────────────────────────────────────
  {
    species: 'dog',
    label: 'Perro',
    category: 'common',
    image: require('../../assets/pets/pet-dog.png'),
  },
  {
    species: 'cat',
    label: 'Gato',
    category: 'common',
    image: require('../../assets/pets/pet-cat.png'),
  },
  {
    species: 'rabbit',
    label: 'Conejo',
    category: 'common',
    image: require('../../assets/pets/pet-rabbit.png'),
  },
  // ── Épicas ───────────────────────────────────────────────
  {
    species: 'polar-bear',
    label: 'Oso Polar',
    category: 'epic',
    image: require('../../assets/pets/pet-polar-bear.png'),
    unlockHint: '100 días de racha o tienda',
  },
  {
    species: 'tiger',
    label: 'Tigre',
    category: 'epic',
    image: require('../../assets/pets/pet-tiger.png'),
    unlockHint: 'Disponible en la tienda',
  },
  // ── Legendarias ──────────────────────────────────────────
  {
    species: 'dragon',
    label: 'Dragón',
    category: 'legendary',
    image: require('../../assets/pets/pet-dragon.png'),
    unlockHint: 'Disponible en la tienda',
  },
  {
    species: 'unicorn',
    label: 'Unicornio',
    category: 'legendary',
    image: require('../../assets/pets/pet-unicorn.png'),
    unlockHint: 'Disponible en la tienda',
  },
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

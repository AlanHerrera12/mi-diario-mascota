import { create } from 'zustand';
import type { Pet } from '../types';

interface PetState {
  pet: Pet | null;
  gemBalance: number;
  currentStreak: number;
  setPet: (pet: Pet | null) => void;
  setGemBalance: (balance: number) => void;
  addGems: (amount: number) => void;
  setStreak: (streak: number) => void;
  setEquippedItems: (itemIds: string[]) => void;
}

export const usePetStore = create<PetState>(set => ({
  pet: null,
  gemBalance: 0,
  currentStreak: 0,

  setPet: pet => set({ pet }),
  setGemBalance: balance => set({ gemBalance: balance }),
  addGems: amount => set(state => ({ gemBalance: state.gemBalance + amount })),
  setStreak: streak => set({ currentStreak: streak }),
  setEquippedItems: itemIds => set(state => ({
    pet: state.pet
      ? { ...state.pet, customization: { ...state.pet.customization, equippedItems: itemIds } }
      : null,
  })),
}));

import { create } from 'zustand';
import type { Pet } from '../types';

interface PetState {
  pet: Pet | null;
  gemBalance: number;
  currentStreak: number;
  lastTalkDate: string | null;
  ownedDemoItems: string[];

  setPet: (pet: Pet | null) => void;
  setGemBalance: (balance: number) => void;
  addGems: (amount: number) => void;
  setStreak: (streak: number) => void;
  setLastTalkDate: (date: string | null) => void;
  setEquippedItems: (itemIds: string[]) => void;
  addDemoItem: (id: string) => void;
}

export const usePetStore = create<PetState>(set => ({
  pet: null,
  gemBalance: 0,
  currentStreak: 0,
  lastTalkDate: null,
  ownedDemoItems: [],

  setPet: pet => set({ pet }),
  setGemBalance: balance => set({ gemBalance: balance }),
  addGems: amount => set(state => ({ gemBalance: state.gemBalance + amount })),
  setStreak: streak => set({ currentStreak: streak }),
  setLastTalkDate: date => set({ lastTalkDate: date }),
  setEquippedItems: itemIds => set(state => ({
    pet: state.pet
      ? { ...state.pet, customization: { ...state.pet.customization, equippedItems: itemIds } }
      : null,
  })),
  addDemoItem: id => set(state => ({
    ownedDemoItems: state.ownedDemoItems.includes(id)
      ? state.ownedDemoItems
      : [...state.ownedDemoItems, id],
  })),
}));

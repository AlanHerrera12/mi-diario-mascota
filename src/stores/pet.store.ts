import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Pet } from '../types';

interface PetState {
  pet: Pet | null;
  gemBalance: number;
  currentStreak: number;
  lastTalkDate: string | null;
  ownedDemoItems: string[];
  equippedDemoItems: string[];

  setPet: (pet: Pet | null) => void;
  setGemBalance: (balance: number) => void;
  addGems: (amount: number) => void;
  setStreak: (streak: number) => void;
  setLastTalkDate: (date: string | null) => void;
  setEquippedItems: (itemIds: string[]) => void;
  addDemoItem: (id: string) => void;
  toggleDemoEquip: (shopItemId: string) => void;
}

// Storage that works on web (localStorage) and silently no-ops on native
function makeStorage() {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return createJSONStorage(() => window.localStorage);
  }
  // Fallback no-op for React Native without AsyncStorage
  return createJSONStorage(() => ({
    getItem: (_key: string) => null,
    setItem: (_key: string, _value: string) => {},
    removeItem: (_key: string) => {},
  }));
}

export const usePetStore = create<PetState>()(
  persist(
    (set) => ({
      pet: null,
      gemBalance: 0,
      currentStreak: 0,
      lastTalkDate: null,
      ownedDemoItems: [],
      equippedDemoItems: [],

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
      toggleDemoEquip: shopItemId => set(state => ({
        equippedDemoItems: state.equippedDemoItems.includes(shopItemId)
          ? state.equippedDemoItems.filter(id => id !== shopItemId)
          : [...state.equippedDemoItems, shopItemId],
      })),
    }),
    {
      name: 'mi-diario-pet-store',
      storage: makeStorage(),
      // Only persist fields that don't come from the DB on every login
      partialize: (state) => ({
        lastTalkDate:      state.lastTalkDate,
        ownedDemoItems:    state.ownedDemoItems,
        equippedDemoItems: state.equippedDemoItems,
        gemBalance:        state.gemBalance,
        // Persist pet so it shows immediately on refresh before Supabase loads
        pet:               state.pet,
      }),
    },
  ),
);

import { create } from 'zustand';
import type { Parent, Child } from '../types';

interface AuthState {
  parent: Parent | null;
  activeChild: Child | null;
  isParentDashboardUnlocked: boolean;
  setParent: (parent: Parent | null) => void;
  setActiveChild: (child: Child | null) => void;
  unlockParentDashboard: () => void;
  lockParentDashboard: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  parent: null,
  activeChild: null,
  isParentDashboardUnlocked: false,

  setParent: parent => set({ parent }),
  setActiveChild: child => set({ activeChild: child }),
  unlockParentDashboard: () => set({ isParentDashboardUnlocked: true }),
  lockParentDashboard: () => set({ isParentDashboardUnlocked: false }),

  signOut: () =>
    set({ parent: null, activeChild: null, isParentDashboardUnlocked: false }),
}));

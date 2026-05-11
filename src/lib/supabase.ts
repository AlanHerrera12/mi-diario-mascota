import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// ============================================================
// Adaptador de storage para Supabase que usa expo-secure-store
// Necesario para persistir la sesión de forma segura en móvil
// ============================================================
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string | undefined;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL y Anon Key son requeridas. Verificá tu archivo .env.local y app.config.ts',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helpers tipados para tablas principales
export type Tables = {
  parents: import('../types').Parent;
  children: import('../types').Child;
  pets: import('../types').Pet;
  diary_entries: import('../types').DiaryEntry;
  parent_summaries: import('../types').ParentSummary;
  parent_alerts: import('../types').ParentAlert;
  gem_transactions: import('../types').GemTransaction;
  streaks: import('../types').Streak;
  shop_items: import('../types').ShopItem;
  child_inventory: import('../types').ChildInventoryItem;
};

import { Platform } from 'react-native';

// Cross-platform storage: SecureStore on native, localStorage on web.
// Keeps the same async interface so callers don't care about the platform.

const webStore = {
  async getItem(key: string): Promise<string | null> {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  },
};

// Lazily load SecureStore only on native to avoid bundling it on web.
let _native: typeof import('expo-secure-store') | null = null;
function getNative(): typeof import('expo-secure-store') {
  if (!_native) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    _native = require('expo-secure-store') as typeof import('expo-secure-store');
  }
  return _native;
}

export const SecureStorage = {
  getItem: Platform.OS === 'web'
    ? webStore.getItem.bind(webStore)
    : (key: string) => getNative().getItemAsync(key),

  setItem: Platform.OS === 'web'
    ? webStore.setItem.bind(webStore)
    : (key: string, value: string) => getNative().setItemAsync(key, value),

  removeItem: Platform.OS === 'web'
    ? webStore.removeItem.bind(webStore)
    : (key: string) => getNative().deleteItemAsync(key),
};

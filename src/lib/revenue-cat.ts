// ============================================================
// Wrapper de RevenueCat para suscripciones y compras in-app
// TODO: instalar react-native-purchases cuando tengamos EAS build
// configurado (requiere native modules, no funciona solo con Expo Go)
// ============================================================

// DECISION: RevenueCat se integra con EAS Build en Fase 6.
// Por ahora se mockea la API para que el resto de la app compile.

export interface PurchaseInfo {
  activeSubscriptions: string[];
  isActive: boolean;
  expirationDate: string | null;
}

export const RevenueCatService = {
  // Mock para desarrollo — reemplazar con Purchases.getCustomerInfo() en Fase 6
  async getCustomerInfo(): Promise<PurchaseInfo> {
    return {
      activeSubscriptions: [],
      isActive: false,
      expirationDate: null,
    };
  },

  async purchase(_productId: string): Promise<boolean> {
    // TODO (Fase 6): Purchases.purchaseProduct(productId)
    console.warn('[RevenueCat] Mock: purchase no implementado aún');
    return false;
  },
};

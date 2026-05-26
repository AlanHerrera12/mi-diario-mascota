// ============================================================
// Tipos de dominio para MiDiarioMascota
// ============================================================

// --- Auth & Usuarios ---

export interface Parent {
  id: string;
  email: string;
  fullName: string;
  consentGivenAt: string;
  consentMethod: 'credit_card' | 'gov_id' | 'email_plus_form';
  countryCode: string;
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'free';
  trialStartedAt: string | null;
  createdAt: string;
}

export interface Child {
  id: string;
  parentId: string;
  displayName: string;
  ageRange: '5-7' | '8-10' | '11-13' | '14+';
  avatarSeed: string;
  createdAt: string;
}

// --- Mascota ---

export type PetSpecies =
  // ── Comunes (se eligen al inicio, gratis) ──
  | 'dog'
  | 'cat'
  | 'rabbit'
  // ── Épicas (tienda o 100 días de racha) ──
  | 'polar-bear'
  | 'tiger'
  // ── Legendarias (tienda) ──
  | 'dragon'
  | 'unicorn';

export interface PetCustomization {
  baseColor: string;
  accentColor: string;
  equippedItems: string[]; // IDs de shop_items equipados
}

export interface Pet {
  id: string;
  childId: string;
  name: string;
  species: PetSpecies;
  customization: PetCustomization;
  level: number;
  happiness: number;
  createdAt: string;
}

// --- Diario ---

export type EmotionType = 'alegria' | 'frustración' | 'tristeza' | 'miedo' | 'enojo' | 'calma';

export interface DiaryEntry {
  id: string;
  childId: string;
  audioStoragePath: string | null;
  audioDurationSeconds: number;
  transcript: string | null;
  transcriptRedacted: string | null;
  sentimentScore: number | null; // -1.0 a 1.0
  detectedEmotions: EmotionType[];
  keywords: string[];
  alertFlags: AlertFlag[];
  audioDeletedAt: string | null;
  createdAt: string;
}

// --- Alertas ---

export type AlertType = 'bullying' | 'self_harm' | 'abuse' | 'severe_distress';
export type AlertSeverity = 'low' | 'medium' | 'high';
export type AlertLevel = 'none' | 'low' | 'medium' | 'high';

export interface AlertFlag {
  type: AlertType;
  severity: AlertSeverity;
  confidence: number;
}

export interface ParentAlert {
  id: string;
  childId: string;
  diaryEntryId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  contextSnippet: string;
  readAt: string | null;
  createdAt: string;
}

// --- Resúmenes parentales ---

export interface ParentSummary {
  id: string;
  childId: string;
  period: 'daily' | 'weekly';
  periodStart: string;
  periodEnd: string;
  summaryText: string;
  dominantEmotions: EmotionType[];
  topics: string[];
  alertLevel: AlertLevel;
  createdAt: string;
}

// --- Economía de gemas ---

export type GemReason = 'daily_talk' | 'streak_bonus' | 'purchase' | 'shop_buy' | 'daily_task';

export interface GemTransaction {
  id: string;
  childId: string;
  amount: number;
  reason: GemReason;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface Streak {
  id: string;
  childId: string;
  currentStreak: number;
  longestStreak: number;
  lastTalkDate: string | null;
  updatedAt: string;
}

// --- Marketplace ---

export type ItemCategory = 'outfit' | 'accessory' | 'effect' | 'animation' | 'species';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  category: ItemCategory;
  name: string;
  description: string;
  priceGems: number | null;
  priceRealCents: number | null;
  isPremiumOnly: boolean;
  rarity: ItemRarity;
  assetUrl: string;
  previewUrl: string;
  availableFrom: string | null;
  availableUntil: string | null;
}

export interface ChildInventoryItem {
  id: string;
  childId: string;
  shopItemId: string;
  acquiredAt: string;
  equipped: boolean;
  item?: ShopItem;
}

// --- Suscripciones ---

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'free';

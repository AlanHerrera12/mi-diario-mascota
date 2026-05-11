// ============================================================
// Constantes globales de la app
// ============================================================

export const APP_NAME = 'MiDiarioMascota';

// Grabación de audio
export const MIN_RECORDING_SECONDS = 60; // 1 minuto mínimo para ganar gemas
export const MAX_RECORDING_SECONDS = 1800; // 30 minutos máximo

// Economía de gemas
export const GEMS = {
  DAILY_TALK: 10,
  MINI_GAME_COMPLETE: 5,
  STREAK_7_DAYS: 20,
  STREAK_30_DAYS: 50,
  DAILY_TASK: 2,
  PREMIUM_BONUS_MULTIPLIER: 1.2,
} as const;

// Rachas
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100] as const;

// Retención de datos
export const AUDIO_RETENTION_DAYS = 7;

// Alertas
export const ALERT_KEYWORDS = {
  // DECISION: Lista curada externamente, cargada desde Supabase en runtime.
  // El placeholder vacío aquí asegura que nunca se hardcodee una lista
  // incompleta en el cliente. Ver supabase/functions/detect-alerts/index.ts
  placeholder: 'loaded_from_backend',
} as const;

// Marketplace
export const SHOP_PRICES = {
  outfit: { common: [50, 100], rare: [150, 300], epic: [400, 800], legendary: [1000, 2000] },
  accessory: { common: [30, 80], rare: [100, 250], epic: [300, 600], legendary: [800, 1500] },
  effect: { common: [80, 150], rare: [200, 400], epic: [500, 900], legendary: [1000, 1500] },
  animation: { common: [100, 200], rare: [300, 600], epic: [700, 1200], legendary: [1500, 2500] },
  species: { legendary: [2000] },
} as const;

// Free tier
export const FREE_TIER = {
  MONTHLY_TALK_DAYS: 7, // días al mes con acceso completo
  WEEKLY_TALKS_AFTER_TRIAL: 1, // 1 sesión por semana fuera del trial
} as const;

// Dashboard parental
export const PARENT_PIN_LENGTH = { min: 4, max: 6 } as const;

// Regiones para cumplimiento GDPR-K / COPPA
export const GDPR_COUNTRIES = [
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI',
  'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
  'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
] as const;

export const COPPA_COUNTRIES = ['US'] as const;

// Recursos de ayuda por país (para alertas críticas)
export const HELP_RESOURCES: Record<string, { name: string; phone: string; url: string }> = {
  AR: { name: 'Línea 102', phone: '102', url: 'https://www.argentina.gob.ar/linea102' },
  US: { name: 'Childhelp National Child Abuse Hotline', phone: '1-800-422-4453', url: 'https://www.childhelp.org' },
  ES: { name: 'Teléfono ANAR', phone: '900-20-20-10', url: 'https://www.anar.org' },
  MX: { name: 'CNDH', phone: '800-715-2000', url: 'https://www.cndh.org.mx' },
  // TODO: ampliar lista en docs/privacy-decisions.md
};

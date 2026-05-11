# MiDiarioMascota — Guía de Setup y Deploy

## Requisitos previos

- Node.js 20+
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Supabase CLI (`npm install -g supabase`)
- Cuenta en [supabase.com](https://supabase.com)
- Cuenta en [expo.dev](https://expo.dev)

---

## 1. Clonar e instalar dependencias

```bash
git clone <repo-url> mi-diario-mascota
cd mi-diario-mascota
npm install
```

---

## 2. Variables de entorno

Copiá el archivo de ejemplo:

```bash
cp .env.example .env.local
```

Completá con tus claves reales:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

Las claves se encuentran en: **Supabase Dashboard → Settings → API**.

---

## 3. Supabase — Base de datos y Storage

### 3a. Vincular el proyecto

```bash
supabase login
supabase link --project-ref qzytzdemayrhniohciex
```

### 3b. Aplicar migraciones

```bash
supabase db push
```

Esto ejecuta las 3 migraciones en orden:
- `001_initial_schema.sql` — tablas, RLS, vistas
- `002_storage_setup.sql` — bucket `diary-audios` + políticas
- `003_shop_seed.sql` — ítems de la tienda + políticas de gemas

### 3c. Verificar tablas

En **Supabase → Table Editor** deberías ver:
`parents`, `children`, `pets`, `diary_entries`, `parent_summaries`,
`parent_alerts`, `gem_transactions`, `streaks`, `shop_items`, `child_inventory`

---

## 4. Supabase Edge Functions

### 4a. Variables de entorno en las funciones

```bash
supabase secrets set OPENAI_API_KEY=sk-...
```

> Las variables `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` se inyectan automáticamente — no las agregues como secretos.

### 4b. Deploy de funciones

```bash
supabase functions deploy transcribe-audio
supabase functions deploy analyze-sentiment
supabase functions deploy detect-alerts
supabase functions deploy generate-parent-summary
supabase functions deploy validate-purchase
```

O todas juntas:

```bash
supabase functions deploy
```

---

## 5. Correr la app en desarrollo

```bash
# iOS Simulator (requiere macOS + Xcode)
npm run ios

# Android Emulator (requiere Android Studio)
npm run android

# En dispositivo físico con Expo Go
npm start
```

---

## 6. Tests

```bash
npm test                # Corre una vez
npm run test:watch      # Modo watch
npm test -- --coverage  # Con cobertura
```

---

## 7. EAS Build (para distribución)

### 7a. Inicializar EAS en el proyecto

```bash
eas init
```

Esto genera un `projectId` — reemplazá el placeholder en `app.config.ts`:

```ts
eas: { projectId: 'TU-PROJECT-ID' }
```

### 7b. Builds

```bash
# Build de desarrollo (incluye dev client, hot reload)
npm run eas:build:dev

# Build de preview (APK para testers)
npm run eas:build:preview

# Build de producción
eas build --platform all --profile production
```

### 7c. Submit a tiendas

```bash
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

Requiere completar los campos `REEMPLAZAR` en `eas.json` (`submit` section).

---

## 8. Checklist pre-launch

### Privacidad (COPPA/GDPR-K)
- [ ] Privacy Policy publicada y URL en app.config.ts
- [ ] Terms of Service publicados
- [ ] Consentimiento parental activo (ya implementado — 5 checkboxes)
- [ ] Retención de audios configurada (7 días por defecto)
- [ ] Formulario "derecho al olvido" operativo (settings screen)

### App Stores
- [ ] Ícono 1024×1024 PNG (sin alfa) en `assets/images/`
- [ ] Screenshots de App Store (6.5" iPhone, 12.9" iPad)
- [ ] Metadata en español (descripción, keywords, categoría: Educación)
- [ ] Clasificación de edad: **4+** / Kids Category
- [ ] Declaración de privacidad en ambas tiendas
- [ ] `NSMicrophoneUsageDescription` en app.config.ts ✅

### Backend
- [ ] RLS verificado en todas las tablas ✅
- [ ] Bucket `diary-audios` privado ✅
- [ ] Edge Functions desplegadas ✅
- [ ] OPENAI_API_KEY configurada como secret ✅ (si se usa Whisper)
- [ ] Monitoreo de errores (opcional: Sentry DSN en .env)

### Rendimiento
- [ ] `staleTime` configurado en hooks de React Query ✅
- [ ] Imágenes optimizadas (usar `expo-image` en v2)
- [ ] Bundle size analizado (`expo export --dump-sourcemap`)

---

## 9. Arquitectura resumida

```
app/
  (auth)/          Login, signup, verificación COPPA, setup hijo
  (kid)/           Home, talk, goodnight, shop, wardrobe, mini-juegos
  (parent)/        PIN guard, dashboard, alertas, resumen semanal, settings
src/
  lib/             supabase.ts, audio.ts, encryption.ts
  stores/          auth.store, pet.store, recording.store (Zustand)
  features/        audio-recording, gems-economy, streaks, parental-controls,
                   mini-games, shop
  components/
    shared/        ScreenWrapper, AppTextInput, PrimaryButton, PinInput
    kid-ui/        PetDisplay, ProgressRing, GemRewardOverlay, ShopItemCard
    parent-ui/     StatBadge, EmotionBar, SentimentTimeline, AlertCard
supabase/
  migrations/      001 schema, 002 storage, 003 shop seed
  functions/       transcribe-audio, analyze-sentiment, detect-alerts,
                   generate-parent-summary, validate-purchase
```

---

## 10. Variables de entorno completas

| Variable | Dónde obtenerla | Requerida |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | ✅ |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | ✅ |
| `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | RevenueCat dashboard | Fase 6+ |
| `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | RevenueCat dashboard | Fase 6+ |
| `EXPO_PUBLIC_SENTRY_DSN` | Sentry dashboard | Opcional |
| `OPENAI_API_KEY` | platform.openai.com (Supabase secret) | Para Whisper |

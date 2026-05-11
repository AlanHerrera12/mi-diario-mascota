import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Mi Diario Mascota',
  slug: 'mi-diario-mascota',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'midiariomascota',
  userInterfaceStyle: 'light', // La app infantil no tiene dark mode — claridad visual
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#FFF5E6',
  },
  ios: {
    supportsTablet: false, // Solo phones en MVP — tablets en v2
    bundleIdentifier: 'com.midiariomascota.app',
    // Kids Category requiere declaración explícita
    usesAppleSignIn: false,
    infoPlist: {
      NSMicrophoneUsageDescription:
        'Necesitamos el micrófono para que puedas hablarle a tu mascota virtual.',
      NSPhotoLibraryUsageDescription: 'Para personalizar tu mascota con fotos.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#FFF5E6',
    },
    package: 'com.midiariomascota.app',
    permissions: ['android.permission.RECORD_AUDIO'],
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    ['expo-av', { microphonePermission: 'Necesitamos el micrófono para hablarle a tu mascota.' }],
    [
      'expo-notifications',
      {
        icon: './assets/images/icon.png',
        color: '#FF9800',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // Variables públicas inyectadas desde .env
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    revenueCatIosKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
    revenueCatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,
    posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
    eas: {
      projectId: 'REEMPLAZAR-CON-ID-EAS', // TODO: después de `eas init`
    },
  },
});

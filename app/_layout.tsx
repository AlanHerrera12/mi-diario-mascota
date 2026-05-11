import '../src/styles/global.css';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/stores/auth.store';
import { usePetStore } from '../src/stores/pet.store';
import type { Child, Pet, Parent } from '../src/types';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 30, retry: 2 },
  },
});

export default function RootLayout() {
  const [loaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const setParent = useAuthStore(s => s.setParent);
  const setActiveChild = useAuthStore(s => s.setActiveChild);
  const setPet = usePetStore(s => s.setPet);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync();

    // Escuchar cambios de sesión de Supabase Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setParent(null);
        setActiveChild(null);
        setPet(null);
        router.replace('/(auth)');
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        // Cargar datos del padre
        const { data: parent } = await supabase
          .from('parents')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!parent) {
          // Usuario de auth pero sin perfil de padre → va a completar verify
          router.replace('/(auth)/parent-verify');
          return;
        }

        setParent(parent as Parent);

        // Cargar hijo activo
        const childId = await SecureStore.getItemAsync('active_child_id');
        const query = supabase.from('children').select('*');
        if (childId) query.eq('id', childId);
        else query.eq('parent_id', session.user.id);
        const { data: children } = await query.limit(1);
        const child = children?.[0] ?? null;

        if (!child) {
          // Padre sin hijo → completar onboarding
          router.replace('/(auth)/child-setup');
          return;
        }

        setActiveChild(child as Child);

        // Cargar mascota
        const { data: pets } = await supabase
          .from('pets')
          .select('*')
          .eq('child_id', child.id)
          .limit(1);
        if (pets?.[0]) setPet(pets[0] as Pet);

        router.replace('/(kid)/home');
      }
    });

    return () => subscription.unsubscribe();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(kid)" />
          <Stack.Screen name="(parent)" />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

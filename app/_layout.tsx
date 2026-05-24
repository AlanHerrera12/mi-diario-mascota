import '../src/styles/global.css';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import type { Session } from '@supabase/supabase-js';
import { SecureStorage } from '../src/lib/secure-storage';
import { supabase } from '../src/lib/supabase';
import { mapParent, mapChild, mapPet } from '../src/lib/mappers';
import { useAuthStore } from '../src/stores/auth.store';
import { usePetStore } from '../src/stores/pet.store';

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
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const loadingData = useRef(false);

  const setParent = useAuthStore(s => s.setParent);
  const setActiveChild = useAuthStore(s => s.setActiveChild);
  const setPet = usePetStore(s => s.setPet);

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  // Effect 1: SYNC auth listener — only updates session state, never awaits inside.
  // Keeping this synchronous ensures Supabase's internal lock is released immediately.
  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, [loaded]);

  // Effect 2: Data loader — runs AFTER the auth lock is released, outside the callback.
  useEffect(() => {
    if (session === undefined) return; // still initializing

    if (!session) {
      setParent(null);
      setActiveChild(null);
      setPet(null);
      router.replace('/(auth)');
      return;
    }

    if (loadingData.current) return;
    loadingData.current = true;

    (async () => {
      try {
        const childId = await SecureStorage.getItem('active_child_id');
        const [{ data: parent }, { data: children }] = await Promise.all([
          supabase.from('parents').select('*').eq('id', session.user.id).single(),
          childId
            ? supabase.from('children').select('*').eq('id', childId).limit(1)
            : supabase.from('children').select('*').limit(1),
        ]);

        // Store PIN hash locally so validateParentPin works on any device/session
        if (parent?.parent_pin_hash) {
          await SecureStorage.setItem('parent_pin_hash', parent.parent_pin_hash as string);
        }

        if (!parent) {
          router.replace('/(auth)/parent-verify');
          return;
        }
        setParent(mapParent(parent as Record<string, unknown>));

        const child = children?.[0] ?? null;
        if (!child) {
          router.replace('/(auth)/child-setup');
          return;
        }
        setActiveChild(mapChild(child as Record<string, unknown>));

        const [{ data: pets }] = await Promise.all([
          supabase.from('pets').select('*').eq('child_id', child.id).limit(1),
          SecureStorage.setItem('active_child_id', child.id),
        ]);
        if (pets?.[0]) setPet(mapPet(pets[0] as Record<string, unknown>));

        router.replace('/(kid)/home');
      } finally {
        loadingData.current = false;
      }
    })();
  }, [session]);

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

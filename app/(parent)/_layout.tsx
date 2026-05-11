import { useEffect } from 'react';
import { Stack, useSegments, router } from 'expo-router';
import { useAuthStore } from '../../src/stores/auth.store';

// Protege todas las rutas de (parent) excepto /pin con el estado del store.
// Si el usuario navega directamente a /dashboard sin haber validado el PIN,
// lo redirige a /pin.
function usePinGuard() {
  const isUnlocked = useAuthStore(s => s.isParentDashboardUnlocked);
  const segments = useSegments();

  useEffect(() => {
    const inParent = segments[0] === '(parent)';
    const onPin = segments[1] === 'pin';
    if (inParent && !onPin && !isUnlocked) {
      router.replace('/(parent)/pin');
    }
  }, [isUnlocked, segments]);
}

export default function ParentLayout() {
  usePinGuard();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="pin" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="weekly-summary" />
      <Stack.Screen name="alerts" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="subscription" />
    </Stack>
  );
}

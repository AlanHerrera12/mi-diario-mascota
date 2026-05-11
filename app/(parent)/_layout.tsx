import { Stack } from 'expo-router';

// Zona del padre: protegida por PIN, UI más densa
export default function ParentLayout() {
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

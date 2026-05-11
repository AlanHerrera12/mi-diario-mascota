import { Stack } from 'expo-router';

// Zona del niño: UI grande, sin texto crítico, sin acceso a config
export default function KidLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="talk" />
      <Stack.Screen name="goodnight" />
      <Stack.Screen name="wardrobe" />
      <Stack.Screen name="shop" />
    </Stack>
  );
}

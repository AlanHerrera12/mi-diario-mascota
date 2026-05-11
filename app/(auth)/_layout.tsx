import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="parent-signup" />
      <Stack.Screen name="parent-verify" />
      <Stack.Screen name="child-setup" />
      <Stack.Screen name="login" />
    </Stack>
  );
}

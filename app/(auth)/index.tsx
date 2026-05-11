import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

// Pantalla de bienvenida — el niño ve la demo de la mascota,
// el adulto puede navegar al registro
export default function WelcomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-primary-50 px-6">
      {/* TODO (assets): Animación Lottie/Rive de mascota saludando */}
      {/* PLACEHOLDER: reemplazar con <PetPreviewAnimation /> */}
      <View className="w-48 h-48 rounded-full bg-primary-200 mb-8 items-center justify-center">
        <Text className="text-6xl">🐾</Text>
      </View>

      <Text className="text-3xl font-bold text-primary-800 mb-2 text-center">
        ¡Hola! Soy tu mascota
      </Text>
      <Text className="text-base text-primary-600 text-center mb-12">
        Cuéntame cómo te fue hoy
      </Text>

      <Pressable
        className="bg-primary-500 rounded-4xl px-8 py-4 mb-4 active:bg-primary-600"
        onPress={() => router.push('/(auth)/parent-signup')}
      >
        <Text className="text-white text-lg font-semibold">Soy un adulto — Crear cuenta</Text>
      </Pressable>

      <Pressable
        className="px-8 py-4"
        onPress={() => router.push('/(auth)/login')}
      >
        <Text className="text-primary-700 text-base">Ya tengo cuenta</Text>
      </Pressable>
    </View>
  );
}

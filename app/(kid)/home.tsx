import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

// TODO (Fase 3): Pantalla principal del niño con mascota animada
// La mascota muestra estado de ánimo según si habló ayer o no
export default function KidHomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-primary-50">
      {/* TODO (assets): Componente <PetDisplay /> con animación Rive/Lottie */}
      <View className="w-64 h-64 rounded-full bg-primary-100 mb-12 items-center justify-center">
        <Text className="text-8xl">🐶</Text>
      </View>

      {/* Botón gigante — accesible para niños de 5+ años */}
      <Pressable
        className="bg-primary-500 rounded-5xl px-12 py-6 shadow-lg active:scale-95"
        onPress={() => router.push('/(kid)/talk')}
      >
        <Text className="text-white text-2xl font-bold text-center">🎙️ Hablar</Text>
      </Pressable>
    </View>
  );
}

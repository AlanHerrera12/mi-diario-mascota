import { useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { PetDisplay } from '../../src/components/kid-ui/PetDisplay';
import { useAuthStore } from '../../src/stores/auth.store';
import { usePetStore } from '../../src/stores/pet.store';
import { useGems } from '../../src/features/gems-economy/useGems';
import { useStreak } from '../../src/features/streaks/useStreak';

function getPetMood(lastTalkDate: string | null) {
  if (!lastTalkDate) return 'missing_you' as const;
  const today = new Date().toISOString().split('T')[0];
  if (lastTalkDate === today) return 'happy' as const;
  const diff = (Date.now() - new Date(lastTalkDate).getTime()) / 86400000;
  return diff > 1 ? 'missing_you' as const : 'idle' as const;
}

export default function KidHomeScreen() {
  const activeChild = useAuthStore(s => s.activeChild);
  const pet = usePetStore(s => s.pet);
  const { gemBalance, loadBalance } = useGems();
  const { currentStreak, loadStreak } = useStreak();

  useEffect(() => {
    loadBalance();
    loadStreak();
  }, []);

  function handleTalk() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/(kid)/talk');
  }

  function handleParentAccess() {
    // Botón sutil en esquina — acceso al dashboard parental
    router.push('/(parent)/pin');
  }

  if (!pet || !activeChild) return null;

  const mood = getPetMood(null); // TODO: pasar last_talk_date desde streaks

  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      {/* Header: gemas + racha */}
      <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
        <View className="flex-row items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-sm">
          <Text className="text-xl">💎</Text>
          <Text className="text-base font-bold text-gray-700">{gemBalance}</Text>
        </View>

        <View className="flex-row items-center gap-2 bg-white rounded-2xl px-4 py-2 shadow-sm">
          <Text className="text-xl">🔥</Text>
          <Text className="text-base font-bold text-gray-700">
            {currentStreak} {currentStreak === 1 ? 'día' : 'días'}
          </Text>
        </View>
      </View>

      {/* Mascota */}
      <View className="flex-1 items-center justify-center">
        <PetDisplay pet={pet} mood={mood} size={200} />

        {/* Mensaje de bienvenida */}
        <Text className="text-xl font-bold text-gray-700 mt-6 text-center px-8">
          {mood === 'missing_you'
            ? `¡${activeChild.displayName}, te extrañé!`
            : mood === 'happy'
              ? `¡Hola de nuevo, ${activeChild.displayName}!`
              : `Hola, ${activeChild.displayName} 👋`}
        </Text>
        <Text className="text-gray-400 text-base text-center mt-1">
          {mood === 'missing_you'
            ? '¿Me contás cómo te fue hoy?'
            : mood === 'happy'
              ? '¡Qué bueno que volviste!'
              : '¿Cómo estás hoy?'}
        </Text>
      </View>

      {/* Botón principal — tamaño XL para niños */}
      <View className="px-8 pb-8 gap-4">
        <Pressable
          onPress={handleTalk}
          className="bg-primary-500 rounded-4xl py-6 items-center shadow-lg active:bg-primary-600 active:scale-95"
        >
          <Text className="text-4xl mb-1">🎙️</Text>
          <Text className="text-white text-2xl font-bold">
            Hablar con {pet.name}
          </Text>
        </Pressable>

        {/* Botones secundarios */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.push('/(kid)/wardrobe')}
            className="flex-1 bg-white rounded-3xl py-4 items-center shadow-sm active:bg-gray-50"
          >
            <Text className="text-2xl">👗</Text>
            <Text className="text-gray-600 text-sm font-semibold mt-1">Vestidor</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(kid)/shop')}
            className="flex-1 bg-white rounded-3xl py-4 items-center shadow-sm active:bg-gray-50"
          >
            <Text className="text-2xl">🛍️</Text>
            <Text className="text-gray-600 text-sm font-semibold mt-1">Tienda</Text>
          </Pressable>
        </View>
      </View>

      {/* Acceso parental — pequeño, discreto, en esquina */}
      <Pressable
        onPress={handleParentAccess}
        className="absolute top-14 right-4 w-8 h-8 items-center justify-center opacity-30"
      >
        <Text className="text-lg">🔐</Text>
      </Pressable>
    </SafeAreaView>
  );
}

import { useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { usePetStore } from '../../src/stores/pet.store';

// Las estrellas se animan de forma independiente
function Star({ emoji, delay, x, y }: { emoji: string; delay: number; x: string; y: string }) {
  const opacity = useSharedValue(0);
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: 800 }), withTiming(0.3, { duration: 800 })),
        -1,
        true,
      ),
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.Text style={[style, { position: 'absolute', left: x, top: y, fontSize: 20 }]}>
      {emoji}
    </Animated.Text>
  );
}

export default function GoodnightScreen() {
  const pet = usePetStore(s => s.pet);
  const petEmoji = pet?.species === 'dog' ? '🐶' : pet?.species === 'cat' ? '🐱' :
    pet?.species === 'rabbit' ? '🐰' : pet?.species === 'bear' ? '🐻' :
    pet?.species === 'elephant' ? '🐘' : pet?.species === 'giraffe' ? '🦒' :
    pet?.species === 'dragon' ? '🐲' : '🦄';

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-indigo-950">
      {/* Estrellas decorativas */}
      <View className="absolute inset-0">
        <Star emoji="⭐" delay={0}    x="10%" y="15%" />
        <Star emoji="✨" delay={400}  x="75%" y="10%" />
        <Star emoji="⭐" delay={800}  x="85%" y="35%" />
        <Star emoji="✨" delay={200}  x="20%" y="45%" />
        <Star emoji="⭐" delay={600}  x="60%" y="20%" />
        <Star emoji="✨" delay={1000} x="5%"  y="70%" />
        <Star emoji="⭐" delay={300}  x="90%" y="65%" />
        <Star emoji="🌟" delay={500}  x="45%" y="8%"  />
      </View>

      {/* Contenido central */}
      <Animated.View
        entering={FadeIn.delay(200).duration(800)}
        className="flex-1 items-center justify-center px-8"
      >
        {/* Luna */}
        <Text className="text-8xl mb-4">🌙</Text>

        {/* Mascota durmiendo */}
        <View
          className="w-40 h-40 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: (pet?.customization.baseColor ?? '#FF9800') + '33' }}
        >
          <Text className="text-7xl">{petEmoji}</Text>
          <Text className="text-3xl absolute bottom-2 right-2">😴</Text>
        </View>

        <Text className="text-3xl font-bold text-white text-center mb-2">
          Buenas noches{pet?.name ? `, ${pet.name}` : ''} 🌙
        </Text>
        <Text className="text-indigo-300 text-base text-center leading-6">
          Gracias por contarme tu día.{'\n'}¡Hasta mañana!
        </Text>
      </Animated.View>

      {/* Botones */}
      <View className="px-8 pb-10 gap-3">
        {/* Mini-juegos pre-sueño */}
        <Pressable
          onPress={() => router.push('/(kid)/mini-games')}
          className="bg-indigo-800 rounded-4xl py-5 items-center active:bg-indigo-700"
        >
          <Text className="text-2xl mb-1">🎮</Text>
          <Text className="text-white text-lg font-bold">Jugar antes de dormir</Text>
          <Text className="text-indigo-400 text-xs mt-0.5">Ganás 💎 por cada juego</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace('/(kid)/home')}
          className="border border-indigo-700 rounded-4xl py-4 items-center active:bg-indigo-900"
        >
          <Text className="text-indigo-400 text-base font-semibold">Volver al inicio</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

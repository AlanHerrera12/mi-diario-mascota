import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  FadeIn,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMiniGame } from '../../src/features/mini-games/useMiniGame';

const { width: SW, height: SH } = Dimensions.get('window');
const TARGET_STARS = 10;
const STAR_EMOJIS = ['⭐', '🌟', '✨', '💫'];

interface StarItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  caught: boolean;
}

function StarDot({ star, onCatch }: { star: StarItem; onCatch: (id: number) => void }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8 });
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  function handlePress() {
    scale.value = withSequence(
      withSpring(1.6, { damping: 5 }),
      withTiming(0, { duration: 200 }),
    );
    opacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => onCatch(star.id), 200);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    position: 'absolute',
    left: star.x,
    top: star.y,
  }));

  return (
    <Animated.View style={style}>
      <Pressable onPress={handlePress} className="w-12 h-12 items-center justify-center">
        <Text style={{ fontSize: 32 }}>{star.emoji}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function StarsGame() {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [stars, setStars] = useState<StarItem[]>([]);
  const [caught, setCaught] = useState(0);
  const [gemsEarned, setGemsEarned] = useState(0);
  const [nextId, setNextId] = useState(0);
  const caughtRef = useRef(0);
  const { completeGame } = useMiniGame('stars');

  const spawnStar = useCallback(() => {
    const margin = 60;
    const x = margin + Math.random() * (SW - margin * 2 - 48);
    const y = 120 + Math.random() * (SH * 0.5);
    const emoji = STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)];
    setNextId(id => {
      setStars(prev => [...prev, { id, x, y, emoji, caught: false }]);
      return id + 1;
    });
  }, []);

  function startGame() {
    setPhase('playing');
    spawnStar();
  }

  function handleCatch(id: number) {
    setStars(prev => prev.filter(s => s.id !== id));
    caughtRef.current += 1;
    const newCount = caughtRef.current;
    setCaught(newCount);
    if (newCount < TARGET_STARS) {
      setTimeout(spawnStar, 400);
      if (newCount % 3 === 0) setTimeout(spawnStar, 700);
    } else {
      handleComplete();
    }
  }

  async function handleComplete() {
    setPhase('done');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const earned = await completeGame();
    setGemsEarned(earned);
  }

  return (
    <SafeAreaView className="flex-1 bg-indigo-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <Pressable onPress={() => router.back()} className="p-2">
          <Text className="text-indigo-400 text-base">✕ Salir</Text>
        </Pressable>
        <View className="flex-row items-center gap-2">
          <Text className="text-indigo-300 font-bold text-lg">
            {caught}/{TARGET_STARS} ⭐
          </Text>
        </View>
        <View className="w-14" />
      </View>

      {/* Stars canvas */}
      <View className="flex-1 relative">
        {/* Decorativas fijas */}
        {['5%', '45%', '80%', '25%', '70%', '90%', '15%'].map((left, i) => (
          <Text
            key={i}
            style={{
              position: 'absolute',
              left,
              top: `${10 + i * 10}%`,
              fontSize: 10,
              opacity: 0.3,
            }}
          >
            ·
          </Text>
        ))}

        {phase === 'ready' && (
          <Animated.View entering={FadeIn} className="flex-1 items-center justify-center px-8">
            <Text className="text-7xl mb-6">🌌</Text>
            <Text className="text-white text-2xl font-bold text-center mb-2">
              ¡Atrapá las estrellas!
            </Text>
            <Text className="text-indigo-300 text-base text-center">
              Tocá cada estrella para atraparla. ¡Atrapá {TARGET_STARS} para ganar!
            </Text>
          </Animated.View>
        )}

        {phase === 'done' && (
          <Animated.View entering={FadeIn} className="flex-1 items-center justify-center px-8">
            <Text className="text-7xl mb-4">🌟</Text>
            <Text className="text-white text-3xl font-bold text-center mb-2">
              ¡{TARGET_STARS} estrellas!
            </Text>
            <Text className="text-indigo-300 text-base text-center">
              Atrapaste todas las estrellas del cielo.
            </Text>
            {gemsEarned > 0 && (
              <View className="bg-indigo-900 rounded-2xl px-6 py-3 mt-6">
                <Text className="text-white font-bold text-xl text-center">+{gemsEarned} 💎</Text>
              </View>
            )}
          </Animated.View>
        )}

        {phase === 'playing' && stars.map(star => (
          <StarDot key={star.id} star={star} onCatch={handleCatch} />
        ))}
      </View>

      {/* Acción */}
      <View className="px-8 pb-10">
        {phase === 'ready' && (
          <Pressable
            onPress={startGame}
            className="bg-indigo-500 rounded-4xl py-5 items-center active:bg-indigo-600"
          >
            <Text className="text-white text-xl font-bold">¡Empezar! ⭐</Text>
          </Pressable>
        )}
        {phase === 'done' && (
          <Pressable
            onPress={() => router.back()}
            className="bg-indigo-500 rounded-4xl py-5 items-center active:bg-indigo-600"
          >
            <Text className="text-white text-xl font-bold">¡Listo! 🌙</Text>
          </Pressable>
        )}
        {phase === 'playing' && (
          <View className="bg-indigo-900/50 rounded-2xl py-3 items-center">
            <Text className="text-indigo-400 text-sm">Tocá las estrellas para atraparlas</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

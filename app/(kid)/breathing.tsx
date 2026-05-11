import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMiniGame } from '../../src/features/mini-games/useMiniGame';

const TOTAL_CYCLES = 4;
const INHALE_MS = 4000;
const HOLD_MS = 1500;
const EXHALE_MS = 4000;

type Phase = 'ready' | 'inhale' | 'hold' | 'exhale' | 'done';

export default function BreathingGame() {
  const [phase, setPhase] = useState<Phase>('ready');
  const [cycle, setCycle] = useState(0);
  const [gemsEarned, setGemsEarned] = useState(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);
  const { completeGame, alreadyPlayed } = useMiniGame('breathing');

  function startCycle(currentCycle: number) {
    if (currentCycle >= TOTAL_CYCLES) {
      runOnJS(handleComplete)();
      return;
    }

    runOnJS(setPhase)('inhale');
    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);

    scale.value = withSequence(
      // Inhale
      withTiming(1.8, { duration: INHALE_MS, easing: Easing.inOut(Easing.ease) }),
      // Hold
      withDelay(HOLD_MS, withTiming(1.8, { duration: 50 })),
      // Exhale
      withTiming(1, { duration: EXHALE_MS, easing: Easing.inOut(Easing.ease) }),
    );

    opacity.value = withSequence(
      withTiming(0.85, { duration: INHALE_MS }),
      withDelay(HOLD_MS, withTiming(0.85, { duration: 50 })),
      withTiming(0.4, { duration: EXHALE_MS }),
    );

    // Phase labels timing
    setTimeout(() => runOnJS(setPhase)('hold'), INHALE_MS);
    setTimeout(() => runOnJS(setPhase)('exhale'), INHALE_MS + HOLD_MS);
    setTimeout(() => {
      runOnJS(setCycle)(currentCycle + 1);
      runOnJS(startCycle)(currentCycle + 1);
    }, INHALE_MS + HOLD_MS + EXHALE_MS);
  }

  async function handleComplete() {
    setPhase('done');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const earned = await completeGame();
    setGemsEarned(earned);
  }

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const phaseLabel = phase === 'inhale' ? 'Inhala...'
    : phase === 'hold' ? 'Aguantá...'
    : phase === 'exhale' ? 'Exhala...'
    : phase === 'done' ? '¡Perfecto!'
    : '';

  return (
    <SafeAreaView className="flex-1 bg-indigo-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <Pressable onPress={() => router.back()} className="p-2">
          <Text className="text-indigo-400 text-base">✕ Salir</Text>
        </Pressable>
        <View className="flex-row items-center gap-1 bg-indigo-900 rounded-xl px-3 py-1">
          <Text>🌬️</Text>
          <Text className="text-indigo-300 text-sm font-semibold">Respiración</Text>
        </View>
        <View className="w-14" />
      </View>

      {/* Círculos de respiración */}
      <View className="flex-1 items-center justify-center">
        {/* Anillo exterior fijo */}
        <View
          className="absolute w-56 h-56 rounded-full border border-indigo-700"
          style={{ borderWidth: 1 }}
        />
        {/* Círculo animado */}
        <Animated.View
          className="w-40 h-40 rounded-full items-center justify-center"
          style={[{ backgroundColor: '#6366f1' }, circleStyle]}
        >
          <Text className="text-5xl">{phase === 'done' ? '🌟' : '🌬️'}</Text>
        </Animated.View>

        {/* Label de fase */}
        <Text className="text-white text-3xl font-bold mt-12 text-center">{phaseLabel}</Text>

        {/* Contador de ciclos */}
        {phase !== 'ready' && phase !== 'done' && (
          <Text className="text-indigo-400 text-sm mt-3">
            Ciclo {Math.min(cycle + 1, TOTAL_CYCLES)} de {TOTAL_CYCLES}
          </Text>
        )}

        {/* Progreso de ciclos */}
        <View className="flex-row gap-2 mt-6">
          {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
            <View
              key={i}
              className={`w-3 h-3 rounded-full ${i < cycle ? 'bg-indigo-400' : 'bg-indigo-800'}`}
            />
          ))}
        </View>
      </View>

      {/* Acciones */}
      <View className="px-8 pb-10 gap-4">
        {phase === 'done' ? (
          <>
            {gemsEarned > 0 && (
              <View className="bg-indigo-900 rounded-2xl p-4 items-center mb-2">
                <Text className="text-white font-bold text-lg">+{gemsEarned} 💎</Text>
                <Text className="text-indigo-300 text-sm">¡Gemas ganadas!</Text>
              </View>
            )}
            <Pressable
              onPress={() => router.back()}
              className="bg-indigo-500 rounded-4xl py-5 items-center active:bg-indigo-600"
            >
              <Text className="text-white text-xl font-bold">¡Listo! 🌙</Text>
            </Pressable>
          </>
        ) : phase === 'ready' ? (
          <Pressable
            onPress={() => startCycle(0)}
            className="bg-indigo-500 rounded-4xl py-5 items-center active:bg-indigo-600"
          >
            <Text className="text-white text-xl font-bold">Empezar 🌬️</Text>
          </Pressable>
        ) : (
          <View className="bg-indigo-900/50 rounded-2xl py-4 items-center">
            <Text className="text-indigo-400 text-sm">
              {alreadyPlayed ? 'Ya jugaste hoy — ¡seguís ganando!' : `Completá ${TOTAL_CYCLES} ciclos para ganar 💎`}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

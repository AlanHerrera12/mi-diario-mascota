import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  runOnJS,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StarField } from '../../src/components/shared/StarField';
import { useMiniGame } from '../../src/features/mini-games/useMiniGame';
import { playInhaleSound, playExhaleSound, playAchievementSound } from '../../src/utils/sounds';

const TOTAL_CYCLES = 4;
const INHALE_MS = 4000;
const HOLD_MS   = 1500;
const EXHALE_MS = 4000;

type Phase = 'ready' | 'inhale' | 'hold' | 'exhale' | 'done';

// One orbit particle — position driven by scaleValue
function OrbitParticle({ index, scaleValue, baseRadius }: {
  index: number; scaleValue: Animated.SharedValue<number>; baseRadius: number;
}) {
  const angle = (index / 8) * 2 * Math.PI;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const style = useAnimatedStyle(() => {
    const r = baseRadius * scaleValue.value * 0.95;
    const opacity = interpolate(scaleValue.value, [1, 1.35, 1.8], [0, 0.6, 0.9], 'clamp');
    return {
      position: 'absolute',
      width: 10, height: 10, borderRadius: 5,
      backgroundColor: '#A78BFA',
      opacity,
      transform: [
        { translateX: cos * r },
        { translateY: sin * r },
      ],
    };
  });

  return <Animated.View style={style} />;
}

export default function BreathingGame() {
  const [phase, setPhase] = useState<Phase>('ready');
  const [cycle, setCycle] = useState(0);
  const [gemsEarned, setGemsEarned] = useState(0);
  const [containerSize, setContainerSize] = useState({ w: 300, h: 400 });

  const scale        = useSharedValue(1);
  const glowOpacity  = useSharedValue(0.15);
  const colorProgress = useSharedValue(0);  // 0=inhale-blue, 0.5=hold-purple, 1=exhale-indigo

  const { completeGame, alreadyPlayed } = useMiniGame('breathing');

  const baseRadius = Math.min(containerSize.w, containerSize.h) * 0.35;
  const circleSize = baseRadius * 2;

  function onContainerLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ w: width, h: height });
  }

  function startCycle(currentCycle: number) {
    if (currentCycle >= TOTAL_CYCLES) {
      runOnJS(handleComplete)();
      return;
    }

    // — Inhale
    runOnJS(setPhase)('inhale');
    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    runOnJS(playInhaleSound)();

    scale.value = withSequence(
      withTiming(1.8, { duration: INHALE_MS, easing: Easing.inOut(Easing.ease) }),
      withDelay(HOLD_MS, withTiming(1.8, { duration: 50 })),
      withTiming(1, { duration: EXHALE_MS, easing: Easing.inOut(Easing.ease) }),
    );

    glowOpacity.value = withSequence(
      withTiming(0.55, { duration: INHALE_MS }),
      withDelay(HOLD_MS, withTiming(0.55, { duration: 50 })),
      withTiming(0.15, { duration: EXHALE_MS }),
    );

    colorProgress.value = withTiming(0, { duration: 300 });

    // Phase labels
    setTimeout(() => {
      runOnJS(setPhase)('hold');
      colorProgress.value = withTiming(0.5, { duration: 300 });
    }, INHALE_MS);
    setTimeout(() => {
      runOnJS(setPhase)('exhale');
      runOnJS(playExhaleSound)();
      colorProgress.value = withTiming(1, { duration: 300 });
    }, INHALE_MS + HOLD_MS);
    setTimeout(() => {
      runOnJS(setCycle)(currentCycle + 1);
      runOnJS(startCycle)(currentCycle + 1);
    }, INHALE_MS + HOLD_MS + EXHALE_MS);
  }

  async function handleComplete() {
    setPhase('done');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    playAchievementSound();
    const earned = await completeGame();
    setGemsEarned(earned);
  }

  // Main circle — scale + color
  const circleStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      colorProgress.value,
      [0, 0.5, 1],
      ['#3B82F6', '#7C3AED', '#6366F1'],
    );
    return {
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      backgroundColor: bg,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ scale: scale.value }],
    };
  });

  // Glow ring behind circle — scale * 1.25
  const glowStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      colorProgress.value,
      [0, 0.5, 1],
      ['#3B82F6', '#7C3AED', '#6366F1'],
    );
    return {
      position: 'absolute',
      width: circleSize * 1.25,
      height: circleSize * 1.25,
      borderRadius: (circleSize * 1.25) / 2,
      backgroundColor: bg,
      opacity: glowOpacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const phaseLabel =
    phase === 'inhale'  ? 'Inhala...' :
    phase === 'hold'    ? 'Aguantá...' :
    phase === 'exhale'  ? 'Exhala...' :
    phase === 'done'    ? '¡Perfecto!' : '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0520' }}>
      <StarField count={14} />

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10, zIndex: 1,
      }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            backgroundColor: pressed ? 'rgba(129,140,248,0.25)' : 'rgba(129,140,248,0.12)',
            borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8,
            borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
          })}
        >
          <Text style={{ color: '#A5B4FC', fontWeight: '700' }}>✕ Salir</Text>
        </Pressable>

        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 6,
          backgroundColor: 'rgba(129,140,248,0.12)',
          borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8,
          borderWidth: 1, borderColor: 'rgba(129,140,248,0.2)',
        }}>
          <Text>🌬️</Text>
          <Text style={{ color: '#A5B4FC', fontSize: 14, fontWeight: '700' }}>Respiración</Text>
        </View>

        <View style={{ width: 80 }} />
      </View>

      {/* Circle area */}
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        onLayout={onContainerLayout}
      >
        {/* Glow ring (behind) */}
        <Animated.View style={glowStyle} />

        {/* Main circle */}
        <Animated.View style={circleStyle}>
          {/* 8 orbit particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <OrbitParticle key={i} index={i} scaleValue={scale} baseRadius={baseRadius} />
          ))}
          <Text style={{ fontSize: circleSize * 0.28 }}>
            {phase === 'done' ? '🌟' : '🌬️'}
          </Text>
        </Animated.View>

        {/* Phase label */}
        <Text style={{
          color: 'white', fontSize: 28, fontWeight: '800',
          marginTop: circleSize * 0.6 + 32, textAlign: 'center',
          position: 'absolute',
          bottom: circleSize * 0.1,
        }}>
          {phaseLabel}
        </Text>
      </View>

      {/* Cycle dots + counter */}
      <View style={{ alignItems: 'center', paddingBottom: 8 }}>
        {phase !== 'ready' && phase !== 'done' && (
          <Text style={{ color: '#818CF8', fontSize: 13, marginBottom: 8 }}>
            Ciclo {Math.min(cycle + 1, TOTAL_CYCLES)} de {TOTAL_CYCLES}
          </Text>
        )}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
            <View key={i} style={{
              width: 10, height: 10, borderRadius: 5,
              backgroundColor: i < cycle ? '#818CF8' : 'rgba(129,140,248,0.25)',
            }} />
          ))}
        </View>
      </View>

      {/* Bottom actions */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 36, paddingTop: 8 }}>
        {phase === 'done' ? (
          <>
            {gemsEarned > 0 && (
              <View style={{
                backgroundColor: 'rgba(129,140,248,0.12)', borderRadius: 20,
                padding: 16, alignItems: 'center', marginBottom: 12,
                borderWidth: 1, borderColor: 'rgba(129,140,248,0.2)',
              }}>
                <Text style={{ color: '#A5B4FC', fontWeight: '800', fontSize: 18 }}>+{gemsEarned} ⭐</Text>
                <Text style={{ color: '#818CF8', fontSize: 13, marginTop: 4 }}>¡Gemas ganadas!</Text>
              </View>
            )}
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#4338CA' : '#6366F1',
                borderRadius: 28, paddingVertical: 20, alignItems: 'center',
                shadowColor: '#6366F1', shadowOpacity: 0.5, shadowRadius: 12, elevation: 6,
              })}
            >
              <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>¡Listo! 🌙</Text>
            </Pressable>
          </>
        ) : phase === 'ready' ? (
          <Pressable
            onPress={() => startCycle(0)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#4338CA' : '#6366F1',
              borderRadius: 28, paddingVertical: 20, alignItems: 'center',
              shadowColor: '#6366F1', shadowOpacity: 0.5, shadowRadius: 12, elevation: 6,
            })}
          >
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>Empezar 🌬️</Text>
          </Pressable>
        ) : (
          <View style={{
            backgroundColor: 'rgba(129,140,248,0.1)', borderRadius: 16,
            paddingVertical: 14, alignItems: 'center',
            borderWidth: 1, borderColor: 'rgba(129,140,248,0.2)',
          }}>
            <Text style={{ color: '#818CF8', fontSize: 14 }}>
              {alreadyPlayed ? 'Ya jugaste hoy — ¡seguís ganando!' : `Completá ${TOTAL_CYCLES} ciclos para ganar ⭐`}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

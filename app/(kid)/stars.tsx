import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring, withSequence,
  withRepeat, withDelay, FadeIn, FadeInDown, Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMiniGame } from '../../src/features/mini-games/useMiniGame';

const TARGET_STARS = 12;
const INITIAL_STARS = 5;
const MAX_ON_SCREEN = 5;
const STAR_EMOJIS = ['⭐', '🌟', '✨', '💫', '🌠'];
const STAR_SIZE = 60;

interface StarItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

// Background twinkle
function BgStar({ x, y, delay }: { x: string; y: string; delay: number }) {
  const opacity = useSharedValue(0.15);
  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.15, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
      ), -1, true,
    ));
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.Text style={[style, { position: 'absolute', left: x, top: y, fontSize: 11, color: '#A78BFA' }]}>✦</Animated.Text>
  );
}

// Catchable star
function StarDot({ star, onCatch }: { star: StarItem; onCatch: (id: number) => void }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  function handlePress() {
    scale.value = withSequence(withSpring(2, { damping: 4 }), withTiming(0, { duration: 180 }));
    opacity.value = withTiming(0, { duration: 180 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => onCatch(star.id), 180);
  }

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: star.x,
    top: star.y,
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(10).stiffness(100)}
      style={style}
    >
      <Pressable
        onPress={handlePress}
        style={{ width: STAR_SIZE, height: STAR_SIZE, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ fontSize: 38 }}>{star.emoji}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function StarsGame() {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [stars, setStars] = useState<StarItem[]>([]);
  const [caught, setCaught] = useState(0);
  const [gemsEarned, setGemsEarned] = useState(0);
  const [areaSize, setAreaSize] = useState({ width: 300, height: 400 });
  const nextId = useRef(0);
  const caughtRef = useRef(0);
  const { completeGame } = useMiniGame('stars');

  function onAreaLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setAreaSize({ width, height });
  }

  function makeStar(w: number, h: number): StarItem {
    const margin = 20;
    const x = margin + Math.random() * (w - margin * 2 - STAR_SIZE);
    const y = margin + Math.random() * (h - margin * 2 - STAR_SIZE);
    return { id: nextId.current++, x, y, emoji: STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)] };
  }

  function startGame() {
    caughtRef.current = 0;
    nextId.current = 0;
    setCaught(0);
    const initial = Array.from({ length: INITIAL_STARS }, () => makeStar(areaSize.width, areaSize.height));
    setStars(initial);
    setPhase('playing');
  }

  function handleCatch(id: number) {
    setStars(prev => prev.filter(s => s.id !== id));
    caughtRef.current += 1;
    const newCount = caughtRef.current;
    setCaught(newCount);

    if (newCount >= TARGET_STARS) {
      handleComplete();
      return;
    }

    // Replenish to MAX_ON_SCREEN after a short delay
    setTimeout(() => {
      setStars(prev => {
        const need = MAX_ON_SCREEN - prev.length;
        if (need <= 0) return prev;
        const fresh = Array.from({ length: need }, () => makeStar(areaSize.width, areaSize.height));
        return [...prev, ...fresh];
      });
    }, 300);
  }

  async function handleComplete() {
    setPhase('done');
    setStars([]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const earned = await completeGame();
    setGemsEarned(earned);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0520' }}>

      {/* Decorative bg stars */}
      <View style={{ position: 'absolute', inset: 0 }} pointerEvents="none">
        {[
          { x: '5%', y: '6%', delay: 0 }, { x: '78%', y: '4%', delay: 300 },
          { x: '42%', y: '13%', delay: 600 }, { x: '90%', y: '22%', delay: 150 },
          { x: '18%', y: '35%', delay: 900 }, { x: '62%', y: '48%', delay: 450 },
          { x: '7%', y: '62%', delay: 750 }, { x: '85%', y: '68%', delay: 550 },
          { x: '33%', y: '78%', delay: 200 }, { x: '66%', y: '86%', delay: 700 },
        ].map((s, i) => <BgStar key={i} {...s} />)}
      </View>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 }}>
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
          backgroundColor: 'rgba(252,211,77,0.15)', borderRadius: 16,
          paddingHorizontal: 16, paddingVertical: 8,
          borderWidth: 1, borderColor: 'rgba(252,211,77,0.3)',
        }}>
          <Text style={{ color: '#FCD34D', fontWeight: '800', fontSize: 17 }}>
            {caught}/{TARGET_STARS} ⭐
          </Text>
        </View>

        <View style={{ width: 80 }} />
      </View>

      {/* Progress bar */}
      {phase === 'playing' && (
        <View style={{ marginHorizontal: 20, marginBottom: 6 }}>
          <View style={{ height: 5, backgroundColor: 'rgba(129,140,248,0.2)', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ height: 5, borderRadius: 3, backgroundColor: '#FCD34D', width: `${(caught / TARGET_STARS) * 100}%` }} />
          </View>
        </View>
      )}

      {/* Play area — measured via onLayout so stars spawn inside it */}
      <View style={{ flex: 1 }} onLayout={onAreaLayout}>

        {/* Ready */}
        {phase === 'ready' && (
          <Animated.View entering={FadeIn} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
            <Text style={{ fontSize: 70, marginBottom: 16 }}>🌌</Text>
            <Text style={{ color: 'white', fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 }}>
              ¡Atrapá las estrellas!
            </Text>
            <Text style={{ color: '#818CF8', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
              Tocá cada estrella antes de que escapen.{'\n'}¡Atrapá {TARGET_STARS} para ganar!
            </Text>
          </Animated.View>
        )}

        {/* Done */}
        {phase === 'done' && (
          <Animated.View entering={FadeIn} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
            <Text style={{ fontSize: 70, marginBottom: 12 }}>🌟</Text>
            <Text style={{ color: 'white', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 6 }}>
              ¡{TARGET_STARS} estrellas!
            </Text>
            <Text style={{ color: '#818CF8', fontSize: 15, textAlign: 'center' }}>
              ¡Atrapaste todas las estrellas del cielo!
            </Text>
            {gemsEarned > 0 && (
              <View style={{
                backgroundColor: 'rgba(252,211,77,0.15)', borderRadius: 20,
                paddingHorizontal: 28, paddingVertical: 16, marginTop: 20,
                borderWidth: 1, borderColor: 'rgba(252,211,77,0.35)',
              }}>
                <Text style={{ color: '#FCD34D', fontWeight: '800', fontSize: 24, textAlign: 'center' }}>+{gemsEarned} ⭐</Text>
                <Text style={{ color: '#818CF8', fontSize: 12, textAlign: 'center', marginTop: 4 }}>¡Gemas ganadas!</Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Stars — positioned relative to this container */}
        {phase === 'playing' && stars.map(star => (
          <StarDot key={star.id} star={star} onCatch={handleCatch} />
        ))}
      </View>

      {/* Bottom */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 36 }}>
        {phase === 'ready' && (
          <Pressable
            onPress={startGame}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#4338CA' : '#6366F1',
              borderRadius: 28, paddingVertical: 20, alignItems: 'center',
              shadowColor: '#6366F1', shadowOpacity: 0.5, shadowRadius: 12, elevation: 6,
            })}
          >
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>¡Empezar! ⭐</Text>
          </Pressable>
        )}
        {phase === 'done' && (
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
        )}
        {phase === 'playing' && (
          <View style={{
            backgroundColor: 'rgba(129,140,248,0.1)', borderRadius: 16,
            paddingVertical: 12, alignItems: 'center',
            borderWidth: 1, borderColor: 'rgba(129,140,248,0.2)',
          }}>
            <Text style={{ color: '#818CF8', fontSize: 14 }}>Tocá las estrellas para atraparlas ✨</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

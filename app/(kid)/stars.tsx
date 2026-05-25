import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  withDelay,
  FadeIn,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMiniGame } from '../../src/features/mini-games/useMiniGame';

const { width: SW, height: SH } = Dimensions.get('window');
const TARGET_STARS = 12;
const INITIAL_STARS = 5; // start with 5 stars visible
const MAX_STARS_ON_SCREEN = 5;
const STAR_EMOJIS = ['⭐', '🌟', '✨', '💫', '🌠'];

interface StarItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  caught: boolean;
}

// Background twinkle
function BgStar({ x, y, delay }: { x: string; y: string; delay: number }) {
  const opacity = useSharedValue(0.2);
  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.7, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.2, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      ), -1, true,
    ));
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.Text style={[style, { position: 'absolute', left: x, top: y, fontSize: 10, color: '#A78BFA' }]}>
      ✦
    </Animated.Text>
  );
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
      withSpring(1.8, { damping: 5 }),
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
      <Pressable
        onPress={handlePress}
        style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ fontSize: 36 }}>{star.emoji}</Text>
      </Pressable>
    </Animated.View>
  );
}

function generateStar(id: number): StarItem {
  const margin = 56;
  const x = margin + Math.random() * (SW - margin * 2 - 56);
  const y = 80 + Math.random() * (SH * 0.52);
  const emoji = STAR_EMOJIS[Math.floor(Math.random() * STAR_EMOJIS.length)];
  return { id, x, y, emoji, caught: false };
}

export default function StarsGame() {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [stars, setStars] = useState<StarItem[]>([]);
  const [caught, setCaught] = useState(0);
  const [gemsEarned, setGemsEarned] = useState(0);
  const nextId = useRef(0);
  const caughtRef = useRef(0);
  const activeRef = useRef(0); // how many stars are currently on screen
  const { completeGame } = useMiniGame('stars');

  function spawnStar() {
    const id = nextId.current++;
    const star = generateStar(id);
    setStars(prev => {
      activeRef.current = prev.length + 1;
      return [...prev, star];
    });
  }

  function spawnBatch(count: number) {
    const newStars: StarItem[] = [];
    for (let i = 0; i < count; i++) {
      newStars.push(generateStar(nextId.current++));
    }
    setStars(prev => {
      activeRef.current = prev.length + newStars.length;
      return [...prev, ...newStars];
    });
  }

  function startGame() {
    caughtRef.current = 0;
    nextId.current = 0;
    activeRef.current = INITIAL_STARS;
    setCaught(0);
    setPhase('playing');
    // spawn initial batch
    const initial: StarItem[] = [];
    for (let i = 0; i < INITIAL_STARS; i++) {
      initial.push(generateStar(nextId.current++));
    }
    setStars(initial);
  }

  function handleCatch(id: number) {
    setStars(prev => {
      const next = prev.filter(s => s.id !== id);
      activeRef.current = next.length;
      return next;
    });

    caughtRef.current += 1;
    const newCount = caughtRef.current;
    setCaught(newCount);

    if (newCount >= TARGET_STARS) {
      handleComplete();
      return;
    }

    // Keep 3-5 stars on screen at all times
    setTimeout(() => {
      setStars(prev => {
        const onScreen = prev.length;
        const toSpawn = Math.max(0, MAX_STARS_ON_SCREEN - onScreen);
        if (toSpawn <= 0) return prev;
        const newStars = Array.from({ length: toSpawn }, () => generateStar(nextId.current++));
        activeRef.current = prev.length + newStars.length;
        return [...prev, ...newStars];
      });
    }, 350);
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

      {/* Background star field */}
      <View style={{ position: 'absolute', inset: 0 }} pointerEvents="none">
        {[
          { x: '5%',  y: '8%',  delay: 0   },
          { x: '76%', y: '5%',  delay: 300 },
          { x: '43%', y: '15%', delay: 600 },
          { x: '91%', y: '25%', delay: 150 },
          { x: '20%', y: '38%', delay: 900 },
          { x: '60%', y: '50%', delay: 450 },
          { x: '8%',  y: '65%', delay: 750 },
          { x: '84%', y: '70%', delay: 550 },
          { x: '35%', y: '80%', delay: 200 },
          { x: '68%', y: '88%', delay: 700 },
        ].map((s, i) => <BgStar key={i} {...s} />)}
      </View>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
      }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            backgroundColor: pressed ? 'rgba(129,140,248,0.25)' : 'rgba(129,140,248,0.12)',
            borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8,
            borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
          })}
        >
          <Text style={{ color: '#A5B4FC', fontWeight: '700', fontSize: 14 }}>✕ Salir</Text>
        </Pressable>

        {/* Progress */}
        <View style={{
          backgroundColor: 'rgba(252,211,77,0.15)',
          borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8,
          borderWidth: 1, borderColor: 'rgba(252,211,77,0.3)',
        }}>
          <Text style={{ color: '#FCD34D', fontWeight: '800', fontSize: 16 }}>
            {caught}/{TARGET_STARS} ⭐
          </Text>
        </View>

        <View style={{ width: 80 }} />
      </View>

      {/* Progress bar */}
      {phase === 'playing' && (
        <View style={{ marginHorizontal: 20, marginBottom: 8 }}>
          <View style={{ height: 4, backgroundColor: 'rgba(129,140,248,0.2)', borderRadius: 2, overflow: 'hidden' }}>
            <View style={{
              height: 4, borderRadius: 2,
              backgroundColor: '#FCD34D',
              width: `${(caught / TARGET_STARS) * 100}%`,
            }} />
          </View>
        </View>
      )}

      {/* Game canvas */}
      <View style={{ flex: 1, position: 'relative' }}>

        {/* Ready screen */}
        {phase === 'ready' && (
          <Animated.View entering={FadeIn} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
            <Text style={{ fontSize: 72, marginBottom: 16 }}>🌌</Text>
            <Text style={{ color: 'white', fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 }}>
              ¡Atrapá las estrellas!
            </Text>
            <Text style={{ color: '#818CF8', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
              Tocá cada estrella para atraparla.{'\n'}¡Atrapá {TARGET_STARS} para ganar y ganar ⭐!
            </Text>
          </Animated.View>
        )}

        {/* Done screen */}
        {phase === 'done' && (
          <Animated.View entering={FadeIn} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
            <Text style={{ fontSize: 72, marginBottom: 12 }}>🌟</Text>
            <Text style={{ color: 'white', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 6 }}>
              ¡{TARGET_STARS} estrellas!
            </Text>
            <Text style={{ color: '#818CF8', fontSize: 15, textAlign: 'center' }}>
              Atrapaste todas las estrellas del cielo.
            </Text>
            {gemsEarned > 0 && (
              <View style={{
                backgroundColor: 'rgba(252,211,77,0.15)',
                borderRadius: 20, paddingHorizontal: 24, paddingVertical: 14, marginTop: 20,
                borderWidth: 1, borderColor: 'rgba(252,211,77,0.35)',
              }}>
                <Text style={{ color: '#FCD34D', fontWeight: '800', fontSize: 22, textAlign: 'center' }}>
                  +{gemsEarned} ⭐
                </Text>
                <Text style={{ color: '#818CF8', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
                  ¡Gemas ganadas!
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Stars */}
        {phase === 'playing' && stars.map(star => (
          <StarDot key={star.id} star={star} onCatch={handleCatch} />
        ))}
      </View>

      {/* Bottom action */}
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
            backgroundColor: 'rgba(129,140,248,0.1)',
            borderRadius: 16, paddingVertical: 12, alignItems: 'center',
            borderWidth: 1, borderColor: 'rgba(129,140,248,0.2)',
          }}>
            <Text style={{ color: '#818CF8', fontSize: 14 }}>
              Tocá las estrellas para atraparlas ✨
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

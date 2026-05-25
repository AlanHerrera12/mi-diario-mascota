import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring, withSequence,
  withRepeat, withDelay, FadeIn, FadeInDown,
  interpolate, Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMiniGame } from '../../src/features/mini-games/useMiniGame';

const { width: SW } = Dimensions.get('window');

// 4 columns, 3 rows = 12 cards (6 pairs)
const COLS = 4;
const CARD_GAP = 10;
const CARD_W = (SW - 32 - CARD_GAP * (COLS - 1)) / COLS;
const CARD_H = CARD_W * 1.15;

const PAIRS = ['😊', '😴', '🌙', '⭐', '🐶', '🎉'];

// Rarity glow by card state
const CARD_COLORS = {
  hidden:   { bg: '#1E1B4B', border: 'rgba(129,140,248,0.3)', glow: '#6366F1' },
  flipped:  { bg: '#312E81', border: 'rgba(167,139,250,0.6)', glow: '#A78BFA' },
  matched:  { bg: '#064E3B', border: 'rgba(52,211,153,0.6)',  glow: '#34D399' },
};

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildDeck(): Card[] {
  return shuffle([...PAIRS, ...PAIRS]).map((emoji, i) => ({
    id: i, emoji, flipped: false, matched: false,
  }));
}

// Background twinkle star
function BgStar({ x, y, delay }: { x: string; y: string; delay: number }) {
  const opacity = useSharedValue(0.15);
  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.75, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.15, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
      ), -1, true,
    ));
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.Text style={[style, { position: 'absolute', left: x, top: y, fontSize: 11, color: '#818CF8' }]}>✦</Animated.Text>
  );
}

// Match burst effect
function MatchBurst({ visible }: { visible: boolean }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  useEffect(() => {
    if (visible) {
      scale.value = withSequence(withSpring(1.5, { damping: 5 }), withTiming(0, { duration: 300 }));
      opacity.value = withSequence(withTiming(1, { duration: 100 }), withTiming(0, { duration: 300 }));
    }
  }, [visible]);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'center',
  }));
  if (!visible) return null;
  return (
    <Animated.Text style={[style, { fontSize: 32 }]}>✨</Animated.Text>
  );
}

function MemoryCard({ card, onPress, disabled }: { card: Card; onPress: () => void; disabled: boolean }) {
  const rotate = useSharedValue(card.flipped || card.matched ? 180 : 0);
  const matchScale = useSharedValue(1);
  const prevMatched = useRef(false);

  useEffect(() => {
    rotate.value = withTiming(card.flipped || card.matched ? 180 : 0, { duration: 320 });
  }, [card.flipped, card.matched]);

  useEffect(() => {
    if (card.matched && !prevMatched.current) {
      matchScale.value = withSequence(
        withSpring(1.25, { damping: 4 }),
        withSpring(1, { damping: 8 }),
      );
      prevMatched.current = true;
    }
  }, [card.matched]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${interpolate(rotate.value, [0, 180], [180, 360])}deg` },
    ],
    backfaceVisibility: 'hidden' as const,
    position: 'absolute',
    width: '100%',
    height: '100%',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotate.value}deg` },
    ],
    backfaceVisibility: 'hidden' as const,
    position: 'absolute',
    width: '100%',
    height: '100%',
  }));

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: matchScale.value }],
  }));

  const colors = card.matched ? CARD_COLORS.matched : card.flipped ? CARD_COLORS.flipped : CARD_COLORS.hidden;

  return (
    <Pressable
      onPress={disabled || card.matched ? undefined : onPress}
      style={{ width: CARD_W, height: CARD_H }}
    >
      <Animated.View style={[wrapStyle, { flex: 1, position: 'relative' }]}>
        {/* Back face */}
        <Animated.View style={[backStyle, {
          backgroundColor: colors.bg,
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.glow,
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 4,
        }]}>
          <Text style={{ fontSize: 26 }}>🌟</Text>
        </Animated.View>

        {/* Front face */}
        <Animated.View style={[frontStyle, {
          backgroundColor: colors.bg,
          borderRadius: 14,
          borderWidth: card.matched ? 2 : 1.5,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.glow,
          shadowOpacity: card.matched ? 0.7 : 0.4,
          shadowRadius: card.matched ? 14 : 8,
          elevation: card.matched ? 8 : 4,
        }]}>
          <Text style={{ fontSize: 34 }}>{card.emoji}</Text>
          {card.matched && (
            <View style={{
              position: 'absolute', top: 4, right: 4,
              backgroundColor: '#10B981', borderRadius: 8,
              paddingHorizontal: 5, paddingVertical: 2,
            }}>
              <Text style={{ color: 'white', fontSize: 9, fontWeight: '900' }}>✓</Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

export default function MemoryGame() {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [deck, setDeck] = useState<Card[]>(buildDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gemsEarned, setGemsEarned] = useState(0);
  const [checking, setChecking] = useState(false);
  const [lastMatchedIds, setLastMatchedIds] = useState<number[]>([]);
  const deckRef = useRef(deck);
  deckRef.current = deck;
  const { completeGame } = useMiniGame('memory');

  const handleCardPress = useCallback((id: number) => {
    if (checking) return;
    setDeck(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSelected(prev => {
      const next = [...prev, id];
      if (next.length === 2) {
        setMoves(m => m + 1);
        setChecking(true);
        setTimeout(() => checkMatch(next), 750);
      }
      return next;
    });
  }, [checking]);

  function checkMatch(ids: number[]) {
    const [a, b] = ids;
    const currentDeck = deckRef.current;
    const cardA = currentDeck.find(c => c.id === a)!;
    const cardB = currentDeck.find(c => c.id === b)!;
    const isMatch = cardA.emoji === cardB.emoji;

    if (isMatch) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLastMatchedIds([a, b]);
      setDeck(prev => prev.map(c =>
        c.id === a || c.id === b ? { ...c, matched: true, flipped: false } : c,
      ));
      setMatches(prev => {
        const newMatches = prev + 1;
        if (newMatches === PAIRS.length) setTimeout(handleComplete, 600);
        return newMatches;
      });
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setLastMatchedIds([]);
      setDeck(prev => prev.map(c =>
        c.id === a || c.id === b ? { ...c, flipped: false } : c,
      ));
    }
    setChecking(false);
    setSelected([]);
  }

  async function handleComplete() {
    setPhase('done');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const earned = await completeGame();
    setGemsEarned(earned);
  }

  function restart() {
    const newDeck = buildDeck();
    setDeck(newDeck);
    setSelected([]);
    setMatches(0);
    setMoves(0);
    setLastMatchedIds([]);
    setPhase('playing');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0520' }}>

      {/* Bg star field */}
      <View style={{ position: 'absolute', inset: 0 }} pointerEvents="none">
        {[
          { x: '4%',  y: '5%',  delay: 0   },
          { x: '75%', y: '3%',  delay: 300 },
          { x: '40%', y: '11%', delay: 600 },
          { x: '91%', y: '20%', delay: 150 },
          { x: '16%', y: '32%', delay: 900 },
          { x: '58%', y: '45%', delay: 450 },
          { x: '6%',  y: '60%', delay: 750 },
          { x: '83%', y: '65%', delay: 550 },
          { x: '30%', y: '76%', delay: 200 },
          { x: '65%', y: '84%', delay: 700 },
        ].map((s, i) => <BgStar key={i} {...s} />)}
      </View>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10,
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

        {phase === 'playing' && (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{
              backgroundColor: 'rgba(52,211,153,0.15)', borderRadius: 12,
              paddingHorizontal: 12, paddingVertical: 6,
              borderWidth: 1, borderColor: 'rgba(52,211,153,0.3)',
            }}>
              <Text style={{ color: '#34D399', fontWeight: '800', fontSize: 14 }}>✅ {matches}/{PAIRS.length}</Text>
            </View>
            <View style={{
              backgroundColor: 'rgba(129,140,248,0.15)', borderRadius: 12,
              paddingHorizontal: 12, paddingVertical: 6,
              borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
            }}>
              <Text style={{ color: '#A5B4FC', fontWeight: '800', fontSize: 14 }}>🃏 {moves}</Text>
            </View>
          </View>
        )}

        <View style={{ width: 80 }} />
      </View>

      {/* Content */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>

        {phase === 'ready' && (
          <Animated.View entering={FadeIn} style={{ alignItems: 'center', paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 70, marginBottom: 16 }}>🃏</Text>
            <Text style={{ color: 'white', fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 }}>
              Memory de emociones
            </Text>
            <Text style={{ color: '#818CF8', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
              Encontrá todas las parejas de cartas.{'\n'}¡Entrenás tu memoria antes de dormir!
            </Text>
          </Animated.View>
        )}

        {phase === 'playing' && (
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={{ flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP, justifyContent: 'center' }}
          >
            {deck.map((card, index) => (
              <Animated.View
                key={card.id}
                entering={FadeInDown.delay(index * 40).duration(350)}
              >
                <MemoryCard
                  card={card}
                  onPress={() => handleCardPress(card.id)}
                  disabled={selected.length >= 2 || checking}
                />
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {phase === 'done' && (
          <Animated.View entering={FadeIn} style={{ alignItems: 'center', paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 70, marginBottom: 12 }}>🏆</Text>
            <Text style={{ color: 'white', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 6 }}>
              ¡Lo lograste!
            </Text>
            <Text style={{ color: '#818CF8', fontSize: 15, textAlign: 'center' }}>
              Encontraste todas las parejas{'\n'}en solo {moves} movimientos.
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
      </View>

      {/* Bottom */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 32, gap: 10 }}>
        {phase === 'ready' && (
          <Pressable
            onPress={() => setPhase('playing')}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#4338CA' : '#6366F1',
              borderRadius: 28, paddingVertical: 20, alignItems: 'center',
              shadowColor: '#6366F1', shadowOpacity: 0.5, shadowRadius: 12, elevation: 6,
            })}
          >
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>¡Jugar! 🃏</Text>
          </Pressable>
        )}

        {phase === 'done' && (
          <>
            <Pressable
              onPress={restart}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#1E1B4B' : '#312E81',
                borderRadius: 24, paddingVertical: 16, alignItems: 'center',
                borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
              })}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '800' }}>Jugar de nuevo 🔄</Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#4338CA' : '#6366F1',
                borderRadius: 28, paddingVertical: 18, alignItems: 'center',
                shadowColor: '#6366F1', shadowOpacity: 0.5, shadowRadius: 10, elevation: 5,
              })}
            >
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '800' }}>¡Listo! 🌙</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

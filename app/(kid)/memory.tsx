import { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  interpolate,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useMiniGame } from '../../src/features/mini-games/useMiniGame';

const PAIRS = ['😊', '😴', '🌙', '⭐', '🐶', '🌈'];
const CARD_BACK = '🌟';

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

function MemoryCard({
  card,
  onPress,
  disabled,
}: {
  card: Card;
  onPress: () => void;
  disabled: boolean;
}) {
  const rotate = useSharedValue(card.flipped || card.matched ? 180 : 0);

  useEffect(() => {
    rotate.value = withTiming(card.flipped || card.matched ? 180 : 0, { duration: 300 });
  }, [card.flipped, card.matched]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [180, 360])}deg` }],
    backfaceVisibility: 'hidden' as const,
    position: 'absolute',
    width: '100%',
    height: '100%',
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotate.value, [0, 180], [0, 180])}deg` }],
    backfaceVisibility: 'hidden' as const,
    position: 'absolute',
    width: '100%',
    height: '100%',
  }));

  const bgColor = card.matched
    ? 'bg-green-900'
    : card.flipped
      ? 'bg-indigo-700'
      : 'bg-indigo-800';

  return (
    <Pressable
      onPress={disabled || card.matched ? undefined : onPress}
      className="w-[15%] aspect-square mx-1 my-1"
      style={{ width: '14%' }}
    >
      <View className="flex-1 relative">
        {/* Back (face-down) */}
        <Animated.View style={backStyle} className={`${bgColor} rounded-xl items-center justify-center`}>
          <Text style={{ fontSize: 22 }}>{CARD_BACK}</Text>
        </Animated.View>
        {/* Front (face-up) */}
        <Animated.View style={frontStyle} className={`${bgColor} rounded-xl items-center justify-center`}>
          <Text style={{ fontSize: 22 }}>{card.emoji}</Text>
        </Animated.View>
      </View>
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
        setTimeout(() => checkMatch(next), 800);
      }
      return next;
    });
  }, [checking]);

  function checkMatch(ids: number[]) {
    const [a, b] = ids;
    setDeck(prev => {
      const cardA = prev.find(c => c.id === a)!;
      const cardB = prev.find(c => c.id === b)!;
      const isMatch = cardA.emoji === cardB.emoji;

      if (isMatch) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const newDeck = prev.map(c =>
          c.id === a || c.id === b ? { ...c, matched: true, flipped: false } : c,
        );
        const newMatches = matches + 1;
        setMatches(newMatches);
        if (newMatches === PAIRS.length) {
          setTimeout(() => handleComplete(), 400);
        }
        setChecking(false);
        setSelected([]);
        return newDeck;
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const newDeck = prev.map(c =>
          c.id === a || c.id === b ? { ...c, flipped: false } : c,
        );
        setChecking(false);
        setSelected([]);
        return newDeck;
      }
    });
  }

  async function handleComplete() {
    setPhase('done');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const earned = await completeGame();
    setGemsEarned(earned);
  }

  function restart() {
    setDeck(buildDeck());
    setSelected([]);
    setMatches(0);
    setMoves(0);
    setPhase('playing');
  }

  return (
    <SafeAreaView className="flex-1 bg-indigo-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <Pressable onPress={() => router.back()} className="p-2">
          <Text className="text-indigo-400 text-base">✕ Salir</Text>
        </Pressable>
        {phase === 'playing' && (
          <View className="flex-row gap-4">
            <Text className="text-indigo-300 text-sm">✅ {matches}/{PAIRS.length}</Text>
            <Text className="text-indigo-300 text-sm">🃏 {moves}</Text>
          </View>
        )}
        <View className="w-14" />
      </View>

      {/* Contenido */}
      <View className="flex-1 items-center justify-center px-4">
        {phase === 'ready' && (
          <Animated.View entering={FadeIn} className="items-center px-8">
            <Text className="text-7xl mb-6">🃏</Text>
            <Text className="text-white text-2xl font-bold text-center mb-2">Memory de emociones</Text>
            <Text className="text-indigo-300 text-base text-center">
              Encontrá todas las parejas de cartas. ¡Memorizá bien!
            </Text>
          </Animated.View>
        )}

        {phase === 'playing' && (
          <View className="flex-row flex-wrap justify-center" style={{ width: '100%' }}>
            {deck.map(card => (
              <MemoryCard
                key={card.id}
                card={card}
                onPress={() => handleCardPress(card.id)}
                disabled={selected.length === 2 || checking}
              />
            ))}
          </View>
        )}

        {phase === 'done' && (
          <Animated.View entering={FadeIn} className="items-center px-8">
            <Text className="text-7xl mb-4">🏆</Text>
            <Text className="text-white text-3xl font-bold text-center mb-2">¡Lo lograste!</Text>
            <Text className="text-indigo-300 text-base text-center">
              Encontraste todas las parejas en {moves} movimientos.
            </Text>
            {gemsEarned > 0 && (
              <View className="bg-indigo-900 rounded-2xl px-6 py-3 mt-6">
                <Text className="text-white font-bold text-xl text-center">+{gemsEarned} 💎</Text>
              </View>
            )}
          </Animated.View>
        )}
      </View>

      {/* Acciones */}
      <View className="px-8 pb-10 gap-3">
        {phase === 'ready' && (
          <Pressable
            onPress={() => setPhase('playing')}
            className="bg-indigo-500 rounded-4xl py-5 items-center active:bg-indigo-600"
          >
            <Text className="text-white text-xl font-bold">¡Jugar! 🃏</Text>
          </Pressable>
        )}
        {phase === 'done' && (
          <>
            <Pressable
              onPress={restart}
              className="bg-indigo-700 rounded-4xl py-4 items-center active:bg-indigo-600"
            >
              <Text className="text-white text-base font-bold">Jugar de nuevo</Text>
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              className="bg-indigo-500 rounded-4xl py-4 items-center active:bg-indigo-600"
            >
              <Text className="text-white text-base font-bold">¡Listo! 🌙</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

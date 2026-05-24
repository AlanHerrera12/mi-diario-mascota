import { useEffect } from 'react';
import { View, Text, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeInDown,
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { usePetStore } from '../../src/stores/pet.store';
import { GEMS } from '../../src/constants';

const GAMES = [
  {
    id: 'breathing',
    route: '/(kid)/breathing' as const,
    title: 'Respiración mágica',
    description: 'Respirá despacio siguiendo el círculo. Relaja tu cuerpo antes de dormir.',
    emoji: '🌬️',
    bgColor: '#312E81',
    accentColor: '#6366F1',
    glowColor: '#818CF8',
    tagColor: '#A5B4FC',
    duration: '~2 min',
  },
  {
    id: 'stars',
    route: '/(kid)/stars' as const,
    title: 'Atrapar estrellas',
    description: 'Las estrellas del cielo necesitan tu ayuda. ¡Tocá cada una para atraparla!',
    emoji: '⭐',
    bgColor: '#4C1D95',
    accentColor: '#7C3AED',
    glowColor: '#A78BFA',
    tagColor: '#C4B5FD',
    duration: '~1 min',
  },
  {
    id: 'memory',
    route: '/(kid)/memory' as const,
    title: 'Memory de emociones',
    description: 'Encontrá todas las parejas de cartas. ¡Entrená tu memoria antes de dormir!',
    emoji: '🃏',
    bgColor: '#1E1B4B',
    accentColor: '#4338CA',
    glowColor: '#818CF8',
    tagColor: '#A5B4FC',
    duration: '~3 min',
  },
];

// Pulsing star for background
function PulseStar({ x, y, delay }: { x: string; y: string; delay: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    scale.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1.4, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
      ), -1, true,
    ));
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.9, { duration: 1200 }),
        withTiming(0.3, { duration: 1200 }),
      ), -1, true,
    ));
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  return (
    <Animated.Text style={[style, { position: 'absolute', left: x, top: y, fontSize: 14 }]}>
      ✦
    </Animated.Text>
  );
}

export default function MiniGamesScreen() {
  const gemBalance = usePetStore(s => s.gemBalance);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0A2E' }}>
      {/* Animated star field */}
      <View style={{ position: 'absolute', inset: 0 }} pointerEvents="none">
        {[
          { x: '8%',  y: '12%', delay: 0    },
          { x: '78%', y: '8%',  delay: 400  },
          { x: '45%', y: '18%', delay: 800  },
          { x: '92%', y: '30%', delay: 200  },
          { x: '15%', y: '42%', delay: 1000 },
          { x: '65%', y: '55%', delay: 600  },
          { x: '30%', y: '70%', delay: 300  },
          { x: '85%', y: '75%', delay: 900  },
          { x: '52%', y: '88%', delay: 500  },
        ].map((s, i) => <PulseStar key={i} {...s} />)}
      </View>

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <View>
          <Text style={{ color: '#818CF8', fontSize: 12, fontWeight: '600', letterSpacing: 1 }}>
            ANTES DE DORMIR
          </Text>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', marginTop: 2 }}>
            Mini-juegos 🌙
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: 'rgba(129,140,248,0.15)',
            borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8,
            borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
          }}>
            <Text style={{ fontSize: 16 }}>⭐</Text>
            <Text style={{ color: 'white', fontWeight: '800', fontSize: 15 }}>{gemBalance}</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              backgroundColor: pressed ? 'rgba(129,140,248,0.25)' : 'rgba(129,140,248,0.15)',
              borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8,
              borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
            })}
          >
            <Text style={{ color: '#A5B4FC', fontWeight: '700', fontSize: 14 }}>‹ Volver</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>
        {/* Subtitle */}
        <View style={{
          backgroundColor: 'rgba(129,140,248,0.1)',
          borderRadius: 16, padding: 14, marginBottom: 4,
          borderWidth: 1, borderColor: 'rgba(129,140,248,0.2)',
        }}>
          <Text style={{ color: '#A5B4FC', fontSize: 13, textAlign: 'center', lineHeight: 18 }}>
            🌙 Jugá antes de dormir y ganás{' '}
            <Text style={{ color: '#FCD34D', fontWeight: '800' }}>+{GEMS.MINI_GAME_COMPLETE} ⭐</Text>
            {' '}por juego
          </Text>
        </View>

        {GAMES.map((game, i) => (
          <Animated.View key={game.id} entering={FadeInDown.delay(i * 120).duration(500)}>
            <Pressable
              onPress={() => router.push(game.route)}
              style={({ pressed }) => ({
                borderRadius: 28,
                overflow: 'hidden',
                opacity: pressed ? 0.88 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              {/* Card background with glass effect */}
              <View style={{
                backgroundColor: game.bgColor,
                borderRadius: 28,
                padding: 22,
                borderWidth: 1,
                borderColor: `${game.glowColor}33`,
                shadowColor: game.glowColor,
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 8,
              }}>
                {/* Glow blob top-right */}
                <View style={{
                  position: 'absolute', top: -20, right: -20,
                  width: 100, height: 100, borderRadius: 50,
                  backgroundColor: game.accentColor, opacity: 0.25,
                }} />

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  {/* Icon */}
                  <View style={{
                    width: 70, height: 70, borderRadius: 22,
                    backgroundColor: `${game.glowColor}22`,
                    borderWidth: 1, borderColor: `${game.glowColor}44`,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 34 }}>{game.emoji}</Text>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'white', fontWeight: '800', fontSize: 17, marginBottom: 4 }}>
                      {game.title}
                    </Text>
                    <Text style={{ color: game.tagColor, fontSize: 12, lineHeight: 17, opacity: 0.85 }}>
                      {game.description}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                      <View style={{
                        backgroundColor: `${game.glowColor}22`,
                        borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
                        borderWidth: 1, borderColor: `${game.glowColor}33`,
                      }}>
                        <Text style={{ color: game.tagColor, fontSize: 11, fontWeight: '700' }}>
                          ⏱ {game.duration}
                        </Text>
                      </View>
                      <View style={{
                        backgroundColor: 'rgba(252,211,77,0.15)',
                        borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
                        borderWidth: 1, borderColor: 'rgba(252,211,77,0.3)',
                      }}>
                        <Text style={{ color: '#FCD34D', fontSize: 11, fontWeight: '800' }}>
                          +{GEMS.MINI_GAME_COMPLETE} ⭐
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={{ color: `${game.glowColor}88`, fontSize: 26, fontWeight: '300' }}>›</Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        ))}

        {/* Footer */}
        <View style={{
          backgroundColor: 'rgba(129,140,248,0.08)',
          borderRadius: 20, padding: 16, marginTop: 4,
          borderWidth: 1, borderColor: 'rgba(129,140,248,0.15)',
        }}>
          <Text style={{ color: '#6366F1', fontSize: 12, textAlign: 'center', lineHeight: 18 }}>
            🌙 Cada juego se puede jugar una vez por sesión.{'\n'}Mañana podrás ganar gemas de nuevo.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

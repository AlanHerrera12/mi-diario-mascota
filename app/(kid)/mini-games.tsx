import { View, Text, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { usePetStore } from '../../src/stores/pet.store';
import { GEMS } from '../../src/constants';

const GAMES = [
  {
    id: 'breathing',
    route: '/(kid)/breathing' as const,
    title: 'Respiración mágica',
    description: 'Respirá despacio siguiendo el círculo. Relaja tu cuerpo antes de dormir.',
    emoji: '🌬️',
    color: 'bg-indigo-900',
    accent: 'bg-indigo-700',
    duration: '~2 min',
  },
  {
    id: 'stars',
    route: '/(kid)/stars' as const,
    title: 'Atrapar estrellas',
    description: 'Las estrellas del cielo necesitan tu ayuda. ¡Tocá cada una para atraparla!',
    emoji: '⭐',
    color: 'bg-purple-900',
    accent: 'bg-purple-700',
    duration: '~1 min',
  },
  {
    id: 'memory',
    route: '/(kid)/memory' as const,
    title: 'Memory de emociones',
    description: 'Encontrá todas las parejas de cartas. ¡Entrená tu memoria antes de dormir!',
    emoji: '🃏',
    color: 'bg-violet-900',
    accent: 'bg-violet-700',
    duration: '~3 min',
  },
];

export default function MiniGamesScreen() {
  const gemBalance = usePetStore(s => s.gemBalance);

  return (
    <SafeAreaView className="flex-1 bg-indigo-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <View>
          <Text className="text-indigo-400 text-xs">Antes de dormir</Text>
          <Text className="text-white text-xl font-bold">Mini-juegos 🌙</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1 bg-indigo-900 rounded-xl px-3 py-1.5">
            <Text>💎</Text>
            <Text className="text-white font-bold">{gemBalance}</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="bg-indigo-900 rounded-xl px-3 py-1.5 active:bg-indigo-800"
          >
            <Text className="text-indigo-300 font-semibold text-sm">‹ Volver</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Text className="text-indigo-300 text-sm text-center mb-2">
          Jugá antes de dormir y ganás {GEMS.MINI_GAME_COMPLETE} 💎 por juego
        </Text>

        {GAMES.map((game, i) => (
          <Animated.View key={game.id} entering={FadeInDown.delay(i * 100).duration(400)}>
            <Pressable
              onPress={() => router.push(game.route)}
              className={`${game.color} rounded-3xl p-5 active:opacity-90`}
            >
              <View className="flex-row items-center gap-4">
                {/* Ícono */}
                <View className={`${game.accent} rounded-2xl w-16 h-16 items-center justify-center`}>
                  <Text style={{ fontSize: 36 }}>{game.emoji}</Text>
                </View>

                {/* Info */}
                <View className="flex-1">
                  <Text className="text-white font-bold text-base mb-0.5">{game.title}</Text>
                  <Text className="text-indigo-300 text-xs leading-4">{game.description}</Text>
                  <View className="flex-row items-center gap-3 mt-2">
                    <View className="flex-row items-center gap-1">
                      <Text className="text-indigo-400 text-xs">⏱ {game.duration}</Text>
                    </View>
                    <View className="flex-row items-center gap-1 bg-indigo-800/60 rounded-lg px-2 py-0.5">
                      <Text className="text-yellow-300 text-xs font-bold">+{GEMS.MINI_GAME_COMPLETE} 💎</Text>
                    </View>
                  </View>
                </View>

                <Text className="text-indigo-500 text-2xl">›</Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}

        {/* Footer */}
        <View className="bg-indigo-900/50 rounded-2xl p-4 mt-2">
          <Text className="text-indigo-400 text-xs text-center leading-4">
            🌙 Cada juego se puede jugar una vez por sesión. Mañana podrás ganar gemas de nuevo.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

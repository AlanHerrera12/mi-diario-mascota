import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface Props {
  gemsEarned: number;
  bonusGems?: number;
  newStreak: number;
  onContinue: () => void;
}

export function GemRewardOverlay({ gemsEarned, bonusGems = 0, newStreak, onContinue }: Props) {
  const gemScale = useSharedValue(0);
  const streakScale = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    gemScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 120 }));
    if (newStreak > 1) {
      streakScale.value = withDelay(700, withSpring(1, { damping: 8, stiffness: 120 }));
    }
  }, []);

  const gemStyle = useAnimatedStyle(() => ({ transform: [{ scale: gemScale.value }] }));
  const streakStyle = useAnimatedStyle(() => ({ transform: [{ scale: streakScale.value }] }));

  const totalGems = gemsEarned + bonusGems;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      className="absolute inset-0 bg-black/60 items-center justify-center px-8"
      style={{ zIndex: 50 }}
    >
      <View className="bg-white rounded-4xl p-8 w-full items-center shadow-2xl">
        {/* Gemas ganadas */}
        <Animated.View style={gemStyle} className="items-center mb-4">
          <Text className="text-6xl mb-2">💎</Text>
          <Text className="text-4xl font-bold text-primary-500">+{totalGems}</Text>
          <Text className="text-gray-500 text-base mt-1">
            {totalGems === 1 ? 'gema ganada' : 'gemas ganadas'}
          </Text>
          {bonusGems > 0 && (
            <View className="bg-accent-100 rounded-xl px-3 py-1 mt-2">
              <Text className="text-accent-700 text-sm font-semibold">
                🔥 +{bonusGems} bonus de racha
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Racha */}
        {newStreak > 0 && (
          <Animated.View style={streakStyle} className="items-center mb-6">
            <View className="flex-row items-center gap-2 bg-orange-50 rounded-2xl px-5 py-3">
              <Text className="text-2xl">🔥</Text>
              <Text className="text-orange-600 font-bold text-lg">
                {newStreak} {newStreak === 1 ? 'día seguido' : 'días seguidos'}
              </Text>
            </View>
          </Animated.View>
        )}

        <Pressable
          onPress={onContinue}
          className="bg-primary-500 rounded-3xl px-10 py-4 w-full items-center active:bg-primary-600"
        >
          <Text className="text-white text-xl font-bold">¡Genial! 🌙</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

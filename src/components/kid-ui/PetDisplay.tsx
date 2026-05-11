import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import type { Pet } from '../../types';

// TODO (assets): reemplazar con <RiveAnimation> cuando tengamos los .riv
// Los nombres de state machine deben ser: idle, listening, happy, sleepy, missing_you

type PetMood = 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';

const SPECIES_EMOJI: Record<string, string> = {
  dog: '🐶', cat: '🐱', rabbit: '🐰', bear: '🐻',
  elephant: '🐘', giraffe: '🦒', dragon: '🐲', unicorn: '🦄',
};

const MOOD_SUFFIX: Record<PetMood, string> = {
  idle:        '',
  listening:   '👂',
  happy:       '🎉',
  sleepy:      '😴',
  missing_you: '🥺',
};

interface Props {
  pet: Pet;
  mood?: PetMood;
  size?: number;
}

export function PetDisplay({ pet, mood = 'idle', size = 180 }: Props) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (mood === 'listening') {
      // Leve oscilación lateral cuando escucha
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.97, { duration: 600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    } else if (mood === 'happy') {
      // Salto de celebración
      translateY.value = withRepeat(
        withSequence(
          withTiming(-16, { duration: 250, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 250, easing: Easing.in(Easing.quad) }),
        ),
        3,
        false,
      );
      scale.value = withTiming(1, { duration: 100 });
    } else {
      // Respiración suave en idle / sleepy / missing_you
      scale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.98, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
      translateY.value = withTiming(0, { duration: 200 });
    }
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const emoji = SPECIES_EMOJI[pet.species] ?? '🐾';
  const suffix = MOOD_SUFFIX[mood];

  return (
    <View className="items-center justify-center">
      <Animated.View
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: pet.customization.baseColor + '33', // 20% opacity
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
        {suffix ? (
          <Text
            style={{ fontSize: size * 0.22, position: 'absolute', bottom: size * 0.08, right: size * 0.08 }}
          >
            {suffix}
          </Text>
        ) : null}
      </Animated.View>

      <Text className="mt-3 text-lg font-bold text-gray-700">{pet.name}</Text>
    </View>
  );
}

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
import { PetDogSVG }    from './PetDogSVG';
import { PetCatSVG }    from './PetCatSVG';
import { PetBearSVG }   from './PetBearSVG';
import { PetRabbitSVG } from './PetRabbitSVG';
import { PetDragonSVG } from './PetDragonSVG';
import { usePetStore } from '../../stores/pet.store';
import { DEMO_ITEMS } from '../../features/shop/useShop';

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

// Overlay positions per item category — relative to the pet container
const ITEM_POSITIONS: Record<string, { top: string; left: string }> = {
  outfit:    { top: '42%', left: '38%' },
  accessory: { top: '5%',  left: '38%' },
  effect:    { top: '65%', left: '10%' },
  animation: { top: '70%', left: '55%' },
  species:   { top: '20%', left: '60%' },
};

interface Props {
  pet: Pet;
  mood?: PetMood;
  size?: number;
}

export function PetDisplay({ pet, mood = 'idle', size = 180 }: Props) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const equippedDemoItems = usePetStore(s => s.equippedDemoItems);

  useEffect(() => {
    if (mood === 'listening') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.97, { duration: 600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    } else if (mood === 'happy') {
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

  // Combine real equipped items from pet customization + locally equipped demo items
  const realEquipped: string[] = pet.customization.equippedItems ?? [];
  const allEquipped = Array.from(new Set([...realEquipped, ...equippedDemoItems]));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          animatedStyle,
          {
            width: size,
            height: size,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        {pet.species === 'dog' ? (
          <PetDogSVG size={size} mood={mood} baseColor={pet.customization.baseColor} />
        ) : pet.species === 'cat' ? (
          <PetCatSVG size={size} mood={mood} baseColor={pet.customization.baseColor} />
        ) : pet.species === 'bear' ? (
          <PetBearSVG size={size} mood={mood} baseColor={pet.customization.baseColor} />
        ) : pet.species === 'rabbit' ? (
          <PetRabbitSVG size={size} mood={mood} baseColor={pet.customization.baseColor} />
        ) : pet.species === 'dragon' ? (
          <PetDragonSVG size={size} mood={mood} baseColor={pet.customization.baseColor} />
        ) : (
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: (pet.customization.baseColor ?? '#A78BFA') + '33',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
          </View>
        )}

        {/* Equipped item overlays */}
        {allEquipped.map(shopItemId => {
          const demoItem = DEMO_ITEMS.find(d => d.id === shopItemId);
          if (!demoItem) return null;
          const pos = ITEM_POSITIONS[demoItem.category] ?? { top: '40%', left: '38%' };
          const isEmoji = !demoItem.preview_url.startsWith('http');
          if (!isEmoji) return null;
          return (
            <Text
              key={shopItemId}
              style={{
                position: 'absolute',
                fontSize: size * 0.18,
                top: pos.top,
                left: pos.left,
              }}
            >
              {demoItem.preview_url}
            </Text>
          );
        })}

        {suffix ? (
          <Text
            style={{ fontSize: size * 0.22, position: 'absolute', bottom: size * 0.08, right: size * 0.08 }}
          >
            {suffix}
          </Text>
        ) : null}
      </Animated.View>

      <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '700', color: '#A5B4FC' }}>
        {pet.name}
      </Text>
    </View>
  );
}

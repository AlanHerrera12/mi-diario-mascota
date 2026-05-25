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
import { ItemIllustration } from './ItemIllustration';
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

interface OverlayItem {
  id: string;
  category: string;
  name: string;
  rarity: string;
  speciesKey?: string;
}

interface OverlayConfig {
  overlaySize: number;
  top: number;
  left: number;
  behind: boolean;
}

/** Returns true for items that should render BEHIND the pet body (wings, capes, effects, animations). */
function isBehindItem(category: string, name: string): boolean {
  const lname = name.toLowerCase();
  if (category === 'accessory' && lname.includes('alas')) return true;
  if (category === 'effect') return true;
  if (category === 'animation') return true;
  if (category === 'outfit' && (lname.includes('capa') || lname.includes('superhéroe'))) return true;
  return false;
}

/** Size / position for each item overlay within the `size × size` pet container. */
function getOverlayConfig(category: string, name: string, size: number): OverlayConfig {
  const lname = name.toLowerCase();
  const behind = isBehindItem(category, name);

  /* ── Accessories ── */
  if (category === 'accessory') {
    // Wings — full canvas, span the whole width
    if (lname.includes('alas')) {
      return { overlaySize: size, top: 0, left: 0, behind: true };
    }
    // Sunglasses — at eye level (~25 % from top)
    if (lname.includes('gafas')) {
      const os = Math.round(size * 0.58);
      return { overlaySize: os, top: Math.round(size * 0.20), left: Math.round((size - os) / 2), behind: false };
    }
    // Collar — at neck (~48 % from top)
    if (lname.includes('collar')) {
      const os = Math.round(size * 0.58);
      return { overlaySize: os, top: Math.round(size * 0.46), left: Math.round((size - os) / 2), behind: false };
    }
    // Halo — slightly above head
    if (lname.includes('halo')) {
      const os = Math.round(size * 0.50);
      return { overlaySize: os, top: Math.round(-size * 0.05), left: Math.round((size - os) / 2), behind: false };
    }
    // Rainbow / generic — small badge, top-right
    const os = Math.round(size * 0.42);
    return { overlaySize: os, top: Math.round(size * 0.04), left: Math.round(size * 0.56), behind: false };
  }

  /* ── Outfits ── */
  if (category === 'outfit') {
    // Hat — sits on top of the head
    if (lname.includes('sombrero') || lname.includes('hat')) {
      const os = Math.round(size * 0.50);
      return { overlaySize: os, top: Math.round(-size * 0.05), left: Math.round((size - os) / 2), behind: false };
    }
    // Crown — just above the head
    if (lname.includes('corona')) {
      const os = Math.round(size * 0.46);
      return { overlaySize: os, top: Math.round(-size * 0.08), left: Math.round((size - os) / 2), behind: false };
    }
    // Cape / superhero — flows from shoulders, behind the pet
    if (lname.includes('capa') || lname.includes('superhéroe')) {
      const os = Math.round(size * 0.78);
      return { overlaySize: os, top: Math.round(size * 0.18), left: Math.round((size - os) / 2), behind: true };
    }
    // Everything else (armor, astronaut, legendary suit, traje) — body-center overlay
    const os = Math.round(size * 0.72);
    return { overlaySize: os, top: Math.round(size * 0.22), left: Math.round((size - os) / 2), behind: false };
  }

  /* ── Effects ── */
  if (category === 'effect') {
    const os = Math.round(size * 0.55);
    return { overlaySize: os, top: Math.round(size * 0.40), left: Math.round(size * 0.04), behind: true };
  }

  /* ── Animations ── */
  if (category === 'animation') {
    const os = Math.round(size * 0.38);
    return { overlaySize: os, top: Math.round(size * 0.60), left: Math.round(size * 0.58), behind: false };
  }

  /* ── Species badge (top-right corner) ── */
  const os = Math.round(size * 0.38);
  return { overlaySize: os, top: Math.round(size * 0.08), left: Math.round(size * 0.58), behind: false };
}

/* ─────────────────────────────────────────── */

interface Props {
  pet: Pet;
  mood?: PetMood;
  size?: number;
  /** Optional item to preview on the pet without actually equipping it. */
  previewItem?: { category: string; name: string; rarity: string; speciesKey?: string };
  showName?: boolean;
}

export function PetDisplay({ pet, mood = 'idle', size = 180, previewItem, showName = true }: Props) {
  const scale      = useSharedValue(1);
  const translateY = useSharedValue(0);
  const equippedDemoItems = usePetStore(s => s.equippedDemoItems);

  useEffect(() => {
    if (mood === 'listening') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.97, { duration: 600, easing: Easing.inOut(Easing.sin) }),
        ), -1, true,
      );
    } else if (mood === 'happy') {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-16, { duration: 250, easing: Easing.out(Easing.quad) }),
          withTiming(0,   { duration: 250, easing: Easing.in(Easing.quad)  }),
        ), 3, false,
      );
      scale.value = withTiming(1, { duration: 100 });
    } else {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.98, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ), -1, true,
      );
      translateY.value = withTiming(0, { duration: 200 });
    }
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const emoji  = SPECIES_EMOJI[pet.species] ?? '🐾';
  const suffix = MOOD_SUFFIX[mood];

  /* ── Build overlay list ── */
  const realEquipped: string[] = pet.customization.equippedItems ?? [];
  const allEquippedIds = Array.from(new Set([...realEquipped, ...equippedDemoItems]));

  const equippedOverlays: OverlayItem[] = allEquippedIds
    .map(shopItemId => {
      const d = DEMO_ITEMS.find(x => x.id === shopItemId);
      if (!d) return null;
      return { id: shopItemId, category: d.category, name: d.name, rarity: d.rarity, speciesKey: d.species_key };
    })
    .filter((x): x is OverlayItem => x !== null);

  const allOverlays: OverlayItem[] = previewItem
    ? [...equippedOverlays, { id: '__preview__', ...previewItem }]
    : equippedOverlays;

  const behindOverlays = allOverlays.filter(i =>  isBehindItem(i.category, i.name));
  const frontOverlays  = allOverlays.filter(i => !isBehindItem(i.category, i.name));

  function renderOverlay(item: OverlayItem) {
    const cfg = getOverlayConfig(item.category, item.name, size);
    return (
      <View
        key={item.id}
        // @ts-ignore — pointerEvents valid on RN View
        pointerEvents="none"
        style={{ position: 'absolute', top: cfg.top, left: cfg.left }}
      >
        <ItemIllustration
          category={item.category}
          name={item.name}
          rarity={item.rarity}
          speciesKey={item.speciesKey}
          size={cfg.overlaySize}
        />
      </View>
    );
  }

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
        {/* ── Items that go BEHIND the pet (wings, capes, effects) ── */}
        {behindOverlays.map(renderOverlay)}

        {/* ── Pet body ── */}
        {pet.species === 'dog' ? (
          <PetDogSVG    size={size} mood={mood} baseColor={pet.customization.baseColor} />
        ) : pet.species === 'cat' ? (
          <PetCatSVG    size={size} mood={mood} baseColor={pet.customization.baseColor} />
        ) : pet.species === 'bear' ? (
          <PetBearSVG   size={size} mood={mood} baseColor={pet.customization.baseColor} />
        ) : pet.species === 'rabbit' ? (
          <PetRabbitSVG size={size} mood={mood} baseColor={pet.customization.baseColor} />
        ) : pet.species === 'dragon' ? (
          <PetDragonSVG size={size} mood={mood} baseColor={pet.customization.baseColor} />
        ) : (
          <View
            style={{
              width: size, height: size, borderRadius: size / 2,
              backgroundColor: (pet.customization.baseColor ?? '#A78BFA') + '33',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
          </View>
        )}

        {/* ── Items that go IN FRONT of the pet (hats, glasses, collars, armor) ── */}
        {frontOverlays.map(renderOverlay)}

        {/* ── Mood suffix badge ── */}
        {suffix ? (
          <Text
            style={{
              fontSize: size * 0.22,
              position: 'absolute',
              bottom: size * 0.08,
              right: size * 0.08,
            }}
          >
            {suffix}
          </Text>
        ) : null}
      </Animated.View>

      {showName && (
        <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '700', color: '#A5B4FC' }}>
          {pet.name}
        </Text>
      )}
    </View>
  );
}

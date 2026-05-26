import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import type { Pet } from '../../types';
import { PetAvatar } from './PetAvatar';
import { ItemIllustration } from './ItemIllustration';
import { usePetStore } from '../../stores/pet.store';
import { DEMO_ITEMS } from '../../features/shop/useShop';

type PetMood = 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
const MOOD_SUFFIX: Record<PetMood, string> = { idle: '', listening: '👂', happy: '🎉', sleepy: '😴', missing_you: '🥺' };

interface OverlayItem { id: string; category: string; name: string; rarity: string; speciesKey?: string; }
interface OverlayConfig { overlaySize: number; top: number; left: number; behind: boolean; }

function isBehindItem(category: string, name: string): boolean {
  const l = name.toLowerCase();
  if (category === 'accessory' && l.includes('alas')) return true;
  if (category === 'effect') return true;
  if (category === 'animation') return true;
  if (category === 'outfit' && (l.includes('capa') || l.includes('superhéroe'))) return true;
  return false;
}

function getOverlayConfig(category: string, name: string, size: number): OverlayConfig {
  const l = name.toLowerCase();
  if (category === 'accessory') {
    if (l.includes('alas'))   return { overlaySize: size, top: 0, left: 0, behind: true };
    if (l.includes('gafas'))  { const os = Math.round(size * 0.58); return { overlaySize: os, top: Math.round(size * 0.20), left: Math.round((size - os) / 2), behind: false }; }
    if (l.includes('collar')) { const os = Math.round(size * 0.58); return { overlaySize: os, top: Math.round(size * 0.46), left: Math.round((size - os) / 2), behind: false }; }
    if (l.includes('halo'))   { const os = Math.round(size * 0.50); return { overlaySize: os, top: Math.round(-size * 0.05), left: Math.round((size - os) / 2), behind: false }; }
    const os = Math.round(size * 0.42); return { overlaySize: os, top: Math.round(size * 0.04), left: Math.round(size * 0.56), behind: false };
  }
  if (category === 'outfit') {
    if (l.includes('sombrero') || l.includes('hat')) { const os = Math.round(size * 0.50); return { overlaySize: os, top: Math.round(-size * 0.05), left: Math.round((size - os) / 2), behind: false }; }
    if (l.includes('corona')) { const os = Math.round(size * 0.46); return { overlaySize: os, top: Math.round(-size * 0.08), left: Math.round((size - os) / 2), behind: false }; }
    if (l.includes('capa') || l.includes('superhéroe')) { const os = Math.round(size * 0.78); return { overlaySize: os, top: Math.round(size * 0.18), left: Math.round((size - os) / 2), behind: true }; }
    const os = Math.round(size * 0.72); return { overlaySize: os, top: Math.round(size * 0.22), left: Math.round((size - os) / 2), behind: false };
  }
  if (category === 'effect')    { const os = Math.round(size * 0.55); return { overlaySize: os, top: Math.round(size * 0.40), left: Math.round(size * 0.04), behind: true }; }
  if (category === 'animation') { const os = Math.round(size * 0.38); return { overlaySize: os, top: Math.round(size * 0.60), left: Math.round(size * 0.58), behind: false }; }
  const os = Math.round(size * 0.38); return { overlaySize: os, top: Math.round(size * 0.08), left: Math.round(size * 0.58), behind: false };
}

interface Props {
  pet: Pet;
  mood?: PetMood;
  size?: number;
  previewItem?: { category: string; name: string; rarity: string; speciesKey?: string };
  showName?: boolean;
}

export function PetDisplay({ pet, mood = 'idle', size = 180, previewItem, showName = true }: Props) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const equippedDemoItems = usePetStore(s => s.equippedDemoItems);

  useEffect(() => {
    if (mood === 'listening') {
      scale.value = withRepeat(withSequence(
        withTiming(1.06, { duration: 600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.97, { duration: 600, easing: Easing.inOut(Easing.sin) }),
      ), -1, true);
    } else if (mood === 'happy') {
      translateY.value = withRepeat(withSequence(
        withTiming(-18, { duration: 220, easing: Easing.out(Easing.quad) }),
        withTiming(0,   { duration: 220, easing: Easing.in(Easing.quad) }),
      ), 3, false);
      scale.value = withTiming(1, { duration: 100 });
    } else if (mood === 'sleepy') {
      scale.value = withRepeat(withSequence(
        withTiming(1.02, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.98, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
      ), -1, true);
    } else {
      scale.value = withRepeat(withSequence(
        withTiming(1.04, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.98, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ), -1, true);
      translateY.value = withRepeat(withSequence(
        withTiming(-6, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0,  { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ), -1, true);
    }
  }, [mood]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  const suffix = MOOD_SUFFIX[mood];

  const realEquipped: string[] = pet.customization.equippedItems ?? [];
  const allEquippedIds = Array.from(new Set([...realEquipped, ...equippedDemoItems]));
  const equippedOverlays: OverlayItem[] = allEquippedIds
    .map(shopItemId => {
      const d = DEMO_ITEMS.find(x => x.id === shopItemId);
      if (!d) return null;
      return { id: shopItemId, category: d.category, name: d.name, rarity: d.rarity, speciesKey: d.species_key };
    })
    .filter((x): x is OverlayItem => x !== null);

  const allOverlays = previewItem
    ? [...equippedOverlays, { id: '__preview__', ...previewItem }]
    : equippedOverlays;
  const behindOverlays = allOverlays.filter(i =>  isBehindItem(i.category, i.name));
  const frontOverlays  = allOverlays.filter(i => !isBehindItem(i.category, i.name));

  function renderOverlay(item: OverlayItem) {
    const cfg = getOverlayConfig(item.category, item.name, size);
    return (
      <View key={item.id} pointerEvents="none" style={{ position: 'absolute', top: cfg.top, left: cfg.left }}>
        <ItemIllustration
          category={item.category} name={item.name}
          rarity={item.rarity} speciesKey={item.speciesKey}
          size={cfg.overlaySize}
        />
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[animatedStyle, { width: size, height: size, alignItems: 'center', justifyContent: 'center' }]}>
        {behindOverlays.map(renderOverlay)}

        <PetAvatar species={pet.species} size={size} mood={mood} baseColor={pet.customization?.baseColor} />

        {frontOverlays.map(renderOverlay)}
        {suffix ? (
          <Text style={{ fontSize: size * 0.22, position: 'absolute', bottom: size * 0.04, right: size * 0.04 }}>
            {suffix}
          </Text>
        ) : null}
      </Animated.View>

      {showName && (
        <Text style={{ marginTop: 8, fontSize: 16, fontWeight: '700', color: '#A5B4FC' }}>
          {pet.name}
        </Text>
      )}
    </View>
  );
}

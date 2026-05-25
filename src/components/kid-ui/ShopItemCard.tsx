import { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, interpolate,
} from 'react-native-reanimated';
import type { RawShopItem } from '../../features/shop/useShop';
import { ItemIllustration } from './ItemIllustration';

const RARITY_CONFIG = {
  common: {
    label: 'Común',
    bgColor: 'rgba(156,163,175,0.15)',
    borderColor: 'rgba(156,163,175,0.3)',
    glowColor: '#9CA3AF',
    tagBg: 'rgba(156,163,175,0.2)',
    tagColor: '#9CA3AF',
    iconBg: 'rgba(156,163,175,0.12)',
    btnBg: '#6B7280',
    btnShadow: '#4B5563',
  },
  rare: {
    label: 'Raro',
    bgColor: 'rgba(59,130,246,0.12)',
    borderColor: 'rgba(59,130,246,0.35)',
    glowColor: '#3B82F6',
    tagBg: 'rgba(59,130,246,0.2)',
    tagColor: '#60A5FA',
    iconBg: 'rgba(59,130,246,0.12)',
    btnBg: '#3B82F6',
    btnShadow: '#1D4ED8',
  },
  epic: {
    label: 'Épico',
    bgColor: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.4)',
    glowColor: '#8B5CF6',
    tagBg: 'rgba(139,92,246,0.2)',
    tagColor: '#A78BFA',
    iconBg: 'rgba(139,92,246,0.12)',
    btnBg: '#7C3AED',
    btnShadow: '#5B21B6',
  },
  legendary: {
    label: 'Legendario',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.45)',
    glowColor: '#F59E0B',
    tagBg: 'rgba(245,158,11,0.2)',
    tagColor: '#FCD34D',
    iconBg: 'rgba(245,158,11,0.1)',
    btnBg: '#D97706',
    btnShadow: '#92400E',
  },
};

// ✦ corner particle for legendary cards
function SparkleCorner({ top, left, right, bottom, delay }: {
  top?: number | string; left?: number | string;
  right?: number | string; bottom?: number | string;
  delay: number;
}) {
  const opacity = useSharedValue(0.2);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.2, { duration: 600 }),
      ),
      -1, true,
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.Text style={[style, {
      position: 'absolute', top, left, right, bottom,
      fontSize: 9, color: '#FCD34D',
    }]}>✦</Animated.Text>
  );
}

interface Props {
  item: RawShopItem;
  owned: boolean;
  equipped?: boolean;
  onBuy: () => Promise<void>;
  loading?: boolean;
  index?: number;
}

export function ShopItemCard({ item, owned, equipped, onBuy, loading, index = 0 }: Props) {
  const r = RARITY_CONFIG[item.rarity] ?? RARITY_CONFIG.common;
  const [showBack, setShowBack] = useState(false);
  const flipProgress = useSharedValue(0);
  const epicBorder = useSharedValue(1);

  // Auto flip-and-reveal on mount
  useEffect(() => {
    const t = setTimeout(() => {
      // Flip to 90°
      flipProgress.value = withTiming(0.5, { duration: 350 }, () => {
        // swap content at mid-flip
      });
      const swap1 = setTimeout(() => setShowBack(true), 300);
      // Flip back to 0°
      const back = setTimeout(() => {
        flipProgress.value = withTiming(0, { duration: 350 });
        const swap2 = setTimeout(() => setShowBack(false), 280);
        return () => clearTimeout(swap2);
      }, 1100);
      return () => { clearTimeout(swap1); clearTimeout(back); };
    }, 700 + index * 55);
    return () => clearTimeout(t);
  }, []);

  // Epic border glow pulse
  useEffect(() => {
    if (item.rarity === 'epic') {
      epicBorder.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 1200 }),
          withTiming(1, { duration: 1200 }),
        ),
        -1, true,
      );
    }
  }, []);

  const flipStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flipProgress.value, [0, 0.5, 1], [0, 90, 0])}deg` },
    ],
  }));

  const epicBorderStyle = useAnimatedStyle(() => ({
    borderWidth: item.rarity === 'epic' ? epicBorder.value : (equipped ? 2 : 1),
  }));

  return (
    <Animated.View style={[{
      backgroundColor: r.bgColor,
      borderRadius: 20,
      borderColor: equipped ? r.glowColor : r.borderColor,
      padding: 12,
      shadowColor: r.glowColor,
      shadowOpacity: equipped ? 0.5 : 0.2,
      shadowRadius: equipped ? 12 : 6,
      elevation: equipped ? 8 : 3,
      overflow: 'hidden',
    }, epicBorderStyle]}>

      {/* Glow spot for legendary/epic */}
      {(item.rarity === 'legendary' || item.rarity === 'epic') && (
        <View style={{
          position: 'absolute', top: -10, right: -10,
          width: 60, height: 60, borderRadius: 30,
          backgroundColor: r.glowColor, opacity: 0.18,
        }} />
      )}

      {/* Legendary corner sparkles */}
      {item.rarity === 'legendary' && (
        <>
          <SparkleCorner top={6}  left={6}  delay={0}   />
          <SparkleCorner top={6}  right={6} delay={150} />
          <SparkleCorner bottom={6} left={6}  delay={300} />
          <SparkleCorner bottom={6} right={6} delay={450} />
        </>
      )}

      {/* Flip-animated preview area */}
      <Animated.View style={[{
        backgroundColor: r.iconBg,
        borderRadius: 14,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: r.borderColor,
        overflow: 'hidden',
      }, flipStyle]}>
        {showBack ? (
          // Back: description text
          <View style={{ paddingHorizontal: 6, alignItems: 'center' }}>
            <Text style={{ color: r.tagColor, fontSize: 9, fontWeight: '700', textAlign: 'center', lineHeight: 13 }}>
              {item.description}
            </Text>
          </View>
        ) : (
          // Front: illustration
          <ItemIllustration
            category={item.category}
            name={item.name}
            rarity={item.rarity}
            speciesKey={item.species_key}
            size={64}
          />
        )}

        {equipped && (
          <View style={{
            position: 'absolute', top: 6, right: 6,
            backgroundColor: '#10B981',
            borderRadius: 10, width: 20, height: 20,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: '900' }}>✓</Text>
          </View>
        )}
      </Animated.View>

      {/* Name */}
      <Text
        style={{ fontSize: 12, fontWeight: '800', color: 'white', marginBottom: 4 }}
        numberOfLines={1}
      >
        {item.name}
      </Text>

      {/* Rarity badge */}
      <View style={{
        alignSelf: 'flex-start',
        backgroundColor: r.tagBg,
        borderRadius: 8,
        paddingHorizontal: 7,
        paddingVertical: 2,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: r.borderColor,
      }}>
        <Text style={{ fontSize: 10, fontWeight: '700', color: r.tagColor }}>
          {item.rarity === 'legendary' ? '⭐ ' : item.rarity === 'epic' ? '💜 ' : ''}
          {r.label}
        </Text>
      </View>

      {/* Action */}
      {owned ? (
        <View style={{
          backgroundColor: equipped ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)',
          borderRadius: 12,
          paddingVertical: 8,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: equipped ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)',
        }}>
          <Text style={{
            fontSize: 11,
            fontWeight: '800',
            color: equipped ? '#34D399' : 'rgba(255,255,255,0.5)',
          }}>
            {equipped ? '✓ Equipado' : 'En tu vestidor'}
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={onBuy}
          disabled={loading}
          style={({ pressed }) => ({
            backgroundColor: pressed ? r.btnShadow : r.btnBg,
            borderRadius: 12,
            paddingVertical: 8,
            alignItems: 'center',
            shadowColor: r.glowColor,
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 3,
          })}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '800' }}>
              {item.price_gems != null ? `⭐ ${item.price_gems}` : 'Gratis'}
            </Text>
          )}
        </Pressable>
      )}
    </Animated.View>
  );
}

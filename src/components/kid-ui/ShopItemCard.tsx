import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import type { RawShopItem } from '../../features/shop/useShop';

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

interface Props {
  item: RawShopItem;
  owned: boolean;
  equipped?: boolean;
  onBuy: () => Promise<void>;
  loading?: boolean;
}

export function ShopItemCard({ item, owned, equipped, onBuy, loading }: Props) {
  const r = RARITY_CONFIG[item.rarity] ?? RARITY_CONFIG.common;
  const isEmoji = !item.preview_url.startsWith('http');

  return (
    <View style={{
      backgroundColor: r.bgColor,
      borderRadius: 20,
      borderWidth: equipped ? 2 : 1,
      borderColor: equipped ? r.glowColor : r.borderColor,
      padding: 12,
      shadowColor: r.glowColor,
      shadowOpacity: equipped ? 0.5 : 0.2,
      shadowRadius: equipped ? 12 : 6,
      elevation: equipped ? 8 : 3,
    }}>
      {/* Glow spot for legendary/epic */}
      {(item.rarity === 'legendary' || item.rarity === 'epic') && (
        <View style={{
          position: 'absolute', top: -10, right: -10,
          width: 60, height: 60, borderRadius: 30,
          backgroundColor: r.glowColor, opacity: 0.15,
        }} />
      )}

      {/* Preview */}
      <View style={{
        backgroundColor: r.iconBg,
        borderRadius: 14,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: r.borderColor,
        overflow: 'hidden',
      }}>
        {isEmoji ? (
          <Text style={{ fontSize: 38 }}>{item.preview_url}</Text>
        ) : (
          <Text style={{ fontSize: 38 }}>🎁</Text>
        )}

        {/* Rarity stars for legendary */}
        {item.rarity === 'legendary' && (
          <Text style={{ position: 'absolute', top: 4, left: 6, fontSize: 10, opacity: 0.8 }}>✦</Text>
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
      </View>

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
    </View>
  );
}

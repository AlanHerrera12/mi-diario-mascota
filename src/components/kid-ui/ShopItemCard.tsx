import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import type { RawShopItem } from '../../features/shop/useShop';

const RARITY_CONFIG = {
  common:    { label: 'Común',     color: 'bg-gray-100',    text: 'text-gray-500',    border: 'border-gray-200'    },
  rare:      { label: 'Raro',      color: 'bg-blue-100',    text: 'text-blue-600',    border: 'border-blue-200'    },
  epic:      { label: 'Épico',     color: 'bg-purple-100',  text: 'text-purple-600',  border: 'border-purple-200'  },
  legendary: { label: 'Legendario',color: 'bg-amber-100',   text: 'text-amber-600',   border: 'border-amber-300'   },
};

interface Props {
  item: RawShopItem;
  owned: boolean;
  equipped?: boolean;
  onBuy: () => Promise<void>;
  loading?: boolean;
}

export function ShopItemCard({ item, owned, equipped, onBuy, loading }: Props) {
  const rarity = RARITY_CONFIG[item.rarity];
  const isEmoji = !item.preview_url.startsWith('http');

  return (
    <View className={`bg-white rounded-2xl border p-3 ${rarity.border} ${equipped ? 'border-2' : ''}`}>
      {/* Preview */}
      <View className={`${rarity.color} rounded-xl h-20 items-center justify-center mb-2`}>
        {isEmoji ? (
          <Text style={{ fontSize: 40 }}>{item.preview_url}</Text>
        ) : (
          <Text className="text-4xl">🎁</Text>
        )}
        {equipped && (
          <View className="absolute top-1 right-1 bg-green-500 rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-white text-xs font-bold">✓</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <Text className="text-xs font-bold text-gray-800 mb-0.5" numberOfLines={1}>{item.name}</Text>

      <View className={`self-start px-1.5 py-0.5 rounded-md ${rarity.color} mb-2`}>
        <Text className={`text-xs font-semibold ${rarity.text}`}>{rarity.label}</Text>
      </View>

      {/* Acción */}
      {owned ? (
        <View className="bg-green-50 rounded-xl py-2 items-center">
          <Text className="text-green-600 text-xs font-bold">{equipped ? '✓ Equipado' : 'En tu vestidor'}</Text>
        </View>
      ) : (
        <Pressable
          onPress={onBuy}
          disabled={loading}
          className="bg-primary-500 rounded-xl py-2 items-center active:bg-primary-600"
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-xs font-bold">
              {item.price_gems != null ? `💎 ${item.price_gems}` : 'Gratis'}
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

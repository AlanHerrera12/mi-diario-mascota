import { useState } from 'react';
import {
  View, Text, FlatList, SafeAreaView, Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { usePetStore } from '../../src/stores/pet.store';
import { useInventory } from '../../src/features/shop/useInventory';
import { useShopItems, useBuyItem, type RawShopItem } from '../../src/features/shop/useShop';
import { ShopItemCard } from '../../src/components/kid-ui/ShopItemCard';
import type { ItemCategory } from '../../src/types';

const CATEGORIES: { key: ItemCategory | 'all'; label: string; emoji: string }[] = [
  { key: 'all',       label: 'Todo',       emoji: '🛍️' },
  { key: 'outfit',    label: 'Ropa',       emoji: '👗' },
  { key: 'accessory', label: 'Accesorios', emoji: '🎀' },
  { key: 'effect',    label: 'Efectos',    emoji: '✨' },
  { key: 'animation', label: 'Bailes',     emoji: '💃' },
];

export default function ShopScreen() {
  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'all'>('all');
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const gemBalance = usePetStore(s => s.gemBalance);
  const { data: allItems = [], isLoading: loadingItems } = useShopItems();
  const { data: inventory = [] } = useInventory();
  const { buyItem } = useBuyItem();

  const ownedIds = new Set(inventory.map(i => i.shop_item_id));
  const equippedIds = new Set(inventory.filter(i => i.equipped).map(i => i.shop_item_id));

  const displayed = activeCategory === 'all'
    ? allItems
    : allItems.filter(item => item.category === activeCategory);

  async function handleBuy(item: RawShopItem) {
    Alert.alert(
      `¿Comprar ${item.name}?`,
      `Cuesta ${item.price_gems} 💎. Tu balance: ${gemBalance} 💎`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Comprar',
          onPress: async () => {
            setBuyingId(item.id);
            const ok = await buyItem(item);
            setBuyingId(null);
            if (ok) Alert.alert('¡Comprado! 🎉', `${item.name} está en tu vestidor.`);
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-accent-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3 bg-white border-b border-gray-100">
        <View>
          <Text className="text-xs text-gray-400">Tienda</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-bold text-gray-900">Mis gemas:</Text>
            <View className="flex-row items-center gap-1 bg-primary-50 rounded-xl px-2 py-0.5">
              <Text className="text-base">💎</Text>
              <Text className="font-bold text-primary-600 text-base">{gemBalance}</Text>
            </View>
          </View>
        </View>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => router.push('/(kid)/wardrobe')}
            className="bg-accent-100 rounded-xl px-3 py-2 active:bg-accent-200"
          >
            <Text className="text-accent-700 font-semibold text-sm">👗 Vestidor</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="bg-gray-100 rounded-xl px-3 py-2 active:bg-gray-200"
          >
            <Text className="text-gray-600 font-semibold text-sm">‹ Volver</Text>
          </Pressable>
        </View>
      </View>

      {/* Categorías */}
      <View className="bg-white border-b border-gray-100">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={c => c.key}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
          renderItem={({ item: cat }) => {
            const isActive = activeCategory === cat.key;
            return (
              <Pressable
                onPress={() => setActiveCategory(cat.key)}
                className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full ${isActive ? 'bg-primary-500' : 'bg-gray-100'}`}
              >
                <Text>{cat.emoji}</Text>
                <Text className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Items */}
      {loadingItems ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FF9800" size="large" />
          <Text className="text-gray-400 mt-3">Cargando tienda…</Text>
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={item => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          ListEmptyComponent={
            <View className="py-16 items-center">
              <Text className="text-5xl mb-3">🏪</Text>
              <Text className="text-gray-500 font-semibold">Nada en esta categoría todavía</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="flex-1">
              <ShopItemCard
                item={item}
                owned={ownedIds.has(item.id)}
                equipped={equippedIds.has(item.id)}
                onBuy={() => handleBuy(item)}
                loading={buyingId === item.id}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

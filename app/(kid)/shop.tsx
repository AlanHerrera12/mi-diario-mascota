import { useState } from 'react';
import {
  View, Text, FlatList, SafeAreaView, Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
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
      `Cuesta ${item.price_gems} ⭐. Tu balance: ${gemBalance} ⭐`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: '¡Comprar!',
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0A2E' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: 'rgba(129,140,248,0.15)',
      }}>
        <View>
          <Text style={{ color: '#818CF8', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
            TIENDA
          </Text>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', marginTop: 2 }}>
            Recompensas 🎁
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Gem balance */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: 'rgba(252,211,77,0.15)',
            borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8,
            borderWidth: 1, borderColor: 'rgba(252,211,77,0.3)',
          }}>
            <Text style={{ fontSize: 16 }}>⭐</Text>
            <Text style={{ color: '#FCD34D', fontWeight: '800', fontSize: 15 }}>{gemBalance}</Text>
          </View>

          {/* Wardrobe */}
          <Pressable
            onPress={() => router.push('/(kid)/wardrobe')}
            style={({ pressed }) => ({
              backgroundColor: pressed ? 'rgba(129,140,248,0.25)' : 'rgba(129,140,248,0.12)',
              borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8,
              borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
            })}
          >
            <Text style={{ color: '#A5B4FC', fontWeight: '700', fontSize: 13 }}>👗 Vestidor</Text>
          </Pressable>

          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              backgroundColor: pressed ? 'rgba(129,140,248,0.25)' : 'rgba(129,140,248,0.12)',
              borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8,
              borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
            })}
          >
            <Text style={{ color: '#A5B4FC', fontWeight: '700', fontSize: 14 }}>‹ Volver</Text>
          </Pressable>
        </View>
      </View>

      {/* Category pills */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={c => c.key}
        style={{ flexGrow: 0, borderBottomWidth: 1, borderBottomColor: 'rgba(129,140,248,0.1)' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        renderItem={({ item: cat }) => {
          const isActive = activeCategory === cat.key;
          return (
            <Pressable
              onPress={() => setActiveCategory(cat.key)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                paddingHorizontal: 14, paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isActive ? '#7C3AED' : 'rgba(129,140,248,0.1)',
                borderWidth: 1,
                borderColor: isActive ? '#8B5CF6' : 'rgba(129,140,248,0.2)',
                shadowColor: isActive ? '#7C3AED' : 'transparent',
                shadowOpacity: 0.4,
                shadowRadius: 6,
                elevation: isActive ? 4 : 0,
              }}
            >
              <Text style={{ fontSize: 14 }}>{cat.emoji}</Text>
              <Text style={{
                fontSize: 13, fontWeight: '700',
                color: isActive ? 'white' : '#818CF8',
              }}>
                {cat.label}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* Items grid */}
      {loadingItems ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <ActivityIndicator color="#8B5CF6" size="large" />
          <Text style={{ color: '#818CF8', fontSize: 14 }}>Cargando tienda…</Text>
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
            <View style={{ paddingVertical: 64, alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 52 }}>🏪</Text>
              <Text style={{ color: '#818CF8', fontWeight: '600', fontSize: 15 }}>
                Nada en esta categoría todavía
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 60).duration(400)}
              style={{ flex: 1 }}
            >
              <ShopItemCard
                item={item}
                owned={ownedIds.has(item.id)}
                equipped={equippedIds.has(item.id)}
                onBuy={() => handleBuy(item)}
                loading={buyingId === item.id}
              />
            </Animated.View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

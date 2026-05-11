import { useState } from 'react';
import {
  View, Text, FlatList, SafeAreaView, Pressable, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { usePetStore } from '../../src/stores/pet.store';
import { PetDisplay } from '../../src/components/kid-ui/PetDisplay';
import { useInventory, useToggleEquip, type RawInventoryItem } from '../../src/features/shop/useInventory';
import type { ItemCategory } from '../../src/types';

const CATEGORY_EMOJI: Record<ItemCategory | string, string> = {
  outfit: '👗', accessory: '🎀', effect: '✨', animation: '💃', species: '🐾',
};

const RARITY_COLOR: Record<string, string> = {
  common: 'bg-gray-100', rare: 'bg-blue-100', epic: 'bg-purple-100', legendary: 'bg-amber-100',
};
const RARITY_TEXT: Record<string, string> = {
  common: 'text-gray-500', rare: 'text-blue-600', epic: 'text-purple-600', legendary: 'text-amber-600',
};

export default function WardrobeScreen() {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const pet = usePetStore(s => s.pet);
  const { data: inventory = [], isLoading } = useInventory();
  const { toggleEquip } = useToggleEquip();

  const equipped = inventory.filter(i => i.equipped);

  async function handleToggle(item: RawInventoryItem) {
    setTogglingId(item.id);
    await toggleEquip(item);
    setTogglingId(null);
  }

  return (
    <SafeAreaView className="flex-1 bg-accent-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3 bg-white border-b border-gray-100">
        <View>
          <Text className="text-xs text-gray-400">Vestidor</Text>
          <Text className="text-lg font-bold text-gray-900">
            {equipped.length > 0 ? `${equipped.length} equipado${equipped.length > 1 ? 's' : ''}` : 'Nada equipado'}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => router.push('/(kid)/shop')}
            className="bg-primary-50 rounded-xl px-3 py-2 active:bg-primary-100"
          >
            <Text className="text-primary-600 font-semibold text-sm">🛍️ Tienda</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="bg-gray-100 rounded-xl px-3 py-2 active:bg-gray-200"
          >
            <Text className="text-gray-600 font-semibold text-sm">‹ Volver</Text>
          </Pressable>
        </View>
      </View>

      {/* Preview de la mascota */}
      {pet && (
        <View className="bg-white py-6 items-center border-b border-gray-100">
          <PetDisplay pet={pet} mood="happy" size={140} />
          <Text className="text-gray-500 text-xs mt-2">
            {equipped.length === 0
              ? 'Tocá un ítem para equiparlo'
              : equipped.map(i => i.shop_items?.preview_url ?? '').join('  ')}
          </Text>
        </View>
      )}

      {/* Lista de inventario */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FF9800" size="large" />
          <Text className="text-gray-400 mt-3">Cargando vestidor…</Text>
        </View>
      ) : inventory.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">🛍️</Text>
          <Text className="text-gray-700 font-bold text-lg text-center">Tu vestidor está vacío</Text>
          <Text className="text-gray-400 text-sm mt-2 text-center">
            Comprá ítems en la tienda con tus gemas para personalizar a {pet?.name ?? 'tu mascota'}.
          </Text>
          <Pressable
            onPress={() => router.push('/(kid)/shop')}
            className="mt-6 bg-primary-500 rounded-2xl px-8 py-4 active:bg-primary-600"
          >
            <Text className="text-white font-bold">Ir a la tienda 🛍️</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => {
            const shopItem = item.shop_items;
            if (!shopItem) return null;
            const isLoading = togglingId === item.id;
            const catEmoji = CATEGORY_EMOJI[shopItem.category] ?? '🎁';
            const rarityBg = RARITY_COLOR[shopItem.rarity] ?? 'bg-gray-100';
            const rarityText = RARITY_TEXT[shopItem.rarity] ?? 'text-gray-500';
            const isEmoji = !shopItem.preview_url.startsWith('http');

            return (
              <Pressable
                onPress={() => handleToggle(item)}
                disabled={isLoading}
                className={`flex-row items-center gap-4 bg-white rounded-2xl p-4 shadow-sm active:bg-gray-50 ${item.equipped ? 'border-2 border-green-400' : ''}`}
              >
                {/* Icono */}
                <View className={`${rarityBg} rounded-xl w-14 h-14 items-center justify-center`}>
                  <Text style={{ fontSize: 30 }}>{isEmoji ? shopItem.preview_url : catEmoji}</Text>
                </View>

                {/* Info */}
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-sm">{shopItem.name}</Text>
                  <Text className={`text-xs font-semibold capitalize ${rarityText}`}>{shopItem.rarity}</Text>
                  <Text className="text-xs text-gray-400 mt-0.5">{catEmoji} {shopItem.category}</Text>
                </View>

                {/* Estado / acción */}
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FF9800" />
                ) : item.equipped ? (
                  <View className="bg-green-100 rounded-xl px-3 py-1.5">
                    <Text className="text-green-700 text-xs font-bold">✓ Equipado</Text>
                  </View>
                ) : (
                  <View className="bg-gray-100 rounded-xl px-3 py-1.5">
                    <Text className="text-gray-500 text-xs font-semibold">Equipar</Text>
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

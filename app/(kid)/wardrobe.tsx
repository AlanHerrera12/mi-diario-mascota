import { useState } from 'react';
import { View, Text, FlatList, SafeAreaView, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { usePetStore } from '../../src/stores/pet.store';
import { playEquipSound } from '../../src/utils/sounds';
import { PetDisplay } from '../../src/components/kid-ui/PetDisplay';
import { useInventory, useToggleEquip, type RawInventoryItem } from '../../src/features/shop/useInventory';
import { DEMO_ITEMS, type RawShopItem } from '../../src/features/shop/useShop';
import type { ItemCategory } from '../../src/types';

const CATEGORY_EMOJI: Record<string, string> = {
  outfit: '👗', accessory: '🎀', effect: '✨', animation: '💃', species: '🐾',
};

const RARITY_CONFIG: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common:    { bg: 'rgba(156,163,175,0.12)', border: 'rgba(156,163,175,0.3)',  text: '#9CA3AF', glow: '#9CA3AF' },
  rare:      { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)',  text: '#60A5FA', glow: '#3B82F6' },
  epic:      { bg: 'rgba(139,92,246,0.15)',  border: 'rgba(139,92,246,0.4)',   text: '#A78BFA', glow: '#8B5CF6' },
  legendary: { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.45)', text: '#FCD34D', glow: '#F59E0B' },
};

// Synthetic demo inventory item
function makeDemoInventoryItem(shopItem: RawShopItem): RawInventoryItem {
  return {
    id: `demo_${shopItem.id}`,
    child_id: '',
    shop_item_id: shopItem.id,
    acquired_at: new Date().toISOString(),
    equipped: false,
    shop_items: shopItem,
  };
}

export default function WardrobeScreen() {
  const pet = usePetStore(s => s.pet);
  const ownedDemoItems = usePetStore(s => s.ownedDemoItems);
  const equippedDemoItems = usePetStore(s => s.equippedDemoItems);
  const toggleDemoEquip = usePetStore(s => s.toggleDemoEquip);
  const { data: realInventory = [], isLoading } = useInventory();
  const { toggleEquip } = useToggleEquip();

  // Merge real DB inventory with locally-purchased demo items
  const demoInventory: RawInventoryItem[] = DEMO_ITEMS
    .filter(item => ownedDemoItems.includes(item.id))
    .map(makeDemoInventoryItem);

  const inventory = [...realInventory, ...demoInventory];

  // For pet preview: real equipped + demo equipped
  const equippedItems = [
    ...realInventory.filter(i => i.equipped),
    ...demoInventory.filter(i => equippedDemoItems.includes(i.shop_item_id)),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0A2E' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: 'rgba(129,140,248,0.15)',
      }}>
        <View>
          <Text style={{ color: '#818CF8', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>VESTIDOR</Text>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '800', marginTop: 2 }}>
            {inventory.length > 0
              ? `${inventory.length} ítem${inventory.length !== 1 ? 's' : ''} 🎁`
              : 'Mi vestidor'}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => router.push('/(kid)/shop')}
            style={({ pressed }) => ({
              backgroundColor: pressed ? 'rgba(129,140,248,0.25)' : 'rgba(129,140,248,0.12)',
              borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8,
              borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
            })}
          >
            <Text style={{ color: '#A5B4FC', fontWeight: '700', fontSize: 13 }}>🛍️ Tienda</Text>
          </Pressable>
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

      {/* Pet preview */}
      {pet && (
        <View style={{
          alignItems: 'center', paddingVertical: 20,
          borderBottomWidth: 1, borderBottomColor: 'rgba(129,140,248,0.12)',
        }}>
          <View style={{
            backgroundColor: '#1E1B4B', borderRadius: 80,
            width: 140, height: 140,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: 'rgba(167,139,250,0.3)',
            shadowColor: '#7C3AED', shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
          }}>
            <PetDisplay pet={pet} mood="happy" size={120} />
          </View>
          <Text style={{ color: '#818CF8', fontSize: 12, marginTop: 10 }}>
            {equippedItems.length === 0
              ? 'Tocá un ítem para equiparlo'
              : `${equippedItems.length} ítem${equippedItems.length !== 1 ? 's' : ''} equipado${equippedItems.length !== 1 ? 's' : ''} ✓`}
          </Text>
        </View>
      )}

      {/* Inventory list */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <ActivityIndicator color="#8B5CF6" size="large" />
          <Text style={{ color: '#818CF8', fontSize: 14 }}>Cargando vestidor…</Text>
        </View>
      ) : inventory.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Text style={{ fontSize: 56, marginBottom: 16 }}>🛍️</Text>
          <Text style={{ color: 'white', fontWeight: '800', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
            Tu vestidor está vacío
          </Text>
          <Text style={{ color: '#818CF8', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 }}>
            Comprá ítems en la tienda con tus ⭐ para personalizar a {pet?.name ?? 'tu mascota'}.
          </Text>
          <Pressable
            onPress={() => router.push('/(kid)/shop')}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#5B21B6' : '#7C3AED',
              borderRadius: 20, paddingHorizontal: 28, paddingVertical: 14,
              shadowColor: '#7C3AED', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5,
            })}
          >
            <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>Ir a la tienda 🛍️</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item, index }) => {
            const shopItem = item.shop_items;
            if (!shopItem) return null;
            const isDemo = item.id.startsWith('demo_');
            const isDemoEquipped = isDemo && equippedDemoItems.includes(item.shop_item_id);
            const isEquipped = isDemo ? isDemoEquipped : item.equipped;
            const r = RARITY_CONFIG[shopItem.rarity] ?? RARITY_CONFIG.common;
            const catEmoji = CATEGORY_EMOJI[shopItem.category] ?? '🎁';
            const isEmoji = !shopItem.preview_url.startsWith('http');

            return (
              <Animated.View entering={FadeInDown.delay(index * 40).duration(350)}>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 14,
                  backgroundColor: isEquipped ? 'rgba(52,211,153,0.1)' : r.bg,
                  borderRadius: 18, padding: 14,
                  borderWidth: isEquipped ? 2 : 1,
                  borderColor: isEquipped ? 'rgba(52,211,153,0.5)' : r.border,
                  shadowColor: isEquipped ? '#10B981' : r.glow,
                  shadowOpacity: isEquipped ? 0.4 : 0.15,
                  shadowRadius: isEquipped ? 10 : 4,
                  elevation: isEquipped ? 5 : 2,
                }}>
                  {/* Icon */}
                  <View style={{
                    width: 58, height: 58, borderRadius: 16,
                    backgroundColor: `${r.glow}18`,
                    borderWidth: 1, borderColor: r.border,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 32 }}>{isEmoji ? shopItem.preview_url : catEmoji}</Text>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'white', fontWeight: '800', fontSize: 14, marginBottom: 3 }}>
                      {shopItem.name}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                      <View style={{
                        backgroundColor: `${r.glow}20`, borderRadius: 8,
                        paddingHorizontal: 7, paddingVertical: 2,
                        borderWidth: 1, borderColor: `${r.glow}30`,
                      }}>
                        <Text style={{ color: r.text, fontSize: 10, fontWeight: '700' }}>
                          {shopItem.rarity}
                        </Text>
                      </View>
                      <View style={{
                        backgroundColor: 'rgba(129,140,248,0.12)', borderRadius: 8,
                        paddingHorizontal: 7, paddingVertical: 2,
                        borderWidth: 1, borderColor: 'rgba(129,140,248,0.2)',
                      }}>
                        <Text style={{ color: '#818CF8', fontSize: 10, fontWeight: '600' }}>
                          {catEmoji} {shopItem.category}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Equip button */}
                  <Pressable
                    onPress={() => {
                      playEquipSound();
                      if (isDemo) {
                        toggleDemoEquip(item.shop_item_id);
                      } else {
                        toggleEquip(item);
                      }
                    }}
                    style={({ pressed }) => ({
                      backgroundColor: isEquipped
                        ? pressed ? 'rgba(16,185,129,0.35)' : 'rgba(52,211,153,0.2)'
                        : pressed ? 'rgba(129,140,248,0.25)' : 'rgba(129,140,248,0.12)',
                      borderRadius: 12,
                      paddingHorizontal: 10, paddingVertical: 6,
                      borderWidth: 1,
                      borderColor: isEquipped ? 'rgba(52,211,153,0.4)' : 'rgba(129,140,248,0.2)',
                    })}
                  >
                    <Text style={{
                      color: isEquipped ? '#34D399' : '#818CF8',
                      fontSize: 11, fontWeight: '800',
                    }}>
                      {isEquipped ? '✓ Equipado' : 'Equipar'}
                    </Text>
                  </Pressable>
                </View>
              </Animated.View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

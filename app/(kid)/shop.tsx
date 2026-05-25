import { useState } from 'react';
import {
  View, Text, FlatList, SafeAreaView, Pressable,
  ActivityIndicator, Modal, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn, SlideInDown } from 'react-native-reanimated';
import { usePetStore } from '../../src/stores/pet.store';
import { useInventory } from '../../src/features/shop/useInventory';
import { useShopItems, useBuyItem, type RawShopItem } from '../../src/features/shop/useShop';
import { ShopItemCard } from '../../src/components/kid-ui/ShopItemCard';
import type { ItemCategory } from '../../src/types';

const CATEGORIES: { key: ItemCategory | 'all'; label: string; emoji: string }[] = [
  { key: 'all',       label: 'Todo',       emoji: '🛍️' },
  { key: 'species',   label: 'Mascotas',   emoji: '🐾' },
  { key: 'outfit',    label: 'Ropa',       emoji: '👗' },
  { key: 'accessory', label: 'Accesorios', emoji: '🎀' },
  { key: 'effect',    label: 'Efectos',    emoji: '✨' },
  { key: 'animation', label: 'Bailes',     emoji: '💃' },
];

const RARITY_GLOW: Record<string, string> = {
  common: '#9CA3AF',
  rare: '#60A5FA',
  epic: '#A78BFA',
  legendary: '#FCD34D',
};

// ---------- Preview Modal ----------
function PreviewModal({
  item,
  owned,
  gemBalance,
  onClose,
  onBuy,
  buying,
}: {
  item: RawShopItem;
  owned: boolean;
  gemBalance: number;
  onClose: () => void;
  onBuy: () => void;
  buying: boolean;
}) {
  const canAfford = gemBalance >= (item.price_gems ?? 0);
  const glow = RARITY_GLOW[item.rarity] ?? '#9CA3AF';

  const rarityLabel: Record<string, string> = {
    common: 'Común',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Legendario',
  };

  const categoryLabel: Record<string, string> = {
    outfit: '👗 Ropa',
    accessory: '🎀 Accesorio',
    effect: '✨ Efecto',
    animation: '💃 Baile',
    species: '🐾 Nueva mascota',
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Animated.View
          entering={SlideInDown.duration(350)}
          style={{
            backgroundColor: '#1A0A3E',
            borderTopLeftRadius: 32, borderTopRightRadius: 32,
            padding: 28, paddingBottom: 40,
            borderWidth: 1, borderColor: `${glow}33`,
          }}
        >
          {/* Glow blob */}
          <View style={{
            position: 'absolute', top: -30, right: 20,
            width: 100, height: 100, borderRadius: 50,
            backgroundColor: glow, opacity: 0.15,
          }} />

          {/* Handle */}
          <View style={{ width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, alignSelf: 'center', marginBottom: 24 }} />

          {/* Big preview */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{
              width: 120, height: 120, borderRadius: 30,
              backgroundColor: `${glow}18`,
              borderWidth: 2, borderColor: `${glow}44`,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: glow, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 64 }}>{item.preview_url}</Text>
            </View>

            <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', textAlign: 'center' }}>
              {item.name}
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <View style={{
                backgroundColor: `${glow}20`, borderRadius: 10,
                paddingHorizontal: 10, paddingVertical: 4,
                borderWidth: 1, borderColor: `${glow}40`,
              }}>
                <Text style={{ color: glow, fontSize: 12, fontWeight: '700' }}>
                  {rarityLabel[item.rarity]}
                </Text>
              </View>
              <View style={{
                backgroundColor: 'rgba(129,140,248,0.15)', borderRadius: 10,
                paddingHorizontal: 10, paddingVertical: 4,
                borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
              }}>
                <Text style={{ color: '#A5B4FC', fontSize: 12, fontWeight: '700' }}>
                  {categoryLabel[item.category] ?? item.category}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text style={{ color: '#A5B4FC', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 }}>
            {item.description}
          </Text>

          {/* Pet adoption notice */}
          {item.category === 'species' && (
            <View style={{
              backgroundColor: 'rgba(236,72,153,0.12)',
              borderRadius: 14, padding: 12, marginBottom: 20,
              borderWidth: 1, borderColor: 'rgba(236,72,153,0.25)',
            }}>
              <Text style={{ color: '#F9A8D4', fontSize: 13, textAlign: 'center', lineHeight: 18 }}>
                🐾 ¡Al comprar esta mascota podrás adoptarla y reemplazar la que tenés ahora!
              </Text>
            </View>
          )}

          {/* Price + action */}
          {owned ? (
            <View style={{
              backgroundColor: 'rgba(16,185,129,0.15)',
              borderRadius: 20, paddingVertical: 18, alignItems: 'center',
              borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)',
            }}>
              <Text style={{ color: '#34D399', fontSize: 17, fontWeight: '800' }}>
                ✓ Ya lo tenés en tu vestidor
              </Text>
            </View>
          ) : (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                <Text style={{ color: '#818CF8', fontSize: 14 }}>Precio:</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                  backgroundColor: 'rgba(252,211,77,0.15)',
                  borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6,
                  borderWidth: 1, borderColor: 'rgba(252,211,77,0.3)',
                }}>
                  <Text style={{ fontSize: 18 }}>⭐</Text>
                  <Text style={{ color: '#FCD34D', fontWeight: '800', fontSize: 20 }}>
                    {item.price_gems ?? 'Gratis'}
                  </Text>
                </View>
                {!canAfford && (
                  <Text style={{ color: '#F87171', fontSize: 12 }}>
                    (faltan {(item.price_gems ?? 0) - gemBalance} ⭐)
                  </Text>
                )}
              </View>

              <Pressable
                onPress={onBuy}
                disabled={!canAfford || buying}
                style={({ pressed }) => ({
                  backgroundColor: !canAfford
                    ? 'rgba(255,255,255,0.08)'
                    : pressed ? '#5B21B6' : '#7C3AED',
                  borderRadius: 20, paddingVertical: 18, alignItems: 'center',
                  shadowColor: canAfford ? '#7C3AED' : 'transparent',
                  shadowOpacity: 0.5, shadowRadius: 12, elevation: canAfford ? 6 : 0,
                })}
              >
                {buying ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{
                    color: canAfford ? 'white' : 'rgba(255,255,255,0.35)',
                    fontSize: 17, fontWeight: '800',
                  }}>
                    {canAfford ? '¡Comprar ahora!' : 'Gemas insuficientes'}
                  </Text>
                )}
              </Pressable>
            </>
          )}

          <Pressable onPress={onClose} style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={{ color: '#818CF8', fontSize: 14 }}>Cancelar</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// ---------- Main Screen ----------
export default function ShopScreen() {
  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'all'>('all');
  const [preview, setPreview] = useState<RawShopItem | null>(null);
  const [buying, setBuying] = useState(false);

  const gemBalance = usePetStore(s => s.gemBalance);
  const ownedDemoItems = usePetStore(s => s.ownedDemoItems);
  const { data: allItems = [], isLoading: loadingItems } = useShopItems();
  const { data: inventory = [] } = useInventory();
  const { buyItem } = useBuyItem();

  // Merge real inventory + demo-purchased items
  const ownedIds = new Set([
    ...inventory.map(i => i.shop_item_id),
    ...ownedDemoItems,
  ]);

  const equippedIds = new Set(inventory.filter(i => i.equipped).map(i => i.shop_item_id));

  const displayed = activeCategory === 'all'
    ? allItems
    : allItems.filter(item => item.category === activeCategory);

  async function handleBuy() {
    if (!preview) return;
    setBuying(true);
    const ok = await buyItem(preview);
    setBuying(false);
    if (ok) {
      setPreview(null);
    }
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
          <Text style={{ color: '#818CF8', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>TIENDA</Text>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', marginTop: 2 }}>Recompensas 🎁</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: 'rgba(252,211,77,0.15)',
            borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8,
            borderWidth: 1, borderColor: 'rgba(252,211,77,0.3)',
          }}>
            <Text style={{ fontSize: 16 }}>⭐</Text>
            <Text style={{ color: '#FCD34D', fontWeight: '800', fontSize: 15 }}>{gemBalance}</Text>
          </View>

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
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                backgroundColor: isActive
                  ? (cat.key === 'species' ? '#BE185D' : '#7C3AED')
                  : 'rgba(129,140,248,0.1)',
                borderWidth: 1,
                borderColor: isActive
                  ? (cat.key === 'species' ? '#EC4899' : '#8B5CF6')
                  : 'rgba(129,140,248,0.2)',
                shadowColor: isActive ? (cat.key === 'species' ? '#EC4899' : '#7C3AED') : 'transparent',
                shadowOpacity: 0.4, shadowRadius: 6, elevation: isActive ? 4 : 0,
              }}
            >
              <Text style={{ fontSize: 14 }}>{cat.emoji}</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: isActive ? 'white' : '#818CF8' }}>
                {cat.label}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* Pet adoption banner */}
      {activeCategory === 'species' && (
        <Animated.View
          entering={FadeIn.duration(400)}
          style={{
            marginHorizontal: 16, marginTop: 12,
            backgroundColor: 'rgba(236,72,153,0.1)',
            borderRadius: 16, padding: 14,
            borderWidth: 1, borderColor: 'rgba(236,72,153,0.25)',
          }}
        >
          <Text style={{ color: '#F9A8D4', fontSize: 13, textAlign: 'center', lineHeight: 18 }}>
            🐾 ¡Comprá una nueva mascota y adoptala! Podés cambiar cuando quieras.
          </Text>
        </Animated.View>
      )}

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
              entering={FadeInDown.delay(index * 50).duration(400)}
              style={{ flex: 1 }}
            >
              {/* Tap whole card to preview */}
              <Pressable onPress={() => setPreview(item)} style={{ flex: 1 }}>
                <ShopItemCard
                  item={item}
                  owned={ownedIds.has(item.id)}
                  equipped={equippedIds.has(item.id)}
                  onBuy={async () => { setPreview(item); }}
                  loading={false}
                />
              </Pressable>
            </Animated.View>
          )}
        />
      )}

      {/* Preview modal */}
      {preview && (
        <PreviewModal
          item={preview}
          owned={ownedIds.has(preview.id)}
          gemBalance={gemBalance}
          onClose={() => setPreview(null)}
          onBuy={handleBuy}
          buying={buying}
        />
      )}
    </SafeAreaView>
  );
}

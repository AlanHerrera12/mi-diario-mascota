import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';
import { usePetStore } from '../../stores/pet.store';
import type { ItemCategory } from '../../types';

export interface RawShopItem {
  id: string;
  category: ItemCategory;
  name: string;
  description: string;
  price_gems: number | null;
  price_real_cents: number | null;
  is_premium_only: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  asset_url: string;
  preview_url: string;
  available_from: string | null;
  available_until: string | null;
}

// Fallback items shown when the shop_items table is empty (before DB seed runs)
const DEMO_ITEMS: RawShopItem[] = [
  { id: 'd1', category: 'outfit',     name: 'Sombrero de explorador', description: 'Un sombrero perfecto para aventureros',   price_gems: 50,   price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '🎩', preview_url: '🎩', available_from: null, available_until: null },
  { id: 'd2', category: 'outfit',     name: 'Capa de superhéroe',     description: 'Vuela con estilo',                          price_gems: 80,   price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '🦸', preview_url: '🦸', available_from: null, available_until: null },
  { id: 'd3', category: 'outfit',     name: 'Corona dorada',          description: 'Para la mascota más real del reino',        price_gems: 150,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '👑', preview_url: '👑', available_from: null, available_until: null },
  { id: 'd4', category: 'outfit',     name: 'Traje de astronauta',    description: 'Listo para explorar el espacio',            price_gems: 200,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '🚀', preview_url: '🚀', available_from: null, available_until: null },
  { id: 'd5', category: 'outfit',     name: 'Armadura épica',         description: 'Protección máxima y estilo total',          price_gems: 400,  price_real_cents: null, is_premium_only: false, rarity: 'epic',      asset_url: '🛡️', preview_url: '🛡️', available_from: null, available_until: null },
  { id: 'd6', category: 'outfit',     name: 'Traje legendario',       description: 'Solo para los más valientes',               price_gems: 1000, price_real_cents: null, is_premium_only: false, rarity: 'legendary', asset_url: '✨', preview_url: '✨', available_from: null, available_until: null },
  { id: 'd7', category: 'accessory',  name: 'Collar de flores',       description: 'Colorido y alegre',                         price_gems: 30,   price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '🌸', preview_url: '🌸', available_from: null, available_until: null },
  { id: 'd8', category: 'accessory',  name: 'Gafas de sol',           description: 'Cool total',                                price_gems: 40,   price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '🕶️', preview_url: '🕶️', available_from: null, available_until: null },
  { id: 'd9', category: 'accessory',  name: 'Alas de mariposa',       description: 'Revolotea con gracia',                      price_gems: 120,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '🦋', preview_url: '🦋', available_from: null, available_until: null },
  { id: 'd10', category: 'accessory', name: 'Arco iris en la cola',   description: 'Un toque mágico',                           price_gems: 250,  price_real_cents: null, is_premium_only: false, rarity: 'epic',      asset_url: '🌈', preview_url: '🌈', available_from: null, available_until: null },
  { id: 'd11', category: 'accessory', name: 'Halo brillante',         description: 'Brilla con luz propia',                     price_gems: 600,  price_real_cents: null, is_premium_only: false, rarity: 'legendary', asset_url: '😇', preview_url: '😇', available_from: null, available_until: null },
  { id: 'd12', category: 'effect',    name: 'Destellos de estrellas', description: 'Dejá un rastro de estrellas al moverte',    price_gems: 80,   price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '⭐', preview_url: '⭐', available_from: null, available_until: null },
  { id: 'd13', category: 'effect',    name: 'Corazones flotantes',    description: 'Tu mascota irradia amor',                   price_gems: 160,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '💖', preview_url: '💖', available_from: null, available_until: null },
  { id: 'd14', category: 'effect',    name: 'Aura de fuego',          description: 'Efectos de llamas épicas',                  price_gems: 500,  price_real_cents: null, is_premium_only: false, rarity: 'epic',      asset_url: '🔥', preview_url: '🔥', available_from: null, available_until: null },
  { id: 'd15', category: 'effect',    name: 'Aura legendaria',        description: 'Magia pura en cada movimiento',             price_gems: 900,  price_real_cents: null, is_premium_only: false, rarity: 'legendary', asset_url: '🌟', preview_url: '🌟', available_from: null, available_until: null },
  { id: 'd16', category: 'animation', name: 'Baile feliz',            description: 'Tu mascota baila de alegría',               price_gems: 100,  price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '💃', preview_url: '💃', available_from: null, available_until: null },
  { id: 'd17', category: 'animation', name: 'Vuelta de campana',      description: 'Un giro impresionante',                     price_gems: 200,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '🌀', preview_url: '🌀', available_from: null, available_until: null },
  { id: 'd18', category: 'animation', name: 'Baile épico',            description: 'La rutina de baile más cool',               price_gems: 500,  price_real_cents: null, is_premium_only: false, rarity: 'epic',      asset_url: '🕺', preview_url: '🕺', available_from: null, available_until: null },
];

export function useShopItems(category?: ItemCategory) {
  return useQuery({
    queryKey: ['shop-items', category ?? 'all'],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      let query = supabase
        .from('shop_items')
        .select('*')
        .order('price_gems', { ascending: true });
      if (category) query = query.eq('category', category);
      const { data, error } = await query;
      if (error) throw error;
      // Use demo items when the DB table hasn't been seeded yet
      const items = (data ?? []) as RawShopItem[];
      return items.length > 0 ? items : DEMO_ITEMS;
    },
  });
}

export function useBuyItem() {
  const child = useAuthStore(s => s.activeChild);
  const { gemBalance, setGemBalance } = usePetStore();
  const queryClient = useQueryClient();

  async function buyItem(item: RawShopItem): Promise<boolean> {
    if (!child) return false;
    const price = item.price_gems ?? 0;

    if (gemBalance < price) {
      Alert.alert('Gemas insuficientes', `Necesitás ${price} 💎 para comprar este artículo.`);
      return false;
    }

    // Verificar que no lo tenga ya
    const { data: existing } = await supabase
      .from('child_inventory')
      .select('id')
      .eq('child_id', child.id)
      .eq('shop_item_id', item.id)
      .maybeSingle();
    if (existing) {
      Alert.alert('Ya lo tenés', 'Este artículo ya está en tu vestidor.');
      return false;
    }

    // Descontar gemas (transacción negativa)
    const { error: gemError } = await supabase
      .from('gem_transactions')
      .insert({ child_id: child.id, amount: -price, reason: 'shop_buy', metadata: { item_id: item.id } });
    if (gemError) {
      Alert.alert('Error', 'No se pudo completar la compra.');
      return false;
    }

    // Agregar al inventario
    const { error: invError } = await supabase
      .from('child_inventory')
      .insert({ child_id: child.id, shop_item_id: item.id });
    if (invError) {
      // Revertir la transacción de gemas si falla
      await supabase.from('gem_transactions').insert({
        child_id: child.id, amount: price, reason: 'purchase', metadata: { refund_item_id: item.id },
      });
      Alert.alert('Error', 'No se pudo agregar el artículo al vestidor.');
      return false;
    }

    setGemBalance(gemBalance - price);
    queryClient.invalidateQueries({ queryKey: ['inventory', child.id] });
    return true;
  }

  return { buyItem };
}

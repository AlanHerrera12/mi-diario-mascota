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
      return (data ?? []) as RawShopItem[];
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

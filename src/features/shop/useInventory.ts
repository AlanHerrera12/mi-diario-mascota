import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';
import { usePetStore } from '../../stores/pet.store';
import type { RawShopItem } from './useShop';

export interface RawInventoryItem {
  id: string;
  child_id: string;
  shop_item_id: string;
  acquired_at: string;
  equipped: boolean;
  shop_items: RawShopItem;
}

export function useInventory() {
  const child = useAuthStore(s => s.activeChild);

  return useQuery({
    queryKey: ['inventory', child?.id],
    enabled: !!child?.id,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('child_inventory')
        .select('*, shop_items(*)')
        .eq('child_id', child!.id)
        .order('acquired_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as RawInventoryItem[];
    },
  });
}

export function useToggleEquip() {
  const child = useAuthStore(s => s.activeChild);
  const pet = usePetStore(s => s.pet);
  const setEquippedItems = usePetStore(s => s.setEquippedItems);
  const queryClient = useQueryClient();

  async function toggleEquip(inventoryItem: RawInventoryItem): Promise<void> {
    if (!child || !pet) return;
    const newEquipped = !inventoryItem.equipped;

    // Optimistic local update
    const currentEquipped = pet.customization.equippedItems ?? [];
    const itemId = inventoryItem.shop_item_id;
    const newEquippedList = newEquipped
      ? [...currentEquipped, itemId]
      : currentEquipped.filter(id => id !== itemId);
    setEquippedItems(newEquippedList);

    // Update inventory row
    await supabase
      .from('child_inventory')
      .update({ equipped: newEquipped })
      .eq('id', inventoryItem.id);

    // Sync pet customization in DB
    await supabase
      .from('pets')
      .update({ customization: { ...pet.customization, equippedItems: newEquippedList } })
      .eq('id', pet.id);

    queryClient.invalidateQueries({ queryKey: ['inventory', child.id] });
  }

  return { toggleEquip };
}

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
  // species items only
  species_key?: string;
}

// Fallback items when shop_items DB table is empty
export const DEMO_ITEMS: RawShopItem[] = [
  // Outfits
  { id: 'd1',  category: 'outfit',    name: 'Sombrero explorador', description: 'Un sombrero perfecto para aventureros',     price_gems: 50,   price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '🎩', preview_url: '🎩', available_from: null, available_until: null },
  { id: 'd2',  category: 'outfit',    name: 'Capa de superhéroe',  description: 'Vuela con estilo',                          price_gems: 80,   price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '🦸', preview_url: '🦸', available_from: null, available_until: null },
  { id: 'd3',  category: 'outfit',    name: 'Corona dorada',       description: 'Para la mascota más real del reino',        price_gems: 150,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '👑', preview_url: '👑', available_from: null, available_until: null },
  { id: 'd4',  category: 'outfit',    name: 'Traje astronauta',    description: 'Listo para explorar el espacio',            price_gems: 200,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '🚀', preview_url: '🚀', available_from: null, available_until: null },
  { id: 'd5',  category: 'outfit',    name: 'Armadura épica',      description: 'Protección máxima y estilo total',          price_gems: 400,  price_real_cents: null, is_premium_only: false, rarity: 'epic',      asset_url: '🛡️', preview_url: '🛡️', available_from: null, available_until: null },
  { id: 'd6',  category: 'outfit',    name: 'Traje legendario',    description: 'Solo para los más valientes',               price_gems: 1000, price_real_cents: null, is_premium_only: false, rarity: 'legendary', asset_url: '✨', preview_url: '✨', available_from: null, available_until: null },
  // Accessories
  { id: 'd7',  category: 'accessory', name: 'Collar de flores',    description: 'Colorido y alegre',                         price_gems: 30,   price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '🌸', preview_url: '🌸', available_from: null, available_until: null },
  { id: 'd8',  category: 'accessory', name: 'Gafas de sol',        description: 'Cool total',                                price_gems: 40,   price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '🕶️', preview_url: '🕶️', available_from: null, available_until: null },
  { id: 'd9',  category: 'accessory', name: 'Alas de mariposa',    description: 'Revolotea con gracia',                      price_gems: 120,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '🦋', preview_url: '🦋', available_from: null, available_until: null },
  { id: 'd10', category: 'accessory', name: 'Arco iris en la cola',description: 'Un toque mágico',                           price_gems: 250,  price_real_cents: null, is_premium_only: false, rarity: 'epic',      asset_url: '🌈', preview_url: '🌈', available_from: null, available_until: null },
  { id: 'd11', category: 'accessory', name: 'Halo brillante',      description: 'Brilla con luz propia',                     price_gems: 600,  price_real_cents: null, is_premium_only: false, rarity: 'legendary', asset_url: '😇', preview_url: '😇', available_from: null, available_until: null },
  // Effects
  { id: 'd12', category: 'effect',    name: 'Destellos de estrellas',description: 'Dejá un rastro de estrellas al moverte', price_gems: 80,   price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '⭐', preview_url: '⭐', available_from: null, available_until: null },
  { id: 'd13', category: 'effect',    name: 'Corazones flotantes', description: 'Tu mascota irradia amor',                   price_gems: 160,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '💖', preview_url: '💖', available_from: null, available_until: null },
  { id: 'd14', category: 'effect',    name: 'Aura de fuego',       description: 'Efectos de llamas épicas',                  price_gems: 500,  price_real_cents: null, is_premium_only: false, rarity: 'epic',      asset_url: '🔥', preview_url: '🔥', available_from: null, available_until: null },
  { id: 'd15', category: 'effect',    name: 'Aura legendaria',     description: 'Magia pura en cada movimiento',             price_gems: 900,  price_real_cents: null, is_premium_only: false, rarity: 'legendary', asset_url: '🌟', preview_url: '🌟', available_from: null, available_until: null },
  // Animations
  { id: 'd16', category: 'animation', name: 'Baile feliz',         description: 'Tu mascota baila de alegría',               price_gems: 100,  price_real_cents: null, is_premium_only: false, rarity: 'common',    asset_url: '💃', preview_url: '💃', available_from: null, available_until: null },
  { id: 'd17', category: 'animation', name: 'Vuelta de campana',   description: 'Un giro impresionante',                     price_gems: 200,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '🌀', preview_url: '🌀', available_from: null, available_until: null },
  { id: 'd18', category: 'animation', name: 'Baile épico',         description: 'La rutina de baile más cool',               price_gems: 500,  price_real_cents: null, is_premium_only: false, rarity: 'epic',      asset_url: '🕺', preview_url: '🕺', available_from: null, available_until: null },
  // New pets (species)
  { id: 'p1',  category: 'species',   name: 'Gata cósmica',        description: '¡Una gata de las estrellas! Elegante y misteriosa.',  price_gems: 300,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '🐱', preview_url: '🐱', available_from: null, available_until: null, species_key: 'cat'     },
  { id: 'p2',  category: 'species',   name: 'Dragón místico',      description: '¡Poderoso y mágico! Escupe chispas de colores.',       price_gems: 800,  price_real_cents: null, is_premium_only: false, rarity: 'legendary', asset_url: '🐲', preview_url: '🐲', available_from: null, available_until: null, species_key: 'dragon'  },
  { id: 'p3',  category: 'species',   name: 'Conejo lunar',        description: 'Suave como la luna. Salta muy alto.',                  price_gems: 250,  price_real_cents: null, is_premium_only: false, rarity: 'rare',      asset_url: '🐰', preview_url: '🐰', available_from: null, available_until: null, species_key: 'rabbit'  },
  { id: 'p4',  category: 'species',   name: 'Oso polar mágico',    description: 'Peludo y adorable. Genera copos de nieve.',            price_gems: 400,  price_real_cents: null, is_premium_only: false, rarity: 'epic',      asset_url: '🐻', preview_url: '🐻', available_from: null, available_until: null, species_key: 'bear'    },
  { id: 'p5',  category: 'species',   name: 'Unicornio mágico',    description: 'Puro arco iris y destellos. El más legendario de todos.',price_gems: 1200, price_real_cents: null, is_premium_only: false, rarity: 'legendary', asset_url: '🦄', preview_url: '🦄', available_from: null, available_until: null, species_key: 'unicorn' },
  { id: 'p6',  category: 'species',   name: 'Perrito galáctico',   description: 'Como tu perro, ¡pero del espacio exterior!',           price_gems: 350,  price_real_cents: null, is_premium_only: false, rarity: 'epic',      asset_url: '🐶', preview_url: '🐶', available_from: null, available_until: null, species_key: 'dog'     },
];

function isDemoItem(id: string) {
  return id.startsWith('d') || id.startsWith('p');
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
      Alert.alert(
        'Gemas insuficientes 😔',
        `Necesitás ${price} ⭐ para comprar esto.\nTenés ${gemBalance} ⭐.\n\n¡Hablá con tu mascota para ganar más!`,
      );
      return false;
    }

    // Demo items: handle locally without Supabase FK constraints
    if (isDemoItem(item.id)) {
      const ownedDemos = usePetStore.getState().ownedDemoItems;
      if (ownedDemos.includes(item.id)) {
        Alert.alert('Ya lo tenés', 'Este artículo ya está en tu vestidor.');
        return false;
      }
      // Deduct gems locally
      usePetStore.getState().setGemBalance(gemBalance - price);
      usePetStore.getState().addDemoItem(item.id);

      // If it's a pet, offer adoption
      if (item.category === 'species' && item.species_key) {
        handlePetAdoption(item);
      }

      return true;
    }

    // Real DB items
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

    const { error: gemError } = await supabase
      .from('gem_transactions')
      .insert({ child_id: child.id, amount: -price, reason: 'shop_buy', metadata: { item_id: item.id } });
    if (gemError) {
      Alert.alert('Error', 'No se pudo completar la compra.');
      return false;
    }

    const { error: invError } = await supabase
      .from('child_inventory')
      .insert({ child_id: child.id, shop_item_id: item.id });
    if (invError) {
      await supabase.from('gem_transactions').insert({
        child_id: child.id, amount: price, reason: 'purchase', metadata: { refund_item_id: item.id },
      });
      Alert.alert('Error', 'No se pudo agregar el artículo al vestidor.');
      return false;
    }

    setGemBalance(gemBalance - price);
    queryClient.invalidateQueries({ queryKey: ['inventory', child.id] });

    if (item.category === 'species' && item.species_key) {
      handlePetAdoption(item);
    }

    return true;
  }

  function handlePetAdoption(item: RawShopItem) {
    Alert.alert(
      `¡${item.preview_url} ${item.name} adoptado!`,
      '¿Querés cambiar tu mascota a la nueva ahora?',
      [
        { text: 'Después', style: 'cancel' },
        {
          text: '¡Sí, adoptar ahora!',
          onPress: async () => {
            const store = usePetStore.getState();
            const pet = store.pet;
            if (!pet || !item.species_key) return;

            const updatedPet = { ...pet, species: item.species_key as any };
            store.setPet(updatedPet);

            // Persist to DB if not demo child
            await supabase
              .from('pets')
              .update({ species: item.species_key })
              .eq('id', pet.id);
          },
        },
      ],
    );
  }

  return { buyItem };
}

import { useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';
import { usePetStore } from '../../stores/pet.store';
import { GEMS } from '../../constants';
import type { GemReason } from '../../types';

export function useGems() {
  const child = useAuthStore(s => s.activeChild);
  const { gemBalance, addGems } = usePetStore();

  const loadBalance = useCallback(async () => {
    if (!child) return;
    const { data } = await supabase
      .from('gem_transactions')
      .select('amount')
      .eq('child_id', child.id);
    if (data) {
      const total = data.reduce((acc, t) => acc + t.amount, 0);
      usePetStore.getState().setGemBalance(total);
    }
  }, [child]);

  const awardGems = useCallback(async (
    reason: GemReason,
    metadata: Record<string, unknown> = {},
  ): Promise<number> => {
    if (!child) return 0;

    const amounts: Record<GemReason, number> = {
      daily_talk:   GEMS.DAILY_TALK,
      streak_bonus: GEMS.STREAK_7_DAYS,
      daily_task:   GEMS.DAILY_TASK,
      purchase:     0,
      shop_buy:     0,
    };
    const amount = amounts[reason] ?? 0;
    if (amount === 0) return 0;

    await supabase.from('gem_transactions').insert({
      child_id: child.id,
      amount,
      reason,
      metadata,
    });

    addGems(amount);
    return amount;
  }, [child]);

  return { gemBalance, loadBalance, awardGems };
}

import { useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';
import { usePetStore } from '../../stores/pet.store';
import { GEMS, STREAK_MILESTONES } from '../../constants';

function todayDate() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function yesterdayDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function useStreak() {
  const child = useAuthStore(s => s.activeChild);
  const { currentStreak, setStreak } = usePetStore();

  const loadStreak = useCallback(async () => {
    if (!child) return;
    const { data } = await supabase
      .from('streaks')
      .select('current_streak, longest_streak, last_talk_date')
      .eq('child_id', child.id)
      .single();
    if (data) setStreak(data.current_streak);
  }, [child]);

  // Devuelve las gemas de bonus ganadas por racha (0 si no hay milestone)
  const recordTalk = useCallback(async (): Promise<{ newStreak: number; bonusGems: number }> => {
    if (!child) return { newStreak: 0, bonusGems: 0 };

    const { data: existing } = await supabase
      .from('streaks')
      .select('current_streak, longest_streak, last_talk_date')
      .eq('child_id', child.id)
      .single();

    if (!existing) return { newStreak: 0, bonusGems: 0 };

    const today = todayDate();
    if (existing.last_talk_date === today) {
      // Ya habló hoy — no sumar racha ni gemas
      return { newStreak: existing.current_streak, bonusGems: 0 };
    }

    const isConsecutive = existing.last_talk_date === yesterdayDate();
    const newStreak = isConsecutive ? existing.current_streak + 1 : 1;
    const longest = Math.max(newStreak, existing.longest_streak);

    await supabase
      .from('streaks')
      .update({ current_streak: newStreak, longest_streak: longest, last_talk_date: today })
      .eq('child_id', child.id);

    setStreak(newStreak);

    // Calcular bonus de gemas por milestone de racha
    let bonusGems = 0;
    if (newStreak === 7 || newStreak === 14 || newStreak === 30 ||
        newStreak === 60 || newStreak === 100) {
      bonusGems = newStreak >= 30 ? GEMS.STREAK_30_DAYS : GEMS.STREAK_7_DAYS;
      await supabase.from('gem_transactions').insert({
        child_id: child.id,
        amount: bonusGems,
        reason: 'streak_bonus',
        metadata: { streak: newStreak },
      });
      usePetStore.getState().addGems(bonusGems);
    }

    return { newStreak, bonusGems };
  }, [child]);

  return { currentStreak, loadStreak, recordTalk };
}

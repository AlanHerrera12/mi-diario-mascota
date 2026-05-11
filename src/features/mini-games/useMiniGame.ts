import { useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';
import { usePetStore } from '../../stores/pet.store';
import { GEMS } from '../../constants';

// Track which games were completed this session to avoid double-awarding
const completedThisSession = new Set<string>();

export function useMiniGame(gameId: string) {
  const child = useAuthStore(s => s.activeChild);
  const addGems = usePetStore(s => s.addGems);

  const completeGame = useCallback(async (): Promise<number> => {
    if (completedThisSession.has(gameId) || !child) return 0;
    completedThisSession.add(gameId);

    const amount = GEMS.MINI_GAME_COMPLETE;
    await supabase.from('gem_transactions').insert({
      child_id: child.id,
      amount,
      reason: 'daily_task',
      metadata: { mini_game: gameId },
    });
    addGems(amount);
    return amount;
  }, [gameId, child, addGems]);

  return {
    completeGame,
    alreadyPlayed: completedThisSession.has(gameId),
    reward: GEMS.MINI_GAME_COMPLETE,
  };
}

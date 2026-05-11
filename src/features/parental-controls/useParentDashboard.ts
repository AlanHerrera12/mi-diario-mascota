import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';
import type { ParentAlert, ParentSummary, EmotionType } from '../../types';

export interface WeeklyEntryRaw {
  detected_emotions: EmotionType[];
  keywords: string[];
  sentiment_score: number | null;
  created_at: string;
  audio_duration_seconds: number | null;
}

function weekStart() {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// Datos de las entradas de los últimos 7 días (emociones + keywords)
export function useWeeklyEntries(childId: string | undefined) {
  return useQuery({
    queryKey: ['weekly-entries', childId],
    enabled: !!childId,
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('detected_emotions, keywords, sentiment_score, created_at, audio_duration_seconds')
        .eq('child_id', childId!)
        .gte('created_at', weekStart())
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as WeeklyEntryRaw[];
    },
  });
}

// Último resumen semanal generado
export function useLatestSummary(childId: string | undefined) {
  return useQuery({
    queryKey: ['latest-summary', childId],
    enabled: !!childId,
    staleTime: 1000 * 60 * 15,
    queryFn: async () => {
      const { data } = await supabase
        .from('parent_summaries')
        .select('*')
        .eq('child_id', childId!)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return data as ParentSummary | null;
    },
  });
}

// Alertas no leídas
export function useUnreadAlerts(childId: string | undefined) {
  return useQuery({
    queryKey: ['unread-alerts', childId],
    enabled: !!childId,
    staleTime: 1000 * 60 * 2,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parent_alerts')
        .select('*')
        .eq('child_id', childId!)
        .is('read_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as ParentAlert[];
    },
  });
}

// Todas las alertas (para la pantalla de alertas completa)
export function useAllAlerts(childId: string | undefined) {
  return useQuery({
    queryKey: ['all-alerts', childId],
    enabled: !!childId,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parent_alerts')
        .select('*')
        .eq('child_id', childId!)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as ParentAlert[];
    },
  });
}

// Marcar alerta como leída
export async function markAlertRead(alertId: string) {
  await supabase
    .from('parent_alerts')
    .update({ read_at: new Date().toISOString() })
    .eq('id', alertId);
}

// Streak del niño
export function useChildStreak(childId: string | undefined) {
  return useQuery({
    queryKey: ['child-streak', childId],
    enabled: !!childId,
    queryFn: async () => {
      const { data } = await supabase
        .from('streaks')
        .select('current_streak, longest_streak, last_talk_date')
        .eq('child_id', childId!)
        .single();
      return data;
    },
  });
}

// Agrega emociones de los últimos 7 días en frecuencias
export function aggregateEmotions(
  entries: Pick<WeeklyEntryRaw, 'detected_emotions'>[],
): { emotion: EmotionType; count: number; pct: number }[] {
  const freq: Partial<Record<EmotionType, number>> = {};
  let total = 0;
  for (const e of entries) {
    for (const em of e.detected_emotions ?? []) {
      freq[em] = (freq[em] ?? 0) + 1;
      total++;
    }
  }
  if (total === 0) return [];
  return (Object.entries(freq) as [EmotionType, number][])
    .sort(([, a], [, b]) => b - a)
    .map(([emotion, count]) => ({ emotion, count, pct: Math.round((count / total) * 100) }));
}

// Calcula score de sentimiento promedio de la semana
export function averageSentiment(entries: Pick<WeeklyEntryRaw, 'sentiment_score'>[]): number {
  const valid = entries.filter(e => e.sentiment_score !== null);
  if (!valid.length) return 0;
  return valid.reduce((acc, e) => acc + (e.sentiment_score ?? 0), 0) / valid.length;
}

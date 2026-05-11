import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================
// Edge Function: generate-parent-summary
// Genera resúmenes semanales para padres a partir de
// keywords y emociones detectadas — sin mostrar transcripciones
// ============================================================

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { childId, periodStart, periodEnd } = await req.json() as {
    childId: string;
    periodStart: string;
    periodEnd: string;
  };

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Obtener entradas del período (solo metadata, NO transcripts)
    const { data: entries, error } = await supabase
      .from('diary_entries')
      .select('detected_emotions, keywords, sentiment_score, alert_flags, created_at')
      .eq('child_id', childId)
      .gte('created_at', periodStart)
      .lte('created_at', periodEnd)
      .order('created_at', { ascending: true });

    if (error) throw error;
    if (!entries || entries.length === 0) {
      return new Response(JSON.stringify({ message: 'No entries for period' }), { status: 200 });
    }

    // Agregar emociones y keywords
    const emotionFreq: Record<string, number> = {};
    const keywordFreq: Record<string, number> = {};
    let totalSentiment = 0;
    let maxAlertLevel = 'none';

    const alertLevelOrder = ['none', 'low', 'medium', 'high'];

    for (const entry of entries) {
      totalSentiment += entry.sentiment_score ?? 0;

      for (const emotion of entry.detected_emotions ?? []) {
        emotionFreq[emotion] = (emotionFreq[emotion] ?? 0) + 1;
      }
      for (const keyword of entry.keywords ?? []) {
        keywordFreq[keyword] = (keywordFreq[keyword] ?? 0) + 1;
      }

      // Calcular nivel de alerta máximo del período
      const flags = entry.alert_flags ?? [];
      for (const flag of flags) {
        if (alertLevelOrder.indexOf(flag.severity) > alertLevelOrder.indexOf(maxAlertLevel)) {
          maxAlertLevel = flag.severity;
        }
      }
    }

    const dominantEmotions = Object.entries(emotionFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion);

    const topKeywords = Object.entries(keywordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word);

    // Obtener info del niño para personalizar el resumen
    const { data: child } = await supabase
      .from('children')
      .select('display_name')
      .eq('id', childId)
      .single();

    const name = child?.display_name ?? 'tu hijo/a';
    const talkDays = entries.length;
    const avgSentiment = totalSentiment / entries.length;
    const sentimentLabel = avgSentiment > 0.2 ? 'positivo' : avgSentiment < -0.2 ? 'con algunos momentos difíciles' : 'equilibrado';

    const emotionText = dominantEmotions.length > 0
      ? `Las emociones más frecuentes fueron: ${dominantEmotions.join(', ')}.`
      : '';

    const keywordsText = topKeywords.length > 0
      ? `Temas que aparecieron: ${topKeywords.join(', ')}.`
      : '';

    const summaryText = `Esta semana ${name} habló ${talkDays} día${talkDays !== 1 ? 's' : ''}. El estado emocional general fue ${sentimentLabel}. ${emotionText} ${keywordsText}`.trim();

    // Guardar resumen
    await supabase.from('parent_summaries').insert({
      child_id: childId,
      period: 'weekly',
      period_start: periodStart,
      period_end: periodEnd,
      summary_text: summaryText,
      dominant_emotions: dominantEmotions,
      topics: topKeywords,
      alert_level: maxAlertLevel,
    });

    return new Response(JSON.stringify({ success: true, summaryText }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[generate-parent-summary]', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
});

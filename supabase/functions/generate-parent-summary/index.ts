import { corsHeaders } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;

const SYSTEM_PROMPT = `Sos un asistente especializado en bienestar infantil. Tu tarea es generar un resumen semanal del diario emocional de un nino para que su padre o madre pueda entender como estuvo emocionalmente durante la semana.

Recibirás un array JSON con las entradas del diario de la semana. Cada entrada tiene:
- created_at: fecha y hora
- sentiment_score: de -1.0 a 1.0
- detected_emotions: array de emociones
- keywords: temas detectados
- transcript_redacted: texto con nombres reemplazados

Genera un JSON con este formato exacto:
{
  "summary_text": "<resumen en 3-5 oraciones en espanol, calido y objetivo, dirigido al padre. Menciona los temas principales, el estado emocional general y algun momento destacado si lo hay. NO uses lenguaje clinico ni alarmes innecesariamente.>",
  "dominant_emotions": ["<emocion1>", "<emocion2>", "<emocion3>"],
  "topics": ["<tema1>", "<tema2>", "<tema3>", "<tema4>"],
  "alert_level": "<'none'|'low'|'medium'|'high' segun la gravedad general de la semana>"
}

IMPORTANTE:
- El tono debe ser de un asistente empático, no clínico.
- Si hay alertas de alto riesgo, alert_level debe ser 'high'.
- Si no hubo entradas, devuelve un JSON con summary_text explicando que el niño no habló esa semana.
- Responde ÚNICAMENTE con el JSON.`;

function weekBounds(weeksAgo = 0): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek) - weeksAgo * 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { childId, periodStart, periodEnd } = body;

    const db = getServiceClient();

    // If no childId given, run for ALL children (cron mode)
    let childIds: string[] = [];
    if (childId) {
      childIds = [childId];
    } else {
      const { data: children } = await db.from('children').select('id');
      childIds = (children ?? []).map((c: { id: string }) => c.id);
    }

    const bounds = periodStart && periodEnd
      ? { start: periodStart, end: periodEnd }
      : weekBounds(1); // default: last full week

    const results: { childId: string; ok: boolean; summaryId?: string; error?: string }[] = [];

    for (const cid of childIds) {
      // Check if summary already exists for this period
      const { data: existing } = await db
        .from('parent_summaries')
        .select('id')
        .eq('child_id', cid)
        .eq('period', 'weekly')
        .eq('period_start', bounds.start)
        .eq('period_end', bounds.end)
        .maybeSingle();

      if (existing) {
        results.push({ childId: cid, ok: true, summaryId: existing.id });
        continue;
      }

      // Fetch diary entries for the period
      const { data: entries, error: entriesErr } = await db
        .from('diary_entries')
        .select('created_at, sentiment_score, detected_emotions, keywords, transcript_redacted, alert_flags')
        .eq('child_id', cid)
        .gte('created_at', `${bounds.start}T00:00:00Z`)
        .lte('created_at', `${bounds.end}T23:59:59Z`)
        .order('created_at', { ascending: true });

      if (entriesErr) {
        results.push({ childId: cid, ok: false, error: entriesErr.message });
        continue;
      }

      // Check for any high alerts this week
      const { data: highAlerts } = await db
        .from('parent_alerts')
        .select('severity')
        .eq('child_id', cid)
        .gte('created_at', `${bounds.start}T00:00:00Z`)
        .lte('created_at', `${bounds.end}T23:59:59Z`);

      const hasHigh = (highAlerts ?? []).some((a: { severity: string }) => a.severity === 'high');
      const hasMedium = (highAlerts ?? []).some((a: { severity: string }) => a.severity === 'medium');

      // Generate summary with GPT-4o-mini
      const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.3,
          max_tokens: 600,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            {
              role: 'user',
              content: `Entradas de la semana (${bounds.start} al ${bounds.end}):\n${JSON.stringify(entries ?? [], null, 2)}`,
            },
          ],
        }),
      });

      if (!gptRes.ok) {
        const detail = await gptRes.text();
        results.push({ childId: cid, ok: false, error: `GPT failed: ${detail}` });
        continue;
      }

      const gptData = await gptRes.json();
      const rawJson = gptData.choices[0]?.message?.content ?? '{}';

      let analysis: {
        summary_text: string;
        dominant_emotions: string[];
        topics: string[];
        alert_level: string;
      };

      try {
        analysis = JSON.parse(rawJson);
      } catch {
        results.push({ childId: cid, ok: false, error: 'Invalid GPT JSON' });
        continue;
      }

      // Override alert_level if we have confirmed alerts
      let alert_level = analysis.alert_level ?? 'none';
      if (hasHigh) alert_level = 'high';
      else if (hasMedium && alert_level === 'none') alert_level = 'medium';

      const { data: inserted, error: insertErr } = await db
        .from('parent_summaries')
        .insert({
          child_id: cid,
          period: 'weekly',
          period_start: bounds.start,
          period_end: bounds.end,
          summary_text: analysis.summary_text,
          dominant_emotions: analysis.dominant_emotions ?? [],
          topics: analysis.topics ?? [],
          alert_level,
        })
        .select('id')
        .single();

      if (insertErr) {
        results.push({ childId: cid, ok: false, error: insertErr.message });
      } else {
        results.push({ childId: cid, ok: true, summaryId: inserted.id });
      }
    }

    return new Response(
      JSON.stringify({ ok: true, period: bounds, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    console.error('generate-parent-summary error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

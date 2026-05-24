import { corsHeaders } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

const SYSTEM_PROMPT = `Sos un sistema de análisis de bienestar infantil. Recibirás la transcripción del diario de voz de un niño (en español rioplatense).

Tu tarea es analizar el contenido y devolver un JSON con este formato exacto:
{
  "sentiment_score": <número de -1.0 a 1.0, donde -1 es muy negativo, 0 neutro, 1 muy positivo>,
  "detected_emotions": <array de strings, solo de: "joy","sadness","anger","fear","disgust","surprise","love","excitement","calm","anxiety","loneliness">,
  "keywords": <array de máximo 8 palabras clave temáticas en español, sin nombres propios>,
  "transcript_redacted": <el mismo texto pero con nombres de personas y lugares específicos reemplazados por [PERSONA] y [LUGAR]>
}

IMPORTANTE:
- No inventes emociones que no estén presentes.
- keywords deben ser sustantivos o temas (ej: "colegio", "amigos", "pelea", "juego"), no adjetivos.
- detected_emotions máximo 4 emociones.
- transcript_redacted: reemplazá solo nombres propios de personas y lugares, conservá todo el contenido.
- Responde ÚNICAMENTE con el JSON, sin texto adicional.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { diaryEntryId, childId } = await req.json();
    if (!diaryEntryId || !childId) {
      return new Response(JSON.stringify({ error: 'Missing diaryEntryId or childId' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const db = getServiceClient();

    // 1. Get transcript from diary entry
    const { data: entry, error: fetchErr } = await db
      .from('diary_entries')
      .select('id, transcript, audio_duration_seconds')
      .eq('id', diaryEntryId)
      .single();

    if (fetchErr || !entry) {
      return new Response(JSON.stringify({ error: 'Entry not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!entry.transcript || entry.transcript.startsWith('[error')) {
      return new Response(JSON.stringify({ error: 'No valid transcript to analyze' }), {
        status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Analyze with GPT-4o-mini
    const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        max_tokens: 512,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Transcripción:\n${entry.transcript}` },
        ],
      }),
    });

    if (!gptRes.ok) {
      const detail = await gptRes.text();
      console.error('GPT error:', detail);
      return new Response(JSON.stringify({ error: 'GPT API failed', detail }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const gptData = await gptRes.json();
    const rawJson = gptData.choices[0]?.message?.content ?? '{}';

    let analysis: {
      sentiment_score: number;
      detected_emotions: string[];
      keywords: string[];
      transcript_redacted: string;
    };

    try {
      analysis = JSON.parse(rawJson);
    } catch {
      console.error('Failed to parse GPT JSON:', rawJson);
      return new Response(JSON.stringify({ error: 'Invalid GPT response format' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Clamp sentiment score just in case
    const sentiment_score = Math.max(-1, Math.min(1, analysis.sentiment_score ?? 0));

    // 3. Update diary entry with analysis
    const { error: updateErr } = await db
      .from('diary_entries')
      .update({
        sentiment_score,
        detected_emotions: analysis.detected_emotions ?? [],
        keywords: analysis.keywords ?? [],
        transcript_redacted: analysis.transcript_redacted ?? entry.transcript,
      })
      .eq('id', diaryEntryId);

    if (updateErr) {
      console.error('Failed to save analysis:', updateErr);
      return new Response(JSON.stringify({ error: 'Failed to save analysis' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Chain to detect-alerts (fire-and-forget)
    fetch(`${SUPABASE_URL}/functions/v1/detect-alerts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ diaryEntryId, childId }),
    }).catch((e) => console.error('Failed to trigger detect-alerts:', e));

    return new Response(
      JSON.stringify({ ok: true, diaryEntryId, sentiment_score, emotions: analysis.detected_emotions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    console.error('analyze-sentiment error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

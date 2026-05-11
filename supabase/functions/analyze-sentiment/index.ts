import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================
// Edge Function: analyze-sentiment
// Análisis determinístico de sentimiento sobre la transcripción.
// DECISION: Usamos análisis basado en léxico (AFINN-ES + emociones
// de NRC Emotion Lexicon en español) en lugar de LLMs generativos.
// Motivo: privacidad infantil, predictibilidad, costo operativo.
// ============================================================

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Léxico simplificado de emociones (español)
// TODO (Fase 4): cargar desde tabla Supabase para permitir actualizaciones sin redeploy
const EMOTION_KEYWORDS: Record<string, string[]> = {
  alegria: ['feliz', 'contento', 'alegre', 'genial', 'buenísimo', 'fantástico', 'divertido', 'bien', 'padre', 'copado', 'lindo'],
  tristeza: ['triste', 'llorando', 'llore', 'lloré', 'extraño', 'extrañé', 'solo', 'sola', 'aburrido', 'extrañaba'],
  frustración: ['enojado', 'molesto', 'fastidio', 'problema', 'difícil', 'no pude', 'salió mal', 'falló'],
  miedo: ['miedo', 'asustado', 'asusté', 'susto', 'pesadilla', 'oscuro', 'solo'],
  enojo: ['furioso', 'rabia', 'odio', 'golpeó', 'me pegó', 'pelee', 'peleé', 'gritó'],
  calma: ['tranquilo', 'relajado', 'bien', 'descansé', 'dormí', 'paz', 'calmado'],
};

type EmotionType = 'alegria' | 'tristeza' | 'frustración' | 'miedo' | 'enojo' | 'calma';

interface SentimentResult {
  score: number;
  emotions: EmotionType[];
  keywords: string[];
}

function analyzeText(transcript: string): SentimentResult {
  const lower = transcript.toLowerCase();
  const words = lower.split(/\s+/);

  const emotionCounts: Record<string, number> = {};
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    emotionCounts[emotion] = keywords.filter(kw => lower.includes(kw)).length;
  }

  const dominated = Object.entries(emotionCounts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([emotion]) => emotion as EmotionType);

  // Score simple: positivo si alegría/calma dominan, negativo si tristeza/enojo/miedo
  const positiveScore = (emotionCounts.alegria ?? 0) + (emotionCounts.calma ?? 0);
  const negativeScore =
    (emotionCounts.tristeza ?? 0) +
    (emotionCounts.enojo ?? 0) +
    (emotionCounts.miedo ?? 0) +
    (emotionCounts.frustración ?? 0);
  const total = positiveScore + negativeScore;
  const score = total === 0 ? 0 : (positiveScore - negativeScore) / total;

  // Keywords: sustantivos frecuentes (sin stop words)
  const STOP_WORDS = new Set(['de', 'la', 'el', 'en', 'y', 'a', 'que', 'me', 'se', 'no', 'un', 'una', 'con', 'por', 'es', 'lo', 'le', 'mi', 'su', 'al', 'del']);
  const freq: Record<string, number> = {};
  for (const word of words) {
    if (word.length > 3 && !STOP_WORDS.has(word)) {
      freq[word] = (freq[word] ?? 0) + 1;
    }
  }
  const keywords = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);

  return { score, emotions: dominated, keywords };
}

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { diaryEntryId, transcript } = await req.json() as {
    diaryEntryId: string;
    childId: string;
    transcript: string;
  };

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const result = analyzeText(transcript);

    await supabase
      .from('diary_entries')
      .update({
        sentiment_score: result.score,
        detected_emotions: result.emotions,
        keywords: result.keywords,
      })
      .eq('id', diaryEntryId);

    // Disparar detección de alertas
    await fetch(`${SUPABASE_URL}/functions/v1/detect-alerts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ diaryEntryId, transcript }),
    });

    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[analyze-sentiment]', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
});

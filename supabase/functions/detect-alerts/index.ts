import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================
// Edge Function: detect-alerts
// Sistema DETERMINÍSTICO de detección de señales de riesgo.
// NUNCA usa LLMs generativos — solo matching de lista curada.
// La lista de términos está versionada en código y revisada
// por especialistas en protección infantil.
// Ver docs/privacy-decisions.md para justificación completa.
// ============================================================

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

type AlertType = 'bullying' | 'self_harm' | 'abuse' | 'severe_distress';
type Severity = 'low' | 'medium' | 'high';

interface AlertPattern {
  type: AlertType;
  severity: Severity;
  patterns: RegExp[];
  negations: RegExp[];
}

// DECISION: Los patrones son RegExp para permitir variantes morfológicas
// (conjugaciones, plurales). La lista es intencionalmente conservadora:
// preferimos falsos negativos a falsos positivos para evitar alarmar
// innecesariamente a los padres.
const ALERT_PATTERNS: AlertPattern[] = [
  {
    type: 'bullying',
    severity: 'medium',
    patterns: [
      /me\s+(pega|pegan|golpea|golpean|empuja|empujan)/i,
      /me\s+(molesta|molestan|fastidi[ao]|fastidian)/i,
      /se\s+burlan?\s+de\s+m[íi]/i,
      /no\s+me\s+dejan?\s+(jugar|sentar|entrar)/i,
    ],
    negations: [/no\s+me\s+peg[aó]/i, /ya\s+no/i],
  },
  {
    type: 'self_harm',
    severity: 'high',
    patterns: [
      /me\s+(corté|corto|lastimé|lastime|hago\s+daño)/i,
      /quiero\s+(hacerme\s+daño|lastimar[me])/i,
    ],
    negations: [/jugando/i, /sin\s+querer/i, /accidente/i],
  },
  {
    type: 'abuse',
    severity: 'high',
    patterns: [
      /me\s+(toca|tocó|tocaron)\s+(mal|donde\s+no|sin\s+querer|las\s+partes)/i,
      /alguien\s+me\s+(lastimó|pegó|hizo\s+daño)/i,
      /(papá|mamá|tío|tía|profesor|profe)\s+me\s+(peg[oó]|grit[oó]|asust[oó])/i,
    ],
    negations: [],
  },
  {
    type: 'severe_distress',
    severity: 'high',
    patterns: [
      /no\s+quiero\s+(vivir|estar\s+acá|seguir)/i,
      /mejor\s+si\s+(no\s+estuviera|me\s+fuera)/i,
      /todos\s+me\s+odian/i,
      /nadie\s+me\s+quiere/i,
    ],
    negations: [/a\s+veces\s+(siento|pienso)/i],
  },
];

function detectAlerts(
  transcript: string,
  diaryEntryId: string,
): Array<{
  diary_entry_id: string;
  alert_type: AlertType;
  severity: Severity;
  context_snippet: string;
}> {
  const alerts = [];
  const lower = transcript.toLowerCase();

  for (const pattern of ALERT_PATTERNS) {
    for (const regex of pattern.patterns) {
      const match = regex.exec(lower);
      if (!match) continue;

      // Verificar negaciones en contexto de ±20 palabras
      const contextStart = Math.max(0, match.index - 100);
      const contextEnd = Math.min(lower.length, match.index + match[0].length + 100);
      const context = lower.slice(contextStart, contextEnd);

      const negated = pattern.negations.some(neg => neg.test(context));
      if (negated) continue;

      // Snippet de contexto mínimo para el padre (30 palabras alrededor)
      const snippet = transcript.slice(contextStart, contextEnd).trim();

      alerts.push({
        diary_entry_id: diaryEntryId,
        alert_type: pattern.type,
        severity: pattern.severity,
        context_snippet: snippet,
      });

      break; // Un match por tipo es suficiente
    }
  }

  return alerts;
}

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { diaryEntryId, transcript, childId } = await req.json() as {
    diaryEntryId: string;
    transcript: string;
    childId: string;
  };

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const alerts = detectAlerts(transcript, diaryEntryId);

    if (alerts.length > 0) {
      const { error } = await supabase.from('parent_alerts').insert(
        alerts.map(a => ({ ...a, child_id: childId })),
      );
      if (error) throw error;

      // Actualizar alert_flags en diary_entry
      await supabase
        .from('diary_entries')
        .update({
          alert_flags: alerts.map(a => ({ type: a.alert_type, severity: a.severity })),
        })
        .eq('id', diaryEntryId);

      // TODO (Fase 5): enviar push notification al padre
      // Mensaje neutral: "Hay algo importante en el resumen de [nombre]"
    }

    return new Response(JSON.stringify({ alertsFound: alerts.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[detect-alerts]', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
});

import { corsHeaders } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

// ============================================================
// PD-004: Deteccion deterministica por lista curada de patrones.
// NO se usa NLP ni LLMs para esta deteccion.
// Cada patron tiene una justificacion clinica y debe ser
// revisado por un especialista antes de modificar.
// ============================================================

interface AlertPattern {
  pattern: RegExp;
  alertType: 'bullying' | 'self_harm' | 'abuse' | 'severe_distress';
  severity: 'low' | 'medium' | 'high';
}

const ALERT_PATTERNS: AlertPattern[] = [
  // --- AUTOLESION / IDEACION SUICIDA (high) ---
  { pattern: /me quiero (matar|morir|lastimar|hacer dano)/i,         alertType: 'self_harm',       severity: 'high' },
  { pattern: /quiero (morirme|desaparecer|no existir)/i,             alertType: 'self_harm',       severity: 'high' },
  { pattern: /ya no quiero (vivir|estar|seguir)/i,                   alertType: 'self_harm',       severity: 'high' },
  { pattern: /me voy a (cortar|lastimar|hacer dano)/i,               alertType: 'self_harm',       severity: 'high' },
  { pattern: /pienso en (matarme|morirme|suicidarme)/i,              alertType: 'self_harm',       severity: 'high' },
  { pattern: /no vale la pena (vivir|seguir)/i,                      alertType: 'self_harm',       severity: 'medium' },
  { pattern: /siento que (sobro|molesto a todos|nadie me quiere)/i,  alertType: 'self_harm',       severity: 'medium' },

  // --- ABUSO (high) ---
  { pattern: /me (toca|toco|toca donde no debe)/i,                   alertType: 'abuse',           severity: 'high' },
  { pattern: /me (pega|pegaron|golpeo|golpearon) (mucho|siempre|todo el tiempo)/i, alertType: 'abuse', severity: 'high' },
  { pattern: /un adulto me (lastimo|hizo dano|toco)/i,               alertType: 'abuse',           severity: 'high' },
  { pattern: /me hace(n)? cosas (malas|feas|que no quiero)/i,        alertType: 'abuse',           severity: 'high' },
  { pattern: /me obligan a/i,                                         alertType: 'abuse',           severity: 'medium' },

  // --- BULLYING (medium/high) ---
  { pattern: /me (molestan|insultan|cargan|joden) (siempre|todos|mucho)/i, alertType: 'bullying',  severity: 'medium' },
  { pattern: /no me dejan (jugar|estar|sentarme)/i,                  alertType: 'bullying',        severity: 'medium' },
  { pattern: /se burlan de mi (siempre|todo el tiempo)/i,            alertType: 'bullying',        severity: 'medium' },
  { pattern: /me dicen (cosas feas|insultos|que soy)/i,              alertType: 'bullying',        severity: 'medium' },
  { pattern: /me (excluyen|ignoran|rechazan) (siempre|en el cole)/i, alertType: 'bullying',        severity: 'low' },
  { pattern: /nadie quiere (ser mi amigo|jugar conmigo)/i,           alertType: 'bullying',        severity: 'low' },
  { pattern: /me (rompieron|sacaron|robaron) (la mochila|las cosas)/i, alertType: 'bullying',     severity: 'medium' },

  // --- DISTRESS SEVERO (medium) ---
  { pattern: /me siento (muy solo|muy triste|muy mal) (siempre|todo el tiempo)/i, alertType: 'severe_distress', severity: 'medium' },
  { pattern: /estoy (muy asustado|muy angustiado|muy preocupado) (siempre|todo el tiempo)/i, alertType: 'severe_distress', severity: 'low' },
  { pattern: /me da (mucho miedo|panico|terror) (ir|volver|estar)/i, alertType: 'severe_distress', severity: 'low' },
  { pattern: /lloro (siempre|todo el tiempo|todos los dias)/i,       alertType: 'severe_distress', severity: 'low' },
];

function extractSnippet(text: string, matchIndex: number, radius = 80): string {
  const start = Math.max(0, matchIndex - radius);
  const end = Math.min(text.length, matchIndex + radius);
  const snippet = text.slice(start, end).trim();
  return (start > 0 ? '...' : '') + snippet + (end < text.length ? '...' : '');
}

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

    const { data: entry, error: fetchErr } = await db
      .from('diary_entries')
      .select('id, transcript_redacted, transcript')
      .eq('id', diaryEntryId)
      .single();

    if (fetchErr || !entry) {
      return new Response(JSON.stringify({ error: 'Entry not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use redacted transcript — fallback to full if not yet redacted
    const text = entry.transcript_redacted ?? entry.transcript ?? '';
    if (!text) {
      return new Response(JSON.stringify({ ok: true, alertsCreated: 0, reason: 'empty transcript' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Run all patterns against the transcript
    const triggered: { alertType: string; severity: string; snippet: string }[] = [];
    const alertFlags: string[] = [];

    for (const { pattern, alertType, severity } of ALERT_PATTERNS) {
      const match = pattern.exec(text);
      if (match) {
        triggered.push({ alertType, severity, snippet: extractSnippet(text, match.index) });
        if (!alertFlags.includes(alertType)) alertFlags.push(alertType);
      }
    }

    // Save alert_flags to diary entry regardless
    await db.from('diary_entries')
      .update({ alert_flags: alertFlags })
      .eq('id', diaryEntryId);

    if (triggered.length === 0) {
      return new Response(JSON.stringify({ ok: true, alertsCreated: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Deduplicate: keep highest severity per alert type
    const severityRank: Record<string, number> = { low: 1, medium: 2, high: 3 };
    const best: Record<string, typeof triggered[0]> = {};
    for (const t of triggered) {
      const existing = best[t.alertType];
      if (!existing || severityRank[t.severity] > severityRank[existing.severity]) {
        best[t.alertType] = t;
      }
    }

    // Insert parent_alerts
    const inserts = Object.values(best).map(({ alertType, severity, snippet }) => ({
      child_id: childId,
      diary_entry_id: diaryEntryId,
      alert_type: alertType,
      severity,
      context_snippet: snippet,
    }));

    const { error: insertErr } = await db.from('parent_alerts').insert(inserts);
    if (insertErr) {
      console.error('Failed to insert alerts:', insertErr);
      return new Response(JSON.stringify({ error: 'Failed to insert alerts', detail: insertErr.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ ok: true, alertsCreated: inserts.length, types: Object.keys(best) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    console.error('detect-alerts error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

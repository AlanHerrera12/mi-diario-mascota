import { corsHeaders } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

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
      .select('id, audio_storage_path, audio_duration_seconds')
      .eq('id', diaryEntryId)
      .single();

    if (fetchErr || !entry) {
      return new Response(JSON.stringify({ error: 'Entry not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!entry.audio_storage_path) {
      return new Response(JSON.stringify({ error: 'No audio path on entry' }), {
        status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: audioBlob, error: storageErr } = await db.storage
      .from('diary-audios')
      .download(entry.audio_storage_path);

    if (storageErr || !audioBlob) {
      return new Response(JSON.stringify({ error: 'Failed to download audio', detail: storageErr?.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.m4a');
    formData.append('model', 'whisper-1');
    formData.append('language', 'es');
    formData.append('response_format', 'json');

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: formData,
    });

    if (!whisperRes.ok) {
      const detail = await whisperRes.text();
      console.error('Whisper error:', detail);
      await db.from('diary_entries')
        .update({ transcript: '[error: transcription failed]' })
        .eq('id', diaryEntryId);
      return new Response(JSON.stringify({ error: 'Whisper API failed', detail }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { text: transcript } = await whisperRes.json();

    const { error: updateErr } = await db
      .from('diary_entries')
      .update({ transcript })
      .eq('id', diaryEntryId);

    if (updateErr) {
      return new Response(JSON.stringify({ error: 'Failed to save transcript' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    fetch(`${SUPABASE_URL}/functions/v1/analyze-sentiment`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ diaryEntryId, childId }),
    }).catch((e) => console.error('Failed to trigger analyze-sentiment:', e));

    return new Response(
      JSON.stringify({ ok: true, diaryEntryId, transcriptLength: transcript.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    console.error('transcribe-audio error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

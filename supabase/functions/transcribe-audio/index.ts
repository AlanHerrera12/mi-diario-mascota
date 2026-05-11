import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ============================================================
// Edge Function: transcribe-audio
// Descarga el audio del Storage, llama a Whisper API de OpenAI
// y guarda la transcripción encriptada en diary_entries
// NO se usa GPT/Claude para responder al niño — solo transcripción
// ============================================================

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { diaryEntryId, childId } = await req.json() as {
    diaryEntryId: string;
    childId: string;
  };

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // 1. Obtener la entrada del diario para encontrar el audio
    const { data: entry, error: entryError } = await supabase
      .from('diary_entries')
      .select('audio_storage_path')
      .eq('id', diaryEntryId)
      .single();

    if (entryError || !entry?.audio_storage_path) {
      return new Response(JSON.stringify({ error: 'Entry not found' }), { status: 404 });
    }

    // 2. Descargar el audio desde Storage
    const { data: audioBlob, error: downloadError } = await supabase.storage
      .from('diary-audios')
      .download(entry.audio_storage_path);

    if (downloadError || !audioBlob) {
      return new Response(JSON.stringify({ error: 'Audio not found' }), { status: 404 });
    }

    // 3. Llamar a Whisper API
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.m4a');
    formData.append('model', 'whisper-1');
    formData.append('language', 'es');
    formData.append('response_format', 'json');

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: formData,
    });

    if (!whisperResponse.ok) {
      throw new Error(`Whisper API error: ${whisperResponse.status}`);
    }

    const { text: transcript } = await whisperResponse.json() as { text: string };

    // 4. Guardar transcripción en diary_entries
    // TODO: encriptar transcript con clave derivada del padre antes de guardar
    const { error: updateError } = await supabase
      .from('diary_entries')
      .update({ transcript })
      .eq('id', diaryEntryId);

    if (updateError) throw updateError;

    // 5. Disparar análisis de sentimiento en background (no bloqueante)
    await fetch(`${SUPABASE_URL}/functions/v1/analyze-sentiment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ diaryEntryId, childId, transcript }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[transcribe-audio]', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
});

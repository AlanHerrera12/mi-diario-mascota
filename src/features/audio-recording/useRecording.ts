import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/auth.store';
import { useRecordingStore } from '../../stores/recording.store';
import { startRecording, stopRecording, deleteLocalRecording, requestAudioPermissions } from '../../lib/audio';
import { MIN_RECORDING_SECONDS } from '../../constants';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export function useRecording() {
  const child = useAuthStore(s => s.activeChild);
  const { phase, recording, elapsedSeconds, hasReachedMinimum,
    setPhase, setRecording, setElapsed, setLastEntryId, reset } = useRecordingStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Actualiza el contador de segundos cada segundo
  function startTimer() {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(elapsed);
    }, 500);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  useEffect(() => () => stopTimer(), []);

  const begin = useCallback(async () => {
    if (!child) return false;

    const hasPermission = await requestAudioPermissions();
    if (!hasPermission) {
      setPhase('error');
      return false;
    }

    reset();
    setPhase('recording');

    try {
      const rec = await startRecording();
      setRecording(rec);
      startTimer();
      return true;
    } catch {
      setPhase('error');
      return false;
    }
  }, [child]);

  const finish = useCallback(async () => {
    if (!recording || !child || phase !== 'recording') return null;

    stopTimer();
    setPhase('processing');

    try {
      const result = await stopRecording(recording);
      if (!result) { setPhase('error'); return null; }

      const durationSecs = Math.floor(result.durationMillis / 1000);

      // 1. Subir audio a Supabase Storage
      const path = `${child.id}/${Date.now()}.m4a`;
      const fileResponse = await fetch(result.uri);
      const blob = await fileResponse.blob();

      const { error: uploadError } = await supabase.storage
        .from('diary-audios')
        .upload(path, blob, { contentType: 'audio/m4a', upsert: false });

      // Borrar archivo local independientemente del resultado
      await deleteLocalRecording(result.uri);

      if (uploadError) throw uploadError;

      // 2. Crear diary_entry
      const { data: entry, error: entryError } = await supabase
        .from('diary_entries')
        .insert({
          child_id: child.id,
          audio_storage_path: path,
          audio_duration_seconds: durationSecs,
        })
        .select('id')
        .single();

      if (entryError) throw entryError;

      setLastEntryId(entry.id);

      // 3. Disparar transcripción en background (fire-and-forget)
      if (durationSecs >= MIN_RECORDING_SECONDS) {
        fetch(`${SUPABASE_URL}/functions/v1/transcribe-audio`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ diaryEntryId: entry.id, childId: child.id }),
        }).catch(() => {/* silencioso — se reintentará via cron */});
      }

      setPhase('done');
      return { durationSecs, qualifiesForGems: durationSecs >= MIN_RECORDING_SECONDS };
    } catch {
      setPhase('error');
      return null;
    }
  }, [recording, child, phase]);

  const cancel = useCallback(async () => {
    stopTimer();
    if (recording) {
      try { await recording.stopAndUnloadAsync(); } catch { /* ignorar */ }
    }
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    reset();
  }, [recording]);

  return { phase, elapsedSeconds, hasReachedMinimum, begin, finish, cancel };
}

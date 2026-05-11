import { create } from 'zustand';
import { Audio } from 'expo-av';

type RecordingPhase = 'idle' | 'recording' | 'processing' | 'done' | 'error';

interface RecordingState {
  phase: RecordingPhase;
  recording: Audio.Recording | null;
  elapsedSeconds: number;
  hasReachedMinimum: boolean;
  lastEntryId: string | null;
  setPhase: (phase: RecordingPhase) => void;
  setRecording: (recording: Audio.Recording | null) => void;
  setElapsed: (seconds: number) => void;
  setLastEntryId: (id: string) => void;
  reset: () => void;
}

export const useRecordingStore = create<RecordingState>(set => ({
  phase: 'idle',
  recording: null,
  elapsedSeconds: 0,
  hasReachedMinimum: false,
  lastEntryId: null,

  setPhase: phase => set({ phase }),
  setRecording: recording => set({ recording }),
  setElapsed: seconds =>
    set(state => ({
      elapsedSeconds: seconds,
      hasReachedMinimum: state.hasReachedMinimum || seconds >= 60,
    })),
  setLastEntryId: id => set({ lastEntryId: id }),
  reset: () =>
    set({ phase: 'idle', recording: null, elapsedSeconds: 0, hasReachedMinimum: false }),
}));

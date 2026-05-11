import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export interface RecordingResult {
  uri: string;
  durationMillis: number;
}

// Configuración optimizada para voz infantil
const RECORDING_OPTIONS: Audio.RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 16000, // suficiente para voz, reduce tamaño
    numberOfChannels: 1, // mono para voz
    bitRate: 64000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.MEDIUM,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 64000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 64000,
  },
};

export async function requestAudioPermissions(): Promise<boolean> {
  const { status } = await Audio.requestPermissionsAsync();
  return status === 'granted';
}

export async function startRecording(): Promise<Audio.Recording> {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
  return recording;
}

export async function stopRecording(recording: Audio.Recording): Promise<RecordingResult | null> {
  await recording.stopAndUnloadAsync();
  await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

  const uri = recording.getURI();
  const status = await recording.getStatusAsync();

  if (!uri) return null;

  return {
    uri,
    durationMillis: status.isLoaded ? (status.durationMillis ?? 0) : 0,
  };
}

export async function deleteLocalRecording(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    // Ignorar errores de borrado — el archivo puede ya no existir
  }
}

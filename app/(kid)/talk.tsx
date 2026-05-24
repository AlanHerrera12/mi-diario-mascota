import { useEffect, useState } from 'react';
import { View, Text, Pressable, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ProgressRing } from '../../src/components/kid-ui/ProgressRing';
import { PetDisplay } from '../../src/components/kid-ui/PetDisplay';
import { GemRewardOverlay } from '../../src/components/kid-ui/GemRewardOverlay';
import { useRecording } from '../../src/features/audio-recording/useRecording';
import { useGems } from '../../src/features/gems-economy/useGems';
import { useStreak } from '../../src/features/streaks/useStreak';
import { usePetStore } from '../../src/stores/pet.store';
import { MIN_RECORDING_SECONDS } from '../../src/constants';

interface RewardState {
  gemsEarned: number;
  bonusGems: number;
  newStreak: number;
}

export default function TalkScreen() {
  const pet = usePetStore(s => s.pet);
  const { phase, elapsedSeconds, hasReachedMinimum, begin, finish, pause, resume, cancel } = useRecording();
  const { awardGems } = useGems();
  const { recordTalk } = useStreak();
  const [reward, setReward] = useState<RewardState | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function init() {
      const ok = await begin();
      if (!ok) {
        Alert.alert(
          'Micrófono',
          'Necesitamos permiso para usar el micrófono. Activalo en Configuración.',
          [{ text: 'OK', onPress: () => router.back() }],
        );
        return;
      }
      setStarted(true);
    }
    init();
    return () => { cancel(); };
  }, []);

  useEffect(() => {
    if (hasReachedMinimum && elapsedSeconds === MIN_RECORDING_SECONDS) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [hasReachedMinimum, elapsedSeconds]);

  async function handleFinish() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const result = await finish();
    if (!result) {
      router.replace('/(kid)/home');
      return;
    }

    if (result.qualifiesForGems) {
      const [gemsEarned, { newStreak, bonusGems }] = await Promise.all([
        awardGems('daily_talk'),
        recordTalk(),
      ]);
      setReward({ gemsEarned, bonusGems, newStreak });
    } else {
      router.replace('/(kid)/goodnight');
    }
  }

  async function handlePause() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (phase === 'paused') {
      await resume();
    } else {
      await pause();
    }
  }

  function handleRewardContinue() {
    setReward(null);
    router.replace('/(kid)/goodnight');
  }

  function handleCancel() {
    Alert.alert(
      '¿Salir?',
      'Si salís ahora, no vas a ganar gemas hoy.',
      [
        { text: 'Seguir hablando', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: () => { cancel(); router.back(); } },
      ],
    );
  }

  const isPaused = phase === 'paused';
  const petMood = isPaused ? 'idle' : phase === 'recording' ? 'listening' : phase === 'done' ? 'happy' : 'idle';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#7C3AED' }}>
      {/* Top bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
        <Pressable onPress={handleCancel}>
          <Text style={{ color: '#C4B5FD', fontSize: 16 }}>✕ Salir</Text>
        </Pressable>

        {/* Pause / Resume button */}
        {(phase === 'recording' || phase === 'paused') && (
          <Pressable
            onPress={handlePause}
            disabled={!started}
            style={{
              backgroundColor: isPaused ? '#10B981' : 'rgba(255,255,255,0.15)',
              borderRadius: 20,
              paddingHorizontal: 18,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Text style={{ fontSize: 16 }}>{isPaused ? '▶️' : '⏸️'}</Text>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>
              {isPaused ? 'Continuar' : 'Pausar'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Pet listening */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        {pet && (
          <View
            style={{
              backgroundColor: '#C4B5FD',
              borderRadius: 110,
              width: 190,
              height: 190,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#5B21B6',
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <PetDisplay pet={pet} mood={petMood} size={160} />
          </View>
        )}

        {/* Speech bubble */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 14,
            maxWidth: 280,
            shadowColor: '#5B21B6',
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#4C1D95', textAlign: 'center' }}>
            {isPaused
              ? '⏸ Grabación pausada'
              : phase === 'recording'
                ? hasReachedMinimum
                  ? '¡Muy bien! Seguí contando...'
                  : 'Te estoy escuchando... 👂'
                : phase === 'processing'
                  ? 'Guardando tu historia...'
                  : ''}
          </Text>
        </View>

        {/* Progress ring */}
        {(phase === 'recording' || phase === 'paused' || phase === 'processing') && (
          <ProgressRing
            elapsedSeconds={elapsedSeconds}
            targetSeconds={MIN_RECORDING_SECONDS}
            size={200}
          />
        )}

        {phase === 'processing' && (
          <Text style={{ color: '#C4B5FD', fontSize: 14 }}>Un momentito...</Text>
        )}
      </View>

      {/* Finish button */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 36 }}>
        {(phase === 'recording' || phase === 'paused') && (
          <Pressable
            onPress={handleFinish}
            disabled={!started || !hasReachedMinimum}
            style={({ pressed }) => ({
              backgroundColor: hasReachedMinimum
                ? (pressed ? '#059669' : '#10B981')
                : 'rgba(255,255,255,0.15)',
              borderRadius: 32,
              paddingVertical: 20,
              alignItems: 'center',
              shadowColor: hasReachedMinimum ? '#059669' : 'transparent',
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: hasReachedMinimum ? 6 : 0,
            })}
          >
            <Text style={{ fontSize: 28, marginBottom: 4 }}>🌙</Text>
            <Text style={{
              fontSize: 18,
              fontWeight: '800',
              color: hasReachedMinimum ? 'white' : 'rgba(255,255,255,0.4)',
            }}>
              {hasReachedMinimum ? '¡Listo, a dormir!' : `Hablá ${MIN_RECORDING_SECONDS - elapsedSeconds}s más`}
            </Text>
          </Pressable>
        )}
      </View>

      {reward && (
        <GemRewardOverlay
          gemsEarned={reward.gemsEarned}
          bonusGems={reward.bonusGems}
          newStreak={reward.newStreak}
          onContinue={handleRewardContinue}
        />
      )}
    </SafeAreaView>
  );
}

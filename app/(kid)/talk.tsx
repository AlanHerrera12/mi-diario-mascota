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
  const { phase, elapsedSeconds, hasReachedMinimum, begin, finish, cancel } = useRecording();
  const { awardGems } = useGems();
  const { recordTalk } = useStreak();
  const [reward, setReward] = useState<RewardState | null>(null);
  const [started, setStarted] = useState(false);

  // Arrancar grabación al montar la pantalla
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

  // Haptic cuando se alcanza el minuto mínimo
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
      // Habló menos de 1 minuto — sin gemas, pero igual guarda la entrada
      router.replace('/(kid)/goodnight');
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

  const petMood = phase === 'recording' ? 'listening' : phase === 'done' ? 'happy' : 'idle';

  return (
    <SafeAreaView className="flex-1 bg-primary-50">
      {/* Botón de salida */}
      <View className="px-6 pt-4">
        <Pressable onPress={handleCancel} className="self-start">
          <Text className="text-gray-400 text-base">✕ Salir</Text>
        </Pressable>
      </View>

      {/* Mascota escuchando */}
      <View className="flex-1 items-center justify-center gap-6">
        {pet && <PetDisplay pet={pet} mood={petMood} size={160} />}

        <Text className="text-xl font-bold text-gray-700 text-center px-8">
          {phase === 'recording'
            ? hasReachedMinimum
              ? '¡Muy bien! Seguí contando...'
              : 'Te estoy escuchando... 👂'
            : phase === 'processing'
              ? 'Guardando tu historia...'
              : ''}
        </Text>

        {/* Anillo de progreso */}
        {(phase === 'recording' || phase === 'processing') && (
          <ProgressRing
            elapsedSeconds={elapsedSeconds}
            targetSeconds={MIN_RECORDING_SECONDS}
            size={220}
          />
        )}

        {/* Indicador de procesamiento */}
        {phase === 'processing' && (
          <Text className="text-gray-400 text-sm">Un momentito...</Text>
        )}
      </View>

      {/* Botón de finalizar — aparece al alcanzar el mínimo */}
      <View className="px-8 pb-10">
        {phase === 'recording' && (
          <Pressable
            onPress={handleFinish}
            disabled={!started}
            className={`rounded-4xl py-6 items-center shadow-lg
              ${hasReachedMinimum
                ? 'bg-secondary-500 active:bg-secondary-600'
                : 'bg-gray-200'}`}
          >
            <Text className="text-3xl mb-1">🌙</Text>
            <Text className={`text-xl font-bold ${hasReachedMinimum ? 'text-white' : 'text-gray-400'}`}>
              {hasReachedMinimum ? '¡Listo, a dormir!' : `Hablá ${MIN_RECORDING_SECONDS - elapsedSeconds}s más`}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Overlay de recompensa */}
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

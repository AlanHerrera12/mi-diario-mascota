import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ScreenWrapper } from '../../src/components/shared/ScreenWrapper';
import { PinInput } from '../../src/components/shared/PinInput';
import { validateParentPin, signOut } from '../../src/features/auth/useParentAuth';
import { useAuthStore } from '../../src/stores/auth.store';

export default function ParentPinScreen() {
  const [error, setError] = useState<string | undefined>();
  const [attempts, setAttempts] = useState(0);
  const unlockDashboard = useAuthStore(s => s.unlockParentDashboard);
  const parent = useAuthStore(s => s.parent);

  async function handlePin(pin: string) {
    const valid = await validateParentPin(pin);
    if (valid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      unlockDashboard();
      router.replace('/(parent)/dashboard');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const next = attempts + 1;
      setAttempts(next);
      if (next >= 5) {
        setError('Demasiados intentos fallidos. Cerrando sesión.');
        setTimeout(() => signOut(), 1500);
      } else {
        setError(`PIN incorrecto. Intentos restantes: ${5 - next}`);
      }
    }
  }

  return (
    <ScreenWrapper scroll={false} bg="bg-white">
      <Pressable
        onPress={() => router.back()}
        className="self-start mb-6"
      >
        <Text className="text-primary-500 text-base">← Volver</Text>
      </Pressable>

      <View className="flex-1 items-center justify-center">
        <View className="w-16 h-16 rounded-2xl bg-gray-100 items-center justify-center mb-4">
          <Text className="text-3xl">🔐</Text>
        </View>

        <Text className="text-2xl font-bold text-gray-900 mb-1">Panel de padres</Text>
        <Text className="text-gray-500 text-center text-sm mb-10 px-4">
          {parent?.fullName
            ? `Hola, ${parent.fullName.split(' ')[0]}. Ingresá tu PIN para continuar.`
            : 'Ingresá tu PIN para acceder.'}
        </Text>

        <PinInput
          length={4}
          label="Tu PIN de 4 dígitos"
          onComplete={handlePin}
          error={error}
        />
      </View>
    </ScreenWrapper>
  );
}

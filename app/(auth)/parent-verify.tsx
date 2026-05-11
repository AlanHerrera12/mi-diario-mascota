import { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '../../src/components/shared/ScreenWrapper';
import { CheckboxField } from '../../src/components/shared/CheckboxField';
import { PinInput } from '../../src/components/shared/PinInput';
import { PrimaryButton } from '../../src/components/shared/PrimaryButton';
import { useParentVerify } from '../../src/features/auth/useParentAuth';

// Los checkboxes de consentimiento según COPPA (USA) y GDPR-K (UE)
// Ver docs/privacy-decisions.md — PD-008
const CONSENT_ITEMS = [
  {
    id: 'adult',
    label: 'Confirmo que soy mayor de 18 años y el adulto responsable de este perfil.',
    required: true,
  },
  {
    id: 'terms',
    label: 'Acepto los Términos de Servicio de la aplicación.',
    required: true,
  },
  {
    id: 'privacy',
    label: 'Leí y acepto la Política de Privacidad, incluyendo el tratamiento de datos de menores.',
    required: true,
  },
  {
    id: 'voice',
    label: 'Autorizo la grabación y transcripción de voz de mi hijo/a exclusivamente para el funcionamiento de la app. Los audios se borran automáticamente a los 7 días.',
    required: true,
  },
  {
    id: 'supervision',
    label: 'Me comprometo a supervisar el uso de la app y a revisar los resúmenes semanales disponibles en el panel de padres.',
    required: false,
  },
];

type ConsentMethod = 'email_plus_form' | 'credit_card' | 'gov_id';

export default function ParentVerifyScreen() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [consentMethod] = useState<ConsentMethod>('email_plus_form');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [step, setStep] = useState<'consent' | 'pin' | 'confirm'>('consent');
  const [pinError, setPinError] = useState<string | undefined>();

  const { verify, loading } = useParentVerify();

  const requiredAll = CONSENT_ITEMS
    .filter(i => i.required)
    .every(i => checked[i.id]);

  function toggleCheck(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleConsentNext() {
    if (!requiredAll) {
      Alert.alert('Requerido', 'Aceptá todos los puntos obligatorios para continuar.');
      return;
    }
    setStep('pin');
  }

  function handlePinSet(value: string) {
    setPin(value);
    setStep('confirm');
  }

  function handlePinConfirm(value: string) {
    if (value !== pin) {
      setPinError('Los PINs no coinciden. Intentalo de nuevo.');
      setPinConfirm('');
      setStep('pin');
      setPin('');
      return;
    }
    setPinConfirm(value);
    setPinError(undefined);
    handleFinish(value);
  }

  async function handleFinish(confirmedPin: string) {
    const ok = await verify({ pin: confirmedPin, consentMethod });
    if (ok) {
      router.push('/(auth)/child-setup');
    } else {
      Alert.alert('Error', 'No se pudo guardar tu perfil. Intentá de nuevo.');
      setStep('consent');
    }
  }

  return (
    <ScreenWrapper bg="bg-white">
      {step === 'consent' && (
        <>
          <Text className="text-2xl font-bold text-gray-900 mb-1">Consentimiento</Text>
          <Text className="text-gray-500 mb-6 text-sm">
            Por ley debemos verificar que un adulto autoriza el uso de esta app por un menor.
          </Text>

          {CONSENT_ITEMS.map(item => (
            <CheckboxField
              key={item.id}
              checked={!!checked[item.id]}
              onToggle={() => toggleCheck(item.id)}
              label={item.label}
              required={item.required}
            />
          ))}

          {/* Sección informativa sobre privacidad */}
          <View className="bg-blue-50 rounded-2xl p-4 mb-6 mt-2">
            <Text className="text-blue-800 text-xs leading-5">
              🔒 <Text className="font-bold">Privacidad garantizada:</Text> Tu hijo/a no habla con
              una inteligencia artificial. La mascota responde con frases pregrabadas. Las grabaciones
              se borran a los 7 días. Nunca vendemos datos ni mostramos publicidad.
            </Text>
          </View>

          <PrimaryButton
            label="Aceptar y continuar"
            onPress={handleConsentNext}
            disabled={!requiredAll}
          />
        </>
      )}

      {step === 'pin' && (
        <View className="flex-1 items-center justify-center py-12">
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Creá tu PIN de padres
          </Text>
          <Text className="text-gray-500 text-center mb-8 text-sm px-4">
            Este PIN protege el acceso al panel de padres. Usalo solo vos.
          </Text>
          <PinInput
            length={4}
            label="Elegí 4 dígitos"
            onComplete={handlePinSet}
            error={pinError}
          />
        </View>
      )}

      {step === 'confirm' && (
        <View className="flex-1 items-center justify-center py-12">
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Confirmá tu PIN
          </Text>
          <Text className="text-gray-500 text-center mb-8 text-sm px-4">
            Ingresá el mismo PIN nuevamente para confirmarlo.
          </Text>
          <PinInput
            length={4}
            label="Repetí tu PIN"
            onComplete={handlePinConfirm}
            error={pinError}
          />
          {loading && (
            <Text className="text-gray-400 mt-4 text-sm">Guardando tu perfil...</Text>
          )}
        </View>
      )}
    </ScreenWrapper>
  );
}

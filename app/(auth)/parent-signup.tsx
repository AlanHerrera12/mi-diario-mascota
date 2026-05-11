import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '../../src/components/shared/ScreenWrapper';
import { AppTextInput } from '../../src/components/shared/AppTextInput';
import { PrimaryButton } from '../../src/components/shared/PrimaryButton';
import { useParentSignup } from '../../src/features/auth/useParentAuth';

const COUNTRY_OPTIONS = [
  { code: 'AR', label: '🇦🇷 Argentina' },
  { code: 'MX', label: '🇲🇽 México' },
  { code: 'ES', label: '🇪🇸 España' },
  { code: 'US', label: '🇺🇸 Estados Unidos' },
  { code: 'CO', label: '🇨🇴 Colombia' },
  { code: 'CL', label: '🇨🇱 Chile' },
];

export default function ParentSignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('AR');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signup, loading } = useParentSignup();

  function validate() {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Ingresá tu nombre completo.';
    if (!email.includes('@')) e.email = 'Email inválido.';
    if (password.length < 8) e.password = 'Mínimo 8 caracteres.';
    if (password !== confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignup() {
    if (!validate()) return;
    const result = await signup({ email, password, fullName, countryCode });
    if (result) {
      router.push('/(auth)/parent-verify');
    } else {
      Alert.alert('Error', 'No se pudo crear la cuenta. Verificá los datos.');
    }
  }

  return (
    <ScreenWrapper bg="bg-white">
      {/* Header */}
      <Pressable onPress={() => router.back()} className="mb-6">
        <Text className="text-primary-500 text-base">← Volver</Text>
      </Pressable>

      <Text className="text-2xl font-bold text-gray-900 mb-1">Crear cuenta</Text>
      <Text className="text-gray-500 mb-8">
        Esta es la cuenta del adulto responsable. Tu hijo/a no necesita una cuenta.
      </Text>

      <AppTextInput
        label="Nombre completo"
        placeholder="Juan García"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        error={errors.fullName}
      />

      <AppTextInput
        label="Email"
        placeholder="tu@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={errors.email}
      />

      <AppTextInput
        label="Contraseña"
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />

      <AppTextInput
        label="Confirmar contraseña"
        placeholder="Repetí tu contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        error={errors.confirmPassword}
      />

      {/* Selector de país simple */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-2">País</Text>
        <View className="flex-row flex-wrap gap-2">
          {COUNTRY_OPTIONS.map(c => (
            <Pressable
              key={c.code}
              onPress={() => setCountryCode(c.code)}
              className={`px-3 py-2 rounded-xl border
                ${countryCode === c.code
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-gray-50 border-gray-200 active:bg-gray-100'}`}
            >
              <Text className={`text-sm font-medium
                ${countryCode === c.code ? 'text-white' : 'text-gray-700'}`}>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <PrimaryButton label="Continuar" onPress={handleSignup} loading={loading} />

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-500">¿Ya tenés cuenta? </Text>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text className="text-primary-500 font-semibold">Iniciá sesión</Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}

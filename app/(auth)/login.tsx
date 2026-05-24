import { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '../../src/components/shared/ScreenWrapper';
import { AppTextInput } from '../../src/components/shared/AppTextInput';
import { PrimaryButton } from '../../src/components/shared/PrimaryButton';
import { useParentLogin } from '../../src/features/auth/useParentAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [transitioning, setTransitioning] = useState(false);

  const { login, loading } = useParentLogin();

  function validate() {
    const e: Record<string, string> = {};
    if (!email.includes('@')) e.email = 'Email inválido.';
    if (!password) e.password = 'Ingresá tu contraseña.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    setErrors({});
    if (!validate()) return;
    const ok = await login(email, password);
    if (!ok) {
      setErrors({ general: 'Email o contraseña incorrectos. Verificá tus datos.' });
      return;
    }
    // Auth OK — _layout.tsx onAuthStateChange carga datos y navega
    setTransitioning(true);
  }

  if (transitioning) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FF9800', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🐾</Text>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: 'white', marginTop: 16, fontSize: 18, fontWeight: '600' }}>
          Entrando...
        </Text>
      </View>
    );
  }

  return (
    <ScreenWrapper bg="bg-white">
      <Pressable onPress={() => router.back()} className="mb-6">
        <Text className="text-primary-500 text-base">← Volver</Text>
      </Pressable>

      {/* Logo / ícono placeholder */}
      <View className="items-center mb-8">
        <View className="w-20 h-20 rounded-3xl bg-primary-100 items-center justify-center mb-3">
          <Text className="text-4xl">🐾</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</Text>
        <Text className="text-gray-500 text-sm mt-1">Iniciá sesión con tu cuenta de adulto</Text>
      </View>

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
        placeholder="Tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />

      <Pressable className="self-end mb-6">
        <Text className="text-primary-500 text-sm">¿Olvidaste tu contraseña?</Text>
      </Pressable>

      {errors.general ? (
        <View className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 mb-4">
          <Text className="text-red-600 text-sm text-center">{errors.general}</Text>
        </View>
      ) : null}

      <PrimaryButton label="Iniciar sesión" onPress={handleLogin} loading={loading} />

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-500">¿No tenés cuenta? </Text>
        <Pressable onPress={() => router.push('/(auth)/parent-signup')}>
          <Text className="text-primary-500 font-semibold">Registrate</Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}

import { useState } from 'react';
import {
  View, Text, Pressable, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useParentSignup } from '../../src/features/auth/useParentAuth';

const COUNTRY_OPTIONS = [
  { code: 'AR', label: '🇦🇷 Argentina' },
  { code: 'MX', label: '🇲🇽 México' },
  { code: 'ES', label: '🇪🇸 España' },
  { code: 'US', label: '🇺🇸 Estados Unidos' },
  { code: 'CO', label: '🇨🇴 Colombia' },
  { code: 'CL', label: '🇨🇱 Chile' },
];

function Field({
  label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize, error,
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder?: string; secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address'; autoCapitalize?: 'none' | 'words';
  error?: string;
}) {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#A5B4FC', marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.3)"
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'none'}
        style={{
          borderWidth: 1.5,
          borderColor: error ? '#F87171' : 'rgba(129,140,248,0.35)',
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 16,
          color: 'white',
          backgroundColor: error ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.07)',
          marginBottom: error ? 4 : 14,
        }}
      />
      {error ? <Text style={{ color: '#F87171', fontSize: 12, marginBottom: 10 }}>{error}</Text> : null}
    </View>
  );
}

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#0D0626' }}
    >
      {/* dark bg via root style — no animated overlay */}

      {/* Top hero */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={{ paddingTop: 56, paddingBottom: 24, paddingHorizontal: 24, zIndex: 1 }}
      >
        <Pressable onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <Text style={{ color: '#A5B4FC', fontSize: 16 }}>← Volver</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{
            width: 56, height: 56, borderRadius: 18,
            backgroundColor: 'rgba(167,139,250,0.2)',
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
          }}>
            <Text style={{ fontSize: 28 }}>🔐</Text>
          </View>
          <View>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: '800' }}>Crear cuenta</Text>
            <Text style={{ color: '#818CF8', fontSize: 13, marginTop: 2 }}>
              Esta es la cuenta del adulto responsable
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Glass card */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(600)}
        style={{
          flex: 1,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          borderWidth: 1,
          borderColor: 'rgba(129,140,248,0.2)',
          paddingHorizontal: 28,
          paddingTop: 28,
          zIndex: 1,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Field
            label="Nombre completo"
            placeholder="Juan García"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            error={errors.fullName}
          />
          <Field
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />
          <Field
            label="Contraseña"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />
          <Field
            label="Confirmar contraseña"
            placeholder="Repetí tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />

          {/* País */}
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#A5B4FC', marginBottom: 10 }}>
            País
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {COUNTRY_OPTIONS.map(c => (
              <Pressable
                key={c.code}
                onPress={() => setCountryCode(c.code)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: countryCode === c.code ? '#7C3AED' : 'rgba(129,140,248,0.25)',
                  backgroundColor: countryCode === c.code ? '#7C3AED' : 'rgba(129,140,248,0.1)',
                }}
              >
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: countryCode === c.code ? 'white' : '#818CF8',
                }}>
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={handleSignup}
            disabled={loading}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#6D28D9' : '#7C3AED',
              borderRadius: 20,
              paddingVertical: 18,
              alignItems: 'center',
              shadowColor: '#7C3AED',
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 6,
              opacity: loading ? 0.8 : 1,
            })}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: '800' }}>
              {loading ? 'Creando cuenta...' : 'Continuar'}
            </Text>
          </Pressable>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 32 }}>
            <Text style={{ color: '#818CF8', fontSize: 14 }}>¿Ya tenés cuenta? </Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={{ color: '#A78BFA', fontSize: 14, fontWeight: '700' }}>Iniciá sesión</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

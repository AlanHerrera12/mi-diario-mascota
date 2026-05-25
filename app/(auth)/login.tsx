import { useState } from 'react';
import {
  View, Text, Pressable, ActivityIndicator, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { PetDogSVG } from '../../src/components/kid-ui/PetDogSVG';
import { StarField } from '../../src/components/shared/StarField';
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
    setTransitioning(true);
  }

  // Transitioning — dark loading screen
  if (transitioning) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D0626', alignItems: 'center', justifyContent: 'center' }}>
        <StarField />
        <PetDogSVG size={120} mood="happy" />
        <ActivityIndicator size="large" color="#A78BFA" style={{ marginTop: 24 }} />
        <Text style={{ color: 'white', marginTop: 16, fontSize: 18, fontWeight: '800' }}>
          Entrando...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#0D0626' }}
    >
      <StarField />

      {/* Top hero */}
      <Animated.View
        entering={FadeInDown.duration(600)}
        style={{ alignItems: 'center', paddingTop: 60, paddingBottom: 28, zIndex: 1 }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ position: 'absolute', top: 60, left: 24 }}
        >
          <Text style={{ color: '#A5B4FC', fontSize: 16 }}>← Volver</Text>
        </Pressable>

        <PetDogSVG size={110} mood="happy" />

        <Text style={{ color: 'white', fontSize: 26, fontWeight: '800', marginTop: 8 }}>
          ¡Hola de vuelta!
        </Text>
        <Text style={{ color: '#818CF8', fontSize: 14, marginTop: 4 }}>
          Iniciá sesión con tu cuenta de adulto
        </Text>
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
          paddingTop: 32,
          zIndex: 1,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Email */}
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#A5B4FC', marginBottom: 6 }}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="tu@email.com"
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={{
              borderWidth: 1.5,
              borderColor: errors.email ? '#F87171' : 'rgba(129,140,248,0.35)',
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
              color: 'white',
              backgroundColor: errors.email ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.07)',
              marginBottom: errors.email ? 4 : 16,
            }}
          />
          {errors.email ? (
            <Text style={{ color: '#F87171', fontSize: 12, marginBottom: 12 }}>{errors.email}</Text>
          ) : null}

          {/* Contraseña */}
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#A5B4FC', marginBottom: 6 }}>
            Contraseña
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Tu contraseña"
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={{
              borderWidth: 1.5,
              borderColor: errors.password ? '#F87171' : 'rgba(129,140,248,0.35)',
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
              color: 'white',
              backgroundColor: errors.password ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.07)',
              marginBottom: errors.password ? 4 : 8,
            }}
          />
          {errors.password ? (
            <Text style={{ color: '#F87171', fontSize: 12, marginBottom: 4 }}>{errors.password}</Text>
          ) : null}

          <Pressable style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
            <Text style={{ color: '#818CF8', fontSize: 13, fontWeight: '600' }}>
              ¿Olvidaste tu contraseña?
            </Text>
          </Pressable>

          {errors.general ? (
            <View style={{
              backgroundColor: 'rgba(248,113,113,0.1)',
              borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)',
              borderRadius: 14, padding: 14, marginBottom: 16,
            }}>
              <Text style={{ color: '#F87171', fontSize: 13, textAlign: 'center' }}>
                {errors.general}
              </Text>
            </View>
          ) : null}

          {/* CTA */}
          <Pressable
            onPress={handleLogin}
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
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={{ color: 'white', fontSize: 17, fontWeight: '800' }}>Iniciar sesión</Text>
            }
          </Pressable>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 32 }}>
            <Text style={{ color: '#818CF8', fontSize: 14 }}>¿No tenés cuenta? </Text>
            <Pressable onPress={() => router.push('/(auth)/parent-signup')}>
              <Text style={{ color: '#A78BFA', fontSize: 14, fontWeight: '700' }}>Registrate</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

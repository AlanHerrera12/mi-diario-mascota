import { useState } from 'react';
import { View, Text, Alert, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { AppTextInput } from '../../src/components/shared/AppTextInput';
import { PetSpeciesSelector } from '../../src/components/pet/PetSpeciesSelector';
import { useChildSetup } from '../../src/features/auth/useParentAuth';
import { PetAvatar } from '../../src/components/kid-ui/PetAvatar';
import type { Child, PetSpecies } from '../../src/types';

const AGE_RANGES: { value: Child['ageRange']; label: string }[] = [
  { value: '5-7',   label: '5 – 7 años' },
  { value: '8-10',  label: '8 – 10 años' },
  { value: '11-13', label: '11 – 13 años' },
  { value: '14+',   label: '14 o más' },
];

// Default colors stored in DB — actual appearance comes from the PNG art
const DEFAULT_BASE_COLOR = '#A78BFA';
const DEFAULT_ACCENT_COLOR = '#7C3AED';

export default function ChildSetupScreen() {
  const [childName, setChildName] = useState('');
  const [ageRange, setAgeRange] = useState<Child['ageRange'] | null>(null);
  const [petSpecies, setPetSpecies] = useState<PetSpecies | null>(null);
  const [petName, setPetName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { setupChild, loading } = useChildSetup();

  function validate() {
    const e: Record<string, string> = {};
    if (!childName.trim()) e.childName = 'Ingresá el nombre o apodo de tu hijo/a.';
    if (!ageRange) e.ageRange = 'Seleccioná el rango de edad.';
    if (!petSpecies) e.petSpecies = 'Elegí una mascota.';
    if (!petName.trim()) e.petName = 'Poné un nombre a tu mascota.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleCreate() {
    if (!validate()) return;
    const ok = await setupChild({
      displayName: childName.trim(),
      ageRange: ageRange!,
      petSpecies: petSpecies!,
      petName: petName.trim(),
      petBaseColor: DEFAULT_BASE_COLOR,
      petAccentColor: DEFAULT_ACCENT_COLOR,
    });
    if (ok) {
      router.replace('/(kid)/home');
    } else {
      Alert.alert('Error', 'No se pudo crear el perfil. Intentá de nuevo.');
    }
  }


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0D0626' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#F0EBFF', marginBottom: 6 }}>
          Conocé a tu mascota
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 32 }}>
          Configurá el perfil de tu hijo/a y elegí la mascota que lo acompañará.
        </Text>

        {/* Perfil del niño */}
        <View style={{
          backgroundColor: 'rgba(129,140,248,0.08)',
          borderRadius: 24, padding: 20, marginBottom: 20,
          borderWidth: 1, borderColor: 'rgba(129,140,248,0.15)',
        }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#A5B4FC', marginBottom: 16 }}>
            👶 Tu hijo/a
          </Text>

          <AppTextInput
            label="Nombre o apodo"
            placeholder="Como quiera que lo llame la mascota"
            value={childName}
            onChangeText={setChildName}
            autoCapitalize="words"
            error={errors.childName}
          />

          <Text style={{ fontSize: 13, fontWeight: '700', color: '#A5B4FC', marginBottom: 10, marginTop: 4 }}>
            Edad
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
            {AGE_RANGES.map(a => (
              <Pressable
                key={a.value}
                onPress={() => setAgeRange(a.value)}
                style={{
                  paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,
                  borderWidth: 1.5,
                  backgroundColor: ageRange === a.value ? '#818CF8' : 'rgba(255,255,255,0.05)',
                  borderColor: ageRange === a.value ? '#818CF8' : 'rgba(129,140,248,0.25)',
                }}
              >
                <Text style={{
                  fontSize: 13, fontWeight: '600',
                  color: ageRange === a.value ? 'white' : 'rgba(255,255,255,0.6)',
                }}>
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </View>
          {errors.ageRange && (
            <Text style={{ color: '#F87171', fontSize: 12, marginTop: 4 }}>{errors.ageRange}</Text>
          )}
        </View>

        {/* Mascota */}
        <View style={{
          backgroundColor: 'rgba(167,139,250,0.06)',
          borderRadius: 24, padding: 20, marginBottom: 20,
          borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)',
        }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#C4B5FD', marginBottom: 16 }}>
            🐾 La mascota
          </Text>

          <PetSpeciesSelector selected={petSpecies} onSelect={setPetSpecies} />
          {errors.petSpecies && (
            <Text style={{ color: '#F87171', fontSize: 12, marginTop: 8 }}>{errors.petSpecies}</Text>
          )}

          <View style={{ marginTop: 20 }}>
            <AppTextInput
              label="Nombre de la mascota"
              placeholder="¿Cómo se llama?"
              value={petName}
              onChangeText={setPetName}
              autoCapitalize="words"
              error={errors.petName}
            />
          </View>
        </View>

        {/* Vista previa */}
        {petSpecies && petName ? (
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderRadius: 24, padding: 20, marginBottom: 28,
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
            alignItems: 'center',
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 8, fontWeight: '600', letterSpacing: 1 }}>
              VISTA PREVIA
            </Text>
            <PetAvatar species={petSpecies} size={110} mood="happy" />
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#F0EBFF', marginTop: 8 }}>{petName}</Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
              listo para escuchar a {childName || '...'}
            </Text>
          </View>
        ) : null}

        {/* CTA */}
        <Pressable
          onPress={handleCreate}
          disabled={loading}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#DB2777' : '#EC4899',
            borderRadius: 18, paddingVertical: 16,
            alignItems: 'center', justifyContent: 'center',
            opacity: loading ? 0.6 : 1,
            shadowColor: '#EC4899', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
          })}
        >
          <Text style={{ fontSize: 16, fontWeight: '800', color: 'white', letterSpacing: 0.3 }}>
            {loading ? 'Creando...' : '¡Crear mascota!'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

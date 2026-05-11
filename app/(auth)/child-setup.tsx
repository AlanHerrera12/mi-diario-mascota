import { useState } from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '../../src/components/shared/ScreenWrapper';
import { AppTextInput } from '../../src/components/shared/AppTextInput';
import { PrimaryButton } from '../../src/components/shared/PrimaryButton';
import { PetSpeciesSelector } from '../../src/components/pet/PetSpeciesSelector';
import { ColorPicker } from '../../src/components/pet/ColorPicker';
import { useChildSetup } from '../../src/features/auth/useParentAuth';
import type { Child, PetSpecies } from '../../src/types';

const AGE_RANGES: { value: Child['ageRange']; label: string }[] = [
  { value: '5-7',   label: '5 – 7 años' },
  { value: '8-10',  label: '8 – 10 años' },
  { value: '11-13', label: '11 – 13 años' },
  { value: '14+',   label: '14 o más' },
];

export default function ChildSetupScreen() {
  const [childName, setChildName] = useState('');
  const [ageRange, setAgeRange] = useState<Child['ageRange'] | null>(null);
  const [petSpecies, setPetSpecies] = useState<PetSpecies | null>(null);
  const [petName, setPetName] = useState('');
  const [petBaseColor, setPetBaseColor] = useState('#FF9800');
  const [petAccentColor, setPetAccentColor] = useState('#FFF5E6');
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
      petBaseColor,
      petAccentColor,
    });
    if (ok) {
      router.replace('/(kid)/home');
    } else {
      Alert.alert('Error', 'No se pudo crear el perfil. Intentá de nuevo.');
    }
  }

  return (
    <ScreenWrapper bg="bg-white">
      <Text className="text-2xl font-bold text-gray-900 mb-1">Conocé a tu mascota</Text>
      <Text className="text-gray-500 mb-8 text-sm">
        Configurá el perfil de tu hijo/a y elegí la mascota que lo acompañará.
      </Text>

      {/* Perfil del niño */}
      <View className="bg-primary-50 rounded-3xl p-5 mb-6">
        <Text className="text-base font-bold text-primary-800 mb-4">👶 Tu hijo/a</Text>

        <AppTextInput
          label="Nombre o apodo"
          placeholder="Como quiera que lo llame la mascota"
          value={childName}
          onChangeText={setChildName}
          autoCapitalize="words"
          error={errors.childName}
        />

        <Text className="text-sm font-semibold text-gray-700 mb-2">Edad</Text>
        <View className="flex-row flex-wrap gap-2 mb-1">
          {AGE_RANGES.map(a => (
            <Pressable
              key={a.value}
              onPress={() => setAgeRange(a.value)}
              className={`px-4 py-2 rounded-xl border
                ${ageRange === a.value
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-white border-gray-200 active:bg-gray-50'}`}
            >
              <Text className={`text-sm font-semibold
                ${ageRange === a.value ? 'text-white' : 'text-gray-700'}`}>
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.ageRange && (
          <Text className="text-red-500 text-xs mt-1">{errors.ageRange}</Text>
        )}
      </View>

      {/* Mascota */}
      <View className="bg-secondary-50 rounded-3xl p-5 mb-6">
        <Text className="text-base font-bold text-secondary-800 mb-4">🐾 La mascota</Text>

        <PetSpeciesSelector selected={petSpecies} onSelect={setPetSpecies} />
        {errors.petSpecies && (
          <Text className="text-red-500 text-xs mt-1 mb-3">{errors.petSpecies}</Text>
        )}

        <View className="mt-4">
          <AppTextInput
            label="Nombre de la mascota"
            placeholder="¿Cómo se llama?"
            value={petName}
            onChangeText={setPetName}
            autoCapitalize="words"
            error={errors.petName}
          />
        </View>

        <ColorPicker
          label="Color principal"
          selected={petBaseColor}
          onSelect={setPetBaseColor}
        />
        <ColorPicker
          label="Color secundario"
          selected={petAccentColor}
          onSelect={setPetAccentColor}
        />
      </View>

      {/* Preview simple */}
      {petSpecies && petName && (
        <View className="bg-gray-50 rounded-3xl p-5 mb-6 items-center">
          <Text className="text-gray-500 text-xs mb-2">Vista previa</Text>
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-2"
            style={{ backgroundColor: petBaseColor }}
          >
            <Text className="text-5xl">
              {petSpecies === 'dog' ? '🐶' : petSpecies === 'cat' ? '🐱' :
               petSpecies === 'rabbit' ? '🐰' : petSpecies === 'bear' ? '🐻' :
               petSpecies === 'elephant' ? '🐘' : petSpecies === 'giraffe' ? '🦒' :
               petSpecies === 'dragon' ? '🐲' : '🦄'}
            </Text>
          </View>
          <Text className="text-lg font-bold text-gray-800">{petName}</Text>
          <Text className="text-gray-500 text-sm">listo para escuchar a {childName || '...'}</Text>
        </View>
      )}

      <PrimaryButton label="¡Crear mascota!" onPress={handleCreate} loading={loading} />
    </ScreenWrapper>
  );
}

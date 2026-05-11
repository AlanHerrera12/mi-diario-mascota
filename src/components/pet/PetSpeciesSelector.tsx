import { View, Text, Pressable, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { PetSpecies } from '../../types';

// TODO (assets): reemplazar emojis con previews de las animaciones Rive
const SPECIES_OPTIONS: { id: PetSpecies; emoji: string; label: string }[] = [
  { id: 'dog',      emoji: '🐶', label: 'Perro' },
  { id: 'cat',      emoji: '🐱', label: 'Gato' },
  { id: 'rabbit',   emoji: '🐰', label: 'Conejo' },
  { id: 'bear',     emoji: '🐻', label: 'Oso' },
  { id: 'elephant', emoji: '🐘', label: 'Elefante' },
  { id: 'giraffe',  emoji: '🦒', label: 'Jirafa' },
  { id: 'dragon',   emoji: '🐲', label: 'Dragón' },
  { id: 'unicorn',  emoji: '🦄', label: 'Unicornio' },
];

interface Props {
  selected: PetSpecies | null;
  onSelect: (species: PetSpecies) => void;
}

export function PetSpeciesSelector({ selected, onSelect }: Props) {
  function handleSelect(species: PetSpecies) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(species);
  }

  return (
    <View>
      <Text className="text-base font-semibold text-gray-700 mb-3">
        ¿Qué tipo de mascota querés?
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3 pb-2">
          {SPECIES_OPTIONS.map(opt => (
            <Pressable
              key={opt.id}
              onPress={() => handleSelect(opt.id)}
              className={`items-center justify-center rounded-3xl p-4 w-20
                ${selected === opt.id
                  ? 'bg-primary-500 shadow-md'
                  : 'bg-gray-100 active:bg-gray-200'}`}
            >
              <Text className="text-4xl mb-1">{opt.emoji}</Text>
              <Text className={`text-xs font-semibold ${selected === opt.id ? 'text-white' : 'text-gray-600'}`}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

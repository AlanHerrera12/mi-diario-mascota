import { View, Text, Pressable, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { PetSpecies } from '../../types';
import { PET_LIST, CATEGORY_META, type PetCategory } from '../../lib/pet-images';
import { PetAvatar } from '../kid-ui/PetAvatar';

interface Props {
  selected: PetSpecies | null;
  onSelect: (species: PetSpecies) => void;
}

const UNLOCKABLE_CATEGORIES: PetCategory[] = ['epic', 'legendary'];

export function PetSpeciesSelector({ selected, onSelect }: Props) {
  function handleSelect(species: PetSpecies, category: PetCategory) {
    if (UNLOCKABLE_CATEGORIES.includes(category)) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(species);
  }

  const categories: PetCategory[] = ['common', 'epic', 'legendary'];

  return (
    <View style={{ gap: 20 }}>
      {categories.map(cat => {
        const meta = CATEGORY_META[cat];
        const pets = PET_LIST.filter(p => p.category === cat);
        const isLocked = UNLOCKABLE_CATEGORIES.includes(cat);

        return (
          <View key={cat}>
            {/* Category header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Text style={{ fontSize: 16 }}>{meta.badge}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: meta.color, letterSpacing: 0.5 }}>
                {meta.label.toUpperCase()}
              </Text>
              {isLocked && (
                <View style={{
                  marginLeft: 4,
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                }}>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>
                    {cat === 'epic' ? '🔒 100 días de racha o tienda' : '🔒 Tienda'}
                  </Text>
                </View>
              )}
            </View>

            {/* Pet cards row */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 12, paddingBottom: 4 }}>
                {pets.map(pet => {
                  const isSelected = selected === pet.species;
                  const locked = isLocked;

                  return (
                    <Pressable
                      key={pet.species}
                      onPress={() => handleSelect(pet.species, cat)}
                      style={({ pressed }) => ({
                        width: 90,
                        alignItems: 'center',
                        borderRadius: 20,
                        padding: 10,
                        backgroundColor: isSelected
                          ? `${meta.color}22`
                          : locked
                          ? 'rgba(255,255,255,0.03)'
                          : pressed
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(255,255,255,0.05)',
                        borderWidth: 1.5,
                        borderColor: isSelected
                          ? meta.color
                          : locked
                          ? 'rgba(255,255,255,0.07)'
                          : 'rgba(255,255,255,0.10)',
                        opacity: locked ? 0.6 : 1,
                      })}
                    >
                      {/* Pet SVG thumbnail */}
                      <View style={{ position: 'relative', width: 64, height: 64, marginBottom: 6 }}>
                        <PetAvatar species={pet.species} size={64} mood="idle" />
                        {locked && (
                          <View style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.45)',
                            borderRadius: 12,
                          }}>
                            <Text style={{ fontSize: 22 }}>🔒</Text>
                          </View>
                        )}
                      </View>

                      {/* Pet name */}
                      <Text style={{
                        fontSize: 11,
                        fontWeight: '700',
                        color: isSelected ? meta.color : locked ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.75)',
                        textAlign: 'center',
                      }}>
                        {pet.label}
                      </Text>

                      {/* Selected checkmark */}
                      {isSelected && (
                        <View style={{
                          position: 'absolute',
                          top: 6, right: 6,
                          width: 18, height: 18,
                          borderRadius: 9,
                          backgroundColor: meta.color,
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Text style={{ fontSize: 10, color: 'white' }}>✓</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
}

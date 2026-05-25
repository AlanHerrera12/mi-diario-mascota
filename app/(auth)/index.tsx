import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { StarField } from '../../src/components/shared/StarField';
import { PetDogSVG } from '../../src/components/kid-ui/PetDogSVG';

export default function WelcomeScreen() {
  return (
    <View style={{
      flex: 1, backgroundColor: '#0D0626',
      alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 24, paddingTop: 64, paddingBottom: 48,
    }}>
      <StarField />

      {/* Tagline bubble */}
      <View style={{
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(129,140,248,0.2)',
        maxWidth: 300,
      }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: 'white', textAlign: 'center' }}>
          Habla, juega, y gana{' '}
          <Text style={{ color: '#EC4899' }}>recompensas</Text>
        </Text>
        {/* Bubble tail */}
        <View style={{
          position: 'absolute',
          bottom: -12,
          left: '50%',
          marginLeft: -12,
          width: 0, height: 0,
          borderLeftWidth: 12, borderRightWidth: 12, borderTopWidth: 12,
          borderLeftColor: 'transparent', borderRightColor: 'transparent',
          borderTopColor: 'rgba(255,255,255,0.08)',
        }} />
      </View>

      {/* Pet area */}
      <View style={{ alignItems: 'center', marginTop: 32 }}>
        {/* Left speech bubble */}
        <View style={{
          backgroundColor: 'rgba(129,140,248,0.15)',
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 10,
          marginBottom: 20,
          alignSelf: 'flex-start',
          marginLeft: 8,
          maxWidth: 220,
          borderWidth: 1,
          borderColor: 'rgba(129,140,248,0.25)',
        }}>
          <Text style={{ fontSize: 13, color: '#A5B4FC', fontWeight: '600' }}>
            ¿Cómo fue tu día hoy? Cuéntame todo 💙
          </Text>
          <View style={{
            position: 'absolute', bottom: -8, left: 20,
            width: 0, height: 0,
            borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8,
            borderLeftColor: 'transparent', borderRightColor: 'transparent',
            borderTopColor: 'rgba(129,140,248,0.15)',
          }} />
        </View>

        {/* Pet avatar — dark circle bg with SVG */}
        <View style={{
          width: 180, height: 180, borderRadius: 90,
          backgroundColor: '#2D1B69',
          alignItems: 'center', justifyContent: 'center',
          borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.35)',
          shadowColor: '#7C3AED', shadowOpacity: 0.5, shadowRadius: 24, elevation: 10,
        }}>
          <PetDogSVG size={150} mood="happy" />
        </View>

        {/* Right speech bubble */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: 16,
          paddingHorizontal: 14,
          paddingVertical: 10,
          marginTop: 16,
          alignSelf: 'flex-end',
          marginRight: 8,
          maxWidth: 200,
          borderWidth: 1,
          borderColor: 'rgba(129,140,248,0.2)',
        }}>
          <Text style={{ fontSize: 13, color: '#C4B5FD', fontWeight: '600' }}>
            ¡Hola! Soy tu mejor amigo 🐾
          </Text>
          <View style={{
            position: 'absolute', top: -8, right: 20,
            width: 0, height: 0,
            borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 8,
            borderLeftColor: 'transparent', borderRightColor: 'transparent',
            borderBottomColor: 'rgba(255,255,255,0.06)',
          }} />
        </View>
      </View>

      {/* Buttons */}
      <View style={{ width: '100%', gap: 12, marginTop: 32 }}>
        <Pressable
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#DB2777' : '#EC4899',
            borderRadius: 32,
            paddingVertical: 18,
            alignItems: 'center',
            shadowColor: '#BE185D',
            shadowOpacity: 0.45,
            shadowRadius: 10,
            elevation: 6,
          })}
          onPress={() => router.push('/(auth)/parent-signup')}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '800' }}>
            Soy un adulto — Crear cuenta
          </Text>
        </Pressable>

        <Pressable
          style={{ paddingVertical: 14, alignItems: 'center' }}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={{ color: '#A5B4FC', fontSize: 16, fontWeight: '600' }}>
            Ya tengo cuenta →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

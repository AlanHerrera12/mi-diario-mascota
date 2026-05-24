import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#7C3AED' }} className="items-center justify-between px-6 pt-16 pb-12">

      {/* Decorative stars */}
      <View style={{ position: 'absolute', top: 60, left: 24 }}>
        <Text style={{ fontSize: 22, opacity: 0.8 }}>⭐</Text>
      </View>
      <View style={{ position: 'absolute', top: 100, right: 30 }}>
        <Text style={{ fontSize: 16, opacity: 0.6 }}>✨</Text>
      </View>
      <View style={{ position: 'absolute', top: 180, left: 40 }}>
        <Text style={{ fontSize: 12, opacity: 0.5 }}>⭐</Text>
      </View>

      {/* Cloud speech bubble — tagline */}
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          paddingHorizontal: 24,
          paddingVertical: 16,
          marginTop: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          maxWidth: 300,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937', textAlign: 'center' }}>
          Habla, juega, y gana{' '}
          <Text style={{ color: '#EC4899' }}>recompensas</Text>
        </Text>
        {/* Bubble tail */}
        <View
          style={{
            position: 'absolute',
            bottom: -12,
            left: '50%',
            marginLeft: -12,
            width: 0,
            height: 0,
            borderLeftWidth: 12,
            borderRightWidth: 12,
            borderTopWidth: 12,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: 'white',
          }}
        />
      </View>

      {/* Pet area */}
      <View className="items-center" style={{ marginTop: 32 }}>
        {/* Left speech bubble */}
        <View
          style={{
            backgroundColor: '#EDE9FE',
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginBottom: 16,
            alignSelf: 'flex-start',
            marginLeft: 8,
            maxWidth: 220,
          }}
        >
          <Text style={{ fontSize: 13, color: '#5B21B6', fontWeight: '600' }}>
            ¿Cómo fue tu día hoy? Cuéntame todo 💙
          </Text>
          <View
            style={{
              position: 'absolute',
              bottom: -8,
              left: 20,
              width: 0,
              height: 0,
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderTopWidth: 8,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: '#EDE9FE',
            }}
          />
        </View>

        {/* Pet avatar */}
        <View
          style={{
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: '#C4B5FD',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#5B21B6',
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 90 }}>🐶</Text>
        </View>

        {/* Right speech bubble */}
        <View
          style={{
            backgroundColor: '#FDF4FF',
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 10,
            marginTop: 14,
            alignSelf: 'flex-end',
            marginRight: 8,
            maxWidth: 200,
          }}
        >
          <Text style={{ fontSize: 13, color: '#7C3AED', fontWeight: '600' }}>
            ¡Hola! Soy tu mejor amigo 🐾
          </Text>
          <View
            style={{
              position: 'absolute',
              top: -8,
              right: 20,
              width: 0,
              height: 0,
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderBottomWidth: 8,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#FDF4FF',
            }}
          />
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
            shadowOpacity: 0.4,
            shadowRadius: 8,
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
          <Text style={{ color: '#EDE9FE', fontSize: 16, fontWeight: '600' }}>
            Ya tengo cuenta →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

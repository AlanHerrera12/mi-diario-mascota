import { useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withDelay, withTiming, withRepeat, withSequence,
  FadeIn, FadeInDown, Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { usePetStore } from '../../src/stores/pet.store';
import { PetDisplay } from '../../src/components/kid-ui/PetDisplay';

// Twinkling star
function Star({ delay, x, y, size = 16 }: { delay: number; x: string; y: string; size?: number }) {
  const opacity = useSharedValue(0.2);
  const scale = useSharedValue(0.8);
  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1,   { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.2, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      ), -1, true,
    ));
    scale.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1.3, { duration: 900 }),
        withTiming(0.8, { duration: 900 }),
      ), -1, true,
    ));
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.Text style={[style, { position: 'absolute', left: x, top: y, fontSize: size }]}>
      ✦
    </Animated.Text>
  );
}

// Floating moon animation
function FloatingMoon() {
  const translateY = useSharedValue(0);
  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0,   { duration: 2500, easing: Easing.inOut(Easing.sin) }),
      ), -1, true,
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  return (
    <Animated.Text style={[style, { fontSize: 72, textAlign: 'center' }]}>🌙</Animated.Text>
  );
}

export default function GoodnightScreen() {
  const pet = usePetStore(s => s.pet);

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#060318' }}>

      {/* Star field */}
      <View style={{ position: 'absolute', inset: 0 }} pointerEvents="none">
        {[
          { x: '8%',  y: '8%',  delay: 0,    size: 14 },
          { x: '78%', y: '6%',  delay: 300,  size: 12 },
          { x: '45%', y: '14%', delay: 700,  size: 10 },
          { x: '90%', y: '22%', delay: 200,  size: 16 },
          { x: '15%', y: '30%', delay: 900,  size: 10 },
          { x: '65%', y: '40%', delay: 500,  size: 12 },
          { x: '5%',  y: '55%', delay: 1100, size: 14 },
          { x: '85%', y: '60%', delay: 400,  size: 10 },
          { x: '35%', y: '72%', delay: 800,  size: 12 },
          { x: '70%', y: '82%', delay: 150,  size: 14 },
          { x: '22%', y: '88%', delay: 600,  size: 10 },
        ].map((s, i) => <Star key={i} {...s} />)}
      </View>

      {/* Subtle purple nebula blobs */}
      <View style={{
        position: 'absolute', top: -60, left: -60,
        width: 200, height: 200, borderRadius: 100,
        backgroundColor: '#4C1D95', opacity: 0.25,
      }} pointerEvents="none" />
      <View style={{
        position: 'absolute', bottom: 60, right: -40,
        width: 160, height: 160, borderRadius: 80,
        backgroundColor: '#1E1B4B', opacity: 0.4,
      }} pointerEvents="none" />

      {/* Central content */}
      <Animated.View
        entering={FadeIn.delay(200).duration(900)}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}
      >
        <FloatingMoon />

        {/* Pet sleeping */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(700)}
          style={{ marginTop: 20, marginBottom: 24 }}
        >
          {/* Glow ring */}
          <View style={{
            position: 'absolute', top: -16, left: -16, right: -16, bottom: -16,
            borderRadius: 120, backgroundColor: '#4C1D95', opacity: 0.35,
          }} />
          <View style={{
            backgroundColor: '#1E1B4B',
            borderRadius: 100,
            width: 180, height: 180,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 1, borderColor: 'rgba(129,140,248,0.25)',
            shadowColor: '#818CF8', shadowOpacity: 0.3, shadowRadius: 20,
            elevation: 10,
          }}>
            {pet ? (
              <PetDisplay pet={pet} mood="sleepy" size={150} showName={false} />
            ) : (
              <Text style={{ fontSize: 70 }}>🐾</Text>
            )}
          </View>
        </Animated.View>

        {/* Zzz dots */}
        <Animated.View
          entering={FadeIn.delay(600).duration(600)}
          style={{ flexDirection: 'row', gap: 4, marginBottom: 20 }}
        >
          {['Z', 'Z', 'z'].map((z, i) => (
            <Text key={i} style={{
              color: '#818CF8', fontWeight: '800',
              fontSize: i === 2 ? 12 : 16,
              opacity: 0.6 - i * 0.1,
            }}>{z}</Text>
          ))}
        </Animated.View>

        <Animated.Text
          entering={FadeIn.delay(500).duration(700)}
          style={{ fontSize: 28, fontWeight: '800', color: 'white', textAlign: 'center', marginBottom: 8 }}
        >
          Buenas noches{pet?.name ? `, ${pet.name}` : ''} 🌙
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.delay(600).duration(700)}
          style={{ color: '#818CF8', fontSize: 15, textAlign: 'center', lineHeight: 22 }}
        >
          Gracias por contarme tu día.{'\n'}¡Hasta mañana!
        </Animated.Text>
      </Animated.View>

      {/* Bottom buttons */}
      <Animated.View
        entering={FadeInDown.delay(700).duration(600)}
        style={{ paddingHorizontal: 24, paddingBottom: 36, gap: 12 }}
      >
        {/* Mini-games CTA */}
        <Pressable
          onPress={() => router.push('/(kid)/mini-games')}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#1E1B4B' : '#312E81',
            borderRadius: 28,
            paddingVertical: 20,
            alignItems: 'center',
            gap: 2,
            borderWidth: 1,
            borderColor: 'rgba(129,140,248,0.35)',
            shadowColor: '#6366F1',
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 6,
          })}
        >
          <Text style={{ fontSize: 28, marginBottom: 2 }}>🎮</Text>
          <Text style={{ color: 'white', fontSize: 17, fontWeight: '800' }}>
            Jugar antes de dormir
          </Text>
          <Text style={{ color: '#818CF8', fontSize: 12, marginTop: 2 }}>
            +⭐ por cada juego completado
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace('/(kid)/home')}
          style={({ pressed }) => ({
            borderWidth: 1, borderColor: 'rgba(129,140,248,0.25)',
            borderRadius: 24, paddingVertical: 16, alignItems: 'center',
            backgroundColor: pressed ? 'rgba(129,140,248,0.1)' : 'transparent',
          })}
        >
          <Text style={{ color: '#818CF8', fontSize: 15, fontWeight: '600' }}>
            Volver al inicio
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

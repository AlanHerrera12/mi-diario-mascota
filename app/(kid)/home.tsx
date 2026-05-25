import { useEffect, useState } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { PetDisplay } from '../../src/components/kid-ui/PetDisplay';
import { useAuthStore } from '../../src/stores/auth.store';
import { usePetStore } from '../../src/stores/pet.store';
import { useGems } from '../../src/features/gems-economy/useGems';
import { useStreak } from '../../src/features/streaks/useStreak';
import { GEMS } from '../../src/constants';

function getPetMood(lastTalkDate: string | null) {
  if (!lastTalkDate) return 'missing_you' as const;
  const today = new Date().toISOString().split('T')[0];
  if (lastTalkDate === today) return 'happy' as const;
  const diff = (Date.now() - new Date(lastTalkDate).getTime()) / 86400000;
  return diff > 1 ? 'missing_you' as const : 'idle' as const;
}

function getNextMilestone(streak: number) {
  const milestones: { days: number; gems: number }[] = [
    { days: 3,   gems: 10 },
    { days: 7,   gems: GEMS.STREAK_7_DAYS },
    { days: 14,  gems: GEMS.STREAK_7_DAYS },
    { days: 30,  gems: GEMS.STREAK_30_DAYS },
    { days: 60,  gems: GEMS.STREAK_30_DAYS },
    { days: 100, gems: GEMS.STREAK_30_DAYS * 2 },
  ];
  return milestones.find(m => m.days > streak) ?? null;
}

// Twinkling background star
function Star({ x, y, delay, size = 12 }: { x: string; y: string; delay: number; size?: number }) {
  const opacity = useSharedValue(0.15);
  const scale = useSharedValue(0.8);
  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.85, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.15, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
      ), -1, true,
    ));
    scale.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1100 }),
        withTiming(0.8, { duration: 1100 }),
      ), -1, true,
    ));
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.Text style={[style, { position: 'absolute', left: x, top: y, fontSize: size, color: '#C4B5FD' }]}>
      ✦
    </Animated.Text>
  );
}

export default function KidHomeScreen() {
  const activeChild = useAuthStore(s => s.activeChild);
  const pet = usePetStore(s => s.pet);
  const lastTalkDate = usePetStore(s => s.lastTalkDate);
  const { gemBalance, loadBalance } = useGems();
  const { currentStreak, loadStreak } = useStreak();
  const [streakExpanded, setStreakExpanded] = useState(false);

  useEffect(() => {
    loadBalance();
    loadStreak();
  }, []);

  function handleTalk() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/(kid)/talk');
  }

  function handleParentAccess() {
    router.push('/(parent)/pin');
  }

  if (!pet || !activeChild) return null;

  const mood = getPetMood(lastTalkDate);
  const nextMilestone = getNextMilestone(currentStreak);

  const greeting =
    mood === 'missing_you'
      ? `¡${activeChild.displayName}, te extrañé!`
      : mood === 'happy'
        ? `¡Hola de nuevo, ${activeChild.displayName}!`
        : `Hola, ${activeChild.displayName} 👋`;

  const subtext =
    mood === 'missing_you'
      ? '¿Me contás cómo te fue hoy?'
      : mood === 'happy'
        ? '¡Qué bueno que volviste!'
        : '¿Cómo estás hoy?';

  // Floating pet animation
  const floatY = useSharedValue(0);
  const glowScale = useSharedValue(1);
  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0,   { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, true,
    );
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.96, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1, true,
    );
  }, []);
  const floatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: floatY.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ transform: [{ scale: glowScale.value }] }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0626' }}>

      {/* Star field background */}
      <View style={{ position: 'absolute', inset: 0 }} pointerEvents="none">
        {[
          { x: '6%',  y: '6%',  delay: 0,    size: 10 },
          { x: '82%', y: '4%',  delay: 350,  size: 8  },
          { x: '44%', y: '10%', delay: 700,  size: 12 },
          { x: '93%', y: '18%', delay: 150,  size: 9  },
          { x: '18%', y: '22%', delay: 900,  size: 8  },
          { x: '70%', y: '28%', delay: 550,  size: 10 },
          { x: '10%', y: '48%', delay: 1100, size: 8  },
          { x: '88%', y: '52%', delay: 450,  size: 12 },
          { x: '55%', y: '58%', delay: 800,  size: 9  },
          { x: '30%', y: '66%', delay: 250,  size: 8  },
          { x: '75%', y: '72%', delay: 650,  size: 10 },
        ].map((s, i) => <Star key={i} {...s} />)}
      </View>

      {/* Soft nebula orbs */}
      <View style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} pointerEvents="none">
        <View style={{ position: 'absolute', top: -40, left: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: '#5B21B6', opacity: 0.18 }} />
        <View style={{ position: 'absolute', top: '20%', right: -50, width: 140, height: 140, borderRadius: 70, backgroundColor: '#EC4899', opacity: 0.1 }} />
        <View style={{ position: 'absolute', bottom: '30%', left: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: '#7C3AED', opacity: 0.15 }} />
      </View>

      {/* Header: gems + streak */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 6,
          backgroundColor: 'rgba(252,211,77,0.15)',
          borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
          borderWidth: 1, borderColor: 'rgba(252,211,77,0.3)',
        }}>
          <Text style={{ fontSize: 18 }}>⭐</Text>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#FCD34D' }}>{gemBalance}</Text>
        </View>

        {/* Streak pill */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setStreakExpanded(v => !v);
          }}
          style={{ alignItems: 'flex-end' }}
        >
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
          }}>
            <Text style={{ fontSize: 18 }}>🔥</Text>
            <Text style={{ fontSize: 15, fontWeight: '800', color: 'white' }}>
              {currentStreak} {currentStreak === 1 ? 'día' : 'días'}
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{streakExpanded ? '▲' : '▼'}</Text>
          </View>

          {/* Streak dropdown */}
          {streakExpanded && (
            <View style={{
              position: 'absolute', top: 46, right: 0,
              backgroundColor: '#1A0A3E',
              borderRadius: 16, padding: 16, width: 220,
              borderWidth: 1, borderColor: 'rgba(129,140,248,0.3)',
              shadowColor: '#5B21B6', shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
              zIndex: 100,
            }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: 'white', marginBottom: 10 }}>
                🔥 Racha actual: {currentStreak} días
              </Text>

              {nextMilestone ? (
                <>
                  <Text style={{ fontSize: 11, color: '#818CF8', marginBottom: 8 }}>PRÓXIMA RECOMPENSA</Text>
                  <View style={{
                    backgroundColor: 'rgba(124,58,237,0.2)',
                    borderRadius: 12, padding: 12,
                    flexDirection: 'row', alignItems: 'center', gap: 10,
                    borderWidth: 1, borderColor: 'rgba(139,92,246,0.3)',
                  }}>
                    <Text style={{ fontSize: 28 }}>🎁</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: '#A78BFA' }}>
                        {nextMilestone.days} días
                      </Text>
                      <Text style={{ fontSize: 13, color: '#FCD34D', fontWeight: '700' }}>
                        +{nextMilestone.gems} ⭐ de bonus
                      </Text>
                      <Text style={{ fontSize: 11, color: '#818CF8', marginTop: 2 }}>
                        {nextMilestone.days - currentStreak} días más
                      </Text>
                    </View>
                  </View>

                  <View style={{ marginTop: 10 }}>
                    <View style={{ height: 6, backgroundColor: 'rgba(129,140,248,0.2)', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{
                        height: 6, backgroundColor: '#EC4899', borderRadius: 3,
                        width: `${Math.min((currentStreak / nextMilestone.days) * 100, 100)}%`,
                      }} />
                    </View>
                    <Text style={{ fontSize: 10, color: '#818CF8', textAlign: 'right', marginTop: 3 }}>
                      {currentStreak}/{nextMilestone.days}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={{ fontSize: 13, color: '#34D399', fontWeight: '700', textAlign: 'center' }}>
                  ¡Leyenda absoluta! 🏆 {currentStreak} días
                </Text>
              )}

              <Text style={{ fontSize: 11, color: '#818CF8', marginTop: 12, marginBottom: 6 }}>TODOS LOS HITOS</Text>
              {[
                { days: 3,   gems: 10,                  label: '3 días' },
                { days: 7,   gems: GEMS.STREAK_7_DAYS,  label: '7 días' },
                { days: 14,  gems: GEMS.STREAK_7_DAYS,  label: '14 días' },
                { days: 30,  gems: GEMS.STREAK_30_DAYS, label: '30 días' },
                { days: 60,  gems: GEMS.STREAK_30_DAYS, label: '60 días' },
                { days: 100, gems: GEMS.STREAK_30_DAYS * 2, label: '100 días' },
              ].map(m => (
                <View key={m.days} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 12, color: currentStreak >= m.days ? '#A78BFA' : '#4B5563', fontWeight: currentStreak >= m.days ? '700' : '400' }}>
                    {currentStreak >= m.days ? '✓ ' : ''}{m.label}
                  </Text>
                  <Text style={{ fontSize: 12, color: currentStreak >= m.days ? '#FCD34D' : '#4B5563', fontWeight: '700' }}>
                    +{m.gems} ⭐
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Pressable>
      </View>

      {/* Pet area */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>

        {/* Speech bubble */}
        <View style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 20, paddingHorizontal: 20, paddingVertical: 14,
          marginBottom: 20, maxWidth: 280,
          shadowColor: '#5B21B6', shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
          alignSelf: 'flex-start', marginLeft: 20,
        }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#4C1D95', textAlign: 'center' }}>
            {greeting}
          </Text>
          <Text style={{ fontSize: 13, color: '#7C3AED', textAlign: 'center', marginTop: 2 }}>
            {subtext}
          </Text>
          <View style={{
            position: 'absolute', bottom: -10, left: 32,
            width: 0, height: 0,
            borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 10,
            borderLeftColor: 'transparent', borderRightColor: 'transparent',
            borderTopColor: 'rgba(255,255,255,0.95)',
          }} />
        </View>

        {/* Pet with float + glow */}
        <Animated.View style={floatStyle}>
          <Animated.View style={[glowStyle, {
            position: 'absolute', top: -16, left: -16, right: -16, bottom: -16,
            borderRadius: 136, backgroundColor: '#7C3AED', opacity: 0.3,
          }]} />
          <View style={{
            backgroundColor: '#2D1B69',
            borderRadius: 120, width: 220, height: 220,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: 'rgba(167,139,250,0.4)',
            shadowColor: '#7C3AED', shadowOpacity: 0.6, shadowRadius: 30, elevation: 14,
          }}>
            <PetDisplay pet={pet} mood={mood} size={180} />
          </View>
        </Animated.View>

        {/* Pet name tag */}
        <View style={{
          backgroundColor: 'rgba(139,92,246,0.25)',
          borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8, marginTop: 16,
          borderWidth: 1, borderColor: 'rgba(167,139,250,0.4)',
        }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#C4B5FD' }}>
            {pet.name} ✨
          </Text>
        </View>
      </View>

      {/* Bottom nav */}
      <View style={{
        backgroundColor: 'rgba(255,255,255,0.97)',
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28,
        flexDirection: 'row', gap: 10,
        shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 12,
      }}>
        <Pressable
          onPress={handleTalk}
          style={({ pressed }) => ({
            flex: 1, backgroundColor: pressed ? '#2563EB' : '#60A5FA',
            borderRadius: 24, paddingVertical: 16, alignItems: 'center', gap: 4,
            shadowColor: '#3B82F6', shadowOpacity: 0.4, shadowRadius: 6, elevation: 4,
          })}
        >
          <Text style={{ fontSize: 26 }}>💬</Text>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '800' }}>Hablar</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(kid)/mini-games')}
          style={({ pressed }) => ({
            flex: 1, backgroundColor: pressed ? '#6D28D9' : '#8B5CF6',
            borderRadius: 24, paddingVertical: 16, alignItems: 'center', gap: 4,
            shadowColor: '#7C3AED', shadowOpacity: 0.4, shadowRadius: 6, elevation: 4,
          })}
        >
          <Text style={{ fontSize: 26 }}>🎮</Text>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '800' }}>Jugar</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/(kid)/shop')}
          style={({ pressed }) => ({
            flex: 1, backgroundColor: pressed ? '#DB2777' : '#EC4899',
            borderRadius: 24, paddingVertical: 16, alignItems: 'center', gap: 4,
            shadowColor: '#EC4899', shadowOpacity: 0.4, shadowRadius: 6, elevation: 4,
          })}
        >
          <Text style={{ fontSize: 26 }}>🎁</Text>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '800' }}>Recompensas</Text>
        </Pressable>
      </View>

      {/* Parent access */}
      <Pressable
        onPress={handleParentAccess}
        style={{ position: 'absolute', top: 56, right: 16, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', opacity: 0.25 }}
      >
        <Text style={{ fontSize: 18 }}>🔐</Text>
      </Pressable>
    </SafeAreaView>
  );
}

import { useEffect, useState } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, Easing,
} from 'react-native-reanimated';
import { PetDisplay } from '../../src/components/kid-ui/PetDisplay';
import { FloatingOrbs } from '../../src/components/shared/FloatingOrbs';
import { useAuthStore } from '../../src/stores/auth.store';
import { usePetStore } from '../../src/stores/pet.store';
import { useGems } from '../../src/features/gems-economy/useGems';
import { useStreak } from '../../src/features/streaks/useStreak';
import { GEMS, STREAK_MILESTONES } from '../../src/constants';

function getPetMood(lastTalkDate: string | null) {
  if (!lastTalkDate) return 'missing_you' as const;
  const today = new Date().toISOString().split('T')[0];
  if (lastTalkDate === today) return 'happy' as const;
  const diff = (Date.now() - new Date(lastTalkDate).getTime()) / 86400000;
  return diff > 1 ? 'missing_you' as const : 'idle' as const;
}

// Next streak milestone and its gem reward
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

export default function KidHomeScreen() {
  const activeChild = useAuthStore(s => s.activeChild);
  const pet = usePetStore(s => s.pet);
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

  const mood = getPetMood(null);
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
        withTiming(0,  { duration: 2200, easing: Easing.inOut(Easing.sin) }),
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#7C3AED' }}>
      <FloatingOrbs />

      {/* Header: gems + streak */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 }}>
        <View
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: 'white', borderRadius: 20,
            paddingHorizontal: 14, paddingVertical: 8,
            shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
          }}
        >
          <Text style={{ fontSize: 18 }}>⭐</Text>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#7C3AED' }}>{gemBalance}</Text>
        </View>

        {/* Streak pill — tappable to expand */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setStreakExpanded(v => !v);
          }}
          style={{
            alignItems: 'flex-end',
          }}
        >
          <View
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: 'white', borderRadius: 20,
              paddingHorizontal: 14, paddingVertical: 8,
              shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18 }}>🔥</Text>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#EC4899' }}>
              {currentStreak} {currentStreak === 1 ? 'día' : 'días'}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{streakExpanded ? '▲' : '▼'}</Text>
          </View>

          {/* Dropdown panel */}
          {streakExpanded && (
            <View
              style={{
                position: 'absolute',
                top: 46,
                right: 0,
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                width: 220,
                shadowColor: '#5B21B6',
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 8,
                zIndex: 100,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#4C1D95', marginBottom: 10 }}>
                🔥 Racha actual: {currentStreak} días
              </Text>

              {nextMilestone ? (
                <>
                  <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 8 }}>PRÓXIMA RECOMPENSA</Text>
                  <View
                    style={{
                      backgroundColor: '#FDF4FF',
                      borderRadius: 12,
                      padding: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <Text style={{ fontSize: 28 }}>🎁</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: '#7C3AED' }}>
                        {nextMilestone.days} días
                      </Text>
                      <Text style={{ fontSize: 13, color: '#EC4899', fontWeight: '700' }}>
                        +{nextMilestone.gems} ⭐ de bonus
                      </Text>
                      <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                        {nextMilestone.days - currentStreak} días más
                      </Text>
                    </View>
                  </View>

                  {/* Milestone progress bar */}
                  <View style={{ marginTop: 10 }}>
                    <View style={{ height: 6, backgroundColor: '#EDE9FE', borderRadius: 3, overflow: 'hidden' }}>
                      <View
                        style={{
                          height: 6,
                          backgroundColor: '#EC4899',
                          borderRadius: 3,
                          width: `${Math.min((currentStreak / nextMilestone.days) * 100, 100)}%`,
                        }}
                      />
                    </View>
                    <Text style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'right', marginTop: 3 }}>
                      {currentStreak}/{nextMilestone.days}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={{ fontSize: 13, color: '#10B981', fontWeight: '700', textAlign: 'center' }}>
                  ¡Leyenda absoluta! 🏆 {currentStreak} días
                </Text>
              )}

              {/* All milestones */}
              <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 12, marginBottom: 6 }}>TODOS LOS HITOS</Text>
              {[
                { days: 3,   gems: 10,                  label: '3 días' },
                { days: 7,   gems: GEMS.STREAK_7_DAYS,  label: '7 días' },
                { days: 14,  gems: GEMS.STREAK_7_DAYS,  label: '14 días' },
                { days: 30,  gems: GEMS.STREAK_30_DAYS, label: '30 días' },
                { days: 60,  gems: GEMS.STREAK_30_DAYS, label: '60 días' },
                { days: 100, gems: GEMS.STREAK_30_DAYS * 2, label: '100 días' },
              ].map(m => (
                <View key={m.days} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 12, color: currentStreak >= m.days ? '#7C3AED' : '#D1D5DB', fontWeight: currentStreak >= m.days ? '700' : '400' }}>
                    {currentStreak >= m.days ? '✓ ' : ''}{m.label}
                  </Text>
                  <Text style={{ fontSize: 12, color: currentStreak >= m.days ? '#EC4899' : '#D1D5DB', fontWeight: '700' }}>
                    +{m.gems} ⭐
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Pressable>
      </View>

      {/* Decorative stars */}
      <View style={{ position: 'absolute', top: 80, left: 16, opacity: 0.5 }}>
        <Text style={{ fontSize: 20 }}>✨</Text>
      </View>
      <View style={{ position: 'absolute', top: 120, right: 18, opacity: 0.4 }}>
        <Text style={{ fontSize: 16 }}>⭐</Text>
      </View>

      {/* Pet area */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>

        {/* Speech bubble */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 14,
            marginBottom: 20,
            maxWidth: 280,
            shadowColor: '#5B21B6',
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
            alignSelf: 'flex-start',
            marginLeft: 20,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#4C1D95', textAlign: 'center' }}>
            {greeting}
          </Text>
          <Text style={{ fontSize: 13, color: '#7C3AED', textAlign: 'center', marginTop: 2 }}>
            {subtext}
          </Text>
          <View
            style={{
              position: 'absolute',
              bottom: -10,
              left: 32,
              width: 0, height: 0,
              borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 10,
              borderLeftColor: 'transparent', borderRightColor: 'transparent',
              borderTopColor: 'white',
            }}
          />
        </View>

        {/* Pet with float + glow */}
        <Animated.View style={floatStyle}>
          {/* Glow ring behind pet */}
          <Animated.View style={[glowStyle, {
            position: 'absolute', top: -14, left: -14, right: -14, bottom: -14,
            borderRadius: 134, backgroundColor: '#A78BFA', opacity: 0.25,
          }]} />
          <View
            style={{
              backgroundColor: '#C4B5FD',
              borderRadius: 120,
              width: 220,
              height: 220,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#5B21B6',
              shadowOpacity: 0.45,
              shadowRadius: 24,
              elevation: 12,
            }}
          >
            <PetDisplay pet={pet} mood={mood} size={180} />
          </View>
        </Animated.View>

        {/* Pet name tag */}
        <View
          style={{
            backgroundColor: '#EDE9FE',
            borderRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 8,
            marginTop: 16,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#5B21B6' }}>
            {pet.name} ✨
          </Text>
        </View>
      </View>

      {/* Bottom nav */}
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 28,
          flexDirection: 'row',
          gap: 10,
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 10,
        }}
      >
        {/* Hablar */}
        <Pressable
          onPress={handleTalk}
          style={({ pressed }) => ({
            flex: 1,
            backgroundColor: pressed ? '#2563EB' : '#60A5FA',
            borderRadius: 24,
            paddingVertical: 16,
            alignItems: 'center',
            gap: 4,
            shadowColor: '#3B82F6',
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 4,
          })}
        >
          <Text style={{ fontSize: 26 }}>💬</Text>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '800' }}>Hablar</Text>
        </Pressable>

        {/* Jugar */}
        <Pressable
          onPress={() => router.push('/(kid)/mini-games')}
          style={({ pressed }) => ({
            flex: 1,
            backgroundColor: pressed ? '#6D28D9' : '#8B5CF6',
            borderRadius: 24,
            paddingVertical: 16,
            alignItems: 'center',
            gap: 4,
            shadowColor: '#7C3AED',
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 4,
          })}
        >
          <Text style={{ fontSize: 26 }}>🎮</Text>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '800' }}>Jugar</Text>
        </Pressable>

        {/* Recompensas */}
        <Pressable
          onPress={() => router.push('/(kid)/shop')}
          style={({ pressed }) => ({
            flex: 1,
            backgroundColor: pressed ? '#DB2777' : '#EC4899',
            borderRadius: 24,
            paddingVertical: 16,
            alignItems: 'center',
            gap: 4,
            shadowColor: '#EC4899',
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 4,
          })}
        >
          <Text style={{ fontSize: 26 }}>🎁</Text>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '800' }}>Recompensas</Text>
        </Pressable>
      </View>

      {/* Parent access */}
      <Pressable
        onPress={handleParentAccess}
        style={{ position: 'absolute', top: 56, right: 16, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}
      >
        <Text style={{ fontSize: 18 }}>🔐</Text>
      </Pressable>
    </SafeAreaView>
  );
}

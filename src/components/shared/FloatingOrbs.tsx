import { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, withDelay, Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Orb {
  size: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
}

const ORBS: Orb[] = [
  { size: 120, x: -30,       y: height * 0.05, color: '#A78BFA', delay: 0,    duration: 6000, drift: 18 },
  { size: 80,  x: width*0.7, y: height * 0.12, color: '#EC4899', delay: 800,  duration: 7500, drift: 14 },
  { size: 60,  x: width*0.1, y: height * 0.55, color: '#C4B5FD', delay: 1600, duration: 5500, drift: 22 },
  { size: 90,  x: width*0.6, y: height * 0.72, color: '#8B5CF6', delay: 400,  duration: 8000, drift: 16 },
  { size: 50,  x: width*0.4, y: height * 0.88, color: '#F9A8D4', delay: 1200, duration: 6500, drift: 20 },
  { size: 40,  x: width*0.85,y: height * 0.45, color: '#DDD6FE', delay: 2000, duration: 7000, drift: 12 },
];

function FloatingOrb({ orb }: { orb: Orb }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      orb.delay,
      withRepeat(
        withSequence(
          withTiming(-orb.drift, { duration: orb.duration / 2, easing: Easing.inOut(Easing.sin) }),
          withTiming(orb.drift,  { duration: orb.duration / 2, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          left: orb.x,
          top: orb.y,
          width: orb.size,
          height: orb.size,
          borderRadius: orb.size / 2,
          backgroundColor: orb.color,
          opacity: 0.18,
        },
      ]}
    />
  );
}

export function FloatingOrbs() {
  return (
    <View style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} pointerEvents="none">
      {ORBS.map((orb, i) => <FloatingOrb key={i} orb={orb} />)}
    </View>
  );
}

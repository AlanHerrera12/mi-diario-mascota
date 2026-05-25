import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, withDelay, Easing,
} from 'react-native-reanimated';

const DEFAULT_STARS = [
  { x: '5%',  y: '4%',  delay: 0 },   { x: '78%', y: '2%',  delay: 300 },
  { x: '42%', y: '10%', delay: 600 },  { x: '91%', y: '18%', delay: 150 },
  { x: '18%', y: '28%', delay: 900 },  { x: '63%', y: '38%', delay: 450 },
  { x: '7%',  y: '52%', delay: 750 },  { x: '86%', y: '58%', delay: 550 },
  { x: '33%', y: '68%', delay: 200 },  { x: '55%', y: '76%', delay: 700 },
  { x: '25%', y: '88%', delay: 350 },  { x: '70%', y: '92%', delay: 250 },
  { x: '48%', y: '50%', delay: 500 },  { x: '14%', y: '72%', delay: 800 },
  { x: '82%', y: '82%', delay: 100 },  { x: '38%', y: '30%', delay: 650 },
];

function StarDot({ x, y, delay }: { x: string; y: string; delay: number }) {
  const opacity = useSharedValue(0.12);

  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(0.75, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.12, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    ));
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  // Use Animated.View (not Animated.Text) so pointerEvents is fully respected on web
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        animStyle,
        {
          position: 'absolute',
          left: x,
          top: y,
          // CSS passthrough — guarantees no pointer capture on web
          // @ts-ignore
          pointerEvents: 'none',
        },
      ]}
    >
      <Text
        selectable={false}
        style={{ fontSize: 11, color: '#A78BFA', userSelect: 'none' } as any}
      >
        ✦
      </Text>
    </Animated.View>
  );
}

interface Props {
  count?: number;
}

export function StarField({ count }: Props) {
  const stars = count !== undefined
    ? DEFAULT_STARS.slice(0, Math.min(count, DEFAULT_STARS.length))
    : DEFAULT_STARS;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        // CSS passthrough for web
        // @ts-ignore
        pointerEvents: 'none',
      }}
    >
      {stars.map((s, i) => (
        <StarDot key={i} x={s.x} y={s.y} delay={s.delay} />
      ))}
    </View>
  );
}

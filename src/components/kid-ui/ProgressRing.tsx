import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  elapsedSeconds: number;
  targetSeconds?: number;
  size?: number;
}

export function ProgressRing({ elapsedSeconds, targetSeconds = 60, size = 220 }: Props) {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const progress = useSharedValue(0);

  useEffect(() => {
    const p = Math.min(elapsedSeconds / targetSeconds, 1);
    progress.value = withTiming(p, { duration: 600, easing: Easing.out(Easing.quad) });
  }, [elapsedSeconds, targetSeconds]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
    // Color: gris → naranja → dorado al completar
    stroke: interpolateColor(
      progress.value,
      [0, 0.5, 1],
      ['#E5E7EB', '#FF9800', '#FFD700'],
    ),
  }));

  // Mostrar segundos hasta el mínimo, luego "✓"
  const hasReached = elapsedSeconds >= targetSeconds;
  const displayTime = hasReached
    ? null
    : elapsedSeconds < targetSeconds
      ? `${targetSeconds - elapsedSeconds}`
      : '0';

  // Formato mm:ss para el tiempo total transcurrido
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const totalTime = `${mins}:${String(secs).padStart(2, '0')}`;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Pista de fondo */}
        <Circle
          cx={cx} cy={cy} r={radius}
          stroke="#F3F4F6"
          strokeWidth={12}
          fill="none"
        />
        {/* Arco de progreso */}
        <AnimatedCircle
          cx={cx} cy={cy} r={radius}
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      </Svg>

      {/* Centro del anillo */}
      <View className="items-center justify-center">
        {hasReached ? (
          <>
            <Text className="text-5xl">⭐</Text>
            <Text className="text-primary-600 font-bold text-sm mt-1">{totalTime}</Text>
          </>
        ) : (
          <>
            <Text className="text-4xl font-bold text-gray-700">{displayTime}</Text>
            <Text className="text-gray-400 text-xs mt-0.5">seg</Text>
            <Text className="text-gray-300 text-xs mt-1">{totalTime}</Text>
          </>
        )}
      </View>
    </View>
  );
}

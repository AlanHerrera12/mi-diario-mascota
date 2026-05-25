import Svg, {
  Circle, Ellipse, Path, G, Defs, RadialGradient, LinearGradient, Stop,
} from 'react-native-svg';

interface Props {
  size?: number;
  mood?: 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
  baseColor?: string;
}

export function PetRabbitSVG({ size = 200, mood = 'idle', baseColor = '#A78BFA' }: Props) {
  const s = size;
  const cx = s / 2;

  const isHappy = mood === 'happy';
  const isSleepy = mood === 'sleepy';
  const isMissingYou = mood === 'missing_you';

  const bodyMain  = '#DDD6FE';
  const bodyShade = '#A78BFA';
  const bodyLight = '#F5F3FF';
  const earOuter  = '#EDE9FE';
  const noseColor = '#EC4899';
  const eyeColor  = '#1F2937';

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="rabBodyGrad" cx="45%" cy="38%" r="55%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="55%" stopColor={bodyMain} />
          <Stop offset="100%" stopColor={bodyShade} />
        </RadialGradient>
        <RadialGradient id="rabHeadGrad" cx="43%" cy="32%" r="55%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="52%" stopColor={bodyMain} />
          <Stop offset="100%" stopColor={bodyShade} />
        </RadialGradient>
        <LinearGradient id="earInnerGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#FBCFE8" />
          <Stop offset="100%" stopColor="#F9A8D4" />
        </LinearGradient>
        <RadialGradient id="rabCheekGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FEE2E2" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.5" />
        </RadialGradient>
      </Defs>

      {/* Ground shadow */}
      <Ellipse cx={cx} cy={s * 0.93} rx={s * 0.24} ry={s * 0.036} fill="#5B21B6" opacity={0.15} />

      {/* LEFT tall ear */}
      <Ellipse
        cx={cx - s * 0.14}
        cy={s * 0.16}
        rx={s * 0.070}
        ry={s * 0.245}
        fill={earOuter}
      />
      <Ellipse
        cx={cx - s * 0.14}
        cy={s * 0.165}
        rx={s * 0.040}
        ry={s * 0.195}
        fill="url(#earInnerGrad)"
      />

      {/* RIGHT tall ear */}
      <Ellipse
        cx={cx + s * 0.14}
        cy={s * 0.16}
        rx={s * 0.070}
        ry={s * 0.245}
        fill={earOuter}
      />
      <Ellipse
        cx={cx + s * 0.14}
        cy={s * 0.165}
        rx={s * 0.040}
        ry={s * 0.195}
        fill="url(#earInnerGrad)"
      />

      {/* Compact body */}
      <Ellipse cx={cx} cy={s * 0.73} rx={s * 0.27} ry={s * 0.24} fill="url(#rabBodyGrad)" />

      {/* Belly */}
      <Ellipse cx={cx} cy={s * 0.76} rx={s * 0.16} ry={s * 0.15} fill={bodyLight} opacity={0.55} />

      {/* White fluffy tail */}
      <Circle cx={cx + s * 0.26} cy={s * 0.76} r={s * 0.055} fill="white" opacity={0.9} />
      <Circle cx={cx + s * 0.26} cy={s * 0.76} r={s * 0.035} fill={bodyLight} opacity={0.7} />

      {/* Front paws */}
      <Ellipse cx={cx - s * 0.15} cy={s * 0.88} rx={s * 0.078} ry={s * 0.058} fill={bodyMain} />
      <Ellipse cx={cx + s * 0.15} cy={s * 0.88} rx={s * 0.078} ry={s * 0.058} fill={bodyMain} />
      <Circle cx={cx - s * 0.18} cy={s * 0.89} r={s * 0.019} fill={bodyShade} />
      <Circle cx={cx - s * 0.15} cy={s * 0.895} r={s * 0.019} fill={bodyShade} />
      <Circle cx={cx - s * 0.12} cy={s * 0.89} r={s * 0.019} fill={bodyShade} />
      <Circle cx={cx + s * 0.12} cy={s * 0.89} r={s * 0.019} fill={bodyShade} />
      <Circle cx={cx + s * 0.15} cy={s * 0.895} r={s * 0.019} fill={bodyShade} />
      <Circle cx={cx + s * 0.18} cy={s * 0.89} r={s * 0.019} fill={bodyShade} />

      {/* Head */}
      <Circle cx={cx} cy={s * 0.39} r={s * 0.27} fill="url(#rabHeadGrad)" />

      {/* Muzzle */}
      <Ellipse cx={cx} cy={s * 0.465} rx={s * 0.12} ry={s * 0.085} fill={earOuter} opacity={0.8} />

      {/* Cheeks */}
      <Ellipse cx={cx - s * 0.155} cy={s * 0.450} rx={s * 0.058} ry={s * 0.040} fill="url(#rabCheekGrad)" />
      <Ellipse cx={cx + s * 0.155} cy={s * 0.450} rx={s * 0.058} ry={s * 0.040} fill="url(#rabCheekGrad)" />

      {/* EYES */}
      {isHappy ? (
        <G>
          <Path d={`M ${cx - s * 0.11} ${s * 0.355} Q ${cx - s * 0.07} ${s * 0.315} ${cx - s * 0.03} ${s * 0.355}`}
            stroke={eyeColor} strokeWidth={s * 0.025} fill="none" strokeLinecap="round" />
          <Path d={`M ${cx + s * 0.03} ${s * 0.355} Q ${cx + s * 0.07} ${s * 0.315} ${cx + s * 0.11} ${s * 0.355}`}
            stroke={eyeColor} strokeWidth={s * 0.025} fill="none" strokeLinecap="round" />
        </G>
      ) : isSleepy ? (
        <G>
          <Ellipse cx={cx - s * 0.075} cy={s * 0.355} rx={s * 0.052} ry={s * 0.030} fill={eyeColor} />
          <Ellipse cx={cx + s * 0.075} cy={s * 0.355} rx={s * 0.052} ry={s * 0.030} fill={eyeColor} />
        </G>
      ) : isMissingYou ? (
        <G>
          <Circle cx={cx - s * 0.075} cy={s * 0.355} r={s * 0.050} fill={eyeColor} />
          <Circle cx={cx + s * 0.075} cy={s * 0.355} r={s * 0.050} fill={eyeColor} />
          <Circle cx={cx - s * 0.060} cy={s * 0.341} r={s * 0.015} fill="white" />
          <Circle cx={cx + s * 0.090} cy={s * 0.341} r={s * 0.015} fill="white" />
          <Ellipse cx={cx + s * 0.075} cy={s * 0.415} rx={s * 0.016} ry={s * 0.022} fill="#93C5FD" opacity={0.9} />
        </G>
      ) : (
        <G>
          <Circle cx={cx - s * 0.075} cy={s * 0.355} r={s * 0.053} fill={eyeColor} />
          <Circle cx={cx + s * 0.075} cy={s * 0.355} r={s * 0.053} fill={eyeColor} />
          <Circle cx={cx - s * 0.060} cy={s * 0.340} r={s * 0.016} fill="white" />
          <Circle cx={cx + s * 0.090} cy={s * 0.340} r={s * 0.016} fill="white" />
        </G>
      )}

      {/* Nose — tiny pink circle */}
      <Ellipse cx={cx} cy={s * 0.436} rx={s * 0.030} ry={s * 0.022} fill={noseColor} />

      {/* Mouth */}
      {isHappy ? (
        <G>
          <Path d={`M ${cx - s * 0.04} ${s * 0.456} Q ${cx} ${s * 0.488} ${cx + s * 0.04} ${s * 0.456}`}
            stroke={noseColor} strokeWidth={s * 0.015} fill="none" strokeLinecap="round" />
          <Ellipse cx={cx} cy={s * 0.498} rx={s * 0.026} ry={s * 0.030} fill="#F87171" />
        </G>
      ) : (
        <Path d={`M ${cx - s * 0.03} ${s * 0.455} Q ${cx} ${s * 0.475} ${cx + s * 0.03} ${s * 0.455}`}
          stroke={noseColor} strokeWidth={s * 0.014} fill="none" strokeLinecap="round" />
      )}

      {/* Head highlight */}
      <Ellipse
        cx={cx - s * 0.075} cy={s * 0.255}
        rx={s * 0.068} ry={s * 0.040}
        fill="white" opacity={0.32}
        transform={`rotate(-18 ${cx - s * 0.075} ${s * 0.255})`}
      />
    </Svg>
  );
}

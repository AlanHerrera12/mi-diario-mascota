import Svg, {
  Circle, Ellipse, Path, G, Defs, RadialGradient, Stop,
} from 'react-native-svg';

interface Props {
  size?: number;
  mood?: 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
  baseColor?: string;
}

export function PetBearSVG({ size = 200, mood = 'idle', baseColor = '#A78BFA' }: Props) {
  const s = size;
  const cx = s / 2;

  const isHappy = mood === 'happy';
  const isSleepy = mood === 'sleepy';
  const isMissingYou = mood === 'missing_you';

  const bodyMain  = '#C4B5FD';
  const bodyShade = '#A78BFA';
  const bodyLight = '#EDE9FE';
  const earOuter  = '#DDD6FE';
  const earInner  = '#F5D0FE';  // soft pink inner ear
  const noseColor = '#6D28D9';
  const eyeColor  = '#1F2937';

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="bearBodyGrad" cx="45%" cy="38%" r="55%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="55%" stopColor={bodyMain} />
          <Stop offset="100%" stopColor={bodyShade} />
        </RadialGradient>
        <RadialGradient id="bearHeadGrad" cx="43%" cy="32%" r="55%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="52%" stopColor={bodyMain} />
          <Stop offset="100%" stopColor={bodyShade} />
        </RadialGradient>
        <RadialGradient id="bearBellyGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="100%" stopColor={earOuter} />
        </RadialGradient>
        <RadialGradient id="bearCheekGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FEE2E2" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.5" />
        </RadialGradient>
      </Defs>

      {/* Ground shadow */}
      <Ellipse cx={cx} cy={s * 0.93} rx={s * 0.30} ry={s * 0.038} fill="#5B21B6" opacity={0.15} />

      {/* Wide chunky body */}
      <Ellipse cx={cx} cy={s * 0.73} rx={s * 0.34} ry={s * 0.26} fill="url(#bearBodyGrad)" />

      {/* Belly patch */}
      <Ellipse cx={cx} cy={s * 0.76} rx={s * 0.20} ry={s * 0.17} fill="url(#bearBellyGrad)" opacity={0.65} />

      {/* Front paws */}
      <Ellipse cx={cx - s * 0.22} cy={s * 0.89} rx={s * 0.10} ry={s * 0.075} fill={bodyMain} />
      <Ellipse cx={cx + s * 0.22} cy={s * 0.89} rx={s * 0.10} ry={s * 0.075} fill={bodyMain} />
      <Circle cx={cx - s * 0.25} cy={s * 0.898} r={s * 0.022} fill={bodyShade} />
      <Circle cx={cx - s * 0.22} cy={s * 0.908} r={s * 0.022} fill={bodyShade} />
      <Circle cx={cx - s * 0.19} cy={s * 0.898} r={s * 0.022} fill={bodyShade} />
      <Circle cx={cx + s * 0.19} cy={s * 0.898} r={s * 0.022} fill={bodyShade} />
      <Circle cx={cx + s * 0.22} cy={s * 0.908} r={s * 0.022} fill={bodyShade} />
      <Circle cx={cx + s * 0.25} cy={s * 0.898} r={s * 0.022} fill={bodyShade} />

      {/* LEFT round ear */}
      <Circle cx={cx - s * 0.27} cy={s * 0.18} r={s * 0.095} fill={earOuter} />
      <Circle cx={cx - s * 0.27} cy={s * 0.18} r={s * 0.056} fill={earInner} />

      {/* RIGHT round ear */}
      <Circle cx={cx + s * 0.27} cy={s * 0.18} r={s * 0.095} fill={earOuter} />
      <Circle cx={cx + s * 0.27} cy={s * 0.18} r={s * 0.056} fill={earInner} />

      {/* Big round head */}
      <Circle cx={cx} cy={s * 0.38} r={s * 0.32} fill="url(#bearHeadGrad)" />

      {/* Round snout */}
      <Circle cx={cx} cy={s * 0.475} r={s * 0.11} fill={earOuter} />
      <Circle cx={cx} cy={s * 0.475} r={s * 0.085} fill={bodyLight} opacity={0.6} />

      {/* Cheeks */}
      <Ellipse cx={cx - s * 0.19} cy={s * 0.45} rx={s * 0.068} ry={s * 0.048} fill="url(#bearCheekGrad)" />
      <Ellipse cx={cx + s * 0.19} cy={s * 0.45} rx={s * 0.068} ry={s * 0.048} fill="url(#bearCheekGrad)" />

      {/* EYES */}
      {isHappy ? (
        <G>
          <Path d={`M ${cx - s * 0.13} ${s * 0.355} Q ${cx - s * 0.085} ${s * 0.31} ${cx - s * 0.04} ${s * 0.355}`}
            stroke={eyeColor} strokeWidth={s * 0.027} fill="none" strokeLinecap="round" />
          <Path d={`M ${cx + s * 0.04} ${s * 0.355} Q ${cx + s * 0.085} ${s * 0.31} ${cx + s * 0.13} ${s * 0.355}`}
            stroke={eyeColor} strokeWidth={s * 0.027} fill="none" strokeLinecap="round" />
        </G>
      ) : isSleepy ? (
        <G>
          <Ellipse cx={cx - s * 0.085} cy={s * 0.355} rx={s * 0.058} ry={s * 0.035} fill={eyeColor} />
          <Ellipse cx={cx + s * 0.085} cy={s * 0.355} rx={s * 0.058} ry={s * 0.035} fill={eyeColor} />
          <Path d={`M ${cx - s * 0.145} ${s * 0.35} Q ${cx - s * 0.085} ${s * 0.33} ${cx - s * 0.025} ${s * 0.35}`}
            stroke={bodyShade} strokeWidth={s * 0.02} fill="none" />
          <Path d={`M ${cx + s * 0.025} ${s * 0.35} Q ${cx + s * 0.085} ${s * 0.33} ${cx + s * 0.145} ${s * 0.35}`}
            stroke={bodyShade} strokeWidth={s * 0.02} fill="none" />
        </G>
      ) : isMissingYou ? (
        <G>
          <Circle cx={cx - s * 0.085} cy={s * 0.355} r={s * 0.055} fill={eyeColor} />
          <Circle cx={cx + s * 0.085} cy={s * 0.355} r={s * 0.055} fill={eyeColor} />
          <Circle cx={cx - s * 0.07} cy={s * 0.34} r={s * 0.016} fill="white" />
          <Circle cx={cx + s * 0.10} cy={s * 0.34} r={s * 0.016} fill="white" />
          <Ellipse cx={cx + s * 0.085} cy={s * 0.42} rx={s * 0.018} ry={s * 0.025} fill="#93C5FD" opacity={0.9} />
        </G>
      ) : (
        <G>
          <Circle cx={cx - s * 0.085} cy={s * 0.355} r={s * 0.058} fill={eyeColor} />
          <Circle cx={cx + s * 0.085} cy={s * 0.355} r={s * 0.058} fill={eyeColor} />
          <Circle cx={cx - s * 0.068} cy={s * 0.338} r={s * 0.018} fill="white" />
          <Circle cx={cx + s * 0.102} cy={s * 0.338} r={s * 0.018} fill="white" />
          <Circle cx={cx - s * 0.060} cy={s * 0.348} r={s * 0.009} fill="white" opacity={0.6} />
          <Circle cx={cx + s * 0.110} cy={s * 0.348} r={s * 0.009} fill="white" opacity={0.6} />
        </G>
      )}

      {/* Nose */}
      <Ellipse cx={cx} cy={s * 0.455} rx={s * 0.042} ry={s * 0.030} fill={noseColor} />
      <Ellipse cx={cx - s * 0.014} cy={s * 0.448} rx={s * 0.013} ry={s * 0.009} fill="white" opacity={0.45} />

      {/* Mouth */}
      {isHappy ? (
        <G>
          <Path d={`M ${cx - s * 0.055} ${s * 0.475} Q ${cx} ${s * 0.515} ${cx + s * 0.055} ${s * 0.475}`}
            stroke={noseColor} strokeWidth={s * 0.018} fill="none" strokeLinecap="round" />
          <Ellipse cx={cx} cy={s * 0.52} rx={s * 0.032} ry={s * 0.038} fill="#F87171" />
        </G>
      ) : isMissingYou ? (
        <Path d={`M ${cx - s * 0.05} ${s * 0.49} Q ${cx} ${s * 0.475} ${cx + s * 0.05} ${s * 0.49}`}
          stroke={noseColor} strokeWidth={s * 0.018} fill="none" strokeLinecap="round" />
      ) : (
        <Path d={`M ${cx - s * 0.04} ${s * 0.475} Q ${cx} ${s * 0.498} ${cx + s * 0.04} ${s * 0.475}`}
          stroke={noseColor} strokeWidth={s * 0.016} fill="none" strokeLinecap="round" />
      )}

      {/* Head highlight */}
      <Ellipse
        cx={cx - s * 0.09} cy={s * 0.235}
        rx={s * 0.075} ry={s * 0.048}
        fill="white" opacity={0.30}
        transform={`rotate(-20 ${cx - s * 0.09} ${s * 0.235})`}
      />
      {/* Rim light */}
      <Ellipse
        cx={cx + s * 0.16} cy={s * 0.22}
        rx={s * 0.058} ry={s * 0.038}
        fill="white" opacity={0.12}
        transform={`rotate(25 ${cx + s * 0.16} ${s * 0.22})`}
      />
    </Svg>
  );
}

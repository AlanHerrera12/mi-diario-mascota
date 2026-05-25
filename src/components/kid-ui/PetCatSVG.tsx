import Svg, {
  Circle, Ellipse, Path, G, Defs, RadialGradient, Stop, Line,
} from 'react-native-svg';

interface Props {
  size?: number;
  mood?: 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
  baseColor?: string;
}

export function PetCatSVG({ size = 200, mood = 'idle', baseColor = '#A78BFA' }: Props) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  const isHappy = mood === 'happy';
  const isSleepy = mood === 'sleepy';
  const isListening = mood === 'listening';
  const isMissingYou = mood === 'missing_you';

  const bodyMain  = '#C4B5FD';
  const bodyShade = '#A78BFA';
  const bodyLight = '#EDE9FE';
  const earColor  = '#DDD6FE';
  const earInner  = '#FBCFE8';  // pink inner ear
  const noseColor = '#DB2777';
  const eyeColor  = '#1F2937';

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="catBodyGrad" cx="45%" cy="35%" r="55%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="55%" stopColor={bodyMain} />
          <Stop offset="100%" stopColor={bodyShade} />
        </RadialGradient>
        <RadialGradient id="catHeadGrad" cx="42%" cy="32%" r="55%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="50%" stopColor={bodyMain} />
          <Stop offset="100%" stopColor={bodyShade} />
        </RadialGradient>
        <RadialGradient id="catCheekGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FEE2E2" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.5" />
        </RadialGradient>
      </Defs>

      {/* Ground shadow */}
      <Ellipse cx={cx} cy={s * 0.93} rx={s * 0.22} ry={s * 0.035} fill="#5B21B6" opacity={0.15} />

      {/* Curling tail */}
      <Path
        d={`M ${cx + s * 0.22} ${s * 0.80} Q ${cx + s * 0.42} ${s * 0.70} ${cx + s * 0.38} ${s * 0.52} Q ${cx + s * 0.34} ${s * 0.38} ${cx + s * 0.26} ${s * 0.44}`}
        stroke={bodyMain} strokeWidth={s * 0.055} fill="none" strokeLinecap="round"
      />
      <Path
        d={`M ${cx + s * 0.22} ${s * 0.80} Q ${cx + s * 0.42} ${s * 0.70} ${cx + s * 0.38} ${s * 0.52} Q ${cx + s * 0.34} ${s * 0.38} ${cx + s * 0.26} ${s * 0.44}`}
        stroke={bodyLight} strokeWidth={s * 0.018} fill="none" strokeLinecap="round" opacity={0.5}
      />

      {/* Slim body */}
      <Ellipse cx={cx} cy={s * 0.73} rx={s * 0.26} ry={s * 0.24} fill="url(#catBodyGrad)" />

      {/* Belly patch */}
      <Ellipse cx={cx} cy={s * 0.76} rx={s * 0.14} ry={s * 0.14} fill={bodyLight} opacity={0.55} />

      {/* Front paws */}
      <Ellipse cx={cx - s * 0.14} cy={s * 0.88} rx={s * 0.07} ry={s * 0.055} fill={bodyMain} />
      <Ellipse cx={cx + s * 0.14} cy={s * 0.88} rx={s * 0.07} ry={s * 0.055} fill={bodyMain} />
      <Circle cx={cx - s * 0.17} cy={s * 0.89} r={s * 0.018} fill={bodyShade} />
      <Circle cx={cx - s * 0.14} cy={s * 0.895} r={s * 0.018} fill={bodyShade} />
      <Circle cx={cx - s * 0.11} cy={s * 0.89} r={s * 0.018} fill={bodyShade} />
      <Circle cx={cx + s * 0.11} cy={s * 0.89} r={s * 0.018} fill={bodyShade} />
      <Circle cx={cx + s * 0.14} cy={s * 0.895} r={s * 0.018} fill={bodyShade} />
      <Circle cx={cx + s * 0.17} cy={s * 0.89} r={s * 0.018} fill={bodyShade} />

      {/* LEFT pointed ear */}
      <Path
        d={`M ${cx - s * 0.28} ${s * 0.18} L ${cx - s * 0.16} ${s * 0.10} L ${cx - s * 0.08} ${s * 0.22} Z`}
        fill={earColor}
      />
      <Path
        d={`M ${cx - s * 0.26} ${s * 0.185} L ${cx - s * 0.16} ${s * 0.125} L ${cx - s * 0.10} ${s * 0.21} Z`}
        fill={earInner}
      />

      {/* RIGHT pointed ear */}
      <Path
        d={`M ${cx + s * 0.08} ${s * 0.22} L ${cx + s * 0.16} ${s * 0.10} L ${cx + s * 0.28} ${s * 0.18} Z`}
        fill={earColor}
      />
      <Path
        d={`M ${cx + s * 0.10} ${s * 0.21} L ${cx + s * 0.16} ${s * 0.125} L ${cx + s * 0.26} ${s * 0.185} Z`}
        fill={earInner}
      />

      {/* Head */}
      <Circle cx={cx} cy={s * 0.36} r={s * 0.28} fill="url(#catHeadGrad)" />

      {/* Muzzle */}
      <Ellipse cx={cx} cy={s * 0.45} rx={s * 0.13} ry={s * 0.09} fill={earColor} opacity={0.85} />

      {/* Cheeks */}
      <Ellipse cx={cx - s * 0.155} cy={s * 0.435} rx={s * 0.055} ry={s * 0.038} fill="url(#catCheekGrad)" />
      <Ellipse cx={cx + s * 0.155} cy={s * 0.435} rx={s * 0.055} ry={s * 0.038} fill="url(#catCheekGrad)" />

      {/* Whiskers left */}
      <Line x1={cx - s * 0.07} y1={s * 0.445} x2={cx - s * 0.30} y2={s * 0.435} stroke={bodyShade} strokeWidth={s * 0.010} strokeLinecap="round" opacity={0.7} />
      <Line x1={cx - s * 0.07} y1={s * 0.455} x2={cx - s * 0.30} y2={s * 0.460} stroke={bodyShade} strokeWidth={s * 0.010} strokeLinecap="round" opacity={0.7} />
      <Line x1={cx - s * 0.07} y1={s * 0.445} x2={cx - s * 0.29} y2={s * 0.420} stroke={bodyShade} strokeWidth={s * 0.008} strokeLinecap="round" opacity={0.5} />

      {/* Whiskers right */}
      <Line x1={cx + s * 0.07} y1={s * 0.445} x2={cx + s * 0.30} y2={s * 0.435} stroke={bodyShade} strokeWidth={s * 0.010} strokeLinecap="round" opacity={0.7} />
      <Line x1={cx + s * 0.07} y1={s * 0.455} x2={cx + s * 0.30} y2={s * 0.460} stroke={bodyShade} strokeWidth={s * 0.010} strokeLinecap="round" opacity={0.7} />
      <Line x1={cx + s * 0.07} y1={s * 0.445} x2={cx + s * 0.29} y2={s * 0.420} stroke={bodyShade} strokeWidth={s * 0.008} strokeLinecap="round" opacity={0.5} />

      {/* EYES */}
      {isHappy ? (
        <G>
          {/* Happy: upward arc ^  */}
          <Path d={`M ${cx - s * 0.11} ${s * 0.345} Q ${cx - s * 0.07} ${s * 0.30} ${cx - s * 0.03} ${s * 0.345}`}
            stroke={eyeColor} strokeWidth={s * 0.024} fill="none" strokeLinecap="round" />
          <Path d={`M ${cx + s * 0.03} ${s * 0.345} Q ${cx + s * 0.07} ${s * 0.30} ${cx + s * 0.11} ${s * 0.345}`}
            stroke={eyeColor} strokeWidth={s * 0.024} fill="none" strokeLinecap="round" />
        </G>
      ) : isSleepy ? (
        <G>
          {/* Sleepy: almond nearly closed */}
          <Path d={`M ${cx - s * 0.12} ${s * 0.345} Q ${cx - s * 0.075} ${s * 0.325} ${cx - s * 0.025} ${s * 0.345}`}
            stroke={eyeColor} strokeWidth={s * 0.02} fill={eyeColor} strokeLinecap="round" />
          <Path d={`M ${cx + s * 0.025} ${s * 0.345} Q ${cx + s * 0.075} ${s * 0.325} ${cx + s * 0.12} ${s * 0.345}`}
            stroke={eyeColor} strokeWidth={s * 0.02} fill={eyeColor} strokeLinecap="round" />
        </G>
      ) : isMissingYou ? (
        <G>
          {/* Sad almond eyes + teardrop */}
          <Path d={`M ${cx - s * 0.12} ${s * 0.335} Q ${cx - s * 0.075} ${s * 0.36} ${cx - s * 0.025} ${s * 0.335}`}
            stroke={eyeColor} strokeWidth={s * 0.022} fill={eyeColor} strokeLinecap="round" />
          <Path d={`M ${cx + s * 0.025} ${s * 0.335} Q ${cx + s * 0.075} ${s * 0.36} ${cx + s * 0.12} ${s * 0.335}`}
            stroke={eyeColor} strokeWidth={s * 0.022} fill={eyeColor} strokeLinecap="round" />
          <Ellipse cx={cx + s * 0.075} cy={s * 0.405} rx={s * 0.015} ry={s * 0.022} fill="#93C5FD" opacity={0.9} />
        </G>
      ) : (
        <G>
          {/* Idle/listening: almond eyes */}
          <Path d={`M ${cx - s * 0.12} ${s * 0.345} Q ${cx - s * 0.075} ${s * 0.31} ${cx - s * 0.025} ${s * 0.345} Q ${cx - s * 0.075} ${s * 0.375} ${cx - s * 0.12} ${s * 0.345} Z`}
            fill={eyeColor} />
          <Path d={`M ${cx + s * 0.025} ${s * 0.345} Q ${cx + s * 0.075} ${s * 0.31} ${cx + s * 0.12} ${s * 0.345} Q ${cx + s * 0.075} ${s * 0.375} ${cx + s * 0.025} ${s * 0.345} Z`}
            fill={eyeColor} />
          <Circle cx={cx - s * 0.067} cy={s * 0.335} r={s * 0.013} fill="white" />
          <Circle cx={cx + s * 0.083} cy={s * 0.335} r={s * 0.013} fill="white" />
        </G>
      )}

      {/* Nose — small triangle */}
      <Path
        d={`M ${cx} ${s * 0.41} L ${cx - s * 0.025} ${s * 0.43} L ${cx + s * 0.025} ${s * 0.43} Z`}
        fill={noseColor}
      />

      {/* Mouth */}
      {isHappy ? (
        <G>
          <Path d={`M ${cx - s * 0.04} ${s * 0.44} Q ${cx} ${s * 0.475} ${cx + s * 0.04} ${s * 0.44}`}
            stroke={noseColor} strokeWidth={s * 0.016} fill="none" strokeLinecap="round" />
          <Ellipse cx={cx} cy={s * 0.49} rx={s * 0.028} ry={s * 0.032} fill="#F87171" />
        </G>
      ) : (
        <Path
          d={`M ${cx - s * 0.03} ${s * 0.44} L ${cx - s * 0.005} ${s * 0.455} L ${cx + s * 0.03} ${s * 0.44}`}
          stroke={noseColor} strokeWidth={s * 0.014} fill="none" strokeLinecap="round"
        />
      )}

      {/* Head highlight */}
      <Ellipse
        cx={cx - s * 0.07} cy={s * 0.235}
        rx={s * 0.065} ry={s * 0.038}
        fill="white" opacity={0.32}
        transform={`rotate(-20 ${cx - s * 0.07} ${s * 0.235})`}
      />

      {/* Rim light (top-right edge) */}
      <Ellipse
        cx={cx + s * 0.14} cy={s * 0.22}
        rx={s * 0.055} ry={s * 0.035}
        fill="white" opacity={0.12}
        transform={`rotate(25 ${cx + s * 0.14} ${s * 0.22})`}
      />
    </Svg>
  );
}

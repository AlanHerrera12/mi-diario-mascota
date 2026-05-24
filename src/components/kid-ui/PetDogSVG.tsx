import Svg, {
  Circle, Ellipse, Path, G, Defs, RadialGradient, Stop, LinearGradient,
} from 'react-native-svg';

interface Props {
  size?: number;
  mood?: 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
  baseColor?: string;
}

export function PetDogSVG({ size = 200, mood = 'idle', baseColor = '#C4B5FD' }: Props) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  // Mood-based eye shape and expression
  const isHappy = mood === 'happy';
  const isSleepy = mood === 'sleepy';
  const isListening = mood === 'listening';
  const isMissingYou = mood === 'missing_you';

  // Derived palette from baseColor (always lavender family)
  const bodyMain = '#C4B5FD';   // lavender
  const bodyShade = '#A78BFA';  // deeper lavender
  const bodyLight = '#EDE9FE';  // very light lavender
  const earColor = '#DDD6FE';   // ear lavender
  const earInner = '#F5F3FF';   // inner ear light
  const noseColor = '#6D28D9';  // dark purple nose
  const eyeColor = '#1F2937';   // near-black eyes
  const cheekColor = '#FCA5A5'; // rosy pink cheeks

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="bodyGrad" cx="50%" cy="40%" r="55%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="60%" stopColor={bodyMain} />
          <Stop offset="100%" stopColor={bodyShade} />
        </RadialGradient>
        <RadialGradient id="headGrad" cx="45%" cy="35%" r="55%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="55%" stopColor={bodyMain} />
          <Stop offset="100%" stopColor={bodyShade} />
        </RadialGradient>
        <RadialGradient id="bellyGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="100%" stopColor={earColor} />
        </RadialGradient>
        <RadialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FEE2E2" stopOpacity="0.9" />
          <Stop offset="100%" stopColor={cheekColor} stopOpacity="0.5" />
        </RadialGradient>
      </Defs>

      {/* Shadow under body */}
      <Ellipse cx={cx} cy={s * 0.92} rx={s * 0.28} ry={s * 0.04} fill="#5B21B6" opacity={0.15} />

      {/* Body */}
      <Ellipse cx={cx} cy={s * 0.72} rx={s * 0.30} ry={s * 0.26} fill="url(#bodyGrad)" />

      {/* Belly patch */}
      <Ellipse cx={cx} cy={s * 0.75} rx={s * 0.18} ry={s * 0.16} fill="url(#bellyGrad)" opacity={0.7} />

      {/* Front legs / paws */}
      <Ellipse cx={cx - s * 0.18} cy={s * 0.88} rx={s * 0.09} ry={s * 0.07} fill={bodyMain} />
      <Ellipse cx={cx + s * 0.18} cy={s * 0.88} rx={s * 0.09} ry={s * 0.07} fill={bodyMain} />
      {/* Paw toes left */}
      <Circle cx={cx - s * 0.22} cy={s * 0.895} r={s * 0.022} fill={bodyShade} />
      <Circle cx={cx - s * 0.18} cy={s * 0.905} r={s * 0.022} fill={bodyShade} />
      <Circle cx={cx - s * 0.14} cy={s * 0.895} r={s * 0.022} fill={bodyShade} />
      {/* Paw toes right */}
      <Circle cx={cx + s * 0.14} cy={s * 0.895} r={s * 0.022} fill={bodyShade} />
      <Circle cx={cx + s * 0.18} cy={s * 0.905} r={s * 0.022} fill={bodyShade} />
      <Circle cx={cx + s * 0.22} cy={s * 0.895} r={s * 0.022} fill={bodyShade} />

      {/* Tail */}
      <Ellipse
        cx={cx + s * 0.34}
        cy={s * 0.62}
        rx={s * 0.07}
        ry={s * 0.12}
        fill={bodyMain}
        transform={`rotate(-30 ${cx + s * 0.34} ${s * 0.62})`}
      />

      {/* LEFT EAR (floppy) */}
      <Ellipse
        cx={cx - s * 0.26}
        cy={s * 0.30}
        rx={s * 0.11}
        ry={s * 0.18}
        fill={earColor}
        transform={`rotate(-15 ${cx - s * 0.26} ${s * 0.30})`}
      />
      {/* inner ear left */}
      <Ellipse
        cx={cx - s * 0.265}
        cy={s * 0.305}
        rx={s * 0.065}
        ry={s * 0.12}
        fill={earInner}
        transform={`rotate(-15 ${cx - s * 0.265} ${s * 0.305})`}
      />

      {/* RIGHT EAR (floppy) */}
      <Ellipse
        cx={cx + s * 0.26}
        cy={s * 0.30}
        rx={s * 0.11}
        ry={s * 0.18}
        fill={earColor}
        transform={`rotate(15 ${cx + s * 0.26} ${s * 0.30})`}
      />
      {/* inner ear right */}
      <Ellipse
        cx={cx + s * 0.265}
        cy={s * 0.305}
        rx={s * 0.065}
        ry={s * 0.12}
        fill={earInner}
        transform={`rotate(15 ${cx + s * 0.265} ${s * 0.305})`}
      />

      {/* Head */}
      <Circle cx={cx} cy={s * 0.37} r={s * 0.30} fill="url(#headGrad)" />

      {/* Muzzle */}
      <Ellipse cx={cx} cy={s * 0.46} rx={s * 0.155} ry={s * 0.11} fill={earColor} />

      {/* Cheeks */}
      <Ellipse cx={cx - s * 0.17} cy={s * 0.44} rx={s * 0.065} ry={s * 0.045} fill="url(#cheekGrad)" />
      <Ellipse cx={cx + s * 0.17} cy={s * 0.44} rx={s * 0.065} ry={s * 0.045} fill="url(#cheekGrad)" />

      {/* EYES */}
      {isHappy ? (
        // Happy: curved "^" eyes
        <G>
          <Path
            d={`M ${cx - s * 0.12} ${s * 0.36} Q ${cx - s * 0.075} ${s * 0.31} ${cx - s * 0.03} ${s * 0.36}`}
            stroke={eyeColor} strokeWidth={s * 0.025} fill="none" strokeLinecap="round"
          />
          <Path
            d={`M ${cx + s * 0.03} ${s * 0.36} Q ${cx + s * 0.075} ${s * 0.31} ${cx + s * 0.12} ${s * 0.36}`}
            stroke={eyeColor} strokeWidth={s * 0.025} fill="none" strokeLinecap="round"
          />
        </G>
      ) : isSleepy ? (
        // Sleepy: half-closed eyes
        <G>
          <Ellipse cx={cx - s * 0.08} cy={s * 0.35} rx={s * 0.055} ry={s * 0.035} fill={eyeColor} />
          <Ellipse cx={cx + s * 0.08} cy={s * 0.35} rx={s * 0.055} ry={s * 0.035} fill={eyeColor} />
          {/* Heavy lids */}
          <Path d={`M ${cx - s * 0.135} ${s * 0.35} Q ${cx - s * 0.08} ${s * 0.33} ${cx - s * 0.025} ${s * 0.35}`}
            stroke={bodyShade} strokeWidth={s * 0.018} fill="none" />
          <Path d={`M ${cx + s * 0.025} ${s * 0.35} Q ${cx + s * 0.08} ${s * 0.33} ${cx + s * 0.135} ${s * 0.35}`}
            stroke={bodyShade} strokeWidth={s * 0.018} fill="none" />
          {/* Zzz */}
          <Path d={`M ${cx + s * 0.22} ${s * 0.22} l ${s * 0.04} 0 l ${-s * 0.04} ${s * 0.03} l ${s * 0.04} 0`}
            stroke="#A78BFA" strokeWidth={s * 0.012} fill="none" strokeLinecap="round" />
        </G>
      ) : isMissingYou ? (
        // Missing you: sad downward curve eyes + teardrop
        <G>
          <Ellipse cx={cx - s * 0.08} cy={s * 0.355} rx={s * 0.052} ry={s * 0.052} fill={eyeColor} />
          <Ellipse cx={cx + s * 0.08} cy={s * 0.355} rx={s * 0.052} ry={s * 0.052} fill={eyeColor} />
          {/* Shine */}
          <Circle cx={cx - s * 0.065} cy={s * 0.34} r={s * 0.014} fill="white" />
          <Circle cx={cx + s * 0.095} cy={s * 0.34} r={s * 0.014} fill="white" />
          {/* Teardrop */}
          <Ellipse cx={cx + s * 0.08} cy={s * 0.42} rx={s * 0.018} ry={s * 0.025} fill="#93C5FD" opacity={0.9} />
        </G>
      ) : isListening ? (
        // Listening: wide bright eyes, one ear "perked"
        <G>
          <Ellipse cx={cx - s * 0.08} cy={s * 0.35} rx={s * 0.058} ry={s * 0.063} fill={eyeColor} />
          <Ellipse cx={cx + s * 0.08} cy={s * 0.35} rx={s * 0.058} ry={s * 0.063} fill={eyeColor} />
          <Circle cx={cx - s * 0.063} cy={s * 0.335} r={s * 0.018} fill="white" />
          <Circle cx={cx + s * 0.097} cy={s * 0.335} r={s * 0.018} fill="white" />
          {/* Inner pupil shine */}
          <Circle cx={cx - s * 0.055} cy={s * 0.345} r={s * 0.008} fill="white" opacity={0.6} />
          <Circle cx={cx + s * 0.105} cy={s * 0.345} r={s * 0.008} fill="white" opacity={0.6} />
        </G>
      ) : (
        // Idle: normal round eyes
        <G>
          <Ellipse cx={cx - s * 0.08} cy={s * 0.35} rx={s * 0.055} ry={s * 0.058} fill={eyeColor} />
          <Ellipse cx={cx + s * 0.08} cy={s * 0.35} rx={s * 0.055} ry={s * 0.058} fill={eyeColor} />
          <Circle cx={cx - s * 0.063} cy={s * 0.336} r={s * 0.016} fill="white" />
          <Circle cx={cx + s * 0.097} cy={s * 0.336} r={s * 0.016} fill="white" />
        </G>
      )}

      {/* Nose */}
      <Ellipse cx={cx} cy={s * 0.43} rx={s * 0.045} ry={s * 0.032} fill={noseColor} />
      {/* Nose shine */}
      <Ellipse cx={cx - s * 0.015} cy={s * 0.422} rx={s * 0.014} ry={s * 0.01} fill="white" opacity={0.5} />

      {/* Mouth */}
      {isHappy ? (
        <Path
          d={`M ${cx - s * 0.055} ${s * 0.46} Q ${cx} ${s * 0.50} ${cx + s * 0.055} ${s * 0.46}`}
          stroke={noseColor} strokeWidth={s * 0.018} fill="none" strokeLinecap="round"
        />
      ) : isMissingYou ? (
        <Path
          d={`M ${cx - s * 0.055} ${s * 0.48} Q ${cx} ${s * 0.465} ${cx + s * 0.055} ${s * 0.48}`}
          stroke={noseColor} strokeWidth={s * 0.018} fill="none" strokeLinecap="round"
        />
      ) : (
        <Path
          d={`M ${cx - s * 0.04} ${s * 0.464} Q ${cx} ${s * 0.49} ${cx + s * 0.04} ${s * 0.464}`}
          stroke={noseColor} strokeWidth={s * 0.016} fill="none" strokeLinecap="round"
        />
      )}

      {/* Tongue when happy */}
      {isHappy && (
        <Ellipse cx={cx} cy={s * 0.515} rx={s * 0.035} ry={s * 0.04} fill="#F87171" />
      )}

      {/* Head highlight (plush sheen) */}
      <Ellipse
        cx={cx - s * 0.08}
        cy={s * 0.24}
        rx={s * 0.07}
        ry={s * 0.045}
        fill="white"
        opacity={0.25}
        transform={`rotate(-20 ${cx - s * 0.08} ${s * 0.24})`}
      />
    </Svg>
  );
}

import Svg, {
  Circle, Ellipse, Path, G, Defs, RadialGradient, LinearGradient, Stop, Polygon,
} from 'react-native-svg';

interface Props {
  size?: number;
  mood?: 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
  baseColor?: string;
}

export function PetDragonSVG({ size = 200, mood = 'idle', baseColor = '#A78BFA' }: Props) {
  const s = size;
  const cx = s / 2;

  const isHappy = mood === 'happy';
  const isSleepy = mood === 'sleepy';
  const isMissingYou = mood === 'missing_you';

  const bodyMain  = '#7C3AED';
  const bodyShade = '#5B21B6';
  const bodyLight = '#A78BFA';
  const scaleColor = '#6D28D9';
  const wingColor  = '#8B5CF6';
  const noseColor  = '#FCD34D';  // gold
  const eyeColor   = '#FCD34D';  // slit pupils — gold
  const eyeBg      = '#1E1B4B';

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="dragBodyGrad" cx="45%" cy="38%" r="55%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="55%" stopColor={bodyMain} />
          <Stop offset="100%" stopColor={bodyShade} />
        </RadialGradient>
        <RadialGradient id="dragHeadGrad" cx="42%" cy="30%" r="55%">
          <Stop offset="0%" stopColor={bodyLight} />
          <Stop offset="50%" stopColor={bodyMain} />
          <Stop offset="100%" stopColor={bodyShade} />
        </RadialGradient>
        <LinearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={wingColor} stopOpacity="0.85" />
          <Stop offset="100%" stopColor={bodyShade} stopOpacity="0.5" />
        </LinearGradient>
      </Defs>

      {/* Ground shadow */}
      <Ellipse cx={cx} cy={s * 0.93} rx={s * 0.26} ry={s * 0.036} fill="#3B0764" opacity={0.2} />

      {/* LEFT wing */}
      <Path
        d={`M ${cx - s * 0.18} ${s * 0.52} Q ${cx - s * 0.45} ${s * 0.30} ${cx - s * 0.42} ${s * 0.62} Q ${cx - s * 0.38} ${s * 0.72} ${cx - s * 0.22} ${s * 0.68}`}
        fill="url(#wingGrad)" opacity={0.8}
      />
      {/* Wing veins */}
      <Path d={`M ${cx - s * 0.19} ${s * 0.56} Q ${cx - s * 0.36} ${s * 0.42} ${cx - s * 0.38} ${s * 0.62}`}
        stroke={bodyShade} strokeWidth={s * 0.010} fill="none" opacity={0.5} />

      {/* RIGHT wing */}
      <Path
        d={`M ${cx + s * 0.18} ${s * 0.52} Q ${cx + s * 0.45} ${s * 0.30} ${cx + s * 0.42} ${s * 0.62} Q ${cx + s * 0.38} ${s * 0.72} ${cx + s * 0.22} ${s * 0.68}`}
        fill="url(#wingGrad)" opacity={0.8}
      />
      <Path d={`M ${cx + s * 0.19} ${s * 0.56} Q ${cx + s * 0.36} ${s * 0.42} ${cx + s * 0.38} ${s * 0.62}`}
        stroke={bodyShade} strokeWidth={s * 0.010} fill="none" opacity={0.5} />

      {/* Body */}
      <Ellipse cx={cx} cy={s * 0.73} rx={s * 0.28} ry={s * 0.25} fill="url(#dragBodyGrad)" />

      {/* Belly scales (lighter belly) */}
      <Ellipse cx={cx} cy={s * 0.76} rx={s * 0.16} ry={s * 0.15} fill={bodyLight} opacity={0.30} />

      {/* Tail */}
      <Path
        d={`M ${cx + s * 0.20} ${s * 0.80} Q ${cx + s * 0.38} ${s * 0.78} ${cx + s * 0.40} ${s * 0.68} Q ${cx + s * 0.40} ${s * 0.60} ${cx + s * 0.32} ${s * 0.58}`}
        stroke={bodyMain} strokeWidth={s * 0.052} fill="none" strokeLinecap="round"
      />
      {/* Tail tip spike */}
      <Polygon
        points={`${cx + s * 0.30},${s * 0.55} ${cx + s * 0.38},${s * 0.50} ${cx + s * 0.34},${s * 0.60}`}
        fill={noseColor}
      />

      {/* Front claws */}
      <Ellipse cx={cx - s * 0.17} cy={s * 0.88} rx={s * 0.082} ry={s * 0.060} fill={bodyMain} />
      <Ellipse cx={cx + s * 0.17} cy={s * 0.88} rx={s * 0.082} ry={s * 0.060} fill={bodyMain} />
      {/* Claw tips */}
      <Path d={`M ${cx - s * 0.20} ${s * 0.90} l ${-s * 0.015} ${s * 0.025}`} stroke={scaleColor} strokeWidth={s * 0.014} strokeLinecap="round" />
      <Path d={`M ${cx - s * 0.17} ${s * 0.905} l 0 ${s * 0.028}`} stroke={scaleColor} strokeWidth={s * 0.014} strokeLinecap="round" />
      <Path d={`M ${cx - s * 0.14} ${s * 0.90} l ${s * 0.015} ${s * 0.025}`} stroke={scaleColor} strokeWidth={s * 0.014} strokeLinecap="round" />
      <Path d={`M ${cx + s * 0.14} ${s * 0.90} l ${-s * 0.015} ${s * 0.025}`} stroke={scaleColor} strokeWidth={s * 0.014} strokeLinecap="round" />
      <Path d={`M ${cx + s * 0.17} ${s * 0.905} l 0 ${s * 0.028}`} stroke={scaleColor} strokeWidth={s * 0.014} strokeLinecap="round" />
      <Path d={`M ${cx + s * 0.20} ${s * 0.90} l ${s * 0.015} ${s * 0.025}`} stroke={scaleColor} strokeWidth={s * 0.014} strokeLinecap="round" />

      {/* Head */}
      <Circle cx={cx} cy={s * 0.38} r={s * 0.28} fill="url(#dragHeadGrad)" />

      {/* Head spikes — 3 triangles on top */}
      <Polygon
        points={`${cx - s * 0.10},${s * 0.155} ${cx - s * 0.065},${s * 0.08} ${cx - s * 0.03},${s * 0.155}`}
        fill={noseColor}
      />
      <Polygon
        points={`${cx - s * 0.035},${s * 0.135} ${cx},${s * 0.065} ${cx + s * 0.035},${s * 0.135}`}
        fill={noseColor}
      />
      <Polygon
        points={`${cx + s * 0.03},${s * 0.155} ${cx + s * 0.065},${s * 0.08} ${cx + s * 0.10},${s * 0.155}`}
        fill={noseColor}
      />

      {/* Elongated snout */}
      <Ellipse cx={cx} cy={s * 0.475} rx={s * 0.14} ry={s * 0.085} fill={bodyMain} />
      <Ellipse cx={cx} cy={s * 0.48} rx={s * 0.10} ry={s * 0.060} fill={bodyLight} opacity={0.30} />

      {/* Nostrils */}
      <Ellipse cx={cx - s * 0.05} cy={s * 0.455} rx={s * 0.018} ry={s * 0.014} fill={scaleColor} />
      <Ellipse cx={cx + s * 0.05} cy={s * 0.455} rx={s * 0.018} ry={s * 0.014} fill={scaleColor} />
      {/* Nostril shine */}
      <Ellipse cx={cx - s * 0.055} cy={s * 0.450} rx={s * 0.007} ry={s * 0.005} fill="white" opacity={0.5} />
      <Ellipse cx={cx + s * 0.045} cy={s * 0.450} rx={s * 0.007} ry={s * 0.005} fill="white" opacity={0.5} />

      {/* EYES — slit pupils */}
      {isHappy ? (
        <G>
          <Path d={`M ${cx - s * 0.12} ${s * 0.355} Q ${cx - s * 0.075} ${s * 0.31} ${cx - s * 0.03} ${s * 0.355}`}
            stroke={noseColor} strokeWidth={s * 0.027} fill="none" strokeLinecap="round" />
          <Path d={`M ${cx + s * 0.03} ${s * 0.355} Q ${cx + s * 0.075} ${s * 0.31} ${cx + s * 0.12} ${s * 0.355}`}
            stroke={noseColor} strokeWidth={s * 0.027} fill="none" strokeLinecap="round" />
        </G>
      ) : isSleepy ? (
        <G>
          <Ellipse cx={cx - s * 0.08} cy={s * 0.355} rx={s * 0.055} ry={s * 0.028} fill={eyeBg} />
          <Ellipse cx={cx + s * 0.08} cy={s * 0.355} rx={s * 0.055} ry={s * 0.028} fill={eyeBg} />
        </G>
      ) : isMissingYou ? (
        <G>
          {/* Slit eye background */}
          <Ellipse cx={cx - s * 0.08} cy={s * 0.355} rx={s * 0.058} ry={s * 0.058} fill={eyeBg} />
          <Ellipse cx={cx + s * 0.08} cy={s * 0.355} rx={s * 0.058} ry={s * 0.058} fill={eyeBg} />
          {/* Slit pupils */}
          <Ellipse cx={cx - s * 0.08} cy={s * 0.355} rx={s * 0.014} ry={s * 0.044} fill={eyeColor} />
          <Ellipse cx={cx + s * 0.08} cy={s * 0.355} rx={s * 0.014} ry={s * 0.044} fill={eyeColor} />
          <Ellipse cx={cx + s * 0.08} cy={s * 0.42} rx={s * 0.016} ry={s * 0.022} fill="#93C5FD" opacity={0.8} />
        </G>
      ) : (
        <G>
          {/* Slit eye background */}
          <Ellipse cx={cx - s * 0.08} cy={s * 0.355} rx={s * 0.060} ry={s * 0.060} fill={eyeBg} />
          <Ellipse cx={cx + s * 0.08} cy={s * 0.355} rx={s * 0.060} ry={s * 0.060} fill={eyeBg} />
          {/* Gold iris ring */}
          <Ellipse cx={cx - s * 0.08} cy={s * 0.355} rx={s * 0.050} ry={s * 0.050} fill="none" stroke={eyeColor} strokeWidth={s * 0.012} />
          <Ellipse cx={cx + s * 0.08} cy={s * 0.355} rx={s * 0.050} ry={s * 0.050} fill="none" stroke={eyeColor} strokeWidth={s * 0.012} />
          {/* Vertical slit pupil */}
          <Ellipse cx={cx - s * 0.08} cy={s * 0.355} rx={s * 0.014} ry={s * 0.042} fill={scaleColor} />
          <Ellipse cx={cx + s * 0.08} cy={s * 0.355} rx={s * 0.014} ry={s * 0.042} fill={scaleColor} />
          {/* Eye shine */}
          <Circle cx={cx - s * 0.065} cy={s * 0.34} r={s * 0.012} fill="white" opacity={0.7} />
          <Circle cx={cx + s * 0.095} cy={s * 0.34} r={s * 0.012} fill="white" opacity={0.7} />
        </G>
      )}

      {/* Mouth / fire when happy */}
      {isHappy ? (
        <G>
          <Path d={`M ${cx - s * 0.055} ${s * 0.49} Q ${cx} ${s * 0.525} ${cx + s * 0.055} ${s * 0.49}`}
            stroke={scaleColor} strokeWidth={s * 0.018} fill="none" strokeLinecap="round" />
          {/* Small flame */}
          <Path d={`M ${cx} ${s * 0.52} Q ${cx - s * 0.02} ${s * 0.54} ${cx} ${s * 0.565} Q ${cx + s * 0.02} ${s * 0.54} ${cx} ${s * 0.52}`}
            fill={noseColor} opacity={0.9} />
        </G>
      ) : (
        <Path d={`M ${cx - s * 0.04} ${s * 0.49} Q ${cx} ${s * 0.510} ${cx + s * 0.04} ${s * 0.49}`}
          stroke={scaleColor} strokeWidth={s * 0.016} fill="none" strokeLinecap="round" />
      )}

      {/* Head highlight */}
      <Ellipse
        cx={cx - s * 0.085} cy={s * 0.24}
        rx={s * 0.072} ry={s * 0.044}
        fill="white" opacity={0.20}
        transform={`rotate(-20 ${cx - s * 0.085} ${s * 0.24})`}
      />
    </Svg>
  );
}

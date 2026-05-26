// Tiger — orange with black stripes, standing heroic pose (Épica)
import Svg, { Circle, Ellipse, Path, G, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';

type Mood = 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
interface Props { size?: number; mood?: Mood; }

function Eye({ x, y, r, mood }: { x: number; y: number; r: number; mood: Mood }) {
  if (mood === 'happy') {
    return (
      <Path d={`M ${x - r} ${y + r*0.2} Q ${x} ${y - r*1.15} ${x + r} ${y + r*0.2}`}
        stroke="#1A0A00" strokeWidth={r*0.55} fill="none" strokeLinecap="round" />
    );
  }
  return (
    <G>
      <Circle cx={x} cy={y} r={r} fill="white" />
      <Circle cx={x} cy={y} r={r*0.72} fill="#D4941C" />
      <Circle cx={x} cy={y} r={r*0.72} fill="#905010" opacity={0.40} />
      <Circle cx={x} cy={y} r={r*0.38} fill="#0D0800" />
      <Circle cx={x + r*0.26} cy={y - r*0.30} r={r*0.20} fill="white" opacity={0.92} />
      <Circle cx={x + r*0.08} cy={y - r*0.50} r={r*0.09} fill="white" opacity={0.65} />
      {mood === 'sleepy' && (
        <Path d={`M ${x - r*1.05} ${y} Q ${x} ${y - r*0.52} ${x + r*1.05} ${y}`}
          fill="#F8CEAA" />
      )}
    </G>
  );
}

// Stripe helper
function Stripe({ d, s }: { d: string; s: number }) {
  return <Path d={d} fill="#2C1810" opacity={0.78} strokeLinecap="round" />;
}

export function PetTigerSVG({ size = 200, mood = 'idle' }: Props) {
  const s = size;
  const cx = s / 2;

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="tHead" cx="36%" cy="26%" r="65%">
          <Stop offset="0%"   stopColor="#FFD090" />
          <Stop offset="40%"  stopColor="#FF9030" />
          <Stop offset="100%" stopColor="#C05010" />
        </RadialGradient>
        <RadialGradient id="tBody" cx="36%" cy="22%" r="68%">
          <Stop offset="0%"   stopColor="#FFB850" />
          <Stop offset="50%"  stopColor="#E87018" />
          <Stop offset="100%" stopColor="#A04008" />
        </RadialGradient>
        <RadialGradient id="tBelly" cx="50%" cy="30%" r="60%">
          <Stop offset="0%"   stopColor="#FFF8E8" />
          <Stop offset="100%" stopColor="#F8E0C0" />
        </RadialGradient>
        <RadialGradient id="tMuzzle" cx="48%" cy="28%" r="62%">
          <Stop offset="0%"   stopColor="#FFF5E8" />
          <Stop offset="100%" stopColor="#F8D8B0" />
        </RadialGradient>
        <RadialGradient id="tEar" cx="40%" cy="30%" r="62%">
          <Stop offset="0%"   stopColor="#FFAA50" />
          <Stop offset="100%" stopColor="#B05010" />
        </RadialGradient>
        <LinearGradient id="tEarInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%"   stopColor="#F8B0A0" />
          <Stop offset="100%" stopColor="#E07060" />
        </LinearGradient>
      </Defs>

      {/* Ground shadow */}
      <Ellipse cx={cx} cy={s*0.948} rx={s*0.22} ry={s*0.034} fill="#1A0A40" opacity={0.14} />

      {/* Body */}
      <Ellipse cx={cx} cy={s*0.755} rx={s*0.265} ry={s*0.220} fill="url(#tBody)" />

      {/* Belly patch */}
      <Ellipse cx={cx} cy={s*0.785} rx={s*0.140} ry={s*0.155} fill="url(#tBelly)" opacity={0.80} />

      {/* Body stripes */}
      <Path d={`M ${cx + s*0.10} ${s*0.60} Q ${cx + s*0.20} ${s*0.62} ${cx + s*0.24} ${s*0.70}`}
        stroke="#2C1810" strokeWidth={s*0.022} fill="none" strokeLinecap="round" opacity={0.72} />
      <Path d={`M ${cx + s*0.14} ${s*0.70} Q ${cx + s*0.24} ${s*0.73} ${cx + s*0.26} ${s*0.82}`}
        stroke="#2C1810" strokeWidth={s*0.020} fill="none" strokeLinecap="round" opacity={0.65} />
      <Path d={`M ${cx - s*0.10} ${s*0.60} Q ${cx - s*0.20} ${s*0.62} ${cx - s*0.24} ${s*0.70}`}
        stroke="#2C1810" strokeWidth={s*0.022} fill="none" strokeLinecap="round" opacity={0.72} />
      <Path d={`M ${cx - s*0.14} ${s*0.70} Q ${cx - s*0.24} ${s*0.73} ${cx - s*0.26} ${s*0.82}`}
        stroke="#2C1810" strokeWidth={s*0.020} fill="none" strokeLinecap="round" opacity={0.65} />

      {/* Tail */}
      <Path d={`M ${s*0.72} ${s*0.78} Q ${s*0.92} ${s*0.68} ${s*0.88} ${s*0.50} Q ${s*0.85} ${s*0.42} ${s*0.76} ${s*0.50}`}
        stroke="#E87018" strokeWidth={s*0.065} fill="none" strokeLinecap="round" />
      {/* Tail stripes */}
      {[0.66, 0.58, 0.50].map((t, i) => (
        <Path key={i}
          d={`M ${s*(0.84 - i*0.03)} ${s*t} Q ${s*(0.88 - i*0.02)} ${s*(t+0.02)} ${s*(0.86 - i*0.03)} ${s*(t+0.05)}`}
          stroke="#2C1810" strokeWidth={s*0.018} fill="none" strokeLinecap="round" opacity={0.65} />
      ))}

      {/* Front paws */}
      <Ellipse cx={cx - s*0.13} cy={s*0.910} rx={s*0.075} ry={s*0.048} fill="#E87018" />
      <Ellipse cx={cx + s*0.13} cy={s*0.910} rx={s*0.075} ry={s*0.048} fill="#E87018" />

      {/* Left ear (behind head) */}
      <Ellipse cx={cx - s*0.185} cy={s*0.235} rx={s*0.100} ry={s*0.125}
        fill="url(#tEar)" transform={`rotate(-12, ${cx - s*0.185}, ${s*0.235})`} />
      <Ellipse cx={cx - s*0.185} cy={s*0.245} rx={s*0.055} ry={s*0.085}
        fill="url(#tEarInner)" opacity={0.80}
        transform={`rotate(-12, ${cx - s*0.185}, ${s*0.245})`} />

      {/* Right ear (behind head) */}
      <Ellipse cx={cx + s*0.185} cy={s*0.228} rx={s*0.095} ry={s*0.118}
        fill="url(#tEar)" transform={`rotate(12, ${cx + s*0.185}, ${s*0.228})`} />
      <Ellipse cx={cx + s*0.185} cy={s*0.238} rx={s*0.052} ry={s*0.080}
        fill="url(#tEarInner)" opacity={0.80}
        transform={`rotate(12, ${cx + s*0.185}, ${s*0.238})`} />

      {/* Head */}
      <Circle cx={cx} cy={s*0.440} r={s*0.265} fill="url(#tHead)" />

      {/* White forehead/face marks */}
      <Ellipse cx={cx} cy={s*0.375} rx={s*0.065} ry={s*0.055} fill="white" opacity={0.30} />

      {/* Head stripes */}
      <Path d={`M ${cx - s*0.06} ${s*0.28} Q ${cx - s*0.12} ${s*0.33} ${cx - s*0.10} ${s*0.40}`}
        stroke="#2C1810" strokeWidth={s*0.018} fill="none" strokeLinecap="round" opacity={0.68} />
      <Path d={`M ${cx + s*0.06} ${s*0.28} Q ${cx + s*0.12} ${s*0.33} ${cx + s*0.10} ${s*0.40}`}
        stroke="#2C1810" strokeWidth={s*0.018} fill="none" strokeLinecap="round" opacity={0.68} />
      <Path d={`M ${cx} ${s*0.27} Q ${cx + s*0.02} ${s*0.32} ${cx} ${s*0.36}`}
        stroke="#2C1810" strokeWidth={s*0.014} fill="none" strokeLinecap="round" opacity={0.55} />

      {/* Muzzle (white) */}
      <Ellipse cx={cx} cy={s*0.540} rx={s*0.125} ry={s*0.090} fill="url(#tMuzzle)" />

      {/* Eyes */}
      <Eye x={cx - s*0.118} y={s*0.410} r={s*0.068} mood={mood} />
      <Eye x={cx + s*0.118} y={s*0.410} r={s*0.068} mood={mood} />

      {/* Nose */}
      <Path d={`M ${cx - s*0.025} ${s*0.505} L ${cx + s*0.025} ${s*0.505} L ${cx} ${s*0.528} Z`}
        fill="#8B3A20" />

      {/* Mouth */}
      {mood === 'happy' ? (
        <Path d={`M ${cx - s*0.062} ${s*0.555} Q ${cx} ${s*0.592} ${cx + s*0.062} ${s*0.555}`}
          stroke="#6B2A10" strokeWidth={s*0.017} fill="none" strokeLinecap="round" />
      ) : (
        <Path d={`M ${cx - s*0.048} ${s*0.555} Q ${cx} ${s*0.578} ${cx + s*0.048} ${s*0.555}`}
          stroke="#6B2A10" strokeWidth={s*0.015} fill="none" strokeLinecap="round" />
      )}

      {/* Blush */}
      <Ellipse cx={cx - s*0.200} cy={s*0.480} rx={s*0.058} ry={s*0.031} fill="rgba(255,140,80,0.38)" />
      <Ellipse cx={cx + s*0.200} cy={s*0.480} rx={s*0.058} ry={s*0.031} fill="rgba(255,140,80,0.38)" />

      {/* Head specular */}
      <Ellipse cx={cx + s*0.105} cy={s*0.308} rx={s*0.082} ry={s*0.055}
        fill="white" opacity={0.25} transform={`rotate(-28, ${cx + s*0.105}, ${s*0.308})`} />
    </Svg>
  );
}

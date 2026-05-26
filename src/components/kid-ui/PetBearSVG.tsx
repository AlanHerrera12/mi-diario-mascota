// Polar Bear — white/icy with ice-blue crystal aura (Épica)
import Svg, { Circle, Ellipse, Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';

type Mood = 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
interface Props { size?: number; mood?: Mood; }

function Eye({ x, y, r, mood }: { x: number; y: number; r: number; mood: Mood }) {
  if (mood === 'happy') {
    return (
      <Path d={`M ${x - r} ${y + r*0.2} Q ${x} ${y - r*1.15} ${x + r} ${y + r*0.2}`}
        stroke="#0A2030" strokeWidth={r*0.55} fill="none" strokeLinecap="round" />
    );
  }
  return (
    <G>
      <Circle cx={x} cy={y} r={r} fill="white" />
      <Circle cx={x} cy={y} r={r*0.72} fill="#5BA8D8" />
      <Circle cx={x} cy={y} r={r*0.72} fill="#2878A8" opacity={0.38} />
      <Circle cx={x} cy={y} r={r*0.38} fill="#0A1828" />
      <Circle cx={x + r*0.26} cy={y - r*0.30} r={r*0.20} fill="white" opacity={0.92} />
      <Circle cx={x + r*0.08} cy={y - r*0.50} r={r*0.09} fill="white" opacity={0.65} />
      {mood === 'sleepy' && (
        <Path d={`M ${x - r*1.05} ${y} Q ${x} ${y - r*0.52} ${x + r*1.05} ${y}`} fill="#EEF6FF" />
      )}
    </G>
  );
}

function Crystal({ x, y, h, op = 0.70 }: { x: number; y: number; h: number; op?: number }) {
  return (
    <Path d={`M ${x} ${y - h} L ${x + h*0.5} ${y} L ${x} ${y + h*0.7} L ${x - h*0.5} ${y} Z`}
      fill="#A8D8F0" stroke="#78B8E0" strokeWidth={h*0.10} opacity={op} />
  );
}

export function PetBearSVG({ size = 200, mood = 'idle' }: Props) {
  const s = size;
  const cx = s / 2;

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="pbHead" cx="36%" cy="26%" r="65%">
          <Stop offset="0%"   stopColor="#FFFFFF" />
          <Stop offset="40%"  stopColor="#EEF8FF" />
          <Stop offset="100%" stopColor="#B8D8F0" />
        </RadialGradient>
        <RadialGradient id="pbBody" cx="36%" cy="22%" r="68%">
          <Stop offset="0%"   stopColor="#FFFFFF" />
          <Stop offset="50%"  stopColor="#E8F4FF" />
          <Stop offset="100%" stopColor="#A8C8E8" />
        </RadialGradient>
        <RadialGradient id="pbEar" cx="40%" cy="30%" r="62%">
          <Stop offset="0%"   stopColor="#F0FAFF" />
          <Stop offset="100%" stopColor="#C8E4F8" />
        </RadialGradient>
        <RadialGradient id="pbMuzzle" cx="48%" cy="28%" r="62%">
          <Stop offset="0%"   stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#DCF0FF" />
        </RadialGradient>
        <RadialGradient id="pbAura" cx="50%" cy="50%" r="50%">
          <Stop offset="0%"   stopColor="#78C8F0" stopOpacity="0.22" />
          <Stop offset="100%" stopColor="#A8D8F8" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Ice aura glow */}
      <Circle cx={cx} cy={s*0.5} r={s*0.46} fill="url(#pbAura)" />

      {/* Ice crystals */}
      <Crystal x={cx - s*0.36} y={s*0.40} h={s*0.052} op={0.72} />
      <Crystal x={cx + s*0.36} y={s*0.38} h={s*0.046} op={0.68} />
      <Crystal x={cx - s*0.30} y={s*0.72} h={s*0.040} op={0.60} />
      <Crystal x={cx + s*0.28} y={s*0.74} h={s*0.036} op={0.55} />
      <Crystal x={cx + s*0.05} y={s*0.12} h={s*0.032} op={0.50} />
      <Crystal x={cx - s*0.08} y={s*0.88} h={s*0.028} op={0.45} />

      {/* Ground shadow */}
      <Ellipse cx={cx} cy={s*0.945} rx={s*0.23} ry={s*0.034} fill="#1A0A40" opacity={0.10} />

      {/* Body */}
      <Ellipse cx={cx} cy={s*0.75} rx={s*0.29} ry={s*0.23} fill="url(#pbBody)" />

      {/* Paws */}
      <Ellipse cx={cx - s*0.15} cy={s*0.912} rx={s*0.085} ry={s*0.050} fill="#E8F4FF" />
      <Ellipse cx={cx + s*0.15} cy={s*0.912} rx={s*0.085} ry={s*0.050} fill="#E8F4FF" />

      {/* Left ear */}
      <Circle cx={cx - s*0.205} cy={s*0.270} r={s*0.090} fill="url(#pbEar)" />
      <Circle cx={cx - s*0.205} cy={s*0.270} r={s*0.054} fill="#D8EEFF" />

      {/* Right ear */}
      <Circle cx={cx + s*0.205} cy={s*0.265} r={s*0.084} fill="url(#pbEar)" />
      <Circle cx={cx + s*0.205} cy={s*0.265} r={s*0.050} fill="#D8EEFF" />

      {/* Head */}
      <Circle cx={cx} cy={s*0.435} r={s*0.285} fill="url(#pbHead)" />

      {/* Muzzle */}
      <Ellipse cx={cx} cy={s*0.545} rx={s*0.135} ry={s*0.095} fill="url(#pbMuzzle)" />

      {/* Eyes */}
      <Eye x={cx - s*0.118} y={s*0.408} r={s*0.070} mood={mood} />
      <Eye x={cx + s*0.118} y={s*0.408} r={s*0.070} mood={mood} />

      {/* Nose */}
      <Ellipse cx={cx} cy={s*0.512} rx={s*0.032} ry={s*0.022} fill="#4A7890" />
      <Ellipse cx={cx} cy={s*0.508} rx={s*0.013} ry={s*0.007} fill="#78A8C0" opacity={0.5} />

      {/* Mouth */}
      {mood === 'happy' ? (
        <Path d={`M ${cx - s*0.062} ${s*0.568} Q ${cx} ${s*0.604} ${cx + s*0.062} ${s*0.568}`}
          stroke="#4A7890" strokeWidth={s*0.017} fill="none" strokeLinecap="round" />
      ) : (
        <Path d={`M ${cx - s*0.048} ${s*0.568} Q ${cx} ${s*0.590} ${cx + s*0.048} ${s*0.568}`}
          stroke="#4A7890" strokeWidth={s*0.015} fill="none" strokeLinecap="round" />
      )}

      {/* Blush (icy blue-pink) */}
      <Ellipse cx={cx - s*0.208} cy={s*0.490} rx={s*0.060} ry={s*0.033} fill="rgba(160,210,248,0.45)" />
      <Ellipse cx={cx + s*0.208} cy={s*0.490} rx={s*0.060} ry={s*0.033} fill="rgba(160,210,248,0.45)" />

      {/* Head specular */}
      <Ellipse cx={cx + s*0.110} cy={s*0.305} rx={s*0.085} ry={s*0.057}
        fill="white" opacity={0.38} transform={`rotate(-28, ${cx + s*0.110}, ${s*0.305})`} />
    </Svg>
  );
}

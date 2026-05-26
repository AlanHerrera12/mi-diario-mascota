// Unicorn — white pearlescent, rainbow mane, golden horn, soft wings (Legendaria)
import Svg, { Circle, Ellipse, Path, G, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';

type Mood = 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
interface Props { size?: number; mood?: Mood; }

function Eye({ x, y, r, mood }: { x: number; y: number; r: number; mood: Mood }) {
  if (mood === 'happy') {
    return (
      <Path d={`M ${x - r} ${y + r*0.2} Q ${x} ${y - r*1.15} ${x + r} ${y + r*0.2}`}
        stroke="#1A0838" strokeWidth={r*0.55} fill="none" strokeLinecap="round" />
    );
  }
  return (
    <G>
      <Circle cx={x} cy={y} r={r} fill="white" />
      <Circle cx={x} cy={y} r={r*0.72} fill="#9B59B6" />
      <Circle cx={x} cy={y} r={r*0.72} fill="#5A1880" opacity={0.40} />
      <Circle cx={x} cy={y} r={r*0.38} fill="#0E0520" />
      <Circle cx={x + r*0.26} cy={y - r*0.30} r={r*0.20} fill="white" opacity={0.95} />
      <Circle cx={x + r*0.08} cy={y - r*0.50} r={r*0.09} fill="white" opacity={0.68} />
      {/* Small star sparkle in iris */}
      <Circle cx={x - r*0.20} cy={y + r*0.20} r={r*0.07} fill="white" opacity={0.50} />
      {mood === 'sleepy' && (
        <Path d={`M ${x - r*1.05} ${y} Q ${x} ${y - r*0.52} ${x + r*1.05} ${y}`}
          fill="#FFF5FA" />
      )}
    </G>
  );
}

export function PetUnicornSVG({ size = 200, mood = 'idle' }: Props) {
  const s = size;
  const cx = s / 2;

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="uHead" cx="36%" cy="26%" r="65%">
          <Stop offset="0%"   stopColor="#FFFFFF" />
          <Stop offset="38%"  stopColor="#F8F0FF" />
          <Stop offset="100%" stopColor="#D8C0F0" />
        </RadialGradient>
        <RadialGradient id="uBody" cx="36%" cy="22%" r="68%">
          <Stop offset="0%"   stopColor="#FFFFFF" />
          <Stop offset="48%"  stopColor="#F0E8FF" />
          <Stop offset="100%" stopColor="#C8A8E8" />
        </RadialGradient>
        <LinearGradient id="uHorn" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%"   stopColor="#FFF0A0" />
          <Stop offset="50%"  stopColor="#FFD020" />
          <Stop offset="100%" stopColor="#C09010" />
        </LinearGradient>
        <LinearGradient id="uMane1" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%"   stopColor="#FF9EC8" />
          <Stop offset="40%"  stopColor="#C880FF" />
          <Stop offset="100%" stopColor="#80C8FF" />
        </LinearGradient>
        <LinearGradient id="uMane2" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%"   stopColor="#80E8C8" />
          <Stop offset="50%"  stopColor="#80AAFF" />
          <Stop offset="100%" stopColor="#FF80C8" />
        </LinearGradient>
        <RadialGradient id="uWing" cx="32%" cy="20%" r="70%">
          <Stop offset="0%"   stopColor="#FFFFFF" />
          <Stop offset="60%"  stopColor="#F0E0FF" />
          <Stop offset="100%" stopColor="#C8A8E8" />
        </RadialGradient>
        <RadialGradient id="uAura" cx="50%" cy="50%" r="50%">
          <Stop offset="0%"   stopColor="#E8C0FF" stopOpacity="0.30" />
          <Stop offset="100%" stopColor="#FFB8E8" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="uMuzzle" cx="48%" cy="28%" r="62%">
          <Stop offset="0%"   stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#F0E4FF" />
        </RadialGradient>
      </Defs>

      {/* Magical aura glow */}
      <Circle cx={cx} cy={s*0.50} r={s*0.46} fill="url(#uAura)" />

      {/* Sparkle stars around unicorn */}
      {[
        { x: cx - s*0.36, y: s*0.30, s2: s*0.018 },
        { x: cx + s*0.38, y: s*0.28, s2: s*0.015 },
        { x: cx - s*0.28, y: s*0.15, s2: s*0.013 },
        { x: cx + s*0.20, y: s*0.14, s2: s*0.016 },
        { x: cx + s*0.38, y: s*0.58, s2: s*0.012 },
        { x: cx - s*0.34, y: s*0.70, s2: s*0.010 },
        { x: cx + s*0.05, y: s*0.88, s2: s*0.014 },
      ].map((p, i) => (
        <G key={i}>
          <Path d={`M ${p.x} ${p.y - p.s2} L ${p.x} ${p.y + p.s2} M ${p.x - p.s2} ${p.y} L ${p.x + p.s2} ${p.y}`}
            stroke="#E8C0FF" strokeWidth={p.s2 * 0.4} opacity={0.80} />
          <Path d={`M ${p.x - p.s2*0.7} ${p.y - p.s2*0.7} L ${p.x + p.s2*0.7} ${p.y + p.s2*0.7} M ${p.x + p.s2*0.7} ${p.y - p.s2*0.7} L ${p.x - p.s2*0.7} ${p.y + p.s2*0.7}`}
            stroke="#FFB8E8" strokeWidth={p.s2 * 0.3} opacity={0.65} />
        </G>
      ))}

      {/* Ground shadow */}
      <Ellipse cx={cx} cy={s*0.948} rx={s*0.22} ry={s*0.033} fill="#1A0A40" opacity={0.10} />

      {/* Body */}
      <Ellipse cx={cx} cy={s*0.755} rx={s*0.265} ry={s*0.215} fill="url(#uBody)" />

      {/* Body shimmer */}
      <Ellipse cx={cx - s*0.06} cy={s*0.68} rx={s*0.065} ry={s*0.042}
        fill="#E0C8FF" opacity={0.22} transform={`rotate(-22, ${cx - s*0.06}, ${s*0.68})`} />

      {/* Paws */}
      <Ellipse cx={cx - s*0.14} cy={s*0.912} rx={s*0.078} ry={s*0.048} fill="#F0E8FF" />
      <Ellipse cx={cx + s*0.14} cy={s*0.912} rx={s*0.078} ry={s*0.048} fill="#F0E8FF" />

      {/* Left wing (behind body) */}
      <Path d={`M ${cx - s*0.08} ${s*0.65} Q ${cx - s*0.40} ${s*0.35} ${cx - s*0.36} ${s*0.15} Q ${cx - s*0.26} ${s*0.30} ${cx - s*0.10} ${s*0.55}`}
        fill="url(#uWing)" opacity={0.85} />
      <Path d={`M ${cx - s*0.08} ${s*0.65} Q ${cx - s*0.33} ${s*0.25} ${cx - s*0.36} ${s*0.15}`}
        stroke="#D8C0F0" strokeWidth={s*0.010} fill="none" opacity={0.50} />
      <Path d={`M ${cx - s*0.12} ${s*0.60} Q ${cx - s*0.28} ${s*0.30} ${cx - s*0.28} ${s*0.18}`}
        stroke="#D8C0F0" strokeWidth={s*0.008} fill="none" opacity={0.40} />

      {/* Right wing (behind body) */}
      <Path d={`M ${cx + s*0.08} ${s*0.65} Q ${cx + s*0.40} ${s*0.35} ${cx + s*0.36} ${s*0.15} Q ${cx + s*0.26} ${s*0.30} ${cx + s*0.10} ${s*0.55}`}
        fill="url(#uWing)" opacity={0.85} />
      <Path d={`M ${cx + s*0.08} ${s*0.65} Q ${cx + s*0.33} ${s*0.25} ${cx + s*0.36} ${s*0.15}`}
        stroke="#D8C0F0" strokeWidth={s*0.010} fill="none" opacity={0.50} />
      <Path d={`M ${cx + s*0.12} ${s*0.60} Q ${cx + s*0.28} ${s*0.30} ${cx + s*0.28} ${s*0.18}`}
        stroke="#D8C0F0" strokeWidth={s*0.008} fill="none" opacity={0.40} />

      {/* Rainbow mane (flowing left side, behind head) */}
      <Path d={`M ${cx - s*0.20} ${s*0.30} Q ${cx - s*0.35} ${s*0.45} ${cx - s*0.28} ${s*0.60}`}
        stroke="url(#uMane1)" strokeWidth={s*0.062} fill="none" strokeLinecap="round" opacity={0.92} />
      <Path d={`M ${cx - s*0.22} ${s*0.28} Q ${cx - s*0.40} ${s*0.42} ${cx - s*0.32} ${s*0.58}`}
        stroke="url(#uMane2)" strokeWidth={s*0.042} fill="none" strokeLinecap="round" opacity={0.80} />
      <Path d={`M ${cx - s*0.18} ${s*0.32} Q ${cx - s*0.30} ${s*0.48} ${cx - s*0.24} ${s*0.62}`}
        stroke="#FF9EC8" strokeWidth={s*0.025} fill="none" strokeLinecap="round" opacity={0.65} />

      {/* Top mane / forelock */}
      <Path d={`M ${cx - s*0.10} ${s*0.225} Q ${cx - s*0.18} ${s*0.18} ${cx - s*0.08} ${s*0.13}`}
        stroke="url(#uMane1)" strokeWidth={s*0.048} fill="none" strokeLinecap="round" opacity={0.88} />
      <Path d={`M ${cx - s*0.06} ${s*0.220} Q ${cx} ${s*0.17} ${cx + s*0.05} ${s*0.12}`}
        stroke="url(#uMane2)" strokeWidth={s*0.035} fill="none" strokeLinecap="round" opacity={0.75} />

      {/* Horn */}
      <Path d={`M ${cx - s*0.025} ${s*0.230} L ${cx} ${s*0.105} L ${cx + s*0.025} ${s*0.230}`}
        fill="url(#uHorn)" />
      {/* Horn spiral lines */}
      {[0.18, 0.15, 0.13].map((y, i) => (
        <Path key={i}
          d={`M ${cx - s*(0.018 - i*0.004)} ${s*y} Q ${cx} ${s*(y-0.008)} ${cx + s*(0.018 - i*0.004)} ${s*y}`}
          stroke="#D4A010" strokeWidth={s*0.006} fill="none" opacity={0.55} />
      ))}

      {/* Head */}
      <Circle cx={cx} cy={s*0.435} r={s*0.270} fill="url(#uHead)" />

      {/* Muzzle */}
      <Ellipse cx={cx} cy={s*0.540} rx={s*0.125} ry={s*0.088} fill="url(#uMuzzle)" />

      {/* Eyes */}
      <Eye x={cx - s*0.115} y={s*0.406} r={s*0.068} mood={mood} />
      <Eye x={cx + s*0.115} y={s*0.406} r={s*0.068} mood={mood} />

      {/* Nose */}
      <Ellipse cx={cx} cy={s*0.505} rx={s*0.024} ry={s*0.017} fill="#D090C0" />

      {/* Mouth */}
      {mood === 'happy' ? (
        <Path d={`M ${cx - s*0.058} ${s*0.555} Q ${cx} ${s*0.590} ${cx + s*0.058} ${s*0.555}`}
          stroke="#A06090" strokeWidth={s*0.016} fill="none" strokeLinecap="round" />
      ) : (
        <Path d={`M ${cx - s*0.044} ${s*0.555} Q ${cx} ${s*0.575} ${cx + s*0.044} ${s*0.555}`}
          stroke="#A06090" strokeWidth={s*0.014} fill="none" strokeLinecap="round" />
      )}

      {/* Blush (pastel pink/purple) */}
      <Ellipse cx={cx - s*0.198} cy={s*0.478} rx={s*0.058} ry={s*0.031} fill="rgba(255,160,210,0.42)" />
      <Ellipse cx={cx + s*0.198} cy={s*0.478} rx={s*0.058} ry={s*0.031} fill="rgba(255,160,210,0.42)" />

      {/* Head specular */}
      <Ellipse cx={cx + s*0.108} cy={s*0.305} rx={s*0.085} ry={s*0.057}
        fill="white" opacity={0.35} transform={`rotate(-28, ${cx + s*0.108}, ${s*0.305})`} />
    </Svg>
  );
}

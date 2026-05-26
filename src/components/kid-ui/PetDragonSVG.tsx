// Dragon — deep purple, gold belly scales, wings, purple magic fire (Legendaria)
import Svg, { Circle, Ellipse, Path, G, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';

type Mood = 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
interface Props { size?: number; mood?: Mood; baseColor?: string; }

function Eye({ x, y, r, mood }: { x: number; y: number; r: number; mood: Mood }) {
  if (mood === 'happy') {
    return (
      <Path d={`M ${x - r} ${y + r*0.2} Q ${x} ${y - r*1.15} ${x + r} ${y + r*0.2}`}
        stroke="#0A0818" strokeWidth={r*0.55} fill="none" strokeLinecap="round" />
    );
  }
  return (
    <G>
      <Circle cx={x} cy={y} r={r} fill="white" />
      <Circle cx={x} cy={y} r={r*0.72} fill="#40C8C0" />
      <Circle cx={x} cy={y} r={r*0.72} fill="#108888" opacity={0.42} />
      {/* Vertical slit pupil */}
      <Ellipse cx={x} cy={y} rx={r*0.20} ry={r*0.60} fill="#050A18" />
      <Circle cx={x + r*0.26} cy={y - r*0.30} r={r*0.20} fill="white" opacity={0.92} />
      <Circle cx={x + r*0.08} cy={y - r*0.50} r={r*0.09} fill="white" opacity={0.65} />
      {mood === 'sleepy' && (
        <Path d={`M ${x - r*1.05} ${y} Q ${x} ${y - r*0.52} ${x + r*1.05} ${y}`}
          fill="#2D1258" />
      )}
    </G>
  );
}

export function PetDragonSVG({ size = 200, mood = 'idle' }: Props) {
  const s = size;
  const cx = s / 2;

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="drHead" cx="36%" cy="26%" r="65%">
          <Stop offset="0%"   stopColor="#7850C8" />
          <Stop offset="42%"  stopColor="#4A20A0" />
          <Stop offset="100%" stopColor="#1E0850" />
        </RadialGradient>
        <RadialGradient id="drBody" cx="36%" cy="22%" r="68%">
          <Stop offset="0%"   stopColor="#6040B8" />
          <Stop offset="50%"  stopColor="#3A1888" />
          <Stop offset="100%" stopColor="#180848" />
        </RadialGradient>
        <RadialGradient id="drBelly" cx="50%" cy="28%" r="62%">
          <Stop offset="0%"   stopColor="#FFE080" />
          <Stop offset="50%"  stopColor="#C89820" />
          <Stop offset="100%" stopColor="#906010" />
        </RadialGradient>
        <RadialGradient id="drWing" cx="30%" cy="20%" r="70%">
          <Stop offset="0%"   stopColor="#8858D8" />
          <Stop offset="100%" stopColor="#2A1068" />
        </RadialGradient>
        <RadialGradient id="drHorn" cx="40%" cy="20%" r="65%">
          <Stop offset="0%"   stopColor="#FFE888" />
          <Stop offset="100%" stopColor="#B87820" />
        </RadialGradient>
        <RadialGradient id="drFire" cx="50%" cy="40%" r="55%">
          <Stop offset="0%"   stopColor="#C880FF" stopOpacity="0.80" />
          <Stop offset="60%"  stopColor="#8840CC" stopOpacity="0.45" />
          <Stop offset="100%" stopColor="#4010A0" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Purple magic fire / aura glow behind body */}
      <Ellipse cx={cx} cy={s*0.82} rx={s*0.35} ry={s*0.18} fill="url(#drFire)" />
      <Ellipse cx={cx} cy={s*0.50} rx={s*0.42} ry={s*0.42} fill="#6020C0" opacity={0.08} />

      {/* Floating magic sparks */}
      {[
        { x: cx - s*0.32, y: s*0.35, r: s*0.012 },
        { x: cx + s*0.34, y: s*0.42, r: s*0.009 },
        { x: cx - s*0.18, y: s*0.15, r: s*0.010 },
        { x: cx + s*0.22, y: s*0.20, r: s*0.008 },
        { x: cx - s*0.38, y: s*0.62, r: s*0.010 },
        { x: cx + s*0.36, y: s*0.68, r: s*0.008 },
      ].map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#C880FF" opacity={0.70} />
      ))}

      {/* Ground shadow */}
      <Ellipse cx={cx} cy={s*0.948} rx={s*0.21} ry={s*0.033} fill="#0A0420" opacity={0.18} />

      {/* Left wing (behind body) */}
      <Path d={`M ${cx - s*0.08} ${s*0.62} Q ${cx - s*0.42} ${s*0.30} ${cx - s*0.38} ${s*0.12} Q ${cx - s*0.28} ${s*0.28} ${cx - s*0.12} ${s*0.52}`}
        fill="url(#drWing)" opacity={0.88} />
      {/* Wing membrane lines */}
      <Path d={`M ${cx - s*0.08} ${s*0.62} Q ${cx - s*0.35} ${s*0.22} ${cx - s*0.38} ${s*0.12}`}
        stroke="#9868E0" strokeWidth={s*0.012} fill="none" opacity={0.55} />
      <Path d={`M ${cx - s*0.12} ${s*0.58} Q ${cx - s*0.30} ${s*0.28} ${cx - s*0.30} ${s*0.16}`}
        stroke="#9868E0" strokeWidth={s*0.010} fill="none" opacity={0.45} />

      {/* Right wing (behind body) */}
      <Path d={`M ${cx + s*0.08} ${s*0.62} Q ${cx + s*0.42} ${s*0.30} ${cx + s*0.38} ${s*0.12} Q ${cx + s*0.28} ${s*0.28} ${cx + s*0.12} ${s*0.52}`}
        fill="url(#drWing)" opacity={0.88} />
      <Path d={`M ${cx + s*0.08} ${s*0.62} Q ${cx + s*0.35} ${s*0.22} ${cx + s*0.38} ${s*0.12}`}
        stroke="#9868E0" strokeWidth={s*0.012} fill="none" opacity={0.55} />
      <Path d={`M ${cx + s*0.12} ${s*0.58} Q ${cx + s*0.30} ${s*0.28} ${cx + s*0.30} ${s*0.16}`}
        stroke="#9868E0" strokeWidth={s*0.010} fill="none" opacity={0.45} />

      {/* Body */}
      <Ellipse cx={cx} cy={s*0.755} rx={s*0.255} ry={s*0.215} fill="url(#drBody)" />

      {/* Belly gold scales */}
      <Ellipse cx={cx} cy={s*0.775} rx={s*0.145} ry={s*0.160} fill="url(#drBelly)" opacity={0.90} />
      {/* Scale texture lines */}
      {[-1, 0, 1].map(row =>
        [-1, 0, 1].map(col => (
          <Ellipse key={`${row}${col}`}
            cx={cx + col * s*0.048} cy={s*0.755 + row * s*0.048}
            rx={s*0.028} ry={s*0.022}
            fill="none" stroke="#B07818" strokeWidth={s*0.008} opacity={0.35}
          />
        ))
      )}

      {/* Tail with spikes */}
      <Path d={`M ${s*0.72} ${s*0.80} Q ${s*0.92} ${s*0.72} ${s*0.88} ${s*0.54} Q ${s*0.85} ${s*0.44} ${s*0.76} ${s*0.50}`}
        stroke="#4A20A0" strokeWidth={s*0.060} fill="none" strokeLinecap="round" />
      {/* Tail spikes */}
      <Path d={`M ${s*0.87} ${s*0.58} L ${s*0.92} ${s*0.52} L ${s*0.86} ${s*0.56}`}
        fill="#FFD860" opacity={0.80} />
      <Path d={`M ${s*0.86} ${s*0.68} L ${s*0.92} ${s*0.62} L ${s*0.86} ${s*0.66}`}
        fill="#FFD860" opacity={0.70} />

      {/* Front claws */}
      <Ellipse cx={cx - s*0.13} cy={s*0.912} rx={s*0.068} ry={s*0.045} fill="#3A1880" />
      <Ellipse cx={cx + s*0.13} cy={s*0.912} rx={s*0.068} ry={s*0.045} fill="#3A1880" />

      {/* Head */}
      <Circle cx={cx} cy={s*0.430} r={s*0.270} fill="url(#drHead)" />

      {/* Head spikes / horns */}
      <Path d={`M ${cx - s*0.08} ${s*0.245} L ${cx - s*0.12} ${s*0.145} L ${cx - s*0.04} ${s*0.240}`}
        fill="url(#drHorn)" />
      <Path d={`M ${cx + s*0.08} ${s*0.245} L ${cx + s*0.12} ${s*0.145} L ${cx + s*0.04} ${s*0.240}`}
        fill="url(#drHorn)" />
      {/* Center spike */}
      <Path d={`M ${cx - s*0.025} ${s*0.220} L ${cx} ${s*0.140} L ${cx + s*0.025} ${s*0.220}`}
        fill="url(#drHorn)" />

      {/* Snout (elongated) */}
      <Ellipse cx={cx} cy={s*0.548} rx={s*0.118} ry={s*0.082} fill="#3A1880" />
      <Ellipse cx={cx} cy={s*0.548} rx={s*0.098} ry={s*0.065} fill="#5030A0" opacity={0.60} />

      {/* Eyes */}
      <Eye x={cx - s*0.118} y={s*0.405} r={s*0.070} mood={mood} />
      <Eye x={cx + s*0.118} y={s*0.405} r={s*0.070} mood={mood} />

      {/* Nostrils */}
      <Ellipse cx={cx - s*0.030} cy={s*0.532} rx={s*0.016} ry={s*0.012} fill="#200850" />
      <Ellipse cx={cx + s*0.030} cy={s*0.532} rx={s*0.016} ry={s*0.012} fill="#200850" />

      {/* Mouth */}
      {mood === 'happy' ? (
        <Path d={`M ${cx - s*0.060} ${s*0.568} Q ${cx} ${s*0.602} ${cx + s*0.060} ${s*0.568}`}
          stroke="#200850" strokeWidth={s*0.016} fill="none" strokeLinecap="round" />
      ) : (
        <Path d={`M ${cx - s*0.045} ${s*0.568} Q ${cx} ${s*0.586} ${cx + s*0.045} ${s*0.568}`}
          stroke="#200850" strokeWidth={s*0.014} fill="none" strokeLinecap="round" />
      )}

      {/* Blush (purple-pink magical) */}
      <Ellipse cx={cx - s*0.200} cy={s*0.478} rx={s*0.058} ry={s*0.032} fill="rgba(200,128,255,0.40)" />
      <Ellipse cx={cx + s*0.200} cy={s*0.478} rx={s*0.058} ry={s*0.032} fill="rgba(200,128,255,0.40)" />

      {/* Head specular */}
      <Ellipse cx={cx + s*0.108} cy={s*0.300} rx={s*0.082} ry={s*0.055}
        fill="white" opacity={0.22} transform={`rotate(-28, ${cx + s*0.108}, ${s*0.300})`} />
    </Svg>
  );
}

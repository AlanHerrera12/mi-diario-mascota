import Svg, { Circle, Ellipse, Path, G, Defs, RadialGradient, Stop, ClipPath, Rect } from 'react-native-svg';

type Mood = 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
interface Props { size?: number; mood?: Mood; baseColor?: string; }

function Eye({ x, y, r, mood }: { x: number; y: number; r: number; mood: Mood }) {
  if (mood === 'happy') {
    return (
      <Path d={`M ${x - r} ${y + r * 0.2} Q ${x} ${y - r * 1.2} ${x + r} ${y + r * 0.2}`}
        stroke="#1A2020" strokeWidth={r * 0.55} fill="none" strokeLinecap="round" />
    );
  }
  const lidY = mood === 'sleepy' ? y - r * 0.05 : y - r * 2;
  return (
    <G>
      <Circle cx={x} cy={y} r={r} fill="white" />
      <Circle cx={x} cy={y} r={r * 0.72} fill="#4BAEA0" />
      <Circle cx={x} cy={y} r={r * 0.72} fill="#2D8070" opacity={0.4} />
      <Circle cx={x} cy={y} r={r * 0.38} fill="#0D1A19" />
      <Circle cx={x + r * 0.26} cy={y - r * 0.30} r={r * 0.20} fill="white" opacity={0.92} />
      <Circle cx={x + r * 0.08} cy={y - r * 0.50} r={r * 0.09} fill="white" opacity={0.65} />
      {mood === 'sleepy' && (
        <Path d={`M ${x - r * 1.05} ${y} Q ${x} ${y - r * 0.55} ${x + r * 1.05} ${y}`}
          fill="#F5DEB3" />
      )}
    </G>
  );
}

export function PetDogSVG({ size = 200, mood = 'idle' }: Props) {
  const s = size;
  const cx = s / 2;

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="dHead" cx="38%" cy="28%" r="65%">
          <Stop offset="0%" stopColor="#FFF8EF" />
          <Stop offset="42%" stopColor="#F5DEB3" />
          <Stop offset="100%" stopColor="#C08050" />
        </RadialGradient>
        <RadialGradient id="dBody" cx="38%" cy="25%" r="68%">
          <Stop offset="0%" stopColor="#FFF0D8" />
          <Stop offset="50%" stopColor="#EDD09A" />
          <Stop offset="100%" stopColor="#B07840" />
        </RadialGradient>
        <RadialGradient id="dEar" cx="40%" cy="30%" r="65%">
          <Stop offset="0%" stopColor="#D4A870" />
          <Stop offset="100%" stopColor="#8A5530" />
        </RadialGradient>
        <RadialGradient id="dMuzzle" cx="45%" cy="30%" r="65%">
          <Stop offset="0%" stopColor="#FFFAF0" />
          <Stop offset="100%" stopColor="#EDD8B8" />
        </RadialGradient>
      </Defs>

      {/* Ground shadow */}
      <Ellipse cx={cx} cy={s * 0.945} rx={s * 0.22} ry={s * 0.035} fill="#1A0A40" opacity={0.12} />

      {/* Body */}
      <Ellipse cx={cx} cy={s * 0.755} rx={s * 0.275} ry={s * 0.215} fill="url(#dBody)" />

      {/* Tail */}
      <Path d={`M ${s*0.73} ${s*0.755} Q ${s*0.90} ${s*0.62} ${s*0.83} ${s*0.50} Q ${s*0.78} ${s*0.44} ${s*0.72} ${s*0.54}`}
        stroke="#C9956A" strokeWidth={s * 0.065} fill="none" strokeLinecap="round" />
      <Path d={`M ${s*0.73} ${s*0.755} Q ${s*0.88} ${s*0.63} ${s*0.82} ${s*0.52}`}
        stroke="#D4A870" strokeWidth={s * 0.028} fill="none" strokeLinecap="round" opacity={0.6} />

      {/* Front paws */}
      <Ellipse cx={cx - s*0.13} cy={s * 0.905} rx={s * 0.075} ry={s * 0.048} fill="#EDD0A0" />
      <Ellipse cx={cx + s*0.13} cy={s * 0.905} rx={s * 0.075} ry={s * 0.048} fill="#EDD0A0" />

      {/* Left ear (behind head) */}
      <Ellipse cx={cx - s*0.175} cy={s*0.32} rx={s*0.115} ry={s*0.155}
        fill="url(#dEar)" transform={`rotate(-14, ${cx - s*0.175}, ${s*0.32})`} />
      {/* Right ear (behind head) */}
      <Ellipse cx={cx + s*0.168} cy={s*0.305} rx={s*0.098} ry={s*0.138}
        fill="url(#dEar)" transform={`rotate(12, ${cx + s*0.168}, ${s*0.305})`} />

      {/* Head */}
      <Circle cx={cx} cy={s * 0.44} r={s * 0.265} fill="url(#dHead)" />

      {/* Muzzle */}
      <Ellipse cx={cx} cy={s * 0.535} rx={s * 0.125} ry={s * 0.09} fill="url(#dMuzzle)" />

      {/* Eyes */}
      <Eye x={cx - s*0.115} y={s*0.405} r={s*0.068} mood={mood} />
      <Eye x={cx + s*0.115} y={s*0.405} r={s*0.068} mood={mood} />

      {/* Nose */}
      <Ellipse cx={cx} cy={s*0.504} rx={s*0.028} ry={s*0.019} fill="#6B2E10" />
      <Ellipse cx={cx} cy={s*0.501} rx={s*0.012} ry={s*0.006} fill="#9B5030" opacity={0.5} />

      {/* Mouth */}
      {mood === 'happy' ? (
        <Path d={`M ${cx - s*0.065} ${s*0.562} Q ${cx} ${s*0.598} ${cx + s*0.065} ${s*0.562}`}
          stroke="#6B2E10" strokeWidth={s*0.017} fill="none" strokeLinecap="round" />
      ) : mood === 'sleepy' ? (
        <Path d={`M ${cx - s*0.03} ${s*0.562} Q ${cx} ${s*0.572} ${cx + s*0.03} ${s*0.562}`}
          stroke="#6B2E10" strokeWidth={s*0.015} fill="none" strokeLinecap="round" />
      ) : (
        <Path d={`M ${cx - s*0.052} ${s*0.562} Q ${cx} ${s*0.588} ${cx + s*0.052} ${s*0.562}`}
          stroke="#6B2E10" strokeWidth={s*0.016} fill="none" strokeLinecap="round" />
      )}

      {/* Blush */}
      <Ellipse cx={cx - s*0.20} cy={s*0.478} rx={s*0.058} ry={s*0.031} fill="rgba(255,140,100,0.38)" />
      <Ellipse cx={cx + s*0.20} cy={s*0.478} rx={s*0.058} ry={s*0.031} fill="rgba(255,140,100,0.38)" />

      {/* Head specular shine */}
      <Ellipse cx={cx + s*0.105} cy={s*0.305} rx={s*0.082} ry={s*0.055}
        fill="white" opacity={0.28} transform={`rotate(-28, ${cx + s*0.105}, ${s*0.305})`} />

      {/* Body shine */}
      <Ellipse cx={cx - s*0.06} cy={s*0.68} rx={s*0.06} ry={s*0.04}
        fill="white" opacity={0.18} transform={`rotate(-20, ${cx - s*0.06}, ${s*0.68})`} />
    </Svg>
  );
}

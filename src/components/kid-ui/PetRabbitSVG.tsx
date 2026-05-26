import Svg, { Circle, Ellipse, Path, G, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';

type Mood = 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
interface Props { size?: number; mood?: Mood; baseColor?: string; }

function Eye({ x, y, r, mood }: { x: number; y: number; r: number; mood: Mood }) {
  if (mood === 'happy') {
    return (
      <Path d={`M ${x - r} ${y + r * 0.2} Q ${x} ${y - r * 1.15} ${x + r} ${y + r * 0.2}`}
        stroke="#3A1A10" strokeWidth={r * 0.55} fill="none" strokeLinecap="round" />
    );
  }
  return (
    <G>
      <Circle cx={x} cy={y} r={r} fill="white" />
      <Circle cx={x} cy={y} r={r * 0.72} fill="#C07830" />
      <Circle cx={x} cy={y} r={r * 0.72} fill="#804018" opacity={0.38} />
      <Circle cx={x} cy={y} r={r * 0.38} fill="#1A0A08" />
      <Circle cx={x + r*0.26} cy={y - r*0.30} r={r * 0.20} fill="white" opacity={0.92} />
      <Circle cx={x + r*0.08} cy={y - r*0.50} r={r * 0.09} fill="white" opacity={0.65} />
      {mood === 'sleepy' && (
        <Path d={`M ${x - r * 1.05} ${y} Q ${x} ${y - r * 0.52} ${x + r * 1.05} ${y}`}
          fill="#EFD8CC" />
      )}
    </G>
  );
}

export function PetRabbitSVG({ size = 200, mood = 'idle' }: Props) {
  const s = size;
  const cx = s / 2;

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="rHead" cx="36%" cy="26%" r="65%">
          <Stop offset="0%" stopColor="#FFF8F5" />
          <Stop offset="42%" stopColor="#F0D8CC" />
          <Stop offset="100%" stopColor="#C09888" />
        </RadialGradient>
        <RadialGradient id="rBody" cx="38%" cy="22%" r="68%">
          <Stop offset="0%" stopColor="#FFEEE8" />
          <Stop offset="52%" stopColor="#E8C8B8" />
          <Stop offset="100%" stopColor="#B08878" />
        </RadialGradient>
        <LinearGradient id="rEarOuter" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#E8C8B8" />
          <Stop offset="100%" stopColor="#C8A090" />
        </LinearGradient>
        <LinearGradient id="rEarInner" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#F8B0C8" />
          <Stop offset="50%" stopColor="#F090B0" />
          <Stop offset="100%" stopColor="#E06888" />
        </LinearGradient>
        <RadialGradient id="rMuzzle" cx="48%" cy="30%" r="62%">
          <Stop offset="0%" stopColor="#FFF8F5" />
          <Stop offset="100%" stopColor="#EDD8CC" />
        </RadialGradient>
        <RadialGradient id="rBelly" cx="50%" cy="30%" r="60%">
          <Stop offset="0%" stopColor="#FFFAF8" />
          <Stop offset="100%" stopColor="#F0E0D8" />
        </RadialGradient>
      </Defs>

      {/* Ground shadow */}
      <Ellipse cx={cx} cy={s * 0.950} rx={s * 0.20} ry={s * 0.032} fill="#1A0A40" opacity={0.12} />

      {/* Body */}
      <Ellipse cx={cx} cy={s * 0.745} rx={s * 0.23} ry={s * 0.225} fill="url(#rBody)" />

      {/* Belly patch */}
      <Ellipse cx={cx} cy={s * 0.775} rx={s * 0.125} ry={s * 0.145} fill="url(#rBelly)" opacity={0.7} />

      {/* Arms (raised and outward) */}
      <Ellipse cx={cx - s*0.235} cy={s*0.720} rx={s*0.065} ry={s*0.052}
        fill="#E8C8B8" transform={`rotate(-30, ${cx - s*0.235}, ${s*0.720})`} />
      <Ellipse cx={cx + s*0.235} cy={s*0.720} rx={s*0.065} ry={s*0.052}
        fill="#E8C8B8" transform={`rotate(30, ${cx + s*0.235}, ${s*0.720})`} />

      {/* Feet */}
      <Ellipse cx={cx - s*0.12} cy={s*0.925} rx={s*0.085} ry={s*0.048} fill="#E0C0B0" />
      <Ellipse cx={cx + s*0.12} cy={s*0.925} rx={s*0.085} ry={s*0.048} fill="#E0C0B0" />

      {/* Fluffy tail */}
      <Circle cx={cx + s*0.22} cy={s*0.80} r={s*0.055} fill="white" opacity={0.90} />
      <Circle cx={cx + s*0.22} cy={s*0.80} r={s*0.042} fill="#F8F0EE" />

      {/* Left ear (tall, behind head) */}
      <Ellipse cx={cx - s*0.115} cy={s*0.145} rx={s*0.072} ry={s*0.175}
        fill="url(#rEarOuter)" />
      <Ellipse cx={cx - s*0.115} cy={s*0.150} rx={s*0.040} ry={s*0.138}
        fill="url(#rEarInner)" opacity={0.88} />

      {/* Right ear (tall, behind head) */}
      <Ellipse cx={cx + s*0.115} cy={s*0.138} rx={s*0.068} ry={s*0.170}
        fill="url(#rEarOuter)" transform={`rotate(5, ${cx + s*0.115}, ${s*0.138})`} />
      <Ellipse cx={cx + s*0.115} cy={s*0.143} rx={s*0.038} ry={s*0.134}
        fill="url(#rEarInner)" opacity={0.88} transform={`rotate(5, ${cx + s*0.115}, ${s*0.143})`} />

      {/* Head */}
      <Circle cx={cx} cy={s * 0.455} r={s * 0.255} fill="url(#rHead)" />

      {/* Muzzle */}
      <Ellipse cx={cx} cy={s * 0.535} rx={s * 0.115} ry={s * 0.082} fill="url(#rMuzzle)" />

      {/* Eyes */}
      <Eye x={cx - s*0.108} y={s*0.422} r={s*0.066} mood={mood} />
      <Eye x={cx + s*0.108} y={s*0.422} r={s*0.066} mood={mood} />

      {/* Nose — little Y shape */}
      <Ellipse cx={cx} cy={s*0.502} rx={s*0.022} ry={s*0.016} fill="#D06088" />
      <Path d={`M ${cx} ${s*0.516} L ${cx - s*0.018} ${s*0.530}`}
        stroke="#D06088" strokeWidth={s*0.012} strokeLinecap="round" />
      <Path d={`M ${cx} ${s*0.516} L ${cx + s*0.018} ${s*0.530}`}
        stroke="#D06088" strokeWidth={s*0.012} strokeLinecap="round" />

      {/* Mouth */}
      {mood === 'happy' ? (
        <Path d={`M ${cx - s*0.058} ${s*0.548} Q ${cx} ${s*0.586} ${cx + s*0.058} ${s*0.548}`}
          stroke="#8B3A50" strokeWidth={s*0.016} fill="none" strokeLinecap="round" />
      ) : (
        <Path d={`M ${cx - s*0.042} ${s*0.548} Q ${cx} ${s*0.570} ${cx + s*0.042} ${s*0.548}`}
          stroke="#8B3A50" strokeWidth={s*0.014} fill="none" strokeLinecap="round" />
      )}

      {/* Blush */}
      <Ellipse cx={cx - s*0.195} cy={s*0.478} rx={s*0.055} ry={s*0.030} fill="rgba(255,150,170,0.40)" />
      <Ellipse cx={cx + s*0.195} cy={s*0.478} rx={s*0.055} ry={s*0.030} fill="rgba(255,150,170,0.40)" />

      {/* Head specular */}
      <Ellipse cx={cx + s*0.10} cy={s*0.318} rx={s*0.078} ry={s*0.052}
        fill="white" opacity={0.28} transform={`rotate(-28, ${cx + s*0.10}, ${s*0.318})`} />
    </Svg>
  );
}

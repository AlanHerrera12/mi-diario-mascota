import Svg, { Circle, Ellipse, Path, G, Defs, RadialGradient, LinearGradient, Stop, Line } from 'react-native-svg';

type Mood = 'idle' | 'listening' | 'happy' | 'sleepy' | 'missing_you';
interface Props { size?: number; mood?: Mood; baseColor?: string; }

function Eye({ x, y, r, mood }: { x: number; y: number; r: number; mood: Mood }) {
  if (mood === 'happy') {
    return (
      <Path d={`M ${x - r} ${y + r * 0.2} Q ${x} ${y - r * 1.2} ${x + r} ${y + r * 0.2}`}
        stroke="#1A1030" strokeWidth={r * 0.55} fill="none" strokeLinecap="round" />
    );
  }
  return (
    <G>
      <Circle cx={x} cy={y} r={r} fill="white" />
      {/* Almond / cat-eye iris */}
      <Path d={`M ${x - r*0.72} ${y} Q ${x} ${y - r*1.0} ${x + r*0.72} ${y} Q ${x} ${y + r*0.8} ${x - r*0.72} ${y} Z`}
        fill="#5BA8D0" />
      <Path d={`M ${x - r*0.72} ${y} Q ${x} ${y - r*1.0} ${x + r*0.72} ${y} Q ${x} ${y + r*0.8} ${x - r*0.72} ${y} Z`}
        fill="#2D7090" opacity={0.45} />
      {/* Slit pupil */}
      <Ellipse cx={x} cy={y} rx={r * 0.18} ry={r * 0.62}
        fill={mood === 'sleepy' ? '#0D1420' : '#0A0F1A'} />
      <Circle cx={x + r*0.24} cy={y - r*0.30} r={r * 0.20} fill="white" opacity={0.90} />
      <Circle cx={x + r*0.06} cy={y - r*0.52} r={r * 0.09} fill="white" opacity={0.62} />
      {mood === 'sleepy' && (
        <Path d={`M ${x - r * 1.05} ${y} Q ${x} ${y - r * 0.5} ${x + r * 1.05} ${y}`}
          fill="#F5E6D8" />
      )}
    </G>
  );
}

export function PetCatSVG({ size = 200, mood = 'idle' }: Props) {
  const s = size;
  const cx = s / 2;

  return (
    <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <Defs>
        <RadialGradient id="cHead" cx="36%" cy="26%" r="66%">
          <Stop offset="0%" stopColor="#FFFAF5" />
          <Stop offset="40%" stopColor="#F8EAD8" />
          <Stop offset="100%" stopColor="#C8A080" />
        </RadialGradient>
        <RadialGradient id="cBody" cx="38%" cy="22%" r="68%">
          <Stop offset="0%" stopColor="#FFF2E8" />
          <Stop offset="52%" stopColor="#F0D8C0" />
          <Stop offset="100%" stopColor="#B88060" />
        </RadialGradient>
        <RadialGradient id="cPatch" cx="42%" cy="32%" r="60%">
          <Stop offset="0%" stopColor="#B8D4E8" />
          <Stop offset="100%" stopColor="#7898B8" />
        </RadialGradient>
        <LinearGradient id="cEarInner" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#F8B8C8" />
          <Stop offset="100%" stopColor="#E888A8" />
        </LinearGradient>
        <RadialGradient id="cMuzzle" cx="48%" cy="28%" r="62%">
          <Stop offset="0%" stopColor="#FFFCF8" />
          <Stop offset="100%" stopColor="#F0E0D0" />
        </RadialGradient>
        <RadialGradient id="cTail" cx="40%" cy="30%" r="65%">
          <Stop offset="0%" stopColor="#DDB898" />
          <Stop offset="100%" stopColor="#9B7060" />
        </RadialGradient>
      </Defs>

      {/* Ground shadow */}
      <Ellipse cx={cx} cy={s * 0.945} rx={s * 0.21} ry={s * 0.033} fill="#1A0A40" opacity={0.12} />

      {/* Body */}
      <Ellipse cx={cx} cy={s * 0.76} rx={s * 0.25} ry={s * 0.205} fill="url(#cBody)" />

      {/* Blue-grey chest/belly patch */}
      <Ellipse cx={cx} cy={s * 0.79} rx={s * 0.13} ry={s * 0.14} fill="url(#cPatch)" opacity={0.55} />

      {/* Tail */}
      <Path d={`M ${s*0.72} ${s*0.80} Q ${s*0.90} ${s*0.75} ${s*0.86} ${s*0.58} Q ${s*0.84} ${s*0.48} ${s*0.75} ${s*0.50}`}
        stroke="url(#cTail)" strokeWidth={s * 0.055} fill="none" strokeLinecap="round" />
      {/* Tail stripe hints */}
      <Path d={`M ${s*0.83} ${s*0.66} Q ${s*0.88} ${s*0.62} ${s*0.85} ${s*0.58}`}
        stroke="#A07858" strokeWidth={s * 0.022} fill="none" strokeLinecap="round" opacity={0.5} />

      {/* Paws */}
      <Ellipse cx={cx - s*0.115} cy={s * 0.91} rx={s * 0.068} ry={s * 0.045} fill="#EDD8C0" />
      <Ellipse cx={cx + s*0.115} cy={s * 0.91} rx={s * 0.068} ry={s * 0.045} fill="#EDD8C0" />

      {/* Raised right paw */}
      <Ellipse cx={cx + s*0.245} cy={s * 0.74} rx={s * 0.058} ry={s * 0.048}
        fill="#EDD8C0" transform={`rotate(-20, ${cx + s*0.245}, ${s*0.74})`} />

      {/* Left ear (pointed, behind head) */}
      <Path d={`M ${cx - s*0.25} ${s*0.22} L ${cx - s*0.12} ${s*0.30} L ${cx - s*0.10} ${s*0.18} Z`}
        fill="#D8B898" />
      {/* Left ear inner */}
      <Path d={`M ${cx - s*0.22} ${s*0.225} L ${cx - s*0.13} ${s*0.285} L ${cx - s*0.12} ${s*0.21} Z`}
        fill="url(#cEarInner)" opacity={0.85} />

      {/* Right ear (pointed, behind head) */}
      <Path d={`M ${cx + s*0.10} ${s*0.18} L ${cx + s*0.12} ${s*0.30} L ${cx + s*0.25} ${s*0.22} Z`}
        fill="#D8B898" />
      {/* Right ear inner */}
      <Path d={`M ${cx + s*0.12} ${s*0.21} L ${cx + s*0.13} ${s*0.285} L ${cx + s*0.22} ${s*0.225} Z`}
        fill="url(#cEarInner)" opacity={0.85} />

      {/* Head */}
      <Circle cx={cx} cy={s * 0.43} r={s * 0.26} fill="url(#cHead)" />

      {/* Blue-grey face patches */}
      <Ellipse cx={cx - s*0.12} cy={s*0.405} rx={s*0.085} ry={s*0.075}
        fill="url(#cPatch)" opacity={0.42} />
      <Ellipse cx={cx + s*0.12} cy={s*0.395} rx={s*0.075} ry={s*0.065}
        fill="url(#cPatch)" opacity={0.38} />

      {/* Muzzle */}
      <Ellipse cx={cx} cy={s * 0.525} rx={s * 0.115} ry={s * 0.085} fill="url(#cMuzzle)" />

      {/* Eyes */}
      <Eye x={cx - s*0.115} y={s*0.402} r={s*0.068} mood={mood} />
      <Eye x={cx + s*0.115} y={s*0.402} r={s*0.068} mood={mood} />

      {/* Whiskers */}
      {['left', 'right'].map((side, si) => {
        const wx = si === 0 ? cx - s*0.13 : cx + s*0.13;
        const dir = si === 0 ? -1 : 1;
        const wy = s * 0.518;
        return [0, 1, 2].map(i => {
          const angle = (i - 1) * 12;
          const len = s * 0.14;
          const rad = (angle * Math.PI) / 180;
          return (
            <Line key={`w${si}${i}`}
              x1={wx} y1={wy}
              x2={wx + dir * len * Math.cos(rad)}
              y2={wy + len * Math.sin(rad) * 0.4}
              stroke="#B09878" strokeWidth={s * 0.010} opacity={0.55}
              strokeLinecap="round"
            />
          );
        });
      })}

      {/* Nose */}
      <Path d={`M ${cx - s*0.020} ${s*0.500} L ${cx + s*0.020} ${s*0.500} L ${cx} ${s*0.520} Z`}
        fill="#D0647A" />

      {/* Mouth */}
      {mood === 'happy' ? (
        <Path d={`M ${cx - s*0.058} ${s*0.548} Q ${cx} ${s*0.585} ${cx + s*0.058} ${s*0.548}`}
          stroke="#8B3A50" strokeWidth={s*0.016} fill="none" strokeLinecap="round" />
      ) : (
        <Path d={`M ${cx - s*0.045} ${s*0.548} Q ${cx} ${s*0.572} ${cx + s*0.045} ${s*0.548}`}
          stroke="#8B3A50" strokeWidth={s*0.015} fill="none" strokeLinecap="round" />
      )}

      {/* Blush */}
      <Ellipse cx={cx - s*0.195} cy={s*0.472} rx={s*0.055} ry={s*0.030} fill="rgba(255,160,180,0.40)" />
      <Ellipse cx={cx + s*0.195} cy={s*0.472} rx={s*0.055} ry={s*0.030} fill="rgba(255,160,180,0.40)" />

      {/* Head specular */}
      <Ellipse cx={cx + s*0.10} cy={s*0.305} rx={s*0.080} ry={s*0.052}
        fill="white" opacity={0.28} transform={`rotate(-28, ${cx + s*0.10}, ${s*0.305})`} />
    </Svg>
  );
}

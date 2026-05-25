import Svg, {
  Circle, Ellipse, Path, Polygon, G, Defs, RadialGradient, LinearGradient, Stop, Rect, Line,
} from 'react-native-svg';
import { PetDogSVG }    from './PetDogSVG';
import { PetCatSVG }    from './PetCatSVG';
import { PetBearSVG }   from './PetBearSVG';
import { PetRabbitSVG } from './PetRabbitSVG';
import { PetDragonSVG } from './PetDragonSVG';

interface Props {
  category: string;
  name: string;
  rarity: string;
  speciesKey?: string;
  size?: number;
}

const RARITY_GLOW: Record<string, string> = {
  common: '#9CA3AF', rare: '#3B82F6', epic: '#8B5CF6', legendary: '#F59E0B',
};

function n(size: number) { return (frac: number) => size * frac; }

// Top hat
function HatSVG({ size, color }: { size: number; color: string }) {
  const s = n(size);
  const cx = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <LinearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </LinearGradient>
      </Defs>
      {/* Brim */}
      <Ellipse cx={cx} cy={s(0.70)} rx={s(0.42)} ry={s(0.085)} fill="url(#hatGrad)" />
      {/* Cylinder */}
      <Rect x={s(0.30)} y={s(0.20)} width={s(0.40)} height={s(0.50)} rx={s(0.04)} fill="url(#hatGrad)" />
      {/* Hat band */}
      <Rect x={s(0.30)} y={s(0.62)} width={s(0.40)} height={s(0.07)} rx={s(0.02)} fill="white" opacity={0.25} />
      {/* Top */}
      <Ellipse cx={cx} cy={s(0.20)} rx={s(0.20)} ry={s(0.055)} fill={color} opacity={0.85} />
      {/* Highlight */}
      <Ellipse cx={cx - s(0.06)} cy={s(0.35)} rx={s(0.06)} ry={s(0.14)} fill="white" opacity={0.12} transform={`rotate(-8 ${cx - s(0.06)} ${s(0.35)})`} />
    </Svg>
  );
}

// Cape
function CapeSVG({ size, color }: { size: number; color: string }) {
  const s = n(size);
  const cx = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <LinearGradient id="capeGrad" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </LinearGradient>
      </Defs>
      {/* Cape body */}
      <Path
        d={`M ${s(0.25)} ${s(0.15)} L ${s(0.12)} ${s(0.88)} Q ${cx} ${s(0.78)} ${s(0.88)} ${s(0.88)} L ${s(0.75)} ${s(0.15)} Z`}
        fill="url(#capeGrad)"
      />
      {/* Collar */}
      <Path
        d={`M ${s(0.25)} ${s(0.15)} Q ${cx} ${s(0.10)} ${s(0.75)} ${s(0.15)} Q ${cx} ${s(0.30)} ${s(0.25)} ${s(0.15)} Z`}
        fill={color} opacity={0.9}
      />
      {/* Center stripe */}
      <Line x1={cx} y1={s(0.20)} x2={cx} y2={s(0.80)} stroke="white" strokeWidth={s(0.03)} opacity={0.2} />
      {/* Clasp */}
      <Circle cx={cx} cy={s(0.17)} r={s(0.04)} fill="#FCD34D" />
    </Svg>
  );
}

// Crown
function CrownSVG({ size, color }: { size: number; color: string }) {
  const s = n(size);
  const cx = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <LinearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FCD34D" />
          <Stop offset="100%" stopColor="#D97706" />
        </LinearGradient>
      </Defs>
      {/* Crown base */}
      <Path
        d={`M ${s(0.12)} ${s(0.70)} L ${s(0.12)} ${s(0.42)} L ${cx} ${s(0.20)} L ${s(0.88)} ${s(0.42)} L ${s(0.88)} ${s(0.70)} Z`}
        fill="url(#crownGrad)"
      />
      {/* Points */}
      <Polygon points={`${s(0.12)},${s(0.42)} ${s(0.25)},${s(0.22)} ${s(0.38)},${s(0.50)}`} fill="#FCD34D" />
      <Polygon points={`${s(0.38)},${s(0.50)} ${cx},${s(0.20)} ${s(0.62)},${s(0.50)}`} fill="#FCD34D" />
      <Polygon points={`${s(0.62)},${s(0.50)} ${s(0.75)},${s(0.22)} ${s(0.88)},${s(0.42)}`} fill="#FCD34D" />
      {/* Gems */}
      <Circle cx={s(0.30)} cy={s(0.58)} r={s(0.055)} fill="#EC4899" />
      <Circle cx={cx}      cy={s(0.55)} r={s(0.065)} fill="#7C3AED" />
      <Circle cx={s(0.70)} cy={s(0.58)} r={s(0.055)} fill="#3B82F6" />
      {/* Shine */}
      <Ellipse cx={cx - s(0.05)} cy={s(0.42)} rx={s(0.06)} ry={s(0.035)} fill="white" opacity={0.25} transform={`rotate(-15 ${cx - s(0.05)} ${s(0.42)})`} />
    </Svg>
  );
}

// Astronaut helmet
function AstronautSVG({ size, color }: { size: number; color: string }) {
  const s = n(size);
  const cx = size / 2;
  const cy = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Suit bottom */}
      <Ellipse cx={cx} cy={s(0.82)} rx={s(0.28)} ry={s(0.10)} fill={color} opacity={0.6} />
      {/* Helmet */}
      <Circle cx={cx} cy={s(0.44)} r={s(0.36)} fill={color} opacity={0.8} />
      {/* Visor */}
      <Ellipse cx={cx} cy={s(0.44)} rx={s(0.24)} ry={s(0.22)} fill="#1E3A5F" opacity={0.9} />
      {/* Visor shine */}
      <Ellipse cx={cx - s(0.08)} cy={s(0.30)} rx={s(0.10)} ry={s(0.06)} fill="white" opacity={0.35} transform={`rotate(-20 ${cx - s(0.08)} ${s(0.30)})`} />
      {/* Reflection in visor */}
      <Path d={`M ${cx - s(0.12)} ${s(0.38)} Q ${cx} ${s(0.32)} ${cx + s(0.12)} ${s(0.38)}`} stroke="white" strokeWidth={s(0.02)} fill="none" opacity={0.2} />
      {/* Antenna */}
      <Line x1={cx} y1={s(0.08)} x2={cx} y2={s(0.15)} stroke={color} strokeWidth={s(0.025)} strokeLinecap="round" />
      <Circle cx={cx} cy={s(0.07)} r={s(0.03)} fill="#FCD34D" />
    </Svg>
  );
}

// Flower collar
function FlowerCollarSVG({ size, color }: { size: number; color: string }) {
  const s = n(size);
  const cx = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Collar band */}
      <Ellipse cx={cx} cy={s(0.60)} rx={s(0.38)} ry={s(0.12)} fill={color} opacity={0.6} stroke={color} strokeWidth={s(0.02)} />
      {/* Flowers */}
      {[
        { x: s(0.20), y: s(0.55), c: '#F472B6' },
        { x: s(0.38), y: s(0.48), c: '#FBBF24' },
        { x: cx,      y: s(0.44), c: '#F87171' },
        { x: s(0.62), y: s(0.48), c: '#A78BFA' },
        { x: s(0.80), y: s(0.55), c: '#34D399' },
      ].map((f, i) => (
        <G key={i}>
          <Circle cx={f.x - s(0.03)} cy={f.y - s(0.03)} r={s(0.055)} fill={f.c} opacity={0.8} />
          <Circle cx={f.x + s(0.03)} cy={f.y - s(0.03)} r={s(0.055)} fill={f.c} opacity={0.8} />
          <Circle cx={f.x}           cy={f.y + s(0.03)} r={s(0.055)} fill={f.c} opacity={0.8} />
          <Circle cx={f.x - s(0.03)} cy={f.y + s(0.03)} r={s(0.055)} fill={f.c} opacity={0.8} />
          <Circle cx={f.x}           cy={f.y}           r={s(0.040)} fill="white" opacity={0.9} />
        </G>
      ))}
    </Svg>
  );
}

// Sunglasses
function SunglassesSVG({ size, color }: { size: number; color: string }) {
  const s = n(size);
  const cx = size / 2;
  const cy = size * 0.48;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Left lens */}
      <Circle cx={cx - s(0.22)} cy={cy} r={s(0.20)} fill={color} opacity={0.85} />
      <Circle cx={cx - s(0.22)} cy={cy} r={s(0.20)} fill="none" stroke={color} strokeWidth={s(0.025)} />
      {/* Right lens */}
      <Circle cx={cx + s(0.22)} cy={cy} r={s(0.20)} fill={color} opacity={0.85} />
      <Circle cx={cx + s(0.22)} cy={cy} r={s(0.20)} fill="none" stroke={color} strokeWidth={s(0.025)} />
      {/* Bridge */}
      <Line x1={cx - s(0.02)} y1={cy} x2={cx + s(0.02)} y2={cy} stroke={color} strokeWidth={s(0.03)} strokeLinecap="round" />
      {/* Arms */}
      <Line x1={cx - s(0.42)} y1={cy - s(0.04)} x2={cx - s(0.42)} y2={cy + s(0.04)} stroke={color} strokeWidth={s(0.025)} strokeLinecap="round" />
      <Line x1={cx + s(0.42)} y1={cy - s(0.04)} x2={cx + s(0.42)} y2={cy + s(0.04)} stroke={color} strokeWidth={s(0.025)} strokeLinecap="round" />
      {/* Lens shines */}
      <Ellipse cx={cx - s(0.28)} cy={cy - s(0.08)} rx={s(0.06)} ry={s(0.04)} fill="white" opacity={0.35} transform={`rotate(-20 ${cx - s(0.28)} ${cy - s(0.08)})`} />
      <Ellipse cx={cx + s(0.16)} cy={cy - s(0.08)} rx={s(0.06)} ry={s(0.04)} fill="white" opacity={0.35} transform={`rotate(-20 ${cx + s(0.16)} ${cy - s(0.08)})`} />
    </Svg>
  );
}

// Butterfly wings
function WingsSVG({ size, color }: { size: number; color: string }) {
  const s = n(size);
  const cx = size / 2;
  const cy = size * 0.52;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id="wingL" cx="30%" cy="40%" r="60%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </RadialGradient>
        <RadialGradient id="wingR" cx="70%" cy="40%" r="60%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </RadialGradient>
      </Defs>
      {/* Left upper wing */}
      <Path d={`M ${cx} ${cy} Q ${s(0.08)} ${s(0.10)} ${s(0.10)} ${s(0.45)} Q ${s(0.12)} ${s(0.65)} ${cx} ${cy} Z`}
        fill="url(#wingL)" />
      {/* Left lower wing */}
      <Path d={`M ${cx} ${cy} Q ${s(0.08)} ${s(0.70)} ${s(0.20)} ${s(0.88)} Q ${s(0.30)} ${s(0.78)} ${cx} ${cy} Z`}
        fill={color} opacity={0.7} />
      {/* Right upper wing */}
      <Path d={`M ${cx} ${cy} Q ${s(0.92)} ${s(0.10)} ${s(0.90)} ${s(0.45)} Q ${s(0.88)} ${s(0.65)} ${cx} ${cy} Z`}
        fill="url(#wingR)" />
      {/* Right lower wing */}
      <Path d={`M ${cx} ${cy} Q ${s(0.92)} ${s(0.70)} ${s(0.80)} ${s(0.88)} Q ${s(0.70)} ${s(0.78)} ${cx} ${cy} Z`}
        fill={color} opacity={0.7} />
      {/* Body */}
      <Ellipse cx={cx} cy={cy} rx={s(0.04)} ry={s(0.18)} fill="#1F2937" />
      {/* Antennae */}
      <Path d={`M ${cx} ${cy - s(0.16)} Q ${cx - s(0.08)} ${s(0.18)} ${cx - s(0.06)} ${s(0.12)}`}
        stroke="#1F2937" strokeWidth={s(0.015)} fill="none" strokeLinecap="round" />
      <Path d={`M ${cx} ${cy - s(0.16)} Q ${cx + s(0.08)} ${s(0.18)} ${cx + s(0.06)} ${s(0.12)}`}
        stroke="#1F2937" strokeWidth={s(0.015)} fill="none" strokeLinecap="round" />
      <Circle cx={cx - s(0.06)} cy={s(0.12)} r={s(0.025)} fill={color} />
      <Circle cx={cx + s(0.06)} cy={s(0.12)} r={s(0.025)} fill={color} />
    </Svg>
  );
}

// 3 Stars effect
function StarEffectSVG({ size, color }: { size: number; color: string }) {
  const s = n(size);
  function starPath(cx: number, cy: number, r: number) {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const rad = i % 2 === 0 ? r : r * 0.4;
      pts.push(`${cx + Math.cos(a) * rad},${cy + Math.sin(a) * rad}`);
    }
    return pts.join(' ');
  }
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Polygon points={starPath(s(0.28), s(0.35), s(0.20))} fill={color} opacity={0.9} />
      <Polygon points={starPath(s(0.72), s(0.35), s(0.18))} fill={color} opacity={0.8} />
      <Polygon points={starPath(s(0.50), s(0.68), s(0.22))} fill={color} />
      {/* Sparkle dots */}
      <Circle cx={s(0.18)} cy={s(0.18)} r={s(0.025)} fill={color} opacity={0.7} />
      <Circle cx={s(0.82)} cy={s(0.22)} r={s(0.020)} fill={color} opacity={0.6} />
      <Circle cx={s(0.50)} cy={s(0.18)} r={s(0.018)} fill={color} opacity={0.5} />
    </Svg>
  );
}

// Dancing figure
function DanceFigureSVG({ size, color }: { size: number; color: string }) {
  const s = n(size);
  const cx = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Head */}
      <Circle cx={cx} cy={s(0.18)} r={s(0.10)} fill={color} />
      {/* Body */}
      <Line x1={cx} y1={s(0.28)} x2={cx} y2={s(0.62)} stroke={color} strokeWidth={s(0.055)} strokeLinecap="round" />
      {/* Arms — one up, one out */}
      <Line x1={cx} y1={s(0.36)} x2={cx - s(0.22)} y2={s(0.22)} stroke={color} strokeWidth={s(0.045)} strokeLinecap="round" />
      <Line x1={cx} y1={s(0.36)} x2={cx + s(0.22)} y2={s(0.42)} stroke={color} strokeWidth={s(0.045)} strokeLinecap="round" />
      {/* Legs */}
      <Line x1={cx} y1={s(0.62)} x2={cx - s(0.16)} y2={s(0.88)} stroke={color} strokeWidth={s(0.045)} strokeLinecap="round" />
      <Line x1={cx} y1={s(0.62)} x2={cx + s(0.20)} y2={s(0.82)} stroke={color} strokeWidth={s(0.045)} strokeLinecap="round" />
      {/* Music notes */}
      <Circle cx={cx + s(0.30)} cy={s(0.28)} r={s(0.030)} fill={color} opacity={0.8} />
      <Line x1={cx + s(0.30)} y1={s(0.25)} x2={cx + s(0.36)} y2={s(0.18)} stroke={color} strokeWidth={s(0.020)} />
      <Circle cx={cx - s(0.28)} cy={s(0.50)} r={s(0.025)} fill={color} opacity={0.7} />
      <Line x1={cx - s(0.28)} y1={s(0.47)} x2={cx - s(0.22)} y2={s(0.40)} stroke={color} strokeWidth={s(0.016)} />
    </Svg>
  );
}

// Diamond fallback
function DiamondSVG({ size, color }: { size: number; color: string }) {
  const s = n(size);
  const cx = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <LinearGradient id="diamGrad" x1="30%" y1="0%" x2="70%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </LinearGradient>
      </Defs>
      <Polygon
        points={`${cx},${s(0.10)} ${s(0.85)},${s(0.40)} ${cx},${s(0.90)} ${s(0.15)},${s(0.40)}`}
        fill="url(#diamGrad)"
      />
      <Polygon
        points={`${cx},${s(0.10)} ${s(0.85)},${s(0.40)} ${cx},${s(0.40)}`}
        fill="white" opacity={0.25}
      />
      <Ellipse cx={cx - s(0.06)} cy={s(0.28)} rx={s(0.05)} ry={s(0.08)} fill="white" opacity={0.2} transform={`rotate(-15 ${cx - s(0.06)} ${s(0.28)})`} />
    </Svg>
  );
}

export function ItemIllustration({ category, name, rarity, speciesKey, size = 64 }: Props) {
  const color = RARITY_GLOW[rarity] ?? '#9CA3AF';
  const lowerName = name.toLowerCase();

  // Species → pet SVG
  if (category === 'species') {
    const sp = speciesKey ?? '';
    if (sp === 'cat')    return <PetCatSVG    size={size} mood="happy" />;
    if (sp === 'bear')   return <PetBearSVG   size={size} mood="happy" />;
    if (sp === 'rabbit') return <PetRabbitSVG size={size} mood="happy" />;
    if (sp === 'dragon') return <PetDragonSVG size={size} mood="happy" />;
    return <PetDogSVG size={size} mood="happy" />;
  }

  // Outfit
  if (category === 'outfit') {
    if (lowerName.includes('sombrero') || lowerName.includes('hat'))       return <HatSVG size={size} color={color} />;
    if (lowerName.includes('capa') || lowerName.includes('superhéroe'))    return <CapeSVG size={size} color={color} />;
    if (lowerName.includes('corona'))                                       return <CrownSVG size={size} color={color} />;
    if (lowerName.includes('astronauta') || lowerName.includes('armadura') || lowerName.includes('traje')) return <AstronautSVG size={size} color={color} />;
    return <HatSVG size={size} color={color} />;
  }

  // Accessory
  if (category === 'accessory') {
    if (lowerName.includes('collar'))                                       return <FlowerCollarSVG size={size} color={color} />;
    if (lowerName.includes('gafas'))                                        return <SunglassesSVG size={size} color={color} />;
    if (lowerName.includes('alas'))                                         return <WingsSVG size={size} color={color} />;
    return <DiamondSVG size={size} color={color} />;
  }

  // Effect
  if (category === 'effect') {
    if (lowerName.includes('estrella') || lowerName.includes('destello'))  return <StarEffectSVG size={size} color={color} />;
    return <DiamondSVG size={size} color={color} />;
  }

  // Animation
  if (category === 'animation') {
    if (lowerName.includes('bail') || lowerName.includes('vuelta'))        return <DanceFigureSVG size={size} color={color} />;
    return <DanceFigureSVG size={size} color={color} />;
  }

  return <DiamondSVG size={size} color={color} />;
}

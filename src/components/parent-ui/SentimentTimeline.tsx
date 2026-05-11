import { View, Text } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

interface DayPoint {
  label: string; // "Lun", "Mar"...
  score: number | null; // -1 a 1, null si no habló
  talked: boolean;
}

interface Props {
  points: DayPoint[];
  width?: number;
  height?: number;
}

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function SentimentTimeline({ points, width = 320, height = 120 }: Props) {
  const padL = 8; const padR = 8; const padT = 16; const padB = 24;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const n = points.length;
  if (!n) return null;

  // score -1..1 → y 0..innerH (invertido: 1=arriba, -1=abajo)
  function scoreToY(s: number) {
    return padT + ((1 - s) / 2) * innerH;
  }
  function idxToX(i: number) {
    return padL + (i / (n - 1)) * innerW;
  }

  // Construir path solo con los días que sí habló
  const talked = points
    .map((p, i) => ({ ...p, i }))
    .filter(p => p.talked && p.score !== null);

  const pathD = talked
    .map((p, idx) =>
      (idx === 0 ? 'M' : 'L') + `${idxToX(p.i).toFixed(1)},${scoreToY(p.score!).toFixed(1)}`
    )
    .join(' ');

  return (
    <View>
      <Svg width={width} height={height}>
        {/* Línea central (score=0) */}
        <Line
          x1={padL} y1={scoreToY(0)} x2={width - padR} y2={scoreToY(0)}
          stroke="#E5E7EB" strokeWidth={1} strokeDasharray="4 3"
        />

        {/* Línea de tendencia */}
        {pathD.length > 0 && (
          <Path d={pathD} stroke="#FF9800" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Puntos + etiquetas de día */}
        {points.map((p, i) => {
          const x = idxToX(i);
          const y = p.talked && p.score !== null ? scoreToY(p.score) : scoreToY(0);
          return (
            <View key={i}>
              {p.talked && p.score !== null && (
                <Circle
                  cx={x} cy={y} r={4}
                  fill="#FF9800" stroke="white" strokeWidth={1.5}
                />
              )}
              {!p.talked && (
                <Circle cx={x} cy={scoreToY(0)} r={3} fill="#E5E7EB" />
              )}
              <SvgText
                x={x} y={height - 4}
                fontSize={9} fill="#9CA3AF" textAnchor="middle"
              >
                {p.label}
              </SvgText>
            </View>
          );
        })}
      </Svg>

      <View className="flex-row justify-between px-1 mt-1">
        <Text className="text-xs text-gray-400">😢 Difícil</Text>
        <Text className="text-xs text-gray-400">😊 Bien</Text>
      </View>
    </View>
  );
}

// Helper: construye los 7 puntos de la semana desde entradas raw
export function buildTimelinePoints(
  entries: Array<{ sentiment_score: number | null; created_at: string }>,
): DayPoint[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1];
    const entry = entries.find(e => e.created_at.startsWith(dateStr));
    return {
      label: dayLabel,
      score: entry?.sentiment_score ?? null,
      talked: !!entry,
    };
  });
}

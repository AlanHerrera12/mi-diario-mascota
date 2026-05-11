import { View, Text } from 'react-native';
import type { EmotionType } from '../../types';

const EMOTION_CONFIG: Record<EmotionType, { label: string; color: string; emoji: string }> = {
  alegria:      { label: 'Alegría',      color: '#FFD700', emoji: '😊' },
  calma:        { label: 'Calma',        color: '#4CAF50', emoji: '😌' },
  tristeza:     { label: 'Tristeza',     color: '#5B9BD5', emoji: '😢' },
  'frustración':{ label: 'Frustración', color: '#E67E22', emoji: '😤' },
  miedo:        { label: 'Miedo',        color: '#8E44AD', emoji: '😨' },
  enojo:        { label: 'Enojo',        color: '#E74C3C', emoji: '😠' },
};

interface EmotionRow {
  emotion: EmotionType;
  count: number;
  pct: number;
}

interface Props {
  data: EmotionRow[];
}

export function EmotionBar({ data }: Props) {
  if (!data.length) {
    return (
      <View className="py-8 items-center">
        <Text className="text-gray-300 text-4xl mb-2">📊</Text>
        <Text className="text-gray-400 text-sm">
          Todavía no hay datos de emociones esta semana.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {data.map(({ emotion, pct }) => {
        const cfg = EMOTION_CONFIG[emotion] ?? { label: emotion, color: '#9E9E9E', emoji: '❓' };
        return (
          <View key={emotion}>
            <View className="flex-row justify-between items-center mb-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-base">{cfg.emoji}</Text>
                <Text className="text-sm font-medium text-gray-700">{cfg.label}</Text>
              </View>
              <Text className="text-sm font-bold text-gray-500">{pct}%</Text>
            </View>
            <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: cfg.color }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

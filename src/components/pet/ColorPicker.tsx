import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

const PALETTE = [
  '#FF9800', '#F44336', '#E91E63', '#9C27B0',
  '#3F51B5', '#2196F3', '#00BCD4', '#4CAF50',
  '#8BC34A', '#FFEB3B', '#FF5722', '#795548',
  '#607D8B', '#FFFFFF', '#212121',
];

interface Props {
  label: string;
  selected: string;
  onSelect: (color: string) => void;
}

export function ColorPicker({ label, selected, onSelect }: Props) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {PALETTE.map(color => (
          <Pressable
            key={color}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(color);
            }}
            style={{ backgroundColor: color }}
            className={`w-9 h-9 rounded-full border-2
              ${selected === color ? 'border-primary-600 scale-110' : 'border-transparent'}`}
          />
        ))}
      </View>
    </View>
  );
}

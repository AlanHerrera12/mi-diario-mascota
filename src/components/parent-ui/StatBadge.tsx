import { View, Text } from 'react-native';

interface Props {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

export function StatBadge({ label, value, icon, color = 'bg-gray-50' }: Props) {
  return (
    <View className={`${color} rounded-2xl p-4 flex-1 items-center`}>
      <Text className="text-2xl mb-1">{icon}</Text>
      <Text className="text-2xl font-bold text-gray-800">{value}</Text>
      <Text className="text-xs text-gray-500 text-center mt-0.5">{label}</Text>
    </View>
  );
}

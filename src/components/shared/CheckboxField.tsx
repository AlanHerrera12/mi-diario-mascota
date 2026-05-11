import { Pressable, View, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

interface Props {
  checked: boolean;
  onToggle: () => void;
  label: string;
  required?: boolean;
}

export function CheckboxField({ checked, onToggle, label, required }: Props) {
  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  }

  return (
    <Pressable className="flex-row items-start gap-3 mb-4" onPress={handlePress}>
      <View
        className={`w-6 h-6 rounded-lg border-2 items-center justify-center mt-0.5 flex-shrink-0
          ${checked ? 'bg-primary-500 border-primary-500' : 'border-gray-300 bg-white'}`}
      >
        {checked && <Text className="text-white text-xs font-bold">✓</Text>}
      </View>
      <Text className="flex-1 text-sm text-gray-700 leading-5">
        {label}
        {required && <Text className="text-red-500"> *</Text>}
      </Text>
    </Pressable>
  );
}

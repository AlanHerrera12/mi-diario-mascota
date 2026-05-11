import { View, Text, TextInput, type TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export function AppTextInput({ label, error, ...props }: Props) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-1">{label}</Text>
      <TextInput
        className={`border rounded-2xl px-4 py-3 text-base text-gray-900 bg-gray-50
          ${error ? 'border-red-400' : 'border-gray-200'}
          ${props.editable === false ? 'opacity-50' : ''}`}
        placeholderTextColor="#9CA3AF"
        autoCapitalize="none"
        {...props}
      />
      {error ? <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text> : null}
    </View>
  );
}

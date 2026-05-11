import { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

interface Props {
  length?: number;
  onComplete: (pin: string) => void;
  error?: string;
  label?: string;
}

export function PinInput({ length = 4, onComplete, error, label = 'Ingresá tu PIN' }: Props) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  function handleChange(text: string) {
    // Solo dígitos, máximo `length` caracteres
    const cleaned = text.replace(/\D/g, '').slice(0, length);
    const newDigits = Array(length)
      .fill('')
      .map((_, i) => cleaned[i] ?? '');
    setDigits(newDigits);

    if (cleaned.length === length) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete(cleaned);
    }
  }

  function handleClear() {
    setDigits(Array(length).fill(''));
    inputRef.current?.clear();
    inputRef.current?.focus();
  }

  const currentValue = digits.join('');

  return (
    <View className="items-center">
      <Text className="text-base font-semibold text-gray-700 mb-4">{label}</Text>

      {/* Cajas de dígitos — tap para mostrar teclado */}
      <Pressable
        className="flex-row gap-3 mb-4"
        onPress={() => inputRef.current?.focus()}
      >
        {digits.map((digit, i) => (
          <View
            key={i}
            className={`w-14 h-14 rounded-2xl border-2 items-center justify-center
              ${focused && currentValue.length === i ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-gray-50'}
              ${digit ? 'bg-primary-100 border-primary-400' : ''}
              ${error ? 'border-red-400' : ''}`}
          >
            <Text className="text-2xl font-bold text-gray-800">
              {digit ? '●' : ''}
            </Text>
          </View>
        ))}
      </Pressable>

      {/* Input oculto que captura el teclado numérico */}
      <TextInput
        ref={inputRef}
        value={currentValue}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ position: 'absolute', opacity: 0, height: 0 }}
        caretHidden
      />

      {error ? (
        <Text className="text-red-500 text-sm text-center mt-1">{error}</Text>
      ) : null}

      {currentValue.length > 0 && (
        <Pressable onPress={handleClear} className="mt-2">
          <Text className="text-gray-400 text-sm">Borrar</Text>
        </Pressable>
      )}
    </View>
  );
}

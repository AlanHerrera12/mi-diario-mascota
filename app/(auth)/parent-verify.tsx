import { View, Text } from 'react-native';

// TODO (Fase 2): Pantalla de consentimiento COPPA/GDPR-K
// Checkboxes explícitos + selección de método de verificación
// Ver docs/privacy-decisions.md para justificación de cada campo
export default function ParentVerifyScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-gray-800">Verificar consentimiento</Text>
      <Text className="text-gray-500 mt-2">— Fase 2 pendiente —</Text>
    </View>
  );
}

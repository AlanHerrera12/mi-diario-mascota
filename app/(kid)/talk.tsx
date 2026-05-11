import { View, Text } from 'react-native';

// TODO (Fase 3): Pantalla de grabación de audio
// - Indicador visual de tiempo (anillo que se llena al minuto)
// - Mascota con animación "escuchando"
// - Botón "Listo, a dormir" para finalizar sesión
export default function TalkScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-primary-50">
      <Text className="text-6xl mb-8">👂</Text>
      <Text className="text-2xl font-bold text-primary-800">Te estoy escuchando...</Text>
      <Text className="text-primary-500 mt-2">— Fase 3 pendiente —</Text>
    </View>
  );
}

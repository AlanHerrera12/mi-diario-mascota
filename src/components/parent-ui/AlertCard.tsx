import { View, Text, Pressable, Linking } from 'react-native';
import { HELP_RESOURCES } from '../../constants';
import type { ParentAlert } from '../../types';
import { useAuthStore } from '../../stores/auth.store';

const ALERT_CONFIG = {
  bullying:       { label: 'Posible situación de bullying', icon: '⚠️', color: 'bg-yellow-50 border-yellow-200' },
  self_harm:      { label: 'Señal de autolesión',          icon: '🆘', color: 'bg-red-50 border-red-200' },
  abuse:          { label: 'Posible situación de abuso',   icon: '🆘', color: 'bg-red-50 border-red-200' },
  severe_distress:{ label: 'Angustia intensa',             icon: '💙', color: 'bg-blue-50 border-blue-200' },
};

const SEVERITY_BADGE = {
  low:    { label: 'Leve',   color: 'bg-yellow-100 text-yellow-700' },
  medium: { label: 'Medio',  color: 'bg-orange-100 text-orange-700' },
  high:   { label: 'Alto',   color: 'bg-red-100 text-red-700' },
};

interface Props {
  alert: ParentAlert;
  onMarkRead?: (id: string) => void;
}

export function AlertCard({ alert, onMarkRead }: Props) {
  const parent = useAuthStore(s => s.parent);
  const country = parent?.country_code ?? 'AR';
  const resource = HELP_RESOURCES[country] ?? HELP_RESOURCES['AR'];

  const cfg = ALERT_CONFIG[alert.alert_type];
  const severity = SEVERITY_BADGE[alert.severity];
  const isUnread = !alert.read_at;

  const date = new Date(alert.created_at).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long',
  });

  return (
    <View className={`rounded-2xl border p-4 mb-3 ${cfg.color} ${isUnread ? 'shadow-sm' : 'opacity-70'}`}>
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="text-xl">{cfg.icon}</Text>
          <Text className="font-bold text-gray-800 flex-1 text-sm">{cfg.label}</Text>
        </View>
        <View className={`px-2 py-0.5 rounded-lg ${severity.color}`}>
          <Text className="text-xs font-semibold">{severity.label}</Text>
        </View>
      </View>

      <Text className="text-xs text-gray-500 mb-3">{date}</Text>

      {alert.context_snippet ? (
        <View className="bg-white/70 rounded-xl p-3 mb-3">
          <Text className="text-xs text-gray-500 mb-1 font-medium">Contexto detectado:</Text>
          <Text className="text-sm text-gray-700 italic">"{alert.context_snippet}"</Text>
        </View>
      ) : null}

      {/* Aviso legal importante */}
      <View className="bg-white/60 rounded-xl p-3 mb-3">
        <Text className="text-xs text-gray-500 leading-4">
          ⚕️ <Text className="font-semibold">Importante:</Text> Esta app no realiza diagnósticos clínicos. Si tenés preocupaciones, consultá con un profesional de salud mental.
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          className="flex-1 bg-white rounded-xl py-2.5 items-center border border-gray-200 active:bg-gray-50"
          onPress={() => Linking.openURL(`tel:${resource.phone}`)}
        >
          <Text className="text-xs font-semibold text-gray-600">📞 {resource.name}</Text>
        </Pressable>

        {isUnread && onMarkRead && (
          <Pressable
            className="px-4 bg-gray-100 rounded-xl py-2.5 items-center active:bg-gray-200"
            onPress={() => onMarkRead(alert.id)}
          >
            <Text className="text-xs font-semibold text-gray-500">Visto ✓</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

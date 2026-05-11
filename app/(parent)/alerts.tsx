import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../src/stores/auth.store';
import { AlertCard } from '../../src/components/parent-ui/AlertCard';
import {
  useAllAlerts,
  markAlertRead,
} from '../../src/features/parental-controls/useParentDashboard';

export default function AlertsScreen() {
  const child = useAuthStore(s => s.activeChild);
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useAllAlerts(child?.id);

  const unreadCount = alerts.filter(a => !a.read_at).length;

  async function handleMarkRead(id: string) {
    await markAlertRead(id);
    queryClient.invalidateQueries({ queryKey: ['all-alerts', child?.id] });
    queryClient.invalidateQueries({ queryKey: ['unread-alerts', child?.id] });
  }

  async function handleMarkAllRead() {
    const unread = alerts.filter(a => !a.read_at);
    await Promise.all(unread.map(a => markAlertRead(a.id)));
    queryClient.invalidateQueries({ queryKey: ['all-alerts', child?.id] });
    queryClient.invalidateQueries({ queryKey: ['unread-alerts', child?.id] });
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3 bg-white border-b border-gray-100">
        <View>
          <Text className="text-xs text-gray-400">Alertas</Text>
          <Text className="text-lg font-bold text-gray-900">
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo tranquilo'}
          </Text>
        </View>
        <View className="flex-row gap-2 items-center">
          {unreadCount > 0 && (
            <Pressable
              onPress={handleMarkAllRead}
              className="bg-gray-100 rounded-xl px-3 py-2 active:bg-gray-200"
            >
              <Text className="text-gray-600 text-xs font-semibold">Marcar todo leído</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => router.back()}
            className="bg-gray-100 rounded-xl px-3 py-2 active:bg-gray-200"
          >
            <Text className="text-gray-600 font-semibold text-sm">‹ Volver</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        {isLoading ? (
          <View className="py-20 items-center">
            <ActivityIndicator color="#FF9800" size="large" />
            <Text className="text-gray-400 mt-3 text-sm">Cargando alertas…</Text>
          </View>
        ) : alerts.length === 0 ? (
          <View className="py-20 items-center">
            <Text className="text-5xl mb-4">✅</Text>
            <Text className="text-gray-700 font-bold text-lg">No hay alertas</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center px-8">
              Todo está tranquilo. Si {child?.displayName ?? 'tu hijo/a'} menciona algo que nos preocupe, aparecerá acá.
            </Text>
          </View>
        ) : (
          <>
            {/* Aviso general */}
            <View className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4">
              <Text className="text-xs text-amber-700 leading-4">
                ⚕️ <Text className="font-semibold">Importante:</Text> Las alertas son indicadores automáticos, no diagnósticos. Ante cualquier duda, consultá con un profesional de salud mental.
              </Text>
            </View>

            {alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} onMarkRead={handleMarkRead} />
            ))}

            <View className="bg-blue-50 rounded-2xl p-4 mt-2">
              <Text className="text-xs text-blue-600 text-center leading-4">
                🔒 Solo vos podés ver estas alertas. Se borran automáticamente después de 30 días.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

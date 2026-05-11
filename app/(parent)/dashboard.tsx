import { View, Text, Pressable, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/auth.store';
import { StatBadge } from '../../src/components/parent-ui/StatBadge';
import { EmotionBar } from '../../src/components/parent-ui/EmotionBar';
import { SentimentTimeline, buildTimelinePoints } from '../../src/components/parent-ui/SentimentTimeline';
import {
  useWeeklyEntries,
  useUnreadAlerts,
  useChildStreak,
  aggregateEmotions,
  averageSentiment,
} from '../../src/features/parental-controls/useParentDashboard';
import { signOut } from '../../src/features/auth/useParentAuth';

export default function ParentDashboardScreen() {
  const parent = useAuthStore(s => s.parent);
  const child = useAuthStore(s => s.activeChild);
  const lockDashboard = useAuthStore(s => s.lockParentDashboard);

  const { data: entries = [], isLoading: loadingEntries } = useWeeklyEntries(child?.id);
  const { data: alerts = [] } = useUnreadAlerts(child?.id);
  const { data: streak } = useChildStreak(child?.id);

  const emotions = aggregateEmotions(entries);
  const avgSentiment = averageSentiment(entries);
  const timelinePoints = buildTimelinePoints(entries);
  const talkDays = entries.length;

  const sentimentLabel =
    avgSentiment > 0.3 ? '😊 Muy bien'
    : avgSentiment > 0 ? '🙂 Bien'
    : avgSentiment > -0.3 ? '😐 Regular'
    : '😔 Difícil';

  function handleClose() {
    lockDashboard();
    router.replace('/(kid)/home');
  }

  async function handleSignOut() {
    lockDashboard();
    await signOut();
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3 bg-white border-b border-gray-100">
        <View>
          <Text className="text-xs text-gray-400">Panel de padres</Text>
          <Text className="text-lg font-bold text-gray-900">
            {parent?.full_name?.split(' ')[0] ?? 'Hola'} 👋
          </Text>
        </View>
        <View className="flex-row gap-3 items-center">
          <Pressable
            onPress={handleClose}
            className="bg-primary-50 rounded-xl px-3 py-2 active:bg-primary-100"
          >
            <Text className="text-primary-600 font-semibold text-sm">Volver 🏠</Text>
          </Pressable>
          <Pressable onPress={handleSignOut} className="p-2">
            <Text className="text-gray-300 text-lg">⏏</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>

        {/* Perfil del niño */}
        <View className="bg-white rounded-3xl p-5 shadow-sm">
          <Text className="text-xs text-gray-400 uppercase tracking-wider mb-1">Seguimiento de</Text>
          <Text className="text-xl font-bold text-gray-900">{child?.displayName ?? '—'}</Text>
        </View>

        {/* Stats rápidos */}
        <View className="flex-row gap-3">
          <StatBadge
            icon="🗓️" label="días esta semana"
            value={`${talkDays}/7`}
            color="bg-white"
          />
          <StatBadge
            icon="🔥" label="racha actual"
            value={streak?.current_streak ?? 0}
            color="bg-white"
          />
          <StatBadge
            icon={avgSentiment >= 0 ? '😊' : '😔'}
            label="estado general"
            value={sentimentLabel.split(' ')[0]}
            color="bg-white"
          />
        </View>

        {/* Alerta badge */}
        {alerts.length > 0 && (
          <Pressable
            onPress={() => router.push('/(parent)/alerts')}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex-row items-center gap-3 active:bg-red-100"
          >
            <Text className="text-2xl">🆘</Text>
            <View className="flex-1">
              <Text className="font-bold text-red-700">
                {alerts.length === 1
                  ? '1 alerta nueva que revisar'
                  : `${alerts.length} alertas nuevas que revisar`}
              </Text>
              <Text className="text-red-500 text-xs mt-0.5">Tocá para ver el detalle</Text>
            </View>
            <Text className="text-red-400 text-lg">›</Text>
          </Pressable>
        )}

        {/* Timeline de sentimiento */}
        <View className="bg-white rounded-3xl p-5 shadow-sm">
          <Text className="font-bold text-gray-800 mb-1">Estado emocional — últimos 7 días</Text>
          <Text className="text-xs text-gray-400 mb-4">
            Días sin punto = {child?.displayName ?? 'tu hijo/a'} no habló ese día
          </Text>
          {loadingEntries ? (
            <ActivityIndicator color="#FF9800" />
          ) : (
            <SentimentTimeline points={timelinePoints} width={320} />
          )}
        </View>

        {/* Emociones */}
        <View className="bg-white rounded-3xl p-5 shadow-sm">
          <Text className="font-bold text-gray-800 mb-4">Emociones esta semana</Text>
          {loadingEntries ? (
            <ActivityIndicator color="#FF9800" />
          ) : (
            <EmotionBar data={emotions} />
          )}
        </View>

        {/* Navegación a secciones */}
        <View className="gap-3">
          <Pressable
            onPress={() => router.push('/(parent)/weekly-summary')}
            className="bg-white rounded-2xl p-4 flex-row items-center gap-3 shadow-sm active:bg-gray-50"
          >
            <Text className="text-2xl">📋</Text>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">Resumen semanal completo</Text>
              <Text className="text-xs text-gray-400">Texto detallado + temas detectados</Text>
            </View>
            <Text className="text-gray-300 text-lg">›</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(parent)/alerts')}
            className="bg-white rounded-2xl p-4 flex-row items-center gap-3 shadow-sm active:bg-gray-50"
          >
            <Text className="text-2xl">🔔</Text>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">Alertas</Text>
              <Text className="text-xs text-gray-400">
                {alerts.length > 0 ? `${alerts.length} sin leer` : 'Todo tranquilo'}
              </Text>
            </View>
            {alerts.length > 0 && (
              <View className="bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">{alerts.length}</Text>
              </View>
            )}
            <Text className="text-gray-300 text-lg">›</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(parent)/settings')}
            className="bg-white rounded-2xl p-4 flex-row items-center gap-3 shadow-sm active:bg-gray-50"
          >
            <Text className="text-2xl">⚙️</Text>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">Configuración</Text>
              <Text className="text-xs text-gray-400">Privacidad, datos y suscripción</Text>
            </View>
            <Text className="text-gray-300 text-lg">›</Text>
          </Pressable>
        </View>

        {/* Footer de privacidad */}
        <View className="bg-blue-50 rounded-2xl p-4">
          <Text className="text-xs text-blue-600 text-center leading-4">
            🔒 Solo vos podés ver este panel. Los audios se borran automáticamente a los 7 días. {child?.displayName ?? 'Tu hijo/a'} no puede acceder a esta sección.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

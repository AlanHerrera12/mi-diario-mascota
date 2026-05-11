import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/auth.store';
import { EmotionBar } from '../../src/components/parent-ui/EmotionBar';
import {
  useWeeklyEntries,
  useLatestSummary,
  aggregateEmotions,
  averageSentiment,
  type WeeklyEntryRaw,
} from '../../src/features/parental-controls/useParentDashboard';

export default function WeeklySummaryScreen() {
  const child = useAuthStore(s => s.activeChild);

  const { data: entries = [], isLoading: loadingEntries } = useWeeklyEntries(child?.id);
  const { data: summary, isLoading: loadingSummary } = useLatestSummary(child?.id);

  const emotions = aggregateEmotions(entries);
  const avgSentiment = averageSentiment(entries);
  const talkDays = entries.length;
  const totalAudioMin = Math.round(
    entries.reduce((acc: number, e: WeeklyEntryRaw) => acc + (e.audio_duration_seconds ?? 0), 0) / 60,
  );

  const allKeywords: string[] = [];
  for (const e of entries as WeeklyEntryRaw[]) {
    for (const kw of e.keywords ?? []) {
      if (!allKeywords.includes(kw)) allKeywords.push(kw);
    }
  }

  const sentimentLabel =
    avgSentiment > 0.3 ? 'Muy bien 😊'
    : avgSentiment > 0 ? 'Bien 🙂'
    : avgSentiment > -0.3 ? 'Regular 😐'
    : 'Difícil 😔';

  const isLoading = loadingEntries || loadingSummary;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3 bg-white border-b border-gray-100">
        <View>
          <Text className="text-xs text-gray-400">Resumen semanal</Text>
          <Text className="text-lg font-bold text-gray-900">{child?.displayName ?? '—'}</Text>
        </View>
        <Pressable
          onPress={() => router.back()}
          className="bg-gray-100 rounded-xl px-3 py-2 active:bg-gray-200"
        >
          <Text className="text-gray-600 font-semibold text-sm">‹ Volver</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>
        {isLoading ? (
          <View className="py-20 items-center">
            <ActivityIndicator color="#FF9800" size="large" />
            <Text className="text-gray-400 mt-3 text-sm">Cargando resumen…</Text>
          </View>
        ) : (
          <>
            {/* Métricas */}
            <View className="bg-white rounded-3xl p-5 shadow-sm">
              <Text className="font-bold text-gray-800 mb-4">Esta semana en números</Text>
              <View className="gap-3">
                <SummaryRow label="Días que habló" value={`${talkDays} de 7`} />
                <SummaryRow label="Estado emocional general" value={sentimentLabel} />
                <SummaryRow label="Tiempo total hablando" value={`${totalAudioMin} min`} />
              </View>
            </View>

            {/* Texto del resumen */}
            <View className="bg-white rounded-3xl p-5 shadow-sm">
              <Text className="font-bold text-gray-800 mb-3">Resumen de la semana</Text>
              {summary?.summary_text ? (
                <Text className="text-sm text-gray-600 leading-5">{summary.summary_text}</Text>
              ) : (
                <View className="py-4 items-center">
                  <Text className="text-gray-300 text-3xl mb-2">📝</Text>
                  <Text className="text-gray-400 text-sm text-center">
                    {talkDays === 0
                      ? `${child?.displayName ?? 'Tu hijo/a'} no habló esta semana.`
                      : 'El resumen se genera automáticamente los lunes. Estará disponible pronto.'}
                  </Text>
                </View>
              )}
            </View>

            {/* Temas detectados */}
            {allKeywords.length > 0 && (
              <View className="bg-white rounded-3xl p-5 shadow-sm">
                <Text className="font-bold text-gray-800 mb-3">Temas que mencionó</Text>
                <View className="flex-row flex-wrap gap-2">
                  {allKeywords.slice(0, 20).map(kw => (
                    <View key={kw} className="bg-orange-50 border border-orange-100 rounded-full px-3 py-1">
                      <Text className="text-xs text-orange-600 font-medium">{kw}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Emociones */}
            <View className="bg-white rounded-3xl p-5 shadow-sm">
              <Text className="font-bold text-gray-800 mb-4">Emociones de la semana</Text>
              <EmotionBar data={emotions} />
            </View>

            {/* Nota */}
            <View className="bg-blue-50 rounded-2xl p-4">
              <Text className="text-xs text-blue-600 leading-4">
                ℹ️ El análisis es orientativo y no reemplaza la observación directa ni el criterio de un profesional. Usalo como punto de conversación con {child?.displayName ?? 'tu hijo/a'}, no como diagnóstico.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center py-2 border-b border-gray-50">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-gray-800">{value}</Text>
    </View>
  );
}

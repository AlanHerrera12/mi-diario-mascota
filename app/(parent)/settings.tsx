import { useState } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, Pressable, Alert, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/auth.store';
import { supabase } from '../../src/lib/supabase';
import { signOut } from '../../src/features/auth/useParentAuth';

export default function ParentSettingsScreen() {
  const parent = useAuthStore(s => s.parent);
  const child = useAuthStore(s => s.activeChild);
  const [deletingData, setDeletingData] = useState(false);

  async function handleDeleteAllData() {
    Alert.alert(
      'Borrar todos los datos',
      `Esto eliminará permanentemente todas las entradas del diario, alertas y resúmenes de ${child?.displayName ?? 'tu hijo/a'}. Esta acción es irreversible.\n\n¿Estás seguro?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: confirmDeleteAllData,
        },
      ],
    );
  }

  async function confirmDeleteAllData() {
    if (!child?.id) return;
    setDeletingData(true);
    try {
      // Borrar audios del Storage
      const { data: files } = await supabase.storage
        .from('diary-audios')
        .list(`${child.id}`);
      if (files?.length) {
        await supabase.storage
          .from('diary-audios')
          .remove(files.map(f => `${child.id}/${f.name}`));
      }
      // Borrar entradas, alertas y resúmenes (cascada vía RLS)
      await supabase.from('diary_entries').delete().eq('child_id', child.id);
      await supabase.from('parent_alerts').delete().eq('child_id', child.id);
      await supabase.from('parent_summaries').delete().eq('child_id', child.id);
      await supabase.from('gem_transactions').delete().eq('child_id', child.id);

      Alert.alert('Listo', 'Todos los datos del diario fueron borrados.');
    } catch {
      Alert.alert('Error', 'No se pudieron borrar todos los datos. Intentá de nuevo.');
    } finally {
      setDeletingData(false);
    }
  }

  async function handleDeleteAccount() {
    Alert.alert(
      'Eliminar cuenta',
      'Esto eliminará tu cuenta y todos los datos asociados permanentemente. No podrás recuperarlos.\n\n¿Querés continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar cuenta',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3 bg-white border-b border-gray-100">
        <View>
          <Text className="text-xs text-gray-400">Panel de padres</Text>
          <Text className="text-lg font-bold text-gray-900">Configuración</Text>
        </View>
        <Pressable
          onPress={() => router.back()}
          className="bg-gray-100 rounded-xl px-3 py-2 active:bg-gray-200"
        >
          <Text className="text-gray-600 font-semibold text-sm">‹ Volver</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16 }}>

        {/* Cuenta */}
        <View className="bg-white rounded-3xl p-5 shadow-sm gap-1">
          <Text className="text-xs text-gray-400 uppercase tracking-wider mb-2">Cuenta</Text>
          <InfoRow label="Email" value={parent?.email ?? '—'} />
          <InfoRow label="País" value={parent?.country_code ?? '—'} />
          <InfoRow label="Plan" value={parent?.subscription_status === 'active' ? '⭐ Premium' : 'Gratuito'} />
        </View>

        {/* Privacidad y datos */}
        <View className="bg-white rounded-3xl p-5 shadow-sm">
          <Text className="text-xs text-gray-400 uppercase tracking-wider mb-3">Privacidad y datos</Text>

          <View className="bg-blue-50 rounded-2xl p-4 mb-4">
            <Text className="text-xs text-blue-600 leading-4">
              🔒 Los audios se borran automáticamente a los 7 días. Las transcripciones quedan almacenadas de forma segura. Solo vos podés ver el panel parental.
            </Text>
          </View>

          <SettingsButton
            label="Borrar todos los datos del diario"
            sublabel={`Borra audios, transcripciones y alertas de ${child?.displayName ?? 'tu hijo/a'}`}
            icon="🗑️"
            variant="danger"
            onPress={handleDeleteAllData}
            loading={deletingData}
          />
        </View>

        {/* PIN */}
        <View className="bg-white rounded-3xl p-5 shadow-sm">
          <Text className="text-xs text-gray-400 uppercase tracking-wider mb-3">Seguridad</Text>
          <SettingsButton
            label="Cambiar PIN parental"
            sublabel="El PIN protege el acceso a este panel"
            icon="🔑"
            onPress={() => {
              Alert.alert(
                'Cambiar PIN',
                'Para cambiar tu PIN, cerrá sesión y registrate de nuevo, o contactá soporte.',
              );
            }}
          />
        </View>

        {/* Suscripción */}
        <View className="bg-white rounded-3xl p-5 shadow-sm">
          <Text className="text-xs text-gray-400 uppercase tracking-wider mb-3">Suscripción</Text>
          {parent?.subscription_status === 'active' ? (
            <View className="bg-green-50 rounded-2xl p-4">
              <Text className="text-sm font-semibold text-green-700">⭐ Plan Premium activo</Text>
              <Text className="text-xs text-green-600 mt-1">Gracias por apoyar MiDiarioMascota.</Text>
            </View>
          ) : (
            <View className="bg-orange-50 rounded-2xl p-4">
              <Text className="text-sm font-semibold text-orange-700">Plan gratuito</Text>
              <Text className="text-xs text-orange-600 mt-1">
                La versión premium incluye resúmenes semanales detallados, más temas detectados y soporte prioritario.
              </Text>
              <Pressable className="mt-3 bg-primary-500 rounded-xl py-2.5 items-center active:bg-primary-600">
                <Text className="text-white font-bold text-sm">Ver planes premium</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Zona peligrosa */}
        <View className="bg-white rounded-3xl p-5 shadow-sm">
          <Text className="text-xs text-red-400 uppercase tracking-wider mb-3">Zona de riesgo</Text>
          <SettingsButton
            label="Eliminar cuenta"
            sublabel="Borra tu cuenta y todos los datos permanentemente"
            icon="⚠️"
            variant="danger"
            onPress={handleDeleteAccount}
          />
        </View>

        {/* Versión */}
        <Text className="text-center text-xs text-gray-300 pb-4">
          MiDiarioMascota · v0.1.0 · Hecho con 💙 para familias
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center py-2 border-b border-gray-50">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-gray-700">{value}</Text>
    </View>
  );
}

interface SettingsButtonProps {
  label: string;
  sublabel: string;
  icon: string;
  variant?: 'default' | 'danger';
  onPress: () => void;
  loading?: boolean;
}

function SettingsButton({ label, sublabel, icon, variant = 'default', onPress, loading }: SettingsButtonProps) {
  const isDanger = variant === 'danger';
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className={`flex-row items-center gap-3 p-3 rounded-2xl active:bg-gray-50 ${isDanger ? 'active:bg-red-50' : ''}`}
    >
      <Text className="text-2xl">{icon}</Text>
      <View className="flex-1">
        <Text className={`text-sm font-semibold ${isDanger ? 'text-red-600' : 'text-gray-800'}`}>{label}</Text>
        <Text className="text-xs text-gray-400 mt-0.5">{sublabel}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color="#EF4444" />
      ) : (
        <Text className={`text-lg ${isDanger ? 'text-red-300' : 'text-gray-300'}`}>›</Text>
      )}
    </Pressable>
  );
}

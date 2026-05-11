import { SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, View } from 'react-native';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  className?: string;
  bg?: string;
}

export function ScreenWrapper({ children, scroll = true, className = '', bg = 'bg-white' }: Props) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className={`flex-1 px-6 py-8 ${className}`}>{children}</View>
    </ScrollView>
  ) : (
    <View className={`flex-1 px-6 py-8 ${className}`}>{children}</View>
  );

  return (
    <SafeAreaView className={`flex-1 ${bg}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { ActivityIndicator, Pressable, Text } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function PrimaryButton({ label, onPress, loading, disabled, variant = 'primary' }: Props) {
  const base = 'rounded-2xl px-6 py-4 items-center justify-center flex-row gap-2';
  const variants = {
    primary: `bg-primary-500 ${disabled || loading ? 'opacity-50' : 'active:bg-primary-600'}`,
    secondary: `border-2 border-primary-500 ${disabled || loading ? 'opacity-50' : 'active:bg-primary-50'}`,
    ghost: `${disabled || loading ? 'opacity-50' : 'active:bg-gray-100'}`,
  };
  const textVariants = {
    primary: 'text-white font-bold text-base',
    secondary: 'text-primary-600 font-bold text-base',
    ghost: 'text-gray-600 font-semibold text-base',
  };

  return (
    <Pressable
      className={`${base} ${variants[variant]}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading && <ActivityIndicator color={variant === 'primary' ? '#fff' : '#FF9800'} />}
      <Text className={textVariants[variant]}>{label}</Text>
    </Pressable>
  );
}

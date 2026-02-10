import { Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton, SectionCard } from './ui';

export function BackAndTryAgainCard({
  message,
  onBack,
  onRetry,
}: {
  message: string;
  onBack: () => void;
  onRetry: () => void;
}) {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '700', color: '#D92D20' }}>Something went wrong</Text>
      <Text>{message}</Text>
      <View style={{ gap: 8 }}>
        <PrimaryButton label="Try again" onPress={onRetry} />
        <SecondaryButton label="Back" onPress={onBack} />
      </View>
    </SectionCard>
  );
}

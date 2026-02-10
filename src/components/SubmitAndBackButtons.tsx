import { View } from 'react-native';
import { PrimaryButton, SecondaryButton } from './ui';

export function SubmitAndBackButtons({
  continueLabel,
  onContinue,
  onBack,
  loading,
}: {
  continueLabel: string;
  onContinue: () => void;
  onBack: () => void;
  loading?: boolean;
}) {
  return (
    <View style={{ gap: 8 }}>
      <PrimaryButton label={continueLabel} onPress={onContinue} loading={loading} />
      <SecondaryButton label="Back" onPress={onBack} />
    </View>
  );
}

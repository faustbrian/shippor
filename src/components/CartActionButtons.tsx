import { View } from 'react-native';
import { PrimaryButton, SecondaryButton } from './ui';

export function CartActionButtons({
  onContinue,
  onBack,
  disableContinue,
}: {
  onContinue: () => void;
  onBack: () => void;
  disableContinue?: boolean;
}) {
  return (
    <View style={{ gap: 8 }}>
      <PrimaryButton label="Continue to payment" onPress={onContinue} disabled={disableContinue} />
      <SecondaryButton label="Back to methods" onPress={onBack} />
    </View>
  );
}

import { Text } from 'react-native';
import { PrimaryButton, SectionCard, SecondaryButton } from './ui';

export function EmptyCartCard({
  onGoMethods,
  onGoSend,
}: {
  onGoMethods: () => void;
  onGoSend: () => void;
}) {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '700' }}>Your cart is empty</Text>
      <Text>Add a shipment draft to cart before proceeding to payment.</Text>
      <PrimaryButton label="Back to methods" onPress={onGoMethods} />
      <SecondaryButton label="Start new shipment" onPress={onGoSend} />
    </SectionCard>
  );
}

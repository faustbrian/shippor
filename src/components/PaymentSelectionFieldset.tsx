import { Text, View } from 'react-native';
import { SectionCard } from './ui';

export function PaymentSelectionFieldset({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '800' }}>Payment selection</Text>
      <Text style={{ color: '#667085', fontSize: 12 }}>
        Choose a payment gateway to proceed with checkout.
      </Text>
      <View style={{ gap: 8 }}>{children}</View>
    </SectionCard>
  );
}

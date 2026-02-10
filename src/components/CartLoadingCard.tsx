import { ActivityIndicator, Text, View } from 'react-native';
import { SectionCard } from './ui';

export function CartLoadingCard() {
  return (
    <SectionCard>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <ActivityIndicator />
        <Text style={{ fontWeight: '700' }}>Loading cart state...</Text>
      </View>
      <Text>Please wait while shipment/payment status updates.</Text>
    </SectionCard>
  );
}

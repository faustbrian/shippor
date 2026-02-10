import { Text } from 'react-native';
import { SectionCard } from './ui';

export function ShipmentInstructions() {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '800', fontSize: 13, color: '#344054' }}>SHIPMENT INSTRUCTIONS</Text>
      <Text style={{ color: '#475467', fontSize: 13 }}>
        Review failed shipments before payment. Successful shipments can be paid and sent immediately.
      </Text>
    </SectionCard>
  );
}

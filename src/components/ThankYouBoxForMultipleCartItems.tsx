import { Text } from 'react-native';
import type { ShipmentRecord } from '../types/models';
import { SectionCard } from './ui';

export function ThankYouBoxForMultipleCartItems({ shipments }: { shipments: ShipmentRecord[] }) {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '800' }}>Thank you</Text>
      <Text>{shipments.length} shipment(s) created successfully.</Text>
      <Text style={{ color: '#667085' }}>
        Download transport labels and receipts for each shipment below.
      </Text>
    </SectionCard>
  );
}

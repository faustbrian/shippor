import { Text } from 'react-native';
import { SectionCard } from './ui';
import type { ShipmentDraft } from '../types/models';

export function ShipmentSummaryCard({ draft }: { draft: ShipmentDraft }) {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '700' }}>Shipment Summary</Text>
      <Text>{draft.senderAddress.city || 'Sender'} {'->'} {draft.recipientAddress.city || 'Recipient'}</Text>
      <Text>Service: {draft.selectedMethod?.label ?? 'Not selected'}</Text>
      <Text>Parcel count: {draft.parcels.length}</Text>
      <Text>Declared value: {draft.value || '0'}</Text>
      <Text>Pickup: {draft.pickupLocationId ?? 'N/A'}</Text>
    </SectionCard>
  );
}

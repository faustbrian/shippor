import { Text } from 'react-native';
import type { ShipmentDraft } from '../types/models';
import { SideCard } from './SideCard';

export function ShipmentSummary({ draft }: { draft: ShipmentDraft }) {
  return (
    <SideCard title="Shipment">
      <Text>Contents: {draft.contents || '-'}</Text>
      <Text>Type: {draft.shipmentType || '-'}</Text>
      <Text>Reference: {draft.reference || '-'}</Text>
      <Text>Declared value: {draft.value || '-'}</Text>
      <Text>Instructions: {draft.instructions || '-'}</Text>
    </SideCard>
  );
}

import { Text } from 'react-native';
import { SectionCard } from './ui';
import type { ShipmentDraft } from '../types/models';

function enabledAddons(draft: ShipmentDraft): string[] {
  const labels: [keyof ShipmentDraft['addons'], string][] = [
    ['pickup', 'Shipment collection'],
    ['delivery', 'Doorstep delivery'],
    ['delivery09', 'Delivery by 9 AM'],
    ['limitedQtys', 'Limited quantities'],
    ['fragile', 'Fragile'],
    ['dangerous', 'Dangerous goods'],
    ['proofOfDelivery', 'Proof of delivery'],
    ['callBeforeDelivery', 'Call before delivery'],
    ['oversize', 'Oversize'],
    ['cashOnDelivery', 'Cash on delivery'],
  ];

  return labels.filter(([key]) => Boolean(draft.addons[key])).map(([, label]) => label);
}

export function ShippingFlowSidePanel({ draft }: { draft: ShipmentDraft }) {
  const parcel = draft.parcels[0];
  const addons = enabledAddons(draft);

  return (
    <SectionCard>
      <Text style={{ fontWeight: '800' }}>Summary Panel</Text>
      <Text style={{ fontWeight: '700' }}>Route</Text>
      <Text>{draft.senderAddress.name || 'Sender'} ({draft.senderAddress.country || '-'})</Text>
      <Text>{draft.recipientAddress.name || 'Recipient'} ({draft.recipientAddress.country || '-'})</Text>
      <Text style={{ fontWeight: '700', marginTop: 6 }}>Parcel</Text>
      <Text>
        {parcel.weight ?? '-'}kg • {parcel.length ?? '-'}x{parcel.width ?? '-'}x{parcel.height ?? '-'} cm
      </Text>
      <Text style={{ fontWeight: '700', marginTop: 6 }}>Method</Text>
      <Text>{draft.selectedMethod?.label ?? 'Not selected'}</Text>
      {draft.pickupLocationId ? <Text>Pickup point: {draft.pickupLocationId}</Text> : null}
      <Text style={{ fontWeight: '700', marginTop: 6 }}>Shipment</Text>
      <Text>Contents: {draft.contents || '-'}</Text>
      <Text>Reference: {draft.reference || '-'}</Text>
      <Text>Value: {draft.value || '-'}</Text>
      <Text style={{ fontWeight: '700', marginTop: 6 }}>Addons</Text>
      <Text>{addons.length ? addons.join(', ') : 'No addons selected'}</Text>
    </SectionCard>
  );
}

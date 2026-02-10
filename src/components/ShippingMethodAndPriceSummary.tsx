import { Text } from 'react-native';
import type { ShipmentDraft } from '../types/models';
import { SideCard } from './SideCard';

export function ShippingMethodAndPriceSummary({ draft }: { draft: ShipmentDraft }) {
  const method = draft.selectedMethod;
  return (
    <SideCard title="Method & Price">
      <Text>Method: {method?.label || 'Not selected'}</Text>
      <Text>Carrier: {method?.carrier || '-'}</Text>
      <Text>ETA: {method?.eta || '-'}</Text>
      <Text>Price: ${method?.price?.toFixed(2) ?? '0.00'}</Text>
      {method?.priceVat0 ? <Text>ex VAT: ${method.priceVat0.toFixed(2)}</Text> : null}
      <Text>Pickup point: {draft.pickupLocationId || '-'}</Text>
    </SideCard>
  );
}

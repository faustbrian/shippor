import type { ShipmentDraft } from '../types/models';
import { View } from 'react-native';
import { AddressesSummary } from './AddressesSummary';
import { ParcelSummary } from './ParcelSummary';
import { ShipmentSummary } from './ShipmentSummary';
import { ShippingMethodAndPriceSummary } from './ShippingMethodAndPriceSummary';

export function ShippingFlowSidePanel({ draft }: { draft: ShipmentDraft }) {
  return (
    <View style={{ gap: 10 }}>
      <AddressesSummary draft={draft} />
      <ParcelSummary draft={draft} />
      <ShipmentSummary draft={draft} />
      <ShippingMethodAndPriceSummary draft={draft} />
    </View>
  );
}

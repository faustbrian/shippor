import type { ShipmentDraft } from '../types/models';
import { SectionCard } from './ui';
import { AddressesSummary } from './AddressesSummary';
import { ParcelSummary } from './ParcelSummary';
import { ShipmentSummary } from './ShipmentSummary';
import { ShippingMethodAndPriceSummary } from './ShippingMethodAndPriceSummary';

export function ShippingFlowSidePanel({ draft }: { draft: ShipmentDraft }) {
  return (
    <SectionCard>
      <AddressesSummary draft={draft} />
      <ParcelSummary draft={draft} />
      <ShipmentSummary draft={draft} />
      <ShippingMethodAndPriceSummary draft={draft} />
    </SectionCard>
  );
}

import { View, Text } from 'react-native';
import { SecondaryButton, SectionCard } from './ui';
import type { ShipmentDraft } from '../types/models';

const templates: { id: string; label: string; apply: (draft: ShipmentDraft) => ShipmentDraft }[] = [
  {
    id: 'doc-us',
    label: 'Documents FI -> US',
    apply: (draft) => ({
      ...draft,
      senderAddress: { ...draft.senderAddress, country: 'FI', type: 'business' },
      recipientAddress: { ...draft.recipientAddress, country: 'US', type: 'private' },
      contents: 'Documents',
      shipmentType: 'documents',
      value: '25',
      reference: 'DOC-TEMPLATE',
      createCommerceProformaInvoice: false,
    }),
  },
  {
    id: 'parcel-domestic',
    label: 'Domestic parcel US -> US',
    apply: (draft) => ({
      ...draft,
      senderAddress: { ...draft.senderAddress, country: 'US', type: 'private' },
      recipientAddress: { ...draft.recipientAddress, country: 'US', type: 'private' },
      contents: 'Retail goods',
      shipmentType: 'parcel',
      value: '75',
      reference: 'DOM-TEMPLATE',
      createCommerceProformaInvoice: false,
    }),
  },
];

export function ConsignmentTemplateCard({
  draft,
  onApply,
}: {
  draft: ShipmentDraft;
  onApply: (draft: ShipmentDraft) => void;
}) {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '700' }}>Consignment templates</Text>
      <View style={{ gap: 8 }}>
        {templates.map((template) => (
          <SecondaryButton key={template.id} label={template.label} onPress={() => onApply(template.apply(draft))} />
        ))}
      </View>
    </SectionCard>
  );
}

import { Text, View } from 'react-native';
import { PrimaryButton, SectionCard } from './ui';
import type { ShipmentDraft } from '../types/models';

const templates = [
  { label: 'Document', weight: 0.5, width: 24, height: 1, length: 33 },
  { label: 'Small Box', weight: 2, width: 30, height: 20, length: 20 },
  { label: 'Medium Box', weight: 5, width: 40, height: 30, length: 25 },
];

export function QuickAddParcelsCard({
  draft,
  onApply,
}: {
  draft: ShipmentDraft;
  onApply: (draft: ShipmentDraft) => void;
}) {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '700' }}>Quick add parcel template</Text>
      <View style={{ gap: 8 }}>
        {templates.map((template) => (
          <PrimaryButton
            key={template.label}
            label={template.label}
            onPress={() => {
              const first = draft.parcels[0];
              onApply({
                ...draft,
                parcels: [
                  {
                    ...first,
                    weight: template.weight,
                    width: template.width,
                    height: template.height,
                    length: template.length,
                    copies: first.copies ?? 1,
                  },
                ],
              });
            }}
          />
        ))}
      </View>
    </SectionCard>
  );
}

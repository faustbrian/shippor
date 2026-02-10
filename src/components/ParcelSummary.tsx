import { Text } from 'react-native';
import type { ShipmentDraft } from '../types/models';
import { SideCard } from './SideCard';

export function ParcelSummary({ draft }: { draft: ShipmentDraft }) {
  return (
    <SideCard title="Parcels">
      {draft.parcels.map((parcel, index) => (
        <Text key={parcel.id}>
          #{index + 1} • {parcel.weight ?? '-'}kg • {parcel.length ?? '-'}x{parcel.width ?? '-'}x{parcel.height ?? '-'} cm • qty {parcel.copies ?? '-'}
        </Text>
      ))}
    </SideCard>
  );
}

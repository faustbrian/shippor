import { View } from 'react-native';
import type { ShipmentDraft } from '../types/models';
import { SideCard } from './SideCard';
import { AddressCard } from './AddressCard';

export function AddressesSummary({ draft }: { draft: ShipmentDraft }) {
  return (
    <SideCard title="Addresses">
      <View style={{ gap: 12 }}>
        <AddressCard label="Sender" address={draft.senderAddress} />
        <AddressCard label="Recipient" address={draft.recipientAddress} />
      </View>
    </SideCard>
  );
}

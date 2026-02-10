import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SectionCard, SecondaryButton } from './ui';
import type { ShipmentRecord } from '../types/models';

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function RecentShipmentsPanel({
  shipments,
  onReorder,
}: {
  shipments: ShipmentRecord[];
  onReorder: (shipment: ShipmentRecord) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!shipments.length) {
    return null;
  }

  return (
    <SectionCard>
      <Pressable onPress={() => setOpen((v) => !v)}>
        <Text style={{ fontWeight: '700' }}>Recent shipments {open ? '▾' : '▸'}</Text>
      </Pressable>
      {open ? (
        <View style={{ gap: 8 }}>
          {shipments.slice(0, 5).map((shipment) => (
            <View
              key={shipment.id}
              style={{ borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 10, padding: 10, backgroundColor: '#fff' }}
            >
              <Text style={{ fontWeight: '700' }}>{shipment.senderName} {'->'} {shipment.recipientName}</Text>
              <Text>{shipment.service}</Text>
              <Text>{formatDate(shipment.createdAt)}</Text>
              <Text>${shipment.price.toFixed(2)}</Text>
              <SecondaryButton label="Reorder" onPress={() => onReorder(shipment)} />
            </View>
          ))}
        </View>
      ) : null}
    </SectionCard>
  );
}

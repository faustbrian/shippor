import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ShippingMethod } from '../types/models';
import { palette, PrimaryButton, SectionCard } from './ui';

function Tag({ text }: { text: string }) {
  return (
    <View style={{ borderRadius: 999, backgroundColor: '#EEF4FF', paddingHorizontal: 10, paddingVertical: 4 }}>
      <Text style={{ color: '#1D4ED8', fontSize: 12, fontWeight: '600' }}>{text}</Text>
    </View>
  );
}

export function ShippingMethodCard({
  method,
  selected,
  onSelect,
  onConfirm,
  isPickup,
}: {
  method: ShippingMethod;
  selected: boolean;
  onSelect: () => void;
  onConfirm: () => void;
  isPickup: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <SectionCard>
      <Pressable onPress={onSelect} style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '800', fontSize: 16 }}>{method.label}</Text>
            <Text style={{ color: '#667085' }}>{method.carrier}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: '800', fontSize: 18 }}>${method.price.toFixed(2)}</Text>
            <Text style={{ color: '#667085' }}>{method.eta}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {isPickup ? <Tag text="Pickup point" /> : <Tag text="Door delivery" />}
          {method.printerRequired ? <Tag text="Printer required" /> : <Tag text="No printer" />}
          {method.isReturnService ? <Tag text="Return service" /> : null}
          {method.serviceId.includes('wolt') ? <Tag text="Same day" /> : null}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: selected ? palette.success : '#667085', fontWeight: '700' }}>
            {selected ? 'Selected' : 'Not selected'}
          </Text>
          <Pressable onPress={() => setExpanded((v) => !v)}>
            <Text style={{ color: palette.blue, fontWeight: '700' }}>{expanded ? 'Hide details' : 'Show details'}</Text>
          </Pressable>
        </View>
      </Pressable>

      {expanded ? (
        <View style={{ borderTopWidth: 1, borderTopColor: '#EAECF0', paddingTop: 10, gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Ionicons name="time-outline" size={16} color="#344054" />
            <Text>Estimated delivery: {method.deliveryTime} days</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Ionicons name="cube-outline" size={16} color="#344054" />
            <Text>Service ID: {method.serviceId}</Text>
          </View>
          <PrimaryButton label="Confirm and continue" onPress={onConfirm} />
        </View>
      ) : null}
    </SectionCard>
  );
}

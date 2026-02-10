import { Text, View } from 'react-native';
import type { ShippingMethod } from '../types/models';
import { SectionCard } from './ui';

export function ShippingMethodInstructionsPanel({ method }: { method: ShippingMethod | null }) {
  if (!method) {
    return null;
  }

  const notes: string[] = [];

  if (method.isPickupLocationMethod) {
    notes.push('Drop off at selected pickup point during opening hours.');
  } else {
    notes.push('Courier delivers to recipient address.');
  }

  if (method.printerRequired) {
    notes.push('Printer required: print transport label before handoff.');
  } else {
    notes.push('No printer required: label can be generated at drop-off.');
  }

  if (method.serviceId.includes('wolt')) {
    notes.push('Same-day service window depends on courier availability.');
  }

  return (
    <SectionCard>
      <Text style={{ fontWeight: '700' }}>Shipping Method Instructions</Text>
      <Text style={{ fontWeight: '600' }}>{method.label}</Text>
      <Text>{method.carrier} • ETA {method.eta}</Text>
      <View style={{ gap: 4, marginTop: 6 }}>
        {notes.map((note) => (
          <Text key={note}>• {note}</Text>
        ))}
      </View>
    </SectionCard>
  );
}

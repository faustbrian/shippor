import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { AppScreen, Heading, SectionCard, ui } from '../../components/ui';
import { buildShipmentStatusSummary } from '../../domain/cart';
import { useAppStore } from '../../store/useAppStore';

export function HomeScreen() {
  const balance = useAppStore((state) => state.dashboardBalance);
  const shipments = useAppStore((state) => state.shipments);

  const summary = useMemo(() => buildShipmentStatusSummary(shipments), [shipments]);

  return (
    <AppScreen>
      <Heading>Home</Heading>
      <SectionCard>
        <Text style={{ fontSize: 14, color: '#667085' }}>Account Balance</Text>
        <Text style={{ fontSize: 34, fontWeight: '800' }}>${balance.toFixed(2)}</Text>
      </SectionCard>
      <SectionCard>
        <Text style={{ fontWeight: '700' }}>Shipment Status</Text>
        <View style={ui.row}>
          <View style={ui.grow}>
            <Text style={ui.muted}>Pending</Text>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>{summary.pending}</Text>
          </View>
          <View style={ui.grow}>
            <Text style={ui.muted}>Out for delivery</Text>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>{summary.outForDelivery}</Text>
          </View>
          <View style={ui.grow}>
            <Text style={ui.muted}>Delivered</Text>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>{summary.delivered}</Text>
          </View>
        </View>
      </SectionCard>
    </AppScreen>
  );
}

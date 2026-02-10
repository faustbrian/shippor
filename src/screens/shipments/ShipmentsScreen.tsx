import { FlatList, Text, View } from 'react-native';
import { AppScreen, Heading, SectionCard } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';

export function ShipmentsScreen() {
  const shipments = useAppStore((state) => state.shipments);

  return (
    <AppScreen>
      <Heading>Shipments</Heading>
      <FlatList
        data={shipments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => {
          return (
            <SectionCard>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: '700' }}>{item.id}</Text>
                <Text>{item.status}</Text>
              </View>
              <Text>{item.senderName} {'->'} {item.recipientName}</Text>
              <Text>Tracking: {item.trackingNumber}</Text>
              <Text>{item.service}</Text>
              <Text style={{ fontWeight: '700' }}>${item.price.toFixed(2)}</Text>
            </SectionCard>
          );
        }}
      />
    </AppScreen>
  );
}

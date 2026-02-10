import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { AppScreen, FieldInput, Heading, PrimaryButton, SectionCard } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';

export function TrackScreen() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const searchTracking = useAppStore((state) => state.searchTracking);
  const events = useAppStore((state) => state.trackingSearchResult);

  return (
    <AppScreen>
      <Heading>Track</Heading>
      <SectionCard>
        <Text style={{ fontWeight: '700' }}>Track shipment</Text>
        <FieldInput
          placeholder="Enter tracking number"
          autoCapitalize="characters"
          value={trackingNumber}
          onChangeText={setTrackingNumber}
        />
        <PrimaryButton label="Track" onPress={() => searchTracking(trackingNumber)} />
      </SectionCard>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SectionCard>
            <Text style={{ fontWeight: '700' }}>{item.trackingNumber}</Text>
            <Text>{item.status}</Text>
            <Text>{item.location}</Text>
            <Text>{new Date(item.timestamp).toLocaleString()}</Text>
          </SectionCard>
        )}
        ListEmptyComponent={
          <View style={{ marginTop: 20 }}>
            <Text>No events found for this tracking number.</Text>
          </View>
        }
      />
    </AppScreen>
  );
}

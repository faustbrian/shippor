import { Text, View } from 'react-native';
import { SecondaryButton, SectionCard } from './ui';

export function DocumentsDownloadFieldset({
  shipmentId,
  trackingNumber,
}: {
  shipmentId: string;
  trackingNumber: string;
}) {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '700' }}>Documents for {shipmentId}</Text>
      <Text style={{ color: '#667085' }}>Tracking: {trackingNumber}</Text>
      <View style={{ gap: 8 }}>
        <SecondaryButton label="Download transport label (PDF)" onPress={() => {}} />
        <SecondaryButton label="Download receipt (PDF)" onPress={() => {}} />
        <SecondaryButton label="Download proforma invoice (PDF)" onPress={() => {}} />
      </View>
    </SectionCard>
  );
}

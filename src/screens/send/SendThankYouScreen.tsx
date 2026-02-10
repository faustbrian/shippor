import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, Heading, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SendStackParamList, 'SendThankYou'>;

export function SendThankYouScreen({ navigation }: Props) {
  const shipments = useAppStore((state) => state.lastCheckoutShipments);

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={7} />
        <Heading>Thank You</Heading>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Shipments sent successfully</Text>
          <Text>Your labels/tracking documents are stubbed in this build.</Text>
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Documents</Text>
          <Text>Transport label PDF: available (stub)</Text>
          <Text>Receipt PDF: available (stub)</Text>
          <Text>Proforma invoice: conditional (stub)</Text>
          <SecondaryButton label="Download transport label" onPress={() => {}} />
          <SecondaryButton label="Download receipt" onPress={() => {}} />
        </SectionCard>

        {shipments.map((shipment) => (
          <SectionCard key={shipment.id}>
            <Text style={{ fontWeight: '700' }}>{shipment.id}</Text>
            <Text>Tracking: {shipment.trackingNumber}</Text>
            <Text>Status: {shipment.status}</Text>
            <Text>Service: {shipment.service}</Text>
          </SectionCard>
        ))}

        <View style={{ gap: 8 }}>
          <PrimaryButton label="Send another shipment" onPress={() => navigation.replace('SendBasic')} />
          <PrimaryButton label="Back to flow start" onPress={() => navigation.navigate('SendBasic')} />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

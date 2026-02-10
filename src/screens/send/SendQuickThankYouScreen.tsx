import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, Heading, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { SendStepHeader } from '../../components/SendStepHeader';

type Props = NativeStackScreenProps<SendStackParamList, 'SendQuickThankYou'>;

export function SendQuickThankYouScreen({ navigation }: Props) {
  const shipments = useAppStore((state) => state.lastCheckoutShipments);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  useEffect(() => {
    if (!shipments.length) {
      navigation.replace('SendQuickStart');
      return;
    }
    const timer = setTimeout(() => setIsLoadingDocs(false), 1200);
    return () => clearTimeout(timer);
  }, [navigation, shipments.length]);

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={7} />
        <Heading>Quick Shipment Sent</Heading>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Transport labels</Text>
          {isLoadingDocs ? (
            <Text>Loading shipment documents...</Text>
          ) : (
            <View style={{ gap: 8 }}>
              {shipments.map((shipment) => (
                <View key={shipment.id} style={{ gap: 4 }}>
                  <Text style={{ fontWeight: '700' }}>{shipment.id}</Text>
                  <Text>Tracking: {shipment.trackingNumber}</Text>
                  <SecondaryButton label="Download label PDF" onPress={() => {}} />
                  <SecondaryButton label="Download receipt PDF" onPress={() => {}} />
                </View>
              ))}
            </View>
          )}
        </SectionCard>

        <PrimaryButton label="Back to send" onPress={() => navigation.replace('SendBasic')} />
      </ScrollView>
    </AppScreen>
  );
}

import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, Heading, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { ThankYouBoxForMultipleCartItems } from '../../components/ThankYouBoxForMultipleCartItems';
import { DocumentsDownloadFieldset } from '../../components/DocumentsDownloadFieldset';
import { ThankYouPageController } from '../../components/ThankYouPageController';

type Props = NativeStackScreenProps<SendStackParamList, 'SendThankYou'>;

export function SendThankYouScreen({ navigation }: Props) {
  const shipments = useAppStore((state) => state.lastCheckoutShipments);
  const checkoutFlowState = useAppStore((state) => state.checkoutFlowState);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

  useEffect(() => {
    if (!shipments.length || checkoutFlowState !== 'shipped') {
      navigation.replace('SendCart');
      return;
    }
    const timer = setTimeout(() => setIsLoadingDocuments(false), 900);
    return () => clearTimeout(timer);
  }, [checkoutFlowState, navigation, shipments.length]);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <SendStepHeader currentStep={7} />
        <Heading>Thank You</Heading>
        <ThankYouPageController>
          <ThankYouBoxForMultipleCartItems shipments={shipments} />
          <SectionCard>
            <Text style={{ fontWeight: '800' }}>Checkout state: {checkoutFlowState}</Text>
            <Text style={{ color: '#667085', fontSize: 12 }}>
              Documents are generated from stubbed APIs in this build.
            </Text>
          </SectionCard>
          {isLoadingDocuments ? (
            <SectionCard>
              <Text style={{ fontWeight: '700' }}>Loading transport documents...</Text>
              <Text style={{ color: '#667085' }}>Fetching shipment metadata and document links.</Text>
            </SectionCard>
          ) : (
            shipments.map((shipment) => (
              <DocumentsDownloadFieldset
                key={shipment.id}
                shipmentId={shipment.id}
                trackingNumber={shipment.trackingNumber}
              />
            ))
          )}

          <View style={{ gap: 8 }}>
            <PrimaryButton label="Send another shipment" onPress={() => navigation.replace('SendBasic')} />
            <SecondaryButton label="Back to flow start" onPress={() => navigation.navigate('SendBasic')} />
          </View>
        </ThankYouPageController>
      </ScrollView>
    </AppScreen>
  );
}

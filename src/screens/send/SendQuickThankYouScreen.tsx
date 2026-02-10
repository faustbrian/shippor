import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, Heading, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ThankYouPageController } from '../../components/ThankYouPageController';
import { ThankYouBoxForMultipleCartItems } from '../../components/ThankYouBoxForMultipleCartItems';
import { DocumentsDownloadFieldset } from '../../components/DocumentsDownloadFieldset';

type Props = NativeStackScreenProps<SendStackParamList, 'SendQuickThankYou'>;

export function SendQuickThankYouScreen({ navigation }: Props) {
  const shipments = useAppStore((state) => state.lastCheckoutShipments);
  const checkoutFlowState = useAppStore((state) => state.checkoutFlowState);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  useEffect(() => {
    if (!shipments.length || checkoutFlowState !== 'shipped') {
      navigation.replace('SendCart');
      return;
    }
    const timer = setTimeout(() => setIsLoadingDocs(false), 1200);
    return () => clearTimeout(timer);
  }, [checkoutFlowState, navigation, shipments.length]);

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={7} />
        <Heading>Quick Shipment Sent</Heading>

        <ThankYouPageController>
          <ThankYouBoxForMultipleCartItems shipments={shipments} />
          <SectionCard>
            <Text style={{ fontWeight: '700' }}>Transport labels</Text>
            {isLoadingDocs ? (
              <Text>Loading shipment documents...</Text>
            ) : (
              <View style={{ gap: 8 }}>
                {shipments.map((shipment) => (
                  <DocumentsDownloadFieldset
                    key={shipment.id}
                    shipmentId={shipment.id}
                    trackingNumber={shipment.trackingNumber}
                  />
                ))}
              </View>
            )}
          </SectionCard>

          <PrimaryButton label="Back to send" onPress={() => navigation.replace('SendBasic')} />
          <SecondaryButton label="Create another quick shipment" onPress={() => navigation.replace('SendQuickStart')} />
        </ThankYouPageController>
      </ScrollView>
    </AppScreen>
  );
}

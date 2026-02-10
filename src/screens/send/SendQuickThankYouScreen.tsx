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
import { fetchDocumentsData } from '../../api/mockApi';
import type { ShipmentDocumentMeta } from '../../types/models';

type Props = NativeStackScreenProps<SendStackParamList, 'SendQuickThankYou'>;

export function SendQuickThankYouScreen({ navigation }: Props) {
  const shipments = useAppStore((state) => state.lastCheckoutShipments);
  const checkoutFlowState = useAppStore((state) => state.checkoutFlowState);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [documentsMeta, setDocumentsMeta] = useState<ShipmentDocumentMeta[]>([]);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  useEffect(() => {
    if (!shipments.length || checkoutFlowState !== 'shipped') {
      navigation.replace('SendCart');
      return;
    }
    setIsLoadingDocs(true);
    setDocumentsError(null);
    void fetchDocumentsData(shipments.map((shipment) => shipment.id))
      .then((meta) => {
        setDocumentsMeta(meta);
        setIsLoadingDocs(false);
      })
      .catch(() => {
        setDocumentsError('Failed to load transport documents');
        setIsLoadingDocs(false);
      });
  }, [checkoutFlowState, navigation, shipments.length]);

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={7} />
        <Heading>Quick Shipment Sent</Heading>

        <ThankYouPageController
          isLoadingDocuments={isLoadingDocs}
          hasDocumentsError={Boolean(documentsError)}
          documentsCount={documentsMeta.reduce((sum, item) => sum + item.documents.length, 0)}
        >
          <ThankYouBoxForMultipleCartItems shipments={shipments} />
          <SectionCard>
            <Text style={{ fontWeight: '700' }}>Transport labels</Text>
            {isLoadingDocs ? (
              <Text>Loading shipment documents...</Text>
            ) : documentsError ? (
              <Text style={{ color: '#D92D20' }}>{documentsError}</Text>
            ) : (
              <View style={{ gap: 8 }}>
                {documentsMeta.map((shipment) => (
                  <DocumentsDownloadFieldset
                    key={shipment.shipmentId}
                    shipmentId={shipment.shipmentId}
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

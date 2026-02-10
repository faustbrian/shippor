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
import { fetchDocumentsData } from '../../api/mockApi';
import type { ShipmentDocumentMeta } from '../../types/models';

type Props = NativeStackScreenProps<SendStackParamList, 'SendThankYou'>;

export function SendThankYouScreen({ navigation }: Props) {
  const shipments = useAppStore((state) => state.lastCheckoutShipments);
  const checkoutFlowState = useAppStore((state) => state.checkoutFlowState);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [documentsMeta, setDocumentsMeta] = useState<ShipmentDocumentMeta[]>([]);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  useEffect(() => {
    if (!shipments.length || checkoutFlowState !== 'shipped') {
      navigation.replace('SendCart');
      return;
    }
    setIsLoadingDocuments(true);
    setDocumentsError(null);
    void fetchDocumentsData(shipments.map((shipment) => shipment.id))
      .then((meta) => {
        setDocumentsMeta(meta);
        setIsLoadingDocuments(false);
      })
      .catch(() => {
        setDocumentsError('Failed to load transport documents');
        setIsLoadingDocuments(false);
      });
  }, [checkoutFlowState, navigation, shipments.length]);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <SendStepHeader currentStep={7} />
        <Heading>Thank You</Heading>
        <ThankYouPageController
          isLoadingDocuments={isLoadingDocuments}
          hasDocumentsError={Boolean(documentsError)}
          documentsCount={documentsMeta.reduce((sum, item) => sum + item.documents.length, 0)}
        >
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
          ) : documentsError ? (
            <SectionCard>
              <Text style={{ color: '#D92D20', fontWeight: '700' }}>{documentsError}</Text>
            </SectionCard>
          ) : (
            documentsMeta.map((shipment) => (
              <DocumentsDownloadFieldset
                key={shipment.shipmentId}
                shipmentId={shipment.shipmentId}
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

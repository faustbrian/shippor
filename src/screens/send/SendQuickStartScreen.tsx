import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { AppScreen, FieldInput, Heading, Label, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';

type Props = NativeStackScreenProps<SendStackParamList, 'SendQuickStart'>;

export function SendQuickStartScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const setDraft = useAppStore((state) => state.setDraft);
  const updateAddressField = useAppStore((state) => state.updateAddressField);
  const loadShippingMethods = useAppStore((state) => state.loadShippingMethods);
  const methods = useAppStore((state) => state.shippingMethods);
  const submitQuickShipment = useAppStore((state) => state.submitQuickShipment);
  const isBusy = useAppStore((state) => state.isBusy);

  useEffect(() => {
    void loadShippingMethods();
  }, [loadShippingMethods]);

  const sendQuick = async () => {
    const ok = await submitQuickShipment();
    if (ok) {
      navigation.replace('SendQuickThankYou');
    }
  };

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={1} />
        <Heading>Quick Shipping Tool</Heading>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Addresses</Text>
          <Label>Sender name</Label>
          <FieldInput value={draft.senderAddress.name} onChangeText={(v) => updateAddressField('sender', 'name', v)} />
          <Label>Sender city</Label>
          <FieldInput value={draft.senderAddress.city} onChangeText={(v) => updateAddressField('sender', 'city', v)} />
          <Label>Recipient name</Label>
          <FieldInput value={draft.recipientAddress.name} onChangeText={(v) => updateAddressField('recipient', 'name', v)} />
          <Label>Recipient city</Label>
          <FieldInput value={draft.recipientAddress.city} onChangeText={(v) => updateAddressField('recipient', 'city', v)} />
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Parcel quick setup</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SecondaryButton
              label="Envelope"
              onPress={() =>
                setDraft({
                  ...draft,
                  parcels: [{ ...draft.parcels[0], weight: 0.2, width: 24, height: 1, length: 33, copies: 1 }],
                  contents: 'Documents',
                  shipmentType: 'documents',
                  value: '25',
                  reference: draft.reference || 'QUICK-ENV',
                })
              }
            />
            <SecondaryButton
              label="Small box"
              onPress={() =>
                setDraft({
                  ...draft,
                  parcels: [{ ...draft.parcels[0], weight: 2, width: 30, height: 20, length: 20, copies: 1 }],
                  contents: 'Goods',
                  shipmentType: 'parcel',
                  value: '75',
                  reference: draft.reference || 'QUICK-BOX',
                })
              }
            />
          </View>
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Shipping method</Text>
          {methods.map((method) => (
            <SecondaryButton
              key={method.id}
              label={`${method.label} $${method.price.toFixed(2)}`}
              onPress={() => setDraft({ ...draft, selectedMethod: method })}
            />
          ))}
          <Text>Selected: {draft.selectedMethod?.label ?? 'None'}</Text>
        </SectionCard>

        <PrimaryButton label="Send Quick Shipment" onPress={sendQuick} loading={isBusy} />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}

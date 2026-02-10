import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { AppScreen, FieldInput, Heading, Label, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import type { Address } from '../../types/models';
import { fetchAddressSuggestions } from '../../api/mockApi';

type Props = NativeStackScreenProps<SendStackParamList, 'SendQuickStart'>;

export function SendQuickStartScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const setDraft = useAppStore((state) => state.setDraft);
  const updateAddressField = useAppStore((state) => state.updateAddressField);
  const loadShippingMethods = useAppStore((state) => state.loadShippingMethods);
  const methods = useAppStore((state) => state.shippingMethods);
  const submitQuickShipment = useAppStore((state) => state.submitQuickShipment);
  const isBusy = useAppStore((state) => state.isBusy);
  const replaceDraftAddress = useAppStore((state) => state.replaceDraftAddress);
  const [senderQuickSearch, setSenderQuickSearch] = useState('');
  const [recipientQuickSearch, setRecipientQuickSearch] = useState('');
  const [senderSuggestions, setSenderSuggestions] = useState<Address[]>([]);
  const [recipientSuggestions, setRecipientSuggestions] = useState<Address[]>([]);

  useEffect(() => {
    void loadShippingMethods();
  }, [loadShippingMethods]);

  const normalize = (value: string) => value.replace(/\s+/g, '');

  const runQuickSearch = async (role: 'sender' | 'recipient', typedValue: string) => {
    const country = role === 'sender' ? draft.senderAddress.country : draft.recipientAddress.country;
    const suggestions = await fetchAddressSuggestions(typedValue, country);

    if (suggestions.length === 1) {
      replaceDraftAddress(role, suggestions[0]);
      if (role === 'sender') {
        setSenderSuggestions([]);
      } else {
        setRecipientSuggestions([]);
      }
      return;
    }

    if (
      suggestions.length > 1 &&
      normalize(suggestions[0].postalCode.toLowerCase()) === normalize(typedValue.toLowerCase())
    ) {
      replaceDraftAddress(role, suggestions[0]);
      if (role === 'sender') {
        setSenderSuggestions([]);
      } else {
        setRecipientSuggestions([]);
      }
      return;
    }

    if (role === 'sender') {
      setSenderSuggestions(suggestions);
    } else {
      setRecipientSuggestions(suggestions);
    }
  };

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
          <Label>Sender quick search</Label>
          <FieldInput
            value={senderQuickSearch}
            onChangeText={(value) => {
              setSenderQuickSearch(value);
              void runQuickSearch('sender', value);
            }}
            placeholder="Sender postal/street/city"
          />
          {senderSuggestions.map((entry) => (
            <SecondaryButton
              key={`quick-sender-${entry.id}`}
              label={`${entry.postalCode} ${entry.street}, ${entry.city}`}
              onPress={() => {
                replaceDraftAddress('sender', entry);
                setSenderSuggestions([]);
                setSenderQuickSearch(entry.postalCode);
              }}
            />
          ))}
          <Label>Sender name</Label>
          <FieldInput value={draft.senderAddress.name} onChangeText={(v) => updateAddressField('sender', 'name', v)} />
          <Label>Sender city</Label>
          <FieldInput value={draft.senderAddress.city} onChangeText={(v) => updateAddressField('sender', 'city', v)} />
          <Label>Recipient quick search</Label>
          <FieldInput
            value={recipientQuickSearch}
            onChangeText={(value) => {
              setRecipientQuickSearch(value);
              void runQuickSearch('recipient', value);
            }}
            placeholder="Recipient postal/street/city"
          />
          {recipientSuggestions.map((entry) => (
            <SecondaryButton
              key={`quick-recipient-${entry.id}`}
              label={`${entry.postalCode} ${entry.street}, ${entry.city}`}
              onPress={() => {
                replaceDraftAddress('recipient', entry);
                setRecipientSuggestions([]);
                setRecipientQuickSearch(entry.postalCode);
              }}
            />
          ))}
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

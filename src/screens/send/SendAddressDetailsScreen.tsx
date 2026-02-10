import { ScrollView, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { AppScreen, ErrorText, FieldInput, Heading, Label, PrimaryButton, SectionCard } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { validateStepAddressDetails } from '../../domain/shipmentValidation';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SendStackParamList, 'SendAddressDetails'>;

export function SendAddressDetailsScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const updateAddressField = useAppStore((state) => state.updateAddressField);
  const [errors, setErrors] = useState<ReturnType<typeof validateStepAddressDetails> | null>(null);

  const next = () => {
    const result = validateStepAddressDetails(draft);
    setErrors(result);

    if (!result.senderAddress && !result.recipientAddress) {
      navigation.navigate('SendShipmentDetails');
    }
  };

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={2} />
        <Heading>Send - Address details</Heading>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Sender details</Text>
          <Label>Name</Label>
          <FieldInput value={draft.senderAddress.name} onChangeText={(v) => updateAddressField('sender', 'name', v)} />
          <ErrorText text={errors?.senderAddress?.name} />
          <Label>Email</Label>
          <FieldInput value={draft.senderAddress.email} onChangeText={(v) => updateAddressField('sender', 'email', v)} autoCapitalize="none" />
          <Label>Phone</Label>
          <FieldInput value={draft.senderAddress.phone} onChangeText={(v) => updateAddressField('sender', 'phone', v)} />
          <Label>Street</Label>
          <FieldInput value={draft.senderAddress.street} onChangeText={(v) => updateAddressField('sender', 'street', v)} />
          <Label>City</Label>
          <FieldInput value={draft.senderAddress.city} onChangeText={(v) => updateAddressField('sender', 'city', v)} />
          <Label>Postal code</Label>
          <FieldInput value={draft.senderAddress.postalCode} onChangeText={(v) => updateAddressField('sender', 'postalCode', v)} />
          <ErrorText text={errors?.senderAddress?.postalCode} />
          <Label>Country</Label>
          <FieldInput value={draft.senderAddress.country} onChangeText={(v) => updateAddressField('sender', 'country', v)} autoCapitalize="characters" />
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Recipient details</Text>
          <Label>Name</Label>
          <FieldInput value={draft.recipientAddress.name} onChangeText={(v) => updateAddressField('recipient', 'name', v)} />
          <ErrorText text={errors?.recipientAddress?.name} />
          <Label>Email</Label>
          <FieldInput value={draft.recipientAddress.email} onChangeText={(v) => updateAddressField('recipient', 'email', v)} autoCapitalize="none" />
          <Label>Phone</Label>
          <FieldInput value={draft.recipientAddress.phone} onChangeText={(v) => updateAddressField('recipient', 'phone', v)} />
          <Label>Street</Label>
          <FieldInput value={draft.recipientAddress.street} onChangeText={(v) => updateAddressField('recipient', 'street', v)} />
          <Label>City</Label>
          <FieldInput value={draft.recipientAddress.city} onChangeText={(v) => updateAddressField('recipient', 'city', v)} />
          <Label>Postal code</Label>
          <FieldInput value={draft.recipientAddress.postalCode} onChangeText={(v) => updateAddressField('recipient', 'postalCode', v)} />
          <Label>Country</Label>
          <FieldInput value={draft.recipientAddress.country} onChangeText={(v) => updateAddressField('recipient', 'country', v)} autoCapitalize="characters" />
        </SectionCard>

        <PrimaryButton label="Next: Shipment details" onPress={next} />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}

import { ScrollView, Switch, Text, View } from 'react-native';
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
  const setDraft = useAppStore((state) => state.setDraft);
  const updateAddressField = useAppStore((state) => state.updateAddressField);
  const [errors, setErrors] = useState<ReturnType<typeof validateStepAddressDetails> | null>(null);
  const isInternational = draft.senderAddress.country !== draft.recipientAddress.country;

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
          {draft.senderAddress.type === 'business' ? (
            <>
              <Label>Organization</Label>
              <FieldInput value={draft.senderAddress.organization ?? ''} onChangeText={(v) => updateAddressField('sender', 'organization', v)} />
              <ErrorText text={errors?.senderAddress?.organization} />
            </>
          ) : (
            <>
              <Label>Name</Label>
              <FieldInput value={draft.senderAddress.name} onChangeText={(v) => updateAddressField('sender', 'name', v)} />
              <ErrorText text={errors?.senderAddress?.name} />
            </>
          )}
          <Label>Email</Label>
          <FieldInput value={draft.senderAddress.email} onChangeText={(v) => updateAddressField('sender', 'email', v)} autoCapitalize="none" />
          <ErrorText text={errors?.senderAddress?.email} />
          <Label>Phone</Label>
          <FieldInput value={draft.senderAddress.phone} onChangeText={(v) => updateAddressField('sender', 'phone', v)} />
          <ErrorText text={errors?.senderAddress?.phone} />
          <Label>Street</Label>
          <FieldInput value={draft.senderAddress.street} onChangeText={(v) => updateAddressField('sender', 'street', v)} />
          <ErrorText text={errors?.senderAddress?.street} />
          <Label>Street line 2</Label>
          <FieldInput value={draft.senderAddress.street2 ?? ''} onChangeText={(v) => updateAddressField('sender', 'street2', v)} />
          <Label>City</Label>
          <FieldInput value={draft.senderAddress.city} onChangeText={(v) => updateAddressField('sender', 'city', v)} />
          <ErrorText text={errors?.senderAddress?.city} />
          <Label>State / Region</Label>
          <FieldInput value={draft.senderAddress.state ?? ''} onChangeText={(v) => updateAddressField('sender', 'state', v)} />
          <ErrorText text={errors?.senderAddress?.state} />
          <Label>Postal code</Label>
          <FieldInput value={draft.senderAddress.postalCode} onChangeText={(v) => updateAddressField('sender', 'postalCode', v)} />
          <ErrorText text={errors?.senderAddress?.postalCode} />
          <Label>Country</Label>
          <FieldInput value={draft.senderAddress.country} onChangeText={(v) => updateAddressField('sender', 'country', v)} autoCapitalize="characters" />
          <ErrorText text={errors?.senderAddress?.country} />
          {isInternational ? (
            <>
              <Label>VAT number</Label>
              <FieldInput value={draft.senderAddress.vatNumber ?? ''} onChangeText={(v) => updateAddressField('sender', 'vatNumber', v)} />
              <ErrorText text={errors?.senderAddress?.vatNumber} />
            </>
          ) : null}
          {draft.senderAddress.type === 'business' ? (
            <>
              <Label>EORI</Label>
              <FieldInput value={draft.senderAddress.eori ?? ''} onChangeText={(v) => updateAddressField('sender', 'eori', v)} />
              <ErrorText text={errors?.senderAddress?.eori} />
            </>
          ) : null}
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Recipient details</Text>
          {draft.recipientAddress.type === 'business' ? (
            <>
              <Label>Organization</Label>
              <FieldInput value={draft.recipientAddress.organization ?? ''} onChangeText={(v) => updateAddressField('recipient', 'organization', v)} />
              <ErrorText text={errors?.recipientAddress?.organization} />
            </>
          ) : (
            <>
              <Label>Name</Label>
              <FieldInput value={draft.recipientAddress.name} onChangeText={(v) => updateAddressField('recipient', 'name', v)} />
              <ErrorText text={errors?.recipientAddress?.name} />
            </>
          )}
          <Label>Email</Label>
          <FieldInput value={draft.recipientAddress.email} onChangeText={(v) => updateAddressField('recipient', 'email', v)} autoCapitalize="none" />
          <ErrorText text={errors?.recipientAddress?.email} />
          <Label>Phone</Label>
          <FieldInput value={draft.recipientAddress.phone} onChangeText={(v) => updateAddressField('recipient', 'phone', v)} />
          <ErrorText text={errors?.recipientAddress?.phone} />
          <Label>Street</Label>
          <FieldInput value={draft.recipientAddress.street} onChangeText={(v) => updateAddressField('recipient', 'street', v)} />
          <ErrorText text={errors?.recipientAddress?.street} />
          <Label>Street line 2</Label>
          <FieldInput value={draft.recipientAddress.street2 ?? ''} onChangeText={(v) => updateAddressField('recipient', 'street2', v)} />
          <Label>City</Label>
          <FieldInput value={draft.recipientAddress.city} onChangeText={(v) => updateAddressField('recipient', 'city', v)} />
          <ErrorText text={errors?.recipientAddress?.city} />
          <Label>State / Region</Label>
          <FieldInput value={draft.recipientAddress.state ?? ''} onChangeText={(v) => updateAddressField('recipient', 'state', v)} />
          <ErrorText text={errors?.recipientAddress?.state} />
          <Label>Postal code</Label>
          <FieldInput value={draft.recipientAddress.postalCode} onChangeText={(v) => updateAddressField('recipient', 'postalCode', v)} />
          <ErrorText text={errors?.recipientAddress?.postalCode} />
          <Label>Country</Label>
          <FieldInput value={draft.recipientAddress.country} onChangeText={(v) => updateAddressField('recipient', 'country', v)} autoCapitalize="characters" />
          <ErrorText text={errors?.recipientAddress?.country} />
          {isInternational ? (
            <>
              <Label>VAT number</Label>
              <FieldInput value={draft.recipientAddress.vatNumber ?? ''} onChangeText={(v) => updateAddressField('recipient', 'vatNumber', v)} />
              <ErrorText text={errors?.recipientAddress?.vatNumber} />
            </>
          ) : null}
          {draft.recipientAddress.type === 'business' ? (
            <>
              <Label>EORI</Label>
              <FieldInput value={draft.recipientAddress.eori ?? ''} onChangeText={(v) => updateAddressField('recipient', 'eori', v)} />
              <ErrorText text={errors?.recipientAddress?.eori} />
            </>
          ) : null}
        </SectionCard>
        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Delivery instructions</Text>
          <Label>Delivery note</Label>
          <FieldInput
            value={draft.instructions ?? ''}
            onChangeText={(value) => setDraft({ ...draft, instructions: value })}
            placeholder="Door code, preferred times, etc."
          />
          <Label>Pickup note</Label>
          <FieldInput
            value={draft.instructionsPickUp ?? ''}
            onChangeText={(value) => setDraft({ ...draft, instructionsPickUp: value })}
            placeholder="Pickup handling notes"
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Return freight doc</Text>
            <Switch
              value={draft.returnFreightDoc}
              onValueChange={(value) => setDraft({ ...draft, returnFreightDoc: value })}
            />
          </View>
        </SectionCard>

        <PrimaryButton label="Next: Shipment details" onPress={next} />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}

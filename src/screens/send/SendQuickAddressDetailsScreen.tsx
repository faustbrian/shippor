import { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, FieldInput, Heading, Label, PrimaryButton, SectionCard } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { hasQuickHomeErrors } from '../../domain/quickFlow';
import { validateStepAddressDetails } from '../../domain/shipmentValidation';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { showAddressLine2Field, showPostalCodeField, showStateField } from '../../utils/addressRules';
import { SubmitAndBackButtons } from '../../components/SubmitAndBackButtons';

type Props = NativeStackScreenProps<SendStackParamList, 'SendQuickAddressDetails'>;

export function SendQuickAddressDetailsScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const setDraft = useAppStore((state) => state.setDraft);
  const updateAddressField = useAppStore((state) => state.updateAddressField);
  const [errors, setErrors] = useState<ReturnType<typeof validateStepAddressDetails> | null>(null);
  const showSenderState = showStateField(draft.senderAddress.country);
  const showRecipientState = showStateField(draft.recipientAddress.country);
  const showSenderPostal = showPostalCodeField(draft.senderAddress.country);
  const showRecipientPostal = showPostalCodeField(draft.recipientAddress.country);
  const showSenderAddressLine2 = showAddressLine2Field(draft.senderAddress.country);
  const showRecipientAddressLine2 = showAddressLine2Field(draft.recipientAddress.country);

  useEffect(() => {
    if (hasQuickHomeErrors(draft)) {
      navigation.replace('SendQuickStart');
    }
  }, [draft, navigation]);

  const next = () => {
    const result = validateStepAddressDetails(draft);
    setErrors(result);
    if (!result.senderAddress && !result.recipientAddress) {
      navigation.navigate('SendQuickShipmentDetails');
    }
  };

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={2} />
        <Heading>Quick Shipping - Address details</Heading>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Sender details</Text>
          <Label>Name</Label>
          <FieldInput value={draft.senderAddress.name} onChangeText={(v) => updateAddressField('sender', 'name', v)} />
          <ErrorText text={errors?.senderAddress?.name} />
          <Label>Email</Label>
          <FieldInput value={draft.senderAddress.email} onChangeText={(v) => updateAddressField('sender', 'email', v)} autoCapitalize="none" />
          <ErrorText text={errors?.senderAddress?.email} />
          <Label>Phone</Label>
          <FieldInput value={draft.senderAddress.phone} onChangeText={(v) => updateAddressField('sender', 'phone', v)} placeholder="+15551234567" />
          <ErrorText text={errors?.senderAddress?.phone} />
          <Label>Street</Label>
          <FieldInput value={draft.senderAddress.street} onChangeText={(v) => updateAddressField('sender', 'street', v)} />
          <ErrorText text={errors?.senderAddress?.street} />
          {showSenderAddressLine2 ? (
            <>
              <Label>Street line 2</Label>
              <FieldInput value={draft.senderAddress.street2 ?? ''} onChangeText={(v) => updateAddressField('sender', 'street2', v)} />
            </>
          ) : null}
          <Label>City</Label>
          <FieldInput value={draft.senderAddress.city} onChangeText={(v) => updateAddressField('sender', 'city', v)} />
          <ErrorText text={errors?.senderAddress?.city} />
          {showSenderState ? (
            <>
              <Label>State / Region</Label>
              <FieldInput value={draft.senderAddress.state ?? ''} onChangeText={(v) => updateAddressField('sender', 'state', v)} />
              <ErrorText text={errors?.senderAddress?.state} />
            </>
          ) : null}
          {showSenderPostal ? (
            <>
              <Label>Postal code</Label>
              <FieldInput value={draft.senderAddress.postalCode} onChangeText={(v) => updateAddressField('sender', 'postalCode', v)} />
              <ErrorText text={errors?.senderAddress?.postalCode} />
            </>
          ) : null}
          <Label>Country</Label>
          <FieldInput value={draft.senderAddress.country} onChangeText={(v) => updateAddressField('sender', 'country', v)} autoCapitalize="characters" />
          <Label>VAT Tax ID type</Label>
          <FieldInput value={draft.senderAddress.vatTaxIdType ?? ''} onChangeText={(v) => updateAddressField('sender', 'vatTaxIdType', v)} placeholder="VAT / EORI / OSS / IOSS" />
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Recipient details</Text>
          <Label>Name</Label>
          <FieldInput value={draft.recipientAddress.name} onChangeText={(v) => updateAddressField('recipient', 'name', v)} />
          <ErrorText text={errors?.recipientAddress?.name} />
          <Label>Email</Label>
          <FieldInput value={draft.recipientAddress.email} onChangeText={(v) => updateAddressField('recipient', 'email', v)} autoCapitalize="none" />
          <ErrorText text={errors?.recipientAddress?.email} />
          <Label>Phone</Label>
          <FieldInput value={draft.recipientAddress.phone} onChangeText={(v) => updateAddressField('recipient', 'phone', v)} placeholder="+15551234567" />
          <ErrorText text={errors?.recipientAddress?.phone} />
          <Label>Street</Label>
          <FieldInput value={draft.recipientAddress.street} onChangeText={(v) => updateAddressField('recipient', 'street', v)} />
          <ErrorText text={errors?.recipientAddress?.street} />
          {showRecipientAddressLine2 ? (
            <>
              <Label>Street line 2</Label>
              <FieldInput value={draft.recipientAddress.street2 ?? ''} onChangeText={(v) => updateAddressField('recipient', 'street2', v)} />
            </>
          ) : null}
          <Label>City</Label>
          <FieldInput value={draft.recipientAddress.city} onChangeText={(v) => updateAddressField('recipient', 'city', v)} />
          <ErrorText text={errors?.recipientAddress?.city} />
          {showRecipientState ? (
            <>
              <Label>State / Region</Label>
              <FieldInput value={draft.recipientAddress.state ?? ''} onChangeText={(v) => updateAddressField('recipient', 'state', v)} />
              <ErrorText text={errors?.recipientAddress?.state} />
            </>
          ) : null}
          {showRecipientPostal ? (
            <>
              <Label>Postal code</Label>
              <FieldInput value={draft.recipientAddress.postalCode} onChangeText={(v) => updateAddressField('recipient', 'postalCode', v)} />
              <ErrorText text={errors?.recipientAddress?.postalCode} />
            </>
          ) : null}
          <Label>Country</Label>
          <FieldInput value={draft.recipientAddress.country} onChangeText={(v) => updateAddressField('recipient', 'country', v)} autoCapitalize="characters" />
          <Label>VAT Tax ID type</Label>
          <FieldInput value={draft.recipientAddress.vatTaxIdType ?? ''} onChangeText={(v) => updateAddressField('recipient', 'vatTaxIdType', v)} placeholder="VAT / EORI / OSS / IOSS" />
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Paying party and paying address</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <PrimaryButton label="Sender pays" onPress={() => setDraft({ ...draft, payingParty: 'sender', payingAddress: { ...draft.senderAddress } })} />
            <PrimaryButton label="Recipient pays" onPress={() => setDraft({ ...draft, payingParty: 'recipient', payingAddress: { ...draft.recipientAddress } })} />
            <PrimaryButton label="Third-party pays" onPress={() => setDraft({ ...draft, payingParty: 'third-party' })} />
          </View>
          <Text style={{ color: '#475467' }}>Current payer: {draft.payingParty}</Text>
          {draft.payingParty === 'third-party' ? (
            <View style={{ gap: 6 }}>
              <Label>Third-party name</Label>
              <FieldInput value={draft.payingAddress.name} onChangeText={(v) => setDraft({ ...draft, payingAddress: { ...draft.payingAddress, name: v } })} />
              <Label>Third-party street</Label>
              <FieldInput value={draft.payingAddress.street} onChangeText={(v) => setDraft({ ...draft, payingAddress: { ...draft.payingAddress, street: v } })} />
              <Label>Third-party city</Label>
              <FieldInput value={draft.payingAddress.city} onChangeText={(v) => setDraft({ ...draft, payingAddress: { ...draft.payingAddress, city: v } })} />
              <Label>Third-party country</Label>
              <FieldInput value={draft.payingAddress.country} onChangeText={(v) => setDraft({ ...draft, payingAddress: { ...draft.payingAddress, country: v } })} />
            </View>
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

        <SubmitAndBackButtons
          continueLabel="Continue to shipment details"
          onContinue={next}
          onBack={() => navigation.goBack()}
        />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}

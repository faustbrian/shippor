import { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, FieldInput, Heading, Label, PrimaryButton, SectionCard } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { hasQuickHomeErrors } from '../../domain/quickFlow';
import { validateStepAddressDetails, validateStepBasic } from '../../domain/shipmentValidation';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { SubmitAndBackButtons } from '../../components/SubmitAndBackButtons';
import { AddressDetailsFieldset } from '../../components/AddressDetailsFieldset';

type Props = NativeStackScreenProps<SendStackParamList, 'SendQuickAddressDetails'>;

export function SendQuickAddressDetailsScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const setDraft = useAppStore((state) => state.setDraft);
  const updateAddressField = useAppStore((state) => state.updateAddressField);
  const [errors, setErrors] = useState<ReturnType<typeof validateStepAddressDetails> | null>(null);
  const showPayerRelation = draft.businessEntityId === 3;

  useEffect(() => {
    if (hasQuickHomeErrors(draft)) {
      navigation.replace('SendQuickStart');
    }
    const basic = validateStepBasic(draft);
    const hasBasicErrors =
      Object.keys(basic.senderAddress).length > 0 ||
      Object.keys(basic.recipientAddress).length > 0 ||
      Object.keys(basic.parcels).length > 0;
    if (hasBasicErrors) {
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
          <AddressDetailsFieldset
            role="sender"
            title="Sender details"
            draft={draft}
            address={draft.senderAddress}
            errors={errors?.senderAddress}
            onChangeField={(field, value) => updateAddressField('sender', field, value)}
            showPayerRelation={showPayerRelation}
          />
        </SectionCard>

        <SectionCard>
          <AddressDetailsFieldset
            role="recipient"
            title="Recipient details"
            draft={draft}
            address={draft.recipientAddress}
            errors={errors?.recipientAddress}
            onChangeField={(field, value) => updateAddressField('recipient', field, value)}
          />
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

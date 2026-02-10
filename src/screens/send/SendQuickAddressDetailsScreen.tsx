import { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, FieldInput, Heading, Label, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { hasQuickHomeErrors } from '../../domain/quickFlow';
import { validateStepAddressDetails } from '../../domain/shipmentValidation';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SendStackParamList, 'SendQuickAddressDetails'>;

export function SendQuickAddressDetailsScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const setDraft = useAppStore((state) => state.setDraft);
  const updateAddressField = useAppStore((state) => state.updateAddressField);
  const [errors, setErrors] = useState<ReturnType<typeof validateStepAddressDetails> | null>(null);

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
          <FieldInput value={draft.senderAddress.phone} onChangeText={(v) => updateAddressField('sender', 'phone', v)} />
          <ErrorText text={errors?.senderAddress?.phone} />
          <Label>Street</Label>
          <FieldInput value={draft.senderAddress.street} onChangeText={(v) => updateAddressField('sender', 'street', v)} />
          <ErrorText text={errors?.senderAddress?.street} />
          <Label>City</Label>
          <FieldInput value={draft.senderAddress.city} onChangeText={(v) => updateAddressField('sender', 'city', v)} />
          <ErrorText text={errors?.senderAddress?.city} />
          <Label>Postal code</Label>
          <FieldInput value={draft.senderAddress.postalCode} onChangeText={(v) => updateAddressField('sender', 'postalCode', v)} />
          <ErrorText text={errors?.senderAddress?.postalCode} />
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
          <FieldInput value={draft.recipientAddress.phone} onChangeText={(v) => updateAddressField('recipient', 'phone', v)} />
          <ErrorText text={errors?.recipientAddress?.phone} />
          <Label>Street</Label>
          <FieldInput value={draft.recipientAddress.street} onChangeText={(v) => updateAddressField('recipient', 'street', v)} />
          <ErrorText text={errors?.recipientAddress?.street} />
          <Label>City</Label>
          <FieldInput value={draft.recipientAddress.city} onChangeText={(v) => updateAddressField('recipient', 'city', v)} />
          <ErrorText text={errors?.recipientAddress?.city} />
          <Label>Postal code</Label>
          <FieldInput value={draft.recipientAddress.postalCode} onChangeText={(v) => updateAddressField('recipient', 'postalCode', v)} />
          <ErrorText text={errors?.recipientAddress?.postalCode} />
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

        <PrimaryButton label="Continue to shipment details" onPress={next} />
        <SecondaryButton label="Back to quick start" onPress={() => navigation.goBack()} />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}

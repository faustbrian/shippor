import { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, FieldInput, Heading, Label, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { BackAndTryAgainCard } from '../../components/BackAndTryAgainCard';
import { hasQuickAddressErrors, hasQuickHomeErrors } from '../../domain/quickFlow';
import { validateStepShipmentDetails } from '../../domain/shipmentValidation';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SendStackParamList, 'SendQuickShipmentDetails'>;

export function SendQuickShipmentDetailsScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const setDraft = useAppStore((state) => state.setDraft);
  const updateDraftField = useAppStore((state) => state.updateDraftField);
  const submitQuickShipment = useAppStore((state) => state.submitQuickShipment);
  const checkoutError = useAppStore((state) => state.checkoutError);
  const isBusy = useAppStore((state) => state.isBusy);
  const [errors, setErrors] = useState<ReturnType<typeof validateStepShipmentDetails> | null>(null);

  useEffect(() => {
    if (hasQuickHomeErrors(draft)) {
      navigation.replace('SendQuickStart');
      return;
    }
    if (hasQuickAddressErrors(draft)) {
      navigation.replace('SendQuickAddressDetails');
    }
  }, [draft, navigation]);

  const sendQuick = async () => {
    const result = validateStepShipmentDetails(draft);
    setErrors(result);
    if (Object.keys(result).length > 0) {
      return;
    }

    const ok = await submitQuickShipment();
    if (ok) {
      navigation.replace('SendQuickThankYou');
    }
  };

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={3} />
        <Heading>Quick Shipping - Shipment details</Heading>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Shipment details</Text>
          <Label>Contents</Label>
          <FieldInput value={draft.contents} onChangeText={(v) => updateDraftField('contents', v)} />
          <ErrorText text={errors?.contents} />
          <Label>Shipment type</Label>
          <FieldInput value={draft.shipmentType} onChangeText={(v) => updateDraftField('shipmentType', v)} placeholder="parcel, documents..." />
          <ErrorText text={errors?.shipmentType} />
          <Label>Declared value</Label>
          <FieldInput value={draft.value} onChangeText={(v) => updateDraftField('value', v)} keyboardType="numeric" />
          <ErrorText text={errors?.value} />
          <Label>Reference</Label>
          <FieldInput value={draft.reference} onChangeText={(v) => updateDraftField('reference', v)} />
          <ErrorText text={errors?.reference} />
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Commercial / proforma invoice</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SecondaryButton label="I already have it" onPress={() => updateDraftField('createCommerceProformaInvoice', false)} />
            <SecondaryButton label="Create now" onPress={() => updateDraftField('createCommerceProformaInvoice', true)} />
          </View>
          <ErrorText text={errors?.createCommerceProformaInvoice} />
          {draft.createCommerceProformaInvoice ? (
            <Text style={{ color: '#667085' }}>
              Full itemized invoice editor is available in the full send flow.
            </Text>
          ) : null}
        </SectionCard>

        <SectionCard>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '700', flex: 1 }}>Cash on delivery</Text>
            <Switch
              value={draft.addons.cashOnDelivery}
              onValueChange={(value) =>
                setDraft({
                  ...draft,
                  addons: { ...draft.addons, cashOnDelivery: value },
                })
              }
            />
          </View>
          {draft.addons.cashOnDelivery ? (
            <View style={{ gap: 6 }}>
              <Label>Amount</Label>
              <FieldInput
                value={draft.cashOnDelivery.amount}
                keyboardType="numeric"
                onChangeText={(v) => setDraft({ ...draft, cashOnDelivery: { ...draft.cashOnDelivery, amount: v } })}
              />
              <ErrorText text={errors?.cashOnDelivery?.amount} />
              <Label>Currency</Label>
              <FieldInput
                value={draft.cashOnDelivery.currency}
                onChangeText={(v) => setDraft({ ...draft, cashOnDelivery: { ...draft.cashOnDelivery, currency: v } })}
              />
              <ErrorText text={errors?.cashOnDelivery?.currency} />
              <Label>Reference</Label>
              <FieldInput
                value={draft.cashOnDelivery.reference}
                onChangeText={(v) => setDraft({ ...draft, cashOnDelivery: { ...draft.cashOnDelivery, reference: v } })}
              />
              <ErrorText text={errors?.cashOnDelivery?.reference} />
            </View>
          ) : null}
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Additional services</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Fragile</Text>
            <Switch
              value={Boolean(draft.addons.fragile)}
              onValueChange={(value) =>
                setDraft({ ...draft, addons: { ...draft.addons, fragile: value } })
              }
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Dangerous goods</Text>
            <Switch
              value={Boolean(draft.addons.dangerous)}
              onValueChange={(value) =>
                setDraft({ ...draft, addons: { ...draft.addons, dangerous: value } })
              }
            />
          </View>
        </SectionCard>

        {checkoutError ? (
          <BackAndTryAgainCard
            message={checkoutError}
            onBack={() => navigation.navigate('SendQuickAddressDetails')}
            onRetry={sendQuick}
          />
        ) : null}

        <PrimaryButton label="Submit quick shipment" onPress={sendQuick} loading={isBusy} />
        <SecondaryButton label="Back to address details" onPress={() => navigation.goBack()} />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}

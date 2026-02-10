import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, FieldInput, Heading, Label, PrimaryButton, SectionCard, ui } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { validateStepShipmentDetails } from '../../domain/shipmentValidation';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SendStackParamList, 'SendShipmentDetails'>;

export function SendShipmentDetailsScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const setDraft = useAppStore((state) => state.setDraft);
  const updateDraftField = useAppStore((state) => state.updateDraftField);
  const upsertItem = useAppStore((state) => state.upsertItem);
  const [errors, setErrors] = useState<ReturnType<typeof validateStepShipmentDetails> | null>(null);

  const firstItem = useMemo(() => {
    return (
      draft.items[0] ?? {
        id: 'item-1',
        description: '',
        countryOfOrigin: 'US',
        hsTariffCode: '',
        quantity: null,
        quantityUnit: null,
        weight: null,
        value: null,
      }
    );
  }, [draft.items]);

  const toggleProforma = (value: boolean) => {
    updateDraftField('createCommerceProformaInvoice', value);
    if (value && !draft.items.length) {
      upsertItem(0, firstItem);
    }
  };

  const toggleCod = (value: boolean) => {
    setDraft({
      ...draft,
      addons: {
        ...draft.addons,
        cashOnDelivery: value,
      },
    });
  };

  const next = () => {
    const result = validateStepShipmentDetails(draft);
    setErrors(result);

    if (!Object.keys(result).length) {
      navigation.navigate('SendMethods');
    }
  };

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={3} />
        <Heading>Send - Shipment details</Heading>
        <SectionCard>
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
          <View style={ui.row}>
            <Text style={{ fontWeight: '700', flex: 1 }}>Create proforma invoice</Text>
            <Switch value={Boolean(draft.createCommerceProformaInvoice)} onValueChange={toggleProforma} />
          </View>
          <ErrorText text={errors?.createCommerceProformaInvoice} />

          {draft.createCommerceProformaInvoice ? (
            <View style={{ gap: 6 }}>
              <Label>Item description</Label>
              <FieldInput value={firstItem.description} onChangeText={(v) => upsertItem(0, { ...firstItem, description: v })} />
              <Label>Quantity</Label>
              <FieldInput
                value={firstItem.quantity ? String(firstItem.quantity) : ''}
                keyboardType="numeric"
                onChangeText={(v) => upsertItem(0, { ...firstItem, quantity: v ? Number(v) : null })}
              />
              <Label>Weight</Label>
              <FieldInput
                value={firstItem.weight ? String(firstItem.weight) : ''}
                keyboardType="numeric"
                onChangeText={(v) => upsertItem(0, { ...firstItem, weight: v ? Number(v) : null })}
              />
              <Label>Value</Label>
              <FieldInput
                value={firstItem.value ? String(firstItem.value) : ''}
                keyboardType="numeric"
                onChangeText={(v) => upsertItem(0, { ...firstItem, value: v ? Number(v) : null })}
              />
              <ErrorText text={errors?.items?.[firstItem.id] || errors?.items?.shipmentItems} />
            </View>
          ) : null}
        </SectionCard>

        <SectionCard>
          <View style={ui.row}>
            <Text style={{ fontWeight: '700', flex: 1 }}>Cash on delivery</Text>
            <Switch value={draft.addons.cashOnDelivery} onValueChange={toggleCod} />
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
          <View style={ui.row}>
            <Text style={{ flex: 1 }}>Fragile</Text>
            <Switch
              value={Boolean(draft.addons.fragile)}
              onValueChange={(value) =>
                setDraft({ ...draft, addons: { ...draft.addons, fragile: value } })
              }
            />
          </View>
          <View style={ui.row}>
            <Text style={{ flex: 1 }}>Dangerous goods</Text>
            <Switch
              value={Boolean(draft.addons.dangerous)}
              onValueChange={(value) =>
                setDraft({ ...draft, addons: { ...draft.addons, dangerous: value } })
              }
            />
          </View>
          <View style={ui.row}>
            <Text style={{ flex: 1 }}>Proof of delivery</Text>
            <Switch
              value={Boolean(draft.addons.proofOfDelivery)}
              onValueChange={(value) =>
                setDraft({ ...draft, addons: { ...draft.addons, proofOfDelivery: value } })
              }
            />
          </View>
          <View style={ui.row}>
            <Text style={{ flex: 1 }}>Call before delivery</Text>
            <Switch
              value={Boolean(draft.addons.callBeforeDelivery)}
              onValueChange={(value) =>
                setDraft({ ...draft, addons: { ...draft.addons, callBeforeDelivery: value } })
              }
            />
          </View>
        </SectionCard>

        <Pressable onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </Pressable>
        <PrimaryButton label="Next: Methods" onPress={next} />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}

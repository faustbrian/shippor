import { useEffect, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, FieldInput, Heading, Label, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { BackAndTryAgainCard } from '../../components/BackAndTryAgainCard';
import { hasQuickAddressErrors, hasQuickHomeErrors } from '../../domain/quickFlow';
import { validateStepAddressDetails, validateStepBasic, validateStepShipmentDetails } from '../../domain/shipmentValidation';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { SubmitAndBackButtons } from '../../components/SubmitAndBackButtons';
import { CommercialInvoicePowerModeSection } from '../../components/CommercialInvoicePowerModeSection';
import { canShowCod, canShowDangerousAndLimited, canShowDelivery09, shouldHideAdditionalServices } from '../../domain/additionalServices';

type Props = NativeStackScreenProps<SendStackParamList, 'SendQuickShipmentDetails'>;

export function SendQuickShipmentDetailsScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const setDraft = useAppStore((state) => state.setDraft);
  const updateDraftField = useAppStore((state) => state.updateDraftField);
  const submitQuickShipment = useAppStore((state) => state.submitQuickShipment);
  const checkoutError = useAppStore((state) => state.checkoutError);
  const isBusy = useAppStore((state) => state.isBusy);
  const [errors, setErrors] = useState<ReturnType<typeof validateStepShipmentDetails> | null>(null);
  const isUnregisteredUser = false;

  const updateItem = (
    index: number,
    field: 'description' | 'countryOfOrigin' | 'hsTariffCode' | 'quantity' | 'quantityUnit' | 'weight' | 'value',
    value: string | number | null,
  ) => {
    setDraft({
      ...draft,
      items: draft.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    });
  };

  const addBlankItem = () => {
    const index = draft.items.length;
    setDraft({
      ...draft,
      items: [
        ...draft.items,
        {
          id: `quick-item-${index + 1}`,
          description: '',
          countryOfOrigin: draft.senderAddress.country || 'US',
          hsTariffCode: '',
          quantity: null,
          quantityUnit: 'pcs',
          weight: null,
          value: null,
        },
      ],
    });
  };

  const addQuickItem = () => {
    const index = draft.items.length;
    setDraft({
      ...draft,
      items: [
        ...draft.items,
        {
          id: `quick-item-${index + 1}`,
          description: 'T-shirt',
          countryOfOrigin: draft.senderAddress.country || 'US',
          hsTariffCode: '6109',
          quantity: 1,
          quantityUnit: 'pcs',
          weight: 0.3,
          value: 20,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    setDraft({
      ...draft,
      items: draft.items.filter((_, i) => i !== index),
    });
  };

  useEffect(() => {
    if (hasQuickHomeErrors(draft)) {
      navigation.replace('SendQuickStart');
      return;
    }
    if (hasQuickAddressErrors(draft)) {
      navigation.replace('SendQuickAddressDetails');
    }
  }, [draft, navigation]);

  useEffect(() => {
    const basic = validateStepBasic(draft);
    const hasBasicErrors =
      Object.keys(basic.senderAddress).length > 0 ||
      Object.keys(basic.recipientAddress).length > 0 ||
      Object.keys(basic.parcels).length > 0;
    if (hasBasicErrors) {
      navigation.replace('SendQuickStart');
      return;
    }

    const address = validateStepAddressDetails(draft);
    if (address.senderAddress || address.recipientAddress) {
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
          <Label>Currency</Label>
          <FieldInput value={draft.currency} onChangeText={(v) => updateDraftField('currency', v.toUpperCase())} autoCapitalize="characters" />
          <Label>Reference</Label>
          <FieldInput value={draft.reference} onChangeText={(v) => updateDraftField('reference', v)} />
          <ErrorText text={errors?.reference} />
          <Label>Incoterms</Label>
          <FieldInput value={draft.incoterms} onChangeText={(v) => updateDraftField('incoterms', v.toUpperCase())} autoCapitalize="characters" />
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Commercial / proforma invoice</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SecondaryButton label="I already have it" onPress={() => updateDraftField('createCommerceProformaInvoice', false)} />
            <SecondaryButton label="Create now" onPress={() => updateDraftField('createCommerceProformaInvoice', true)} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SecondaryButton label="Simple mode" onPress={() => setDraft({ ...draft, commerceInvoiceMode: 'simple' })} />
            <SecondaryButton label="Power mode" onPress={() => setDraft({ ...draft, commerceInvoiceMode: 'power' })} />
          </View>
          <ErrorText text={errors?.createCommerceProformaInvoice} />
          {draft.createCommerceProformaInvoice ? (
            <View style={{ gap: 6 }}>
              <PrimaryButton label="Add empty item row" onPress={addBlankItem} />
              <SecondaryButton label="Quick add item" onPress={addQuickItem} />
              {draft.items.map((item, index) => (
                <View key={item.id} style={{ borderWidth: 1, borderColor: '#EAECF0', borderRadius: 10, padding: 10, gap: 6 }}>
                  <Text style={{ fontWeight: '700' }}>Item #{index + 1}</Text>
                  <Label>Description</Label>
                  <FieldInput value={item.description} onChangeText={(v) => updateItem(index, 'description', v)} />
                  <Label>Country of origin</Label>
                  <FieldInput value={item.countryOfOrigin} onChangeText={(v) => updateItem(index, 'countryOfOrigin', v)} autoCapitalize="characters" />
                  <Label>HS tariff code</Label>
                  <FieldInput value={item.hsTariffCode} onChangeText={(v) => updateItem(index, 'hsTariffCode', v)} />
                  <Label>Quantity</Label>
                  <FieldInput
                    value={item.quantity ? String(item.quantity) : ''}
                    keyboardType="numeric"
                    onChangeText={(v) => updateItem(index, 'quantity', v ? Number(v) : null)}
                  />
                  <Label>Quantity unit</Label>
                  <FieldInput value={item.quantityUnit ?? ''} onChangeText={(v) => updateItem(index, 'quantityUnit', v)} />
                  <Label>Weight</Label>
                  <FieldInput
                    value={item.weight ? String(item.weight) : ''}
                    keyboardType="numeric"
                    onChangeText={(v) => updateItem(index, 'weight', v ? Number(v) : null)}
                  />
                  <Label>Value</Label>
                  <FieldInput
                    value={item.value ? String(item.value) : ''}
                    keyboardType="numeric"
                    onChangeText={(v) => updateItem(index, 'value', v ? Number(v) : null)}
                  />
                  <ErrorText text={errors?.items?.[item.id]} />
                  <SecondaryButton label="Remove item" onPress={() => removeItem(index)} />
                </View>
              ))}
              <ErrorText text={errors?.items?.shipmentItems} />
              <Text style={{ color: '#667085' }}>
                Items total value: {draft.items.reduce((sum, item) => sum + (item.value ?? 0), 0).toFixed(2)}
              </Text>
              <Text style={{ color: '#667085' }}>
                Items total weight: {draft.items.reduce((sum, item) => sum + (item.weight ?? 0), 0).toFixed(2)} kg
              </Text>
              {draft.commerceInvoiceMode === 'power' ? (
                <CommercialInvoicePowerModeSection draft={draft} setDraft={setDraft} />
              ) : null}
            </View>
          ) : null}
        </SectionCard>

        {!shouldHideAdditionalServices(draft, isUnregisteredUser) ? (
          <SectionCard>
            <Text style={{ fontWeight: '700' }}>Additional services</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>Shipment collection service</Text>
              <Switch
                value={Boolean(draft.addons.pickup)}
                onValueChange={(value) =>
                  setDraft({ ...draft, addons: { ...draft.addons, pickup: value } })
                }
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>Doorstep delivery</Text>
              <Switch
                value={Boolean(draft.addons.delivery)}
                onValueChange={(value) =>
                  setDraft({ ...draft, addons: { ...draft.addons, delivery: value } })
                }
              />
            </View>
            {canShowDelivery09(draft, isUnregisteredUser) ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text>Delivered by 9 AM</Text>
                <Switch
                  value={Boolean(draft.addons.delivery09)}
                  onValueChange={(value) =>
                    setDraft({ ...draft, addons: { ...draft.addons, delivery09: value } })
                  }
                />
              </View>
            ) : null}
            {canShowCod(draft) ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text>Cash on delivery</Text>
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
            ) : null}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>Fragile</Text>
              <Switch
                value={Boolean(draft.addons.fragile)}
                onValueChange={(value) =>
                  setDraft({ ...draft, addons: { ...draft.addons, fragile: value } })
                }
              />
            </View>
            {canShowDangerousAndLimited(draft, isUnregisteredUser) ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text>Dangerous goods</Text>
                  <Switch
                    value={Boolean(draft.addons.dangerous)}
                    onValueChange={(value) =>
                      setDraft({ ...draft, addons: { ...draft.addons, dangerous: value } })
                    }
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text>Limited quantities</Text>
                  <Switch
                    value={Boolean(draft.addons.limitedQtys)}
                    onValueChange={(value) =>
                      setDraft({ ...draft, addons: { ...draft.addons, limitedQtys: value } })
                    }
                  />
                </View>
              </>
            ) : null}
          </SectionCard>
        ) : null}

        {canShowCod(draft) && draft.addons.cashOnDelivery ? (
          <SectionCard>
            <Text style={{ fontWeight: '700' }}>Cash on delivery details</Text>
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
          </SectionCard>
        ) : null}
        {draft.addons.dangerous ? (
          <SectionCard>
            <Text style={{ fontWeight: '700' }}>Dangerous goods section</Text>
            <Label>UN Number</Label>
            <FieldInput value={draft.dangerousGoods.unNumber} onChangeText={(value) => setDraft({ ...draft, dangerousGoods: { ...draft.dangerousGoods, unNumber: value } })} />
            <Label>Hazard class</Label>
            <FieldInput value={draft.dangerousGoods.hazardClass} onChangeText={(value) => setDraft({ ...draft, dangerousGoods: { ...draft.dangerousGoods, hazardClass: value } })} />
            <Label>Packing group</Label>
            <FieldInput value={draft.dangerousGoods.packingGroup} onChangeText={(value) => setDraft({ ...draft, dangerousGoods: { ...draft.dangerousGoods, packingGroup: value } })} />
            <Label>Emergency contact</Label>
            <FieldInput value={draft.dangerousGoods.emergencyContact} onChangeText={(value) => setDraft({ ...draft, dangerousGoods: { ...draft.dangerousGoods, emergencyContact: value } })} />
          </SectionCard>
        ) : null}

        {checkoutError ? (
          <BackAndTryAgainCard
            message={checkoutError}
            onBack={() => navigation.navigate('SendQuickAddressDetails')}
            onRetry={sendQuick}
          />
        ) : null}

        <SubmitAndBackButtons
          continueLabel="Submit quick shipment"
          onContinue={sendQuick}
          onBack={() => navigation.goBack()}
          loading={isBusy}
        />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}

import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { AppScreen, ErrorText, FieldInput, Heading, Label, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import type { Address } from '../../types/models';
import { fetchAddressSuggestions } from '../../api/mockApi';
import { getQuickSearchMapping, isSafeToChangeAddress, removeSpaces } from '../../utils/quickSearch';
import { validateStepBasic } from '../../domain/shipmentValidation';
import { getShippingMethodValidationErrors } from '../../domain/shippingMethods';

type Props = NativeStackScreenProps<SendStackParamList, 'SendQuickStart'>;

export function SendQuickStartScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const setDraft = useAppStore((state) => state.setDraft);
  const updateAddressField = useAppStore((state) => state.updateAddressField);
  const loadShippingMethods = useAppStore((state) => state.loadShippingMethods);
  const methods = useAppStore((state) => state.shippingMethods);
  const isBusy = useAppStore((state) => state.isBusy);
  const replaceDraftAddress = useAppStore((state) => state.replaceDraftAddress);
  const [senderQuickSearch, setSenderQuickSearch] = useState('');
  const [recipientQuickSearch, setRecipientQuickSearch] = useState('');
  const [senderSuggestions, setSenderSuggestions] = useState<Address[]>([]);
  const [recipientSuggestions, setRecipientSuggestions] = useState<Address[]>([]);
  const [quickSearchWarning, setQuickSearchWarning] = useState('');
  const [quickHomeError, setQuickHomeError] = useState('');
  const [typeErrors, setTypeErrors] = useState<{ senderType?: string; recipientType?: string }>({});

  useEffect(() => {
    void loadShippingMethods();
  }, [loadShippingMethods]);

  const runQuickSearch = async (role: 'sender' | 'recipient', typedValue: string) => {
    const existingAddress = role === 'sender' ? draft.senderAddress : draft.recipientAddress;
    const country = existingAddress.country;
    const [mappedField] = getQuickSearchMapping(country);
    if (!mappedField) {
      return;
    }
    const suggestions = await fetchAddressSuggestions(typedValue, country);

    const applyIfSafe = (candidate: Address) => {
      const safeToChange = isSafeToChangeAddress(existingAddress, candidate, ['country']);
      if (!safeToChange) {
        setQuickSearchWarning('Suggestion blocked because country mismatch is not allowed.');
        return false;
      }
      replaceDraftAddress(role, candidate);
      setQuickSearchWarning('');
      return true;
    };

    if (suggestions.length === 1) {
      if (applyIfSafe(suggestions[0])) {
        if (role === 'sender') {
          setSenderSuggestions([]);
        } else {
          setRecipientSuggestions([]);
        }
      }
      return;
    }

    if (
      suggestions.length > 1 &&
      removeSpaces(String(suggestions[0][mappedField]).toLowerCase()) === removeSpaces(typedValue.toLowerCase())
    ) {
      if (applyIfSafe(suggestions[0])) {
        if (role === 'sender') {
          setSenderSuggestions([]);
        } else {
          setRecipientSuggestions([]);
        }
      }
      return;
    }

    if (role === 'sender') {
      setSenderSuggestions(suggestions);
    } else {
      setRecipientSuggestions(suggestions);
    }
  };

  const continueQuick = async () => {
    const basic = validateStepBasic(draft);
    const method = getShippingMethodValidationErrors(draft.selectedMethod);
    const hasBasicErrors =
      Object.keys(basic.senderAddress).length > 0 ||
      Object.keys(basic.recipientAddress).length > 0 ||
      Object.keys(basic.parcels).length > 0;
    if (hasBasicErrors || method.shippingMethod) {
      setQuickHomeError('Complete addresses, parcel details, and shipping method to continue.');
      setTypeErrors({
        senderType: basic.senderAddress.type,
        recipientType: basic.recipientAddress.type,
      });
      return;
    }

    setQuickHomeError('');
    navigation.navigate('SendQuickAddressDetails');
  };

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={1} />
        <Heading>Quick Shipping Tool</Heading>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Addresses</Text>
          {(() => {
            const [mappedField, label] = getQuickSearchMapping(draft.senderAddress.country);
            if (!mappedField) {
              return null;
            }

            return (
              <View style={{ gap: 6 }}>
                <Label>Sender quick search ({label.toLowerCase()} / street / city)</Label>
                <FieldInput
                  value={senderQuickSearch}
                  onChangeText={(value) => {
                    setSenderQuickSearch(value);
                    void runQuickSearch('sender', value);
                  }}
                  placeholder={`Sender ${label.toLowerCase()}/street/city`}
                />
              </View>
            );
          })()}
          {senderSuggestions.map((entry) => (
            <SecondaryButton
              key={`quick-sender-${entry.id}`}
              label={`${entry.postalCode} ${entry.street}, ${entry.city}`}
              onPress={() => {
                const [mappedField] = getQuickSearchMapping(draft.senderAddress.country);
                if (!mappedField) {
                  return;
                }
                const safe = isSafeToChangeAddress(draft.senderAddress, entry, ['country']);
                if (!safe) {
                  setQuickSearchWarning('Suggestion blocked because country mismatch is not allowed.');
                  return;
                }
                replaceDraftAddress('sender', entry);
                setSenderSuggestions([]);
                setSenderQuickSearch(String(entry[mappedField]));
                setQuickSearchWarning('');
              }}
            />
          ))}
          <Label>Sender name</Label>
          <FieldInput value={draft.senderAddress.name} onChangeText={(v) => updateAddressField('sender', 'name', v)} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SecondaryButton label="Sender private" onPress={() => updateAddressField('sender', 'type', 'private')} />
            <SecondaryButton label="Sender business" onPress={() => updateAddressField('sender', 'type', 'business')} />
          </View>
          <ErrorText text={typeErrors.senderType} />
          <Label>Sender city</Label>
          <FieldInput value={draft.senderAddress.city} onChangeText={(v) => updateAddressField('sender', 'city', v)} />
          {(() => {
            const [mappedField, label] = getQuickSearchMapping(draft.recipientAddress.country);
            if (!mappedField) {
              return null;
            }

            return (
              <View style={{ gap: 6 }}>
                <Label>Recipient quick search ({label.toLowerCase()} / street / city)</Label>
                <FieldInput
                  value={recipientQuickSearch}
                  onChangeText={(value) => {
                    setRecipientQuickSearch(value);
                    void runQuickSearch('recipient', value);
                  }}
                  placeholder={`Recipient ${label.toLowerCase()}/street/city`}
                />
              </View>
            );
          })()}
          {recipientSuggestions.map((entry) => (
            <SecondaryButton
              key={`quick-recipient-${entry.id}`}
              label={`${entry.postalCode} ${entry.street}, ${entry.city}`}
              onPress={() => {
                const [mappedField] = getQuickSearchMapping(draft.recipientAddress.country);
                if (!mappedField) {
                  return;
                }
                const safe = isSafeToChangeAddress(draft.recipientAddress, entry, ['country']);
                if (!safe) {
                  setQuickSearchWarning('Suggestion blocked because country mismatch is not allowed.');
                  return;
                }
                replaceDraftAddress('recipient', entry);
                setRecipientSuggestions([]);
                setRecipientQuickSearch(String(entry[mappedField]));
                setQuickSearchWarning('');
              }}
            />
          ))}
          <Label>Recipient name</Label>
          <FieldInput value={draft.recipientAddress.name} onChangeText={(v) => updateAddressField('recipient', 'name', v)} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <SecondaryButton label="Recipient private" onPress={() => updateAddressField('recipient', 'type', 'private')} />
            <SecondaryButton label="Recipient business" onPress={() => updateAddressField('recipient', 'type', 'business')} />
          </View>
          <ErrorText text={typeErrors.recipientType} />
          <Label>Recipient city</Label>
          <FieldInput value={draft.recipientAddress.city} onChangeText={(v) => updateAddressField('recipient', 'city', v)} />
          {quickSearchWarning ? <Text style={{ color: '#D92D20' }}>{quickSearchWarning}</Text> : null}
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
          <Label>Weight (kg)</Label>
          <FieldInput
            value={draft.parcels[0].weight ? String(draft.parcels[0].weight) : ''}
            keyboardType="numeric"
            onChangeText={(v) =>
              setDraft({
                ...draft,
                parcels: [{ ...draft.parcels[0], weight: v ? Number(v) : null }],
              })
            }
          />
          <Label>Width (cm)</Label>
          <FieldInput
            value={draft.parcels[0].width ? String(draft.parcels[0].width) : ''}
            keyboardType="numeric"
            onChangeText={(v) =>
              setDraft({
                ...draft,
                parcels: [{ ...draft.parcels[0], width: v ? Number(v) : null }],
              })
            }
          />
          <Label>Height (cm)</Label>
          <FieldInput
            value={draft.parcels[0].height ? String(draft.parcels[0].height) : ''}
            keyboardType="numeric"
            onChangeText={(v) =>
              setDraft({
                ...draft,
                parcels: [{ ...draft.parcels[0], height: v ? Number(v) : null }],
              })
            }
          />
          <Label>Length (cm)</Label>
          <FieldInput
            value={draft.parcels[0].length ? String(draft.parcels[0].length) : ''}
            keyboardType="numeric"
            onChangeText={(v) =>
              setDraft({
                ...draft,
                parcels: [{ ...draft.parcels[0], length: v ? Number(v) : null }],
              })
            }
          />
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

        {quickHomeError ? <Text style={{ color: '#D92D20' }}>{quickHomeError}</Text> : null}
        <PrimaryButton label="Continue" onPress={continueQuick} loading={isBusy} />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}

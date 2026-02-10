import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, FieldInput, Heading, Label, PrimaryButton, SecondaryButton, SectionCard, ui } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { RecentShipmentsPanel } from '../../components/RecentShipmentsPanel';
import { QuickAddParcelsCard } from '../../components/QuickAddParcelsCard';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { ConsignmentTemplateCard } from '../../components/ConsignmentTemplateCard';
import { validateStepBasic } from '../../domain/shipmentValidation';
import { useAppStore } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import type { Address } from '../../types/models';
import { filterAddressesByWordMatch, removeSpacesWhenFiltering } from '../../utils/addressSearch';
import { fetchAddressSuggestions } from '../../api/mockApi';
import { getQuickSearchMapping, isSafeToChangeAddress, removeSpaces } from '../../utils/quickSearch';

type Props = NativeStackScreenProps<SendStackParamList, 'SendBasic'>;

function AddressBookChooser({
  role,
  entries,
  onSelect,
}: {
  role: 'sender' | 'recipient';
  entries: Address[];
  onSelect: (address: Address) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      {entries.map((entry) => (
        <Pressable
          key={`${role}-${entry.id}`}
          onPress={() => onSelect(entry)}
          style={{ borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 10, padding: 8 }}
        >
          <Text style={{ fontWeight: '700' }}>{entry.label}</Text>
          <Text>{entry.name}</Text>
          <Text>{entry.city}, {entry.country}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function SendBasicScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const setDraft = useAppStore((state) => state.setDraft);
  const shipments = useAppStore((state) => state.shipments);
  const addressBook = useAppStore((state) => state.addressBook);
  const replaceDraftAddress = useAppStore((state) => state.replaceDraftAddress);
  const updateAddressField = useAppStore((state) => state.updateAddressField);
  const searchAddressBook = useAppStore((state) => state.searchAddressBook);

  const [query, setQuery] = useState('');
  const [senderQuickSearch, setSenderQuickSearch] = useState('');
  const [recipientQuickSearch, setRecipientQuickSearch] = useState('');
  const [senderSuggestions, setSenderSuggestions] = useState<Address[]>([]);
  const [recipientSuggestions, setRecipientSuggestions] = useState<Address[]>([]);
  const [quickSearchWarning, setQuickSearchWarning] = useState<string>('');
  const [errors, setErrors] = useState<ReturnType<typeof validateStepBasic> | null>(null);

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

  const updateParcel = (
    parcelId: string,
    field: 'weight' | 'width' | 'height' | 'length' | 'copies',
    value: number | null,
  ) => {
    setDraft({
      ...draft,
      parcels: draft.parcels.map((parcel) =>
        parcel.id === parcelId ? { ...parcel, [field]: value } : parcel,
      ),
    });
  };

  const addParcel = () => {
    const nextId = `parcel-${draft.parcels.length + 1}`;
    setDraft({
      ...draft,
      parcels: [
        ...draft.parcels,
        {
          id: nextId,
          width: null,
          height: null,
          length: null,
          weight: null,
          copies: 1,
        },
      ],
    });
  };

  const removeParcel = (id: string) => {
    if (draft.parcels.length === 1) {
      return;
    }
    setDraft({
      ...draft,
      parcels: draft.parcels.filter((parcel) => parcel.id !== id),
    });
  };

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return addressBook;
    }

    const byWord = filterAddressesByWordMatch(addressBook, query);
    const byPostal = removeSpacesWhenFiltering(addressBook, query);
    const map = new Map([...byWord, ...byPostal].map((entry) => [entry.id, entry]));
    return Array.from(map.values());
  }, [addressBook, query]);

  const next = () => {
    const result = validateStepBasic(draft);
    setErrors(result);

    const hasErrors =
      Object.keys(result.senderAddress).length > 0 ||
      Object.keys(result.recipientAddress).length > 0 ||
      Object.keys(result.parcels).length > 0;

    if (!hasErrors) {
      navigation.navigate('SendAddressDetails');
    }
  };

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={1} />
        <Heading>Send - Basic</Heading>
        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Quick shipping</Text>
          <SecondaryButton
            label="Open quick shipping tool"
            onPress={() => navigation.navigate('SendQuickStart')}
          />
        </SectionCard>
        <ConsignmentTemplateCard draft={draft} onApply={setDraft} />
        <RecentShipmentsPanel
          shipments={shipments}
          onReorder={(shipment) => {
            setDraft({
              ...draft,
              senderAddress: {
                ...draft.senderAddress,
                name: shipment.senderName,
              },
              recipientAddress: {
                ...draft.recipientAddress,
                name: shipment.recipientName,
              },
            });
          }}
        />
        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Quick starter</Text>
          <PrimaryButton
            label="Switch sender and recipient"
            onPress={() =>
              setDraft({
                ...draft,
                senderAddress: { ...draft.recipientAddress },
                recipientAddress: { ...draft.senderAddress },
              })
            }
          />
        </SectionCard>
        <SectionCard>
          <Label>Search address book</Label>
          <FieldInput
            placeholder="Search saved addresses"
            value={query}
            onChangeText={(value) => {
              setQuery(value);
              void searchAddressBook(value);
            }}
          />
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Sender</Text>
          {(() => {
            const [mappedField, label] = getQuickSearchMapping(draft.senderAddress.country);
            if (!mappedField) {
              return null;
            }

            return (
              <View style={{ gap: 6 }}>
                <Label>Quick search ({label.toLowerCase()} / street / city)</Label>
                <FieldInput
                  placeholder={`Type sender ${label.toLowerCase()} or address`}
                  value={senderQuickSearch}
                  onChangeText={(value) => {
                    setSenderQuickSearch(value);
                    void runQuickSearch('sender', value);
                  }}
                />
                {senderSuggestions.map((entry) => (
                  <SecondaryButton
                    key={`sender-suggest-${entry.id}`}
                    label={`${entry.postalCode} ${entry.street}, ${entry.city}`}
                    onPress={() => {
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
              </View>
            );
          })()}
          <View style={ui.row}>
            <PrimaryButton label="Private" onPress={() => updateAddressField('sender', 'type', 'private')} />
            <PrimaryButton label="Business" onPress={() => updateAddressField('sender', 'type', 'business')} />
          </View>
          <ErrorText text={errors?.senderAddress.type} />
          <AddressBookChooser role="sender" entries={filtered} onSelect={(entry) => replaceDraftAddress('sender', entry)} />
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Recipient</Text>
          {(() => {
            const [mappedField, label] = getQuickSearchMapping(draft.recipientAddress.country);
            if (!mappedField) {
              return null;
            }

            return (
              <View style={{ gap: 6 }}>
                <Label>Quick search ({label.toLowerCase()} / street / city)</Label>
                <FieldInput
                  placeholder={`Type recipient ${label.toLowerCase()} or address`}
                  value={recipientQuickSearch}
                  onChangeText={(value) => {
                    setRecipientQuickSearch(value);
                    void runQuickSearch('recipient', value);
                  }}
                />
                {recipientSuggestions.map((entry) => (
                  <SecondaryButton
                    key={`recipient-suggest-${entry.id}`}
                    label={`${entry.postalCode} ${entry.street}, ${entry.city}`}
                    onPress={() => {
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
              </View>
            );
          })()}
          <View style={ui.row}>
            <PrimaryButton label="Private" onPress={() => updateAddressField('recipient', 'type', 'private')} />
            <PrimaryButton label="Business" onPress={() => updateAddressField('recipient', 'type', 'business')} />
          </View>
          <ErrorText text={errors?.recipientAddress.type} />
          <ErrorText text={quickSearchWarning || undefined} />
          <AddressBookChooser role="recipient" entries={filtered} onSelect={(entry) => replaceDraftAddress('recipient', entry)} />
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Parcel</Text>
          {draft.parcels.map((parcel, index) => (
            <View key={parcel.id} style={{ borderWidth: 1, borderColor: '#EAECF0', borderRadius: 10, padding: 10, gap: 6 }}>
              <Text style={{ fontWeight: '700' }}>Parcel #{index + 1}</Text>
              <Label>Weight (kg)</Label>
              <FieldInput
                keyboardType="numeric"
                value={parcel.weight ? String(parcel.weight) : ''}
                onChangeText={(value) => updateParcel(parcel.id, 'weight', value ? Number(value) : null)}
              />
              <Label>Width (cm)</Label>
              <FieldInput
                keyboardType="numeric"
                value={parcel.width ? String(parcel.width) : ''}
                onChangeText={(value) => updateParcel(parcel.id, 'width', value ? Number(value) : null)}
              />
              <Label>Height (cm)</Label>
              <FieldInput
                keyboardType="numeric"
                value={parcel.height ? String(parcel.height) : ''}
                onChangeText={(value) => updateParcel(parcel.id, 'height', value ? Number(value) : null)}
              />
              <Label>Length (cm)</Label>
              <FieldInput
                keyboardType="numeric"
                value={parcel.length ? String(parcel.length) : ''}
                onChangeText={(value) => updateParcel(parcel.id, 'length', value ? Number(value) : null)}
              />
              <Label>Copies</Label>
              <FieldInput
                keyboardType="numeric"
                value={parcel.copies ? String(parcel.copies) : ''}
                onChangeText={(value) => updateParcel(parcel.id, 'copies', value ? Number(value) : null)}
              />
              <ErrorText text={errors?.parcels[parcel.id]} />
              <SecondaryButton label="Remove parcel" onPress={() => removeParcel(parcel.id)} />
            </View>
          ))}
          <PrimaryButton label="Add parcel" onPress={addParcel} />
        </SectionCard>
        <QuickAddParcelsCard draft={draft} onApply={setDraft} />

        <PrimaryButton label="Next: Address details" onPress={next} />
        <ShippingFlowSidePanel draft={draft} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </AppScreen>
  );
}

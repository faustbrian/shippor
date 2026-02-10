import { useEffect } from 'react';
import { Text, View } from 'react-native';
import type { ShipmentDraft } from '../types/models';
import { FieldInput, Label } from './ui';

function PartyFields({
  title,
  data,
  onChange,
}: {
  title: string;
  data: ShipmentDraft['commerceInvoiceMeta']['sender'];
  onChange: (field: keyof ShipmentDraft['commerceInvoiceMeta']['sender'], value: string) => void;
}) {
  return (
    <View style={{ gap: 6, borderWidth: 1, borderColor: '#EAECF0', borderRadius: 10, padding: 10 }}>
      <Text style={{ fontWeight: '700' }}>{title}</Text>
      <Label>Company</Label>
      <FieldInput value={data.company} onChangeText={(v) => onChange('company', v)} />
      <Label>Name</Label>
      <FieldInput value={data.name} onChangeText={(v) => onChange('name', v)} />
      <Label>Address line 1</Label>
      <FieldInput value={data.address1} onChangeText={(v) => onChange('address1', v)} />
      <Label>Address line 2</Label>
      <FieldInput value={data.address2} onChangeText={(v) => onChange('address2', v)} />
      <Label>Address line 3</Label>
      <FieldInput value={data.address3} onChangeText={(v) => onChange('address3', v)} />
      <Label>Postcode</Label>
      <FieldInput value={data.postcode} onChangeText={(v) => onChange('postcode', v)} />
      <Label>City</Label>
      <FieldInput value={data.city} onChangeText={(v) => onChange('city', v)} />
      <Label>State</Label>
      <FieldInput value={data.state} onChangeText={(v) => onChange('state', v)} />
      <Label>Country</Label>
      <FieldInput value={data.country} onChangeText={(v) => onChange('country', v.toUpperCase())} autoCapitalize="characters" />
      <Label>Phone</Label>
      <FieldInput value={data.phone} onChangeText={(v) => onChange('phone', v)} />
      <Label>Email</Label>
      <FieldInput value={data.email} onChangeText={(v) => onChange('email', v)} autoCapitalize="none" keyboardType="email-address" />
      <Label>VAT</Label>
      <FieldInput value={data.vatNumber} onChangeText={(v) => onChange('vatNumber', v)} />
      <Label>EORI</Label>
      <FieldInput value={data.eoriNumber} onChangeText={(v) => onChange('eoriNumber', v)} />
      <Label>Tax ID</Label>
      <FieldInput value={data.taxNumber} onChangeText={(v) => onChange('taxNumber', v)} />
      <Label>Reference</Label>
      <FieldInput value={data.reference} onChangeText={(v) => onChange('reference', v)} />
    </View>
  );
}

export function CommercialInvoicePowerModeSection({
  draft,
  setDraft,
}: {
  draft: ShipmentDraft;
  setDraft: (draft: ShipmentDraft) => void;
}) {
  useEffect(() => {
    const sender = draft.senderAddress;
    const receiver = draft.recipientAddress;

    const maybe = <T extends string>(current: T, fallback: string): T =>
      (current || fallback || '') as T;

    const nextSender = {
      ...draft.commerceInvoiceMeta.sender,
      company: maybe(draft.commerceInvoiceMeta.sender.company, sender.organization ?? ''),
      name: maybe(draft.commerceInvoiceMeta.sender.name, sender.name),
      address1: maybe(draft.commerceInvoiceMeta.sender.address1, sender.street),
      address2: maybe(draft.commerceInvoiceMeta.sender.address2, sender.street2 ?? ''),
      city: maybe(draft.commerceInvoiceMeta.sender.city, sender.city),
      postcode: maybe(draft.commerceInvoiceMeta.sender.postcode, sender.postalCode),
      state: maybe(draft.commerceInvoiceMeta.sender.state, sender.state ?? ''),
      country: maybe(draft.commerceInvoiceMeta.sender.country, sender.country),
      phone: maybe(draft.commerceInvoiceMeta.sender.phone, sender.phone),
      email: maybe(draft.commerceInvoiceMeta.sender.email, sender.email),
      vatNumber: maybe(draft.commerceInvoiceMeta.sender.vatNumber, sender.vatNumber ?? ''),
      eoriNumber: maybe(draft.commerceInvoiceMeta.sender.eoriNumber, sender.eori ?? ''),
    };

    const nextReceiver = {
      ...draft.commerceInvoiceMeta.receiver,
      company: maybe(draft.commerceInvoiceMeta.receiver.company, receiver.organization ?? ''),
      name: maybe(draft.commerceInvoiceMeta.receiver.name, receiver.name),
      address1: maybe(draft.commerceInvoiceMeta.receiver.address1, receiver.street),
      address2: maybe(draft.commerceInvoiceMeta.receiver.address2, receiver.street2 ?? ''),
      city: maybe(draft.commerceInvoiceMeta.receiver.city, receiver.city),
      postcode: maybe(draft.commerceInvoiceMeta.receiver.postcode, receiver.postalCode),
      state: maybe(draft.commerceInvoiceMeta.receiver.state, receiver.state ?? ''),
      country: maybe(draft.commerceInvoiceMeta.receiver.country, receiver.country),
      phone: maybe(draft.commerceInvoiceMeta.receiver.phone, receiver.phone),
      email: maybe(draft.commerceInvoiceMeta.receiver.email, receiver.email),
      vatNumber: maybe(draft.commerceInvoiceMeta.receiver.vatNumber, receiver.vatNumber ?? ''),
      eoriNumber: maybe(draft.commerceInvoiceMeta.receiver.eoriNumber, receiver.eori ?? ''),
    };

    const nextDelivery = {
      ...draft.commerceInvoiceMeta.delivery,
      company: maybe(draft.commerceInvoiceMeta.delivery.company, receiver.organization ?? ''),
      name: maybe(draft.commerceInvoiceMeta.delivery.name, receiver.name),
      address1: maybe(draft.commerceInvoiceMeta.delivery.address1, receiver.street),
      address2: maybe(draft.commerceInvoiceMeta.delivery.address2, receiver.street2 ?? ''),
      city: maybe(draft.commerceInvoiceMeta.delivery.city, receiver.city),
      postcode: maybe(draft.commerceInvoiceMeta.delivery.postcode, receiver.postalCode),
      state: maybe(draft.commerceInvoiceMeta.delivery.state, receiver.state ?? ''),
      country: maybe(draft.commerceInvoiceMeta.delivery.country, receiver.country),
      phone: maybe(draft.commerceInvoiceMeta.delivery.phone, receiver.phone),
      email: maybe(draft.commerceInvoiceMeta.delivery.email, receiver.email),
      vatNumber: maybe(draft.commerceInvoiceMeta.delivery.vatNumber, receiver.vatNumber ?? ''),
      eoriNumber: maybe(draft.commerceInvoiceMeta.delivery.eoriNumber, receiver.eori ?? ''),
    };

    const nextMeta = {
      ...draft.commerceInvoiceMeta,
      incoterm: maybe(draft.commerceInvoiceMeta.incoterm, draft.incoterms),
      sender: nextSender,
      receiver: nextReceiver,
      delivery: nextDelivery,
    };

    if (JSON.stringify(nextMeta) !== JSON.stringify(draft.commerceInvoiceMeta)) {
      setDraft({
        ...draft,
        commerceInvoiceMeta: nextMeta,
      });
    }
  }, [draft, setDraft]);

  const updateMeta = (field: keyof ShipmentDraft['commerceInvoiceMeta'], value: string) => {
    setDraft({
      ...draft,
      commerceInvoiceMeta: {
        ...draft.commerceInvoiceMeta,
        [field]: value,
      },
    });
  };

  return (
    <View style={{ gap: 6, borderWidth: 1, borderColor: '#EAECF0', borderRadius: 10, padding: 10 }}>
      <Text style={{ fontWeight: '700' }}>Commercial invoice power mode</Text>
      <Label>Invoice number</Label>
      <FieldInput value={draft.commerceInvoiceMeta.invoiceNumber} onChangeText={(v) => updateMeta('invoiceNumber', v)} />
      <Label>Invoice date</Label>
      <FieldInput value={draft.commerceInvoiceMeta.invoiceDate} onChangeText={(v) => updateMeta('invoiceDate', v)} placeholder="YYYY-MM-DD" />
      <Label>Shipment date</Label>
      <FieldInput value={draft.commerceInvoiceMeta.shipmentDate} onChangeText={(v) => updateMeta('shipmentDate', v)} placeholder="YYYY-MM-DD" />
      <Label>Export reason</Label>
      <FieldInput value={draft.commerceInvoiceMeta.exportReason} onChangeText={(v) => updateMeta('exportReason', v)} />
      <Label>Terms of sale</Label>
      <FieldInput value={draft.commerceInvoiceMeta.termsOfSale} onChangeText={(v) => updateMeta('termsOfSale', v)} />
      <Label>Tax number</Label>
      <FieldInput value={draft.commerceInvoiceMeta.taxNumber} onChangeText={(v) => updateMeta('taxNumber', v)} />
      <Label>Incoterm</Label>
      <FieldInput value={draft.commerceInvoiceMeta.incoterm} onChangeText={(v) => updateMeta('incoterm', v)} />
      <Label>Importer reference</Label>
      <FieldInput value={draft.commerceInvoiceMeta.importerReference} onChangeText={(v) => updateMeta('importerReference', v)} />
      <Label>Comments</Label>
      <FieldInput value={draft.commerceInvoiceMeta.comments} onChangeText={(v) => updateMeta('comments', v)} />

      <PartyFields
        title="Sender party"
        data={draft.commerceInvoiceMeta.sender}
        onChange={(field, value) =>
          setDraft({
            ...draft,
            commerceInvoiceMeta: {
              ...draft.commerceInvoiceMeta,
              sender: { ...draft.commerceInvoiceMeta.sender, [field]: value },
            },
          })
        }
      />
      <PartyFields
        title="Receiver party"
        data={draft.commerceInvoiceMeta.receiver}
        onChange={(field, value) =>
          setDraft({
            ...draft,
            commerceInvoiceMeta: {
              ...draft.commerceInvoiceMeta,
              receiver: { ...draft.commerceInvoiceMeta.receiver, [field]: value },
            },
          })
        }
      />
      <PartyFields
        title="Delivery party"
        data={draft.commerceInvoiceMeta.delivery}
        onChange={(field, value) =>
          setDraft({
            ...draft,
            commerceInvoiceMeta: {
              ...draft.commerceInvoiceMeta,
              delivery: { ...draft.commerceInvoiceMeta.delivery, [field]: value },
            },
          })
        }
      />
    </View>
  );
}

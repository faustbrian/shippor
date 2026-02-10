import { useEffect } from 'react';
import { Text, View } from 'react-native';
import type { Address, ShipmentDraft } from '../types/models';
import { ErrorText, FieldInput, Label, PrimaryButton } from './ui';
import { showAddressLine2Field, showPostalCodeField, showStateField } from '../utils/addressRules';
import {
  shouldShowEmployerIdentificationNumber,
  shouldShowSocialSecurityNumber,
  shouldShowVatTaxIdInput,
} from '../domain/addressVisibility';
import { getVatTaxIdTypes } from '../domain/vatRequirement';
import { CountryAwarePhoneInput } from './CountryAwarePhoneInput';

export function AddressDetailsFieldset({
  role,
  title,
  draft,
  address,
  errors,
  onChangeField,
  showPayerRelation,
}: {
  role: 'sender' | 'recipient';
  title: string;
  draft: ShipmentDraft;
  address: Address;
  errors?: Record<string, string>;
  onChangeField: (field: keyof Address, value: string) => void;
  showPayerRelation?: boolean;
}) {
  const showAddress2 = showAddressLine2Field(address.country);
  const showPostal = showPostalCodeField(address.country);
  const showState = showStateField(address.country);
  const isBusiness = address.type === 'business';
  const vatTaxIdTypes = getVatTaxIdTypes(address.country);
  const showVat = shouldShowVatTaxIdInput(address, role, draft);
  const showSsn = shouldShowSocialSecurityNumber(address, draft.payingAddress, role);
  const showEin = shouldShowEmployerIdentificationNumber(address, role);
  const fieldErrors = errors ?? {};

  useEffect(() => {
    if (showPayerRelation && !address.payerRelation) {
      onChangeField('payerRelation', 'sender');
    }
  }, [address.payerRelation, onChangeField, showPayerRelation]);

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontWeight: '700' }}>{title}</Text>
      {isBusiness ? (
        <>
          <Label>Organization</Label>
          <FieldInput value={address.organization ?? ''} onChangeText={(v) => onChangeField('organization', v)} />
          <ErrorText text={fieldErrors.organization} />
        </>
      ) : null}

      <Label>{role === 'sender' ? 'Sender' : 'Recipient'}</Label>
      <FieldInput value={address.name} onChangeText={(v) => onChangeField('name', v)} />
      <ErrorText text={fieldErrors.name} />

      <Label>Address line 1</Label>
      <FieldInput value={address.street} onChangeText={(v) => onChangeField('street', v)} />
      <ErrorText text={fieldErrors.street} />

      {showAddress2 ? (
        <>
          <Label>Address line 2</Label>
          <FieldInput value={address.street2 ?? ''} onChangeText={(v) => onChangeField('street2', v)} />
          <ErrorText text={fieldErrors.street2} />
        </>
      ) : null}

      {showPostal ? (
        <>
          <Label>Postal code</Label>
          <FieldInput value={address.postalCode} onChangeText={(v) => onChangeField('postalCode', v)} />
          <ErrorText text={fieldErrors.postalCode} />
        </>
      ) : null}

      <Label>City</Label>
      <FieldInput value={address.city} onChangeText={(v) => onChangeField('city', v)} />
      <ErrorText text={fieldErrors.city} />

      {showState ? (
        <>
          <Label>State / Region</Label>
          <FieldInput value={address.state ?? ''} onChangeText={(v) => onChangeField('state', v)} />
          <ErrorText text={fieldErrors.state} />
        </>
      ) : null}

      <Label>Country</Label>
      <FieldInput value={address.country} onChangeText={(v) => onChangeField('country', v.toUpperCase())} autoCapitalize="characters" />
      <ErrorText text={fieldErrors.country} />

      <CountryAwarePhoneInput country={address.country} value={address.phone} onChange={(v) => onChangeField('phone', v)} />
      <ErrorText text={fieldErrors.phone} />

      <Label>{role === 'sender' ? 'Sender email' : 'Email'}</Label>
      <FieldInput value={address.email} onChangeText={(v) => onChangeField('email', v)} autoCapitalize="none" keyboardType="email-address" />
      <ErrorText text={fieldErrors.email} />
      {role === 'recipient' ? <Text style={{ color: '#667085', fontSize: 12 }}>Recipient email is used for delivery notifications.</Text> : null}

      {address.type === 'business' ? (
        <>
          <Label>EORI</Label>
          <FieldInput value={address.eori ?? ''} onChangeText={(v) => onChangeField('eori', v)} />
          <ErrorText text={fieldErrors.eori} />
        </>
      ) : null}

      {showVat ? (
        <>
          <Label>VAT / Tax ID {vatTaxIdTypes.length ? `(${vatTaxIdTypes.join(', ')})` : ''}</Label>
          <FieldInput value={address.vatNumber ?? ''} onChangeText={(v) => onChangeField('vatNumber', v)} />
          <ErrorText text={fieldErrors.vatNumber} />
          <Label>VAT Tax ID type</Label>
          <FieldInput value={address.vatTaxIdType ?? ''} onChangeText={(v) => onChangeField('vatTaxIdType', v)} placeholder="As required by destination" />
        </>
      ) : null}

      {showPayerRelation ? (
        <>
          <Label>Payer relation</Label>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <PrimaryButton label="Sender" onPress={() => onChangeField('payerRelation', 'sender')} />
            <PrimaryButton label="Receiver" onPress={() => onChangeField('payerRelation', 'receiver')} />
            <PrimaryButton label="Third party" onPress={() => onChangeField('payerRelation', 'thirdParty')} />
          </View>
          <Text style={{ color: '#475467' }}>Current: {address.payerRelation || 'sender'}</Text>
          {address.payerRelation === 'thirdParty' ? (
            <>
              <Label>Billing email</Label>
              <FieldInput value={address.billingEmail ?? ''} onChangeText={(v) => onChangeField('billingEmail', v)} autoCapitalize="none" keyboardType="email-address" />
            </>
          ) : null}
        </>
      ) : null}

      {showSsn ? (
        <>
          <Label>Social security number</Label>
          <FieldInput value={address.socialSecurityNumber ?? ''} onChangeText={(v) => onChangeField('socialSecurityNumber', v)} />
        </>
      ) : null}

      {showSsn && role === 'recipient' && address.country === 'US' && address.type === 'private' ? (
        <Text style={{ color: '#667085', fontSize: 12 }}>
          US private recipient shipments over threshold can require SSN.
        </Text>
      ) : null}

      {showEin ? (
        <>
          <Label>Employer identification number</Label>
          <FieldInput value={address.employerIdentificationNumber ?? ''} onChangeText={(v) => onChangeField('employerIdentificationNumber', v)} />
        </>
      ) : null}
    </View>
  );
}

import { countryMeta, type CountryMeta } from './countryMeta';
import type { Address, ShipmentDraft } from '../types/models';

type FieldErrors = Record<string, string>;

export interface BasicStepErrors {
  parcels: FieldErrors;
  senderAddress: FieldErrors;
  recipientAddress: FieldErrors;
}

export interface AddressStepErrors {
  senderAddress?: FieldErrors;
  recipientAddress?: FieldErrors;
}

export interface ShipmentDetailsErrors {
  contents?: string;
  shipmentType?: string;
  value?: string;
  reference?: string;
  createCommerceProformaInvoice?: string;
  items?: FieldErrors;
  cashOnDelivery?: {
    amount?: string;
    currency?: string;
    reference?: string;
  };
}

function emptyAddress(prefix: string): Address {
  return {
    id: `${prefix}-address`,
    label: '',
    type: '',
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  };
}

export function createEmptyShipmentDraft(): ShipmentDraft {
  return {
    senderAddress: emptyAddress('sender'),
    recipientAddress: emptyAddress('recipient'),
    parcels: [
      {
        id: 'parcel-1',
        width: null,
        height: null,
        length: null,
        weight: null,
        copies: 1,
      },
    ],
    shipmentType: '',
    contents: '',
    reference: '',
    value: '',
    createCommerceProformaInvoice: null,
    items: [],
    selectedMethod: null,
    pickupLocationId: null,
    addons: {
      cashOnDelivery: false,
    },
    cashOnDelivery: {
      amount: '',
      currency: '',
      reference: '',
    },
  };
}

function isDomesticShipment(shipment: ShipmentDraft): boolean {
  return shipment.senderAddress.country === shipment.recipientAddress.country;
}

function isInternationalShipment(shipment: ShipmentDraft): boolean {
  return shipment.senderAddress.country !== shipment.recipientAddress.country;
}

function isSendingOutsideOfEuVatBorder(shipment: ShipmentDraft, meta: CountryMeta): boolean {
  if (isDomesticShipment(shipment)) {
    return false;
  }

  const senderCountry = shipment.senderAddress.country;
  const recipientCountry = shipment.recipientAddress.country;
  const recipientPostalCode = shipment.recipientAddress.postalCode;

  const senderInEu = meta.euCountries.includes(senderCountry);
  const recipientInEu = meta.euCountries.includes(recipientCountry);

  if (recipientInEu && !senderInEu) {
    return true;
  }

  if (recipientCountry === 'GB' && recipientPostalCode.startsWith('BT-')) {
    return false;
  }

  if (recipientCountry === 'ES') {
    return (
      recipientPostalCode.startsWith('35') ||
      recipientPostalCode.startsWith('38') ||
      recipientPostalCode.startsWith('51') ||
      recipientPostalCode.startsWith('52')
    );
  }

  return recipientCountry !== 'FI' && (meta.vatExemptEu.includes(recipientCountry) || !recipientInEu);
}

function showShipmentValueField(shipment: ShipmentDraft): boolean {
  if (!shipment.senderAddress.country || !shipment.recipientAddress.country) {
    return false;
  }

  return isInternationalShipment(shipment);
}

function isShipmentDetailFieldRequired(fieldName: keyof ShipmentDetailsErrors | 'reference', shipment: ShipmentDraft, meta: CountryMeta): boolean {
  if (fieldName === 'contents') {
    return isInternationalShipment(shipment);
  }

  if (fieldName === 'value') {
    return showShipmentValueField(shipment);
  }

  if (fieldName === 'shipmentType') {
    return isSendingOutsideOfEuVatBorder(shipment, meta);
  }

  if (fieldName === 'reference') {
    return true;
  }

  return false;
}

function isEoriRequired({
  addressType,
  senderCountryCode,
  recipientCountryCode,
  meta,
  postalCode,
  senderOrRecipient,
}: {
  addressType: Address['type'];
  senderCountryCode: string;
  recipientCountryCode: string;
  meta: CountryMeta;
  postalCode: string;
  senderOrRecipient: 'sender' | 'recipient';
}): boolean {
  if (addressType !== 'business') {
    return false;
  }

  if (senderCountryCode === recipientCountryCode) {
    return false;
  }

  const isEuCountry = (countryCode: string) => meta.euCountries.includes(countryCode);
  const isSpecialTerritory = (countryCode: string, code: string) => {
    if (countryCode === 'ES') {
      return code.startsWith('35') || code.startsWith('38') || code.startsWith('51') || code.startsWith('52');
    }

    return false;
  };

  const senderInEu = isEuCountry(senderCountryCode);
  const recipientInEu = isEuCountry(recipientCountryCode);
  const specialTerritoryInvolved =
    isSpecialTerritory(senderCountryCode, postalCode) || isSpecialTerritory(recipientCountryCode, postalCode);

  const isCrossBorderEuTrade =
    (senderInEu && !recipientInEu) ||
    (!senderInEu && recipientInEu) ||
    specialTerritoryInvolved;

  if (isCrossBorderEuTrade) {
    if (senderOrRecipient === 'sender') {
      return senderInEu;
    }

    return recipientInEu;
  }

  return false;
}

function isAddressFieldRequired({
  fieldName,
  address,
  senderOrRecipient,
  shipment,
  meta,
}: {
  fieldName: string;
  address: Address;
  senderOrRecipient: 'sender' | 'recipient';
  shipment: ShipmentDraft;
  meta: CountryMeta;
}): boolean {
  if (['street', 'city', 'country', 'phone'].includes(fieldName)) {
    return true;
  }

  if (fieldName === 'postalCode' && meta.mandatoryPostalCodes.includes(address.country)) {
    return true;
  }

  if (fieldName === 'state' && meta.stateRequired.includes(address.country)) {
    return true;
  }

  if (fieldName === 'email' && senderOrRecipient === 'sender') {
    return true;
  }

  if (fieldName === 'email' && senderOrRecipient === 'recipient') {
    return shipment.selectedMethod?.id === 'm-1';
  }

  if ((fieldName === 'name' && address.type === 'private') || (fieldName === 'organization' && address.type === 'business')) {
    return true;
  }

  if (fieldName === 'eori') {
    return isEoriRequired({
      addressType: address.type,
      senderCountryCode: shipment.senderAddress.country,
      recipientCountryCode: shipment.recipientAddress.country,
      meta,
      postalCode: address.postalCode,
      senderOrRecipient,
    });
  }

  if (fieldName === 'vatNumber') {
    return isInternationalShipment(shipment);
  }

  return false;
}

function getFullAddressValidationErrors(shipment: ShipmentDraft, address: Address, senderOrRecipient: 'sender' | 'recipient', meta: CountryMeta): FieldErrors {
  const errors: FieldErrors = {};
  const fields = [
    'name',
    'city',
    'country',
    'state',
    'street',
    'street2',
    'organization',
    'postalCode',
    'email',
    'type',
    'phone',
    'eori',
    'vatNumber',
  ];

  for (const field of fields) {
    const value = address[field as keyof Address];
    if (!String(value ?? '').trim() && isAddressFieldRequired({ fieldName: field, address, senderOrRecipient, shipment, meta })) {
      errors[field] = 'Please set the value';
    }
  }

  if ((address.phone + '').length < 6) {
    errors.phone = 'Please set the value';
  }

  return errors;
}

export function validateStepBasic(shipment: ShipmentDraft, meta: CountryMeta = countryMeta): BasicStepErrors {
  const errors: BasicStepErrors = {
    parcels: {},
    senderAddress: {},
    recipientAddress: {},
  };

  for (const parcel of shipment.parcels) {
    if (!parcel.width || !parcel.length || !parcel.height || !parcel.weight || !parcel.copies) {
      errors.parcels[parcel.id] = parcel.weight ? 'Please set parcel dimensions' : 'Please set the weight';
    }
  }

  if (!shipment.senderAddress.type) {
    errors.senderAddress.type = 'Please set the value';
  }

  if (!shipment.recipientAddress.type) {
    errors.recipientAddress.type = 'Select recipient type';
  }

  const senderPostalRequired = meta.mandatoryPostalCodes.includes(shipment.senderAddress.country || '');
  if (senderPostalRequired && !shipment.senderAddress.postalCode.trim()) {
    errors.senderAddress.postalCode = 'Please set the value';
  }

  const recipientPostalRequired = meta.mandatoryPostalCodes.includes(shipment.recipientAddress.country || '');
  if (recipientPostalRequired && !shipment.recipientAddress.postalCode.trim()) {
    errors.recipientAddress.postalCode = 'Please set the value';
  }

  return errors;
}

export function validateStepAddressDetails(shipment: ShipmentDraft, meta: CountryMeta = countryMeta): AddressStepErrors {
  const senderAddress = getFullAddressValidationErrors(shipment, shipment.senderAddress, 'sender', meta);
  const recipientAddress = getFullAddressValidationErrors(shipment, shipment.recipientAddress, 'recipient', meta);

  return {
    senderAddress: Object.keys(senderAddress).length ? senderAddress : undefined,
    recipientAddress: Object.keys(recipientAddress).length ? recipientAddress : undefined,
  };
}

export function validateStepShipmentDetails(shipment: ShipmentDraft, meta: CountryMeta = countryMeta): ShipmentDetailsErrors {
  const errors: ShipmentDetailsErrors = {};

  const requiredFields: ('contents' | 'shipmentType' | 'value' | 'reference')[] = ['contents', 'shipmentType', 'value', 'reference'];

  for (const field of requiredFields) {
    const draftFieldMap: Record<typeof field, string> = {
      contents: shipment.contents,
      shipmentType: shipment.shipmentType,
      value: shipment.value,
      reference: shipment.reference,
    };

    if (!draftFieldMap[field].trim() && isShipmentDetailFieldRequired(field, shipment, meta)) {
      if (field === 'shipmentType') {
        errors.shipmentType = 'This field is required';
      }

      if (field === 'contents') {
        errors.contents = 'This field is required';
      }

      if (field === 'value') {
        errors.value = 'This field is required';
      }

      if (field === 'reference') {
        errors.reference = 'This field is required';
      }
    }
  }

  if (shipment.createCommerceProformaInvoice === null) {
    errors.createCommerceProformaInvoice = 'This field is required';
  }

  if (shipment.createCommerceProformaInvoice) {
    if (!shipment.items.length) {
      errors.items = {
        shipmentItems: 'This field is required',
      };
    }

    for (const item of shipment.items) {
      if (!item.quantity || !item.description.trim() || !item.weight || !item.value) {
        if (!errors.items) {
          errors.items = {};
        }
        errors.items[item.id] = 'Please set description, quantity, weight, and value';
      }
    }
  }

  if (shipment.addons.cashOnDelivery) {
    const codErrors: ShipmentDetailsErrors['cashOnDelivery'] = {};

    if (!shipment.cashOnDelivery.amount.trim() || Number(shipment.cashOnDelivery.amount) <= 0) {
      codErrors.amount = 'Please enter valid amount';
    }

    if (!shipment.cashOnDelivery.currency.trim()) {
      codErrors.currency = 'This field is required';
    }

    if (!shipment.cashOnDelivery.reference.trim()) {
      codErrors.reference = 'This field is required';
    }

    if (Object.keys(codErrors).length) {
      errors.cashOnDelivery = codErrors;
    }
  }

  return errors;
}

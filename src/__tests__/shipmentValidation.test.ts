import { describe, expect, it } from 'vitest';
import { createEmptyShipmentDraft, validateStepBasic, validateStepAddressDetails, validateStepShipmentDetails } from '../domain/shipmentValidation';

describe('shipment validation', () => {
  it('requires parcel dimensions and sender/recipient types in basic step', () => {
    const draft = createEmptyShipmentDraft();
    const errors = validateStepBasic(draft);

    expect(errors.senderAddress.type).toBeDefined();
    expect(errors.recipientAddress.type).toBeDefined();
    expect(errors.parcels['parcel-1']).toContain('weight');
  });

  it('requires required address fields in address details step', () => {
    const draft = createEmptyShipmentDraft();
    draft.senderAddress.type = 'private';
    draft.recipientAddress.type = 'private';
    draft.senderAddress.country = 'US';
    draft.recipientAddress.country = 'US';
    const errors = validateStepAddressDetails(draft);

    expect(errors.senderAddress?.name).toBeDefined();
    expect(errors.senderAddress?.postalCode).toBeDefined();
    expect(errors.recipientAddress?.name).toBeDefined();
  });

  it('requires shipment details and item fields when customs docs are enabled', () => {
    const draft = createEmptyShipmentDraft();
    draft.senderAddress.country = 'FI';
    draft.recipientAddress.country = 'US';
    draft.shipmentType = '';
    draft.contents = '';
    draft.reference = '';
    draft.value = '';
    draft.createCommerceProformaInvoice = true;
    draft.items = [
      {
        id: 'i-1',
        description: '',
        countryOfOrigin: 'US',
        hsTariffCode: '',
        quantity: null,
        quantityUnit: null,
        weight: null,
        value: null,
      },
    ];

    const errors = validateStepShipmentDetails(draft);

    expect(errors.shipmentType).toBeDefined();
    expect(errors.contents).toBeDefined();
    expect(errors.items?.['i-1']).toContain('description');
  });

  it('does not require shipment type for domestic shipments', () => {
    const draft = createEmptyShipmentDraft();
    draft.senderAddress.country = 'FI';
    draft.recipientAddress.country = 'FI';
    draft.reference = 'REF-1';
    draft.value = '10';
    draft.contents = 'Documents';
    draft.shipmentType = '';
    draft.createCommerceProformaInvoice = false;

    const errors = validateStepShipmentDetails(draft);

    expect(errors.shipmentType).toBeUndefined();
  });

  it('requires eori for business sender in EU to non-EU shipment', () => {
    const draft = createEmptyShipmentDraft();
    draft.senderAddress.type = 'business';
    draft.senderAddress.country = 'FI';
    draft.recipientAddress.type = 'private';
    draft.recipientAddress.country = 'US';

    const errors = validateStepAddressDetails(draft);

    expect(errors.senderAddress?.eori).toBeDefined();
  });
});

import { getShippingMethodValidationErrors } from './shippingMethods';
import { validateStepAddressDetails, validateStepBasic, validateStepShipmentDetails } from './shipmentValidation';
import type { ShipmentDraft } from '../types/models';

export function hasQuickHomeErrors(draft: ShipmentDraft): boolean {
  const basic = validateStepBasic(draft);
  const method = getShippingMethodValidationErrors(draft.selectedMethod);

  const hasBasic =
    Object.keys(basic.senderAddress).length > 0 ||
    Object.keys(basic.recipientAddress).length > 0 ||
    Object.keys(basic.parcels).length > 0;

  return hasBasic || Boolean(method.shippingMethod);
}

export function hasQuickAddressErrors(draft: ShipmentDraft): boolean {
  const address = validateStepAddressDetails(draft);
  return Boolean(address.senderAddress || address.recipientAddress);
}

export function hasQuickShipmentErrors(draft: ShipmentDraft): boolean {
  const shipment = validateStepShipmentDetails(draft);
  return Object.keys(shipment).length > 0;
}

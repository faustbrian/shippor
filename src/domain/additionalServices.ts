import type { ShipmentDraft } from '../types/models';

export function shouldHideAdditionalServices(shipment: ShipmentDraft, isUnregisteredUser: boolean): boolean {
  const isPrivateSender = shipment.senderAddress.type === 'private';
  const isSweden = shipment.senderAddress.country === 'SE' || shipment.recipientAddress.country === 'SE';
  return isSweden && (isPrivateSender || isUnregisteredUser);
}

export function canShowDelivery09(shipment: ShipmentDraft, isUnregisteredUser: boolean): boolean {
  return shipment.senderAddress.type !== 'private' && !isUnregisteredUser;
}

export function canShowCod(shipment: ShipmentDraft): boolean {
  return shipment.senderAddress.type !== 'private';
}

export function canShowDangerousAndLimited(shipment: ShipmentDraft, isUnregisteredUser: boolean): boolean {
  return shipment.senderAddress.type !== 'private' && !isUnregisteredUser;
}

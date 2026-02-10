import type { Address, ShipmentDraft } from '../types/models';
import { isVatFieldRequired, shouldShowVatField } from './vatRequirement';

export function shouldShowSocialSecurityNumber(address: Address, payingAddress: Address, role: 'sender' | 'recipient'): boolean {
  if (role === 'recipient' && (address.country === 'US' || address.country === 'KR')) {
    return address.type === 'private';
  }

  if (role !== 'sender') {
    return false;
  }

  return (
    address.country === 'SE' &&
    payingAddress.country === 'SE' &&
    payingAddress.type !== 'business' &&
    address.type === 'private'
  );
}

export function shouldShowEmployerIdentificationNumber(address: Address, role: 'sender' | 'recipient'): boolean {
  return role === 'recipient' && address.country === 'US' && address.type === 'business';
}

export function shouldShowVatTaxIdInput(address: Address, role: 'sender' | 'recipient', shipment: ShipmentDraft): boolean {
  if (role !== 'recipient') {
    return false;
  }

  const methodName = `${shipment.selectedMethod?.label ?? ''} ${shipment.selectedMethod?.serviceId ?? ''}`.toLowerCase();
  if (!methodName.startsWith('asendia') && !methodName.includes('asendia')) {
    return false;
  }

  return shouldShowVatField(address.country);
}

export function isVatTaxIdRequired(address: Address, role: 'sender' | 'recipient', shipment: ShipmentDraft): boolean {
  return shouldShowVatTaxIdInput(address, role, shipment) && isVatFieldRequired(address.country);
}

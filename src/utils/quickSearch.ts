import type { Address } from '../types/models';
import { countryMeta } from '../domain/countryMeta';

export function removeSpaces(value: string): string {
  return value.replace(/\s+/g, '');
}

export function normaliseAddressLine(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  return `${value}`.replace(/\s+/g, '').toLowerCase();
}

export function isSafeToChangeAddress(
  existingAddress: Address,
  newAddress: Address | null,
  disallowedFieldChanges: (keyof Address)[],
): boolean {
  if (disallowedFieldChanges.length === 0) {
    return true;
  }

  if (newAddress === null) {
    return true;
  }

  for (const field of disallowedFieldChanges) {
    if (normaliseAddressLine(existingAddress[field]) !== normaliseAddressLine(newAddress[field])) {
      return false;
    }
  }

  return true;
}

export function getQuickSearchMapping(countryCode: string): [keyof Address | '', string] {
  if (countryMeta.hideQuickSearch.includes(countryCode)) {
    return ['', ''];
  }

  if (countryCode === 'HK') {
    return ['city', 'City'];
  }

  return ['postalCode', 'Postal code'];
}

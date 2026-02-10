import { countryMeta } from '../domain/countryMeta';

const countryDialCode: Record<string, string> = {
  US: '+1',
  CA: '+1',
  GB: '+44',
  SE: '+46',
  FI: '+358',
  DE: '+49',
  FR: '+33',
  ES: '+34',
  IT: '+39',
  NL: '+31',
  PL: '+48',
  HK: '+852',
};

export function getCountryDialCode(country: string): string {
  return countryDialCode[country] ?? '';
}

export function showStateField(country: string): boolean {
  return countryMeta.stateRequired.includes(country);
}

export function showPostalCodeField(country: string): boolean {
  return !countryMeta.hidePostalCodes.includes(country);
}

export function showAddressLine2Field(country: string): boolean {
  return !countryMeta.hideAddressLine2.includes(country);
}

export function normalizePhoneForCountry(phone: string, country: string): string {
  const compact = phone.replace(/\s+/g, '');
  if (!compact) {
    return '';
  }

  if (compact.startsWith('00')) {
    return `+${compact.slice(2).replace(/[^\d]/g, '')}`;
  }

  if (compact.startsWith('+')) {
    return `+${compact.slice(1).replace(/[^\d]/g, '')}`;
  }

  const local = compact.replace(/[^\d]/g, '');
  const dial = countryDialCode[country];
  if (!dial) {
    return local;
  }

  return `${dial}${local}`;
}

export function stripDialCodePrefix(phone: string, country: string): string {
  const compact = phone.replace(/\s+/g, '');
  const dial = getCountryDialCode(country);
  if (!compact || !dial) {
    return compact;
  }

  if (compact.startsWith(dial)) {
    return compact.slice(dial.length);
  }

  return compact.replace(/^\+/, '');
}

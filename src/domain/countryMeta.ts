export interface CountryMeta {
  euCountries: string[];
  vatExemptEu: string[];
  mandatoryPostalCodes: string[];
  stateRequired: string[];
}

export const countryMeta: CountryMeta = {
  euCountries: [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
    'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
    'SI', 'ES', 'SE',
  ],
  vatExemptEu: ['AX', 'IC'],
  mandatoryPostalCodes: ['US', 'CA', 'GB', 'SE', 'FI', 'DE', 'FR', 'ES', 'IT', 'NL', 'PL'],
  stateRequired: ['US', 'CA', 'AU', 'BR', 'MX'],
};

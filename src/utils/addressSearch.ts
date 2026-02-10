import type { Address } from '../types/models';

function removeSpaces(value: string): string {
  return value.replace(/\s+/g, '');
}

export function filterAddressesByWordMatch(options: Address[], inputValue: string): Address[] {
  const searchText = `${inputValue}`.trim().toLowerCase();
  return options.filter((option) => {
    if (option.name && option.name.toLowerCase().includes(searchText)) {
      return true;
    }

    if (option.city && option.city.toLowerCase().includes(searchText)) {
      return true;
    }

    if (option.country && option.country.toLowerCase().includes(searchText)) {
      return true;
    }

    if (option.postalCode && option.postalCode.toLowerCase().includes(searchText)) {
      return true;
    }

    if (option.organization && option.organization.toLowerCase().includes(searchText)) {
      return true;
    }

    if (option.email && option.email.toLowerCase().includes(searchText)) {
      return true;
    }

    return false;
  });
}

export function removeSpacesWhenFiltering(options: Address[], inputValue: string): Address[] {
  return options.filter((option) => removeSpaces(option.postalCode).includes(removeSpaces(inputValue)));
}

export function formatAddressForInput(address: Address): string {
  return address.organization || address.name || '';
}

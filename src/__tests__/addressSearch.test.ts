import { describe, expect, it } from 'vitest';
import { filterAddressesByWordMatch, removeSpacesWhenFiltering } from '../utils/addressSearch';
import type { Address } from '../types/models';

describe('address search parity rules', () => {
  const addresses: Address[] = [
    {
      id: 'a1',
      label: 'HQ',
      type: 'business',
      name: 'Alex Freight',
      email: 'alex@example.com',
      phone: '+12025550111',
      organization: 'Shippor Inc',
      street: '1 Main',
      city: 'Stockholm',
      postalCode: '112 51',
      country: 'SE',
    },
  ];

  it('matches by name/city/country/postal/email/organization', () => {
    expect(filterAddressesByWordMatch(addresses, 'alex')).toHaveLength(1);
    expect(filterAddressesByWordMatch(addresses, 'stockholm')).toHaveLength(1);
    expect(filterAddressesByWordMatch(addresses, '112')).toHaveLength(1);
    expect(filterAddressesByWordMatch(addresses, 'shippor')).toHaveLength(1);
  });

  it('matches postal codes ignoring spaces', () => {
    expect(removeSpacesWhenFiltering(addresses, '11251')).toHaveLength(1);
  });
});

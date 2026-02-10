import { Text } from 'react-native';
import type { Address } from '../types/models';

export function AddressCard({ label, address }: { label: string; address: Address }) {
  return (
    <>
      <Text style={{ fontWeight: '700' }}>{label}</Text>
      <Text>{address.organization || address.name || '-'}</Text>
      <Text>{address.street || '-'}</Text>
      {address.street2 ? <Text>{address.street2}</Text> : null}
      <Text>{address.postalCode ? `${address.postalCode} ` : ''}{address.city || '-'}</Text>
      <Text>{address.country || '-'}</Text>
      <Text>{address.phone || '-'}</Text>
      <Text>{address.email || '-'}</Text>
    </>
  );
}

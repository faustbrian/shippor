import { Text } from 'react-native';
import type { Address } from '../types/models';

export function AddressCard({ label, address }: { label: string; address: Address }) {
  return (
    <>
      <Text style={{ fontWeight: '800', fontSize: 12, color: '#344054' }}>{label}</Text>
      <Text>{address.organization || address.name || '-'}</Text>
      <Text style={{ color: '#475467' }}>{address.street || '-'}</Text>
      {address.street2 ? <Text>{address.street2}</Text> : null}
      <Text style={{ color: '#475467' }}>{address.postalCode ? `${address.postalCode} ` : ''}{address.city || '-'}</Text>
      <Text style={{ color: '#475467' }}>{address.country || '-'}</Text>
      <Text style={{ color: '#667085', fontSize: 12 }}>{address.phone || '-'}</Text>
      <Text style={{ color: '#667085', fontSize: 12 }}>{address.email || '-'}</Text>
    </>
  );
}

import { Text } from 'react-native';
import { SectionCard } from './ui';

export function CartSidePanelMobile({
  itemsCount,
  subtotal,
  fee,
  total,
  state,
  selectedPayment,
}: {
  itemsCount: number;
  subtotal: number;
  fee: number;
  total: number;
  state: string;
  selectedPayment: string;
}) {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '800' }}>Cart Side Panel</Text>
      <Text>Items in cart: {itemsCount}</Text>
      <Text>State: {state}</Text>
      <Text>Payment: {selectedPayment || 'Not selected'}</Text>
      <Text style={{ marginTop: 6, fontWeight: '700' }}>Totals</Text>
      <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
      <Text>Fee: ${fee.toFixed(2)}</Text>
      <Text style={{ fontWeight: '800' }}>Total: ${total.toFixed(2)}</Text>
    </SectionCard>
  );
}

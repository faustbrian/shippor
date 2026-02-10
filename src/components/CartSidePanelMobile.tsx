import { Text } from 'react-native';
import { SectionCard } from './ui';

export function CartSidePanelMobile({
  itemsCount,
  failedItemsCount,
  subtotal,
  fee,
  total,
  state,
  selectedPayment,
}: {
  itemsCount: number;
  failedItemsCount: number;
  subtotal: number;
  fee: number;
  total: number;
  state: string;
  selectedPayment: string;
}) {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '800' }}>Cart Summary</Text>
      <Text>Items: {itemsCount}</Text>
      <Text>Failed: {failedItemsCount}</Text>
      <Text>Checkout state: {state}</Text>
      <Text>Payment method: {selectedPayment || 'Not selected'}</Text>
      <Text style={{ marginTop: 6, fontWeight: '700' }}>Price breakdown</Text>
      <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
      <Text>Fee: ${fee.toFixed(2)}</Text>
      <Text style={{ fontWeight: '800' }}>Total: ${total.toFixed(2)}</Text>
    </SectionCard>
  );
}

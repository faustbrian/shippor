import { Text, View } from 'react-native';

export function CartPaymentAndShipmentController({
  state,
  hasCheckoutError,
  isBusy,
  itemCount,
  children,
}: {
  state: 'not-started' | 'pending' | 'failed-payment' | 'paid' | 'shipped';
  hasCheckoutError: boolean;
  isBusy: boolean;
  itemCount: number;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ borderWidth: 1, borderColor: '#EAECF0', borderRadius: 10, padding: 10, backgroundColor: '#fff' }}>
        <Text style={{ fontWeight: '700' }}>Cart controller state: {state}</Text>
        <Text style={{ color: '#667085' }}>Items in cart: {itemCount}</Text>
        <Text style={{ color: '#667085' }}>{isBusy ? 'Controller busy' : 'Controller idle'}</Text>
        {hasCheckoutError ? <Text style={{ color: '#D92D20' }}>Controller has checkout error</Text> : null}
      </View>
      {children}
    </View>
  );
}

import { Text, View } from 'react-native';
import { palette, PrimaryButton } from './ui';

const stateMap: Record<string, { bg: string; border: string; title: string; message: string }> = {
  'not-started': {
    bg: '#F8F9FC',
    border: '#D0D5DD',
    title: 'Payment not started',
    message: 'Select a payment method and agree to terms to continue.',
  },
  pending: {
    bg: '#EFF8FF',
    border: '#53B1FD',
    title: 'Payment pending',
    message: 'Submitting payment and shipment request...',
  },
  'failed-payment': {
    bg: '#FEF3F2',
    border: '#FDA29B',
    title: 'Payment failed',
    message: 'Payment did not complete. Update method and retry.',
  },
  paid: {
    bg: '#ECFDF3',
    border: '#6CE9A6',
    title: 'Payment received',
    message: 'Payment accepted. Preparing shipment creation.',
  },
  shipped: {
    bg: '#ECFDF3',
    border: '#32D583',
    title: 'Shipped',
    message: 'Shipments were created successfully.',
  },
};

export function PaymentStateBanner({
  state,
  onRetry,
}: {
  state: 'not-started' | 'pending' | 'failed-payment' | 'paid' | 'shipped';
  onRetry?: () => void;
}) {
  const data = stateMap[state];

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: data.border,
        borderLeftWidth: 4,
        backgroundColor: data.bg,
        borderRadius: 10,
        padding: 12,
        gap: 6,
      }}
    >
      <Text style={{ fontWeight: '800', color: palette.ink, fontSize: 13, letterSpacing: 0.2 }}>{data.title}</Text>
      <Text style={{ color: '#475467', fontSize: 13 }}>{data.message}</Text>
      {state === 'failed-payment' && onRetry ? <PrimaryButton label="Retry payment" onPress={onRetry} /> : null}
    </View>
  );
}

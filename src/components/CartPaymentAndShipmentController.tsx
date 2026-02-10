import { View } from 'react-native';

export function CartPaymentAndShipmentController({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={{ gap: 12 }}>{children}</View>;
}

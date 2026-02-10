import { View } from 'react-native';

export function ThankYouPageController({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={{ gap: 10 }}>{children}</View>;
}

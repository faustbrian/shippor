import { View } from 'react-native';
import { SectionCard } from './ui';

function PlaceholderRow() {
  return (
    <View style={{ gap: 6, paddingVertical: 6 }}>
      <View style={{ height: 14, width: '60%', backgroundColor: '#EAECF0', borderRadius: 6 }} />
      <View style={{ height: 12, width: '40%', backgroundColor: '#F2F4F7', borderRadius: 6 }} />
      <View style={{ height: 10, width: '85%', backgroundColor: '#F2F4F7', borderRadius: 6 }} />
    </View>
  );
}

export function ShippingMethodsLoadingPlaceholder() {
  return (
    <SectionCard>
      <PlaceholderRow />
      <PlaceholderRow />
      <PlaceholderRow />
    </SectionCard>
  );
}

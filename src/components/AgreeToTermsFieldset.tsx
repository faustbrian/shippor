import { Switch, Text, View } from 'react-native';
import { SectionCard } from './ui';

export function AgreeToTermsFieldset({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <SectionCard>
      <Text style={{ fontWeight: '800' }}>Terms and confirmation</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Text style={{ flex: 1, color: '#475467' }}>
          I confirm shipment details and accept payment and transport terms.
        </Text>
        <Switch value={value} onValueChange={onValueChange} />
      </View>
    </SectionCard>
  );
}

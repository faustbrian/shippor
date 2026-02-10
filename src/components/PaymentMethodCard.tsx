import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette } from './ui';

export function PaymentMethodCard({
  id,
  label,
  selected,
  onSelect,
}: {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const iconName = id === 'card' ? 'card-outline' : id === 'invoice' ? 'document-text-outline' : 'wallet-outline';
  const logos =
    id === 'card'
      ? 'Visa • Mastercard • Amex'
      : id === 'invoice'
        ? 'Net terms / monthly billing'
        : 'Account wallet / prepaid balance';

  return (
    <Pressable
      onPress={onSelect}
      style={{
        borderWidth: 1,
        borderColor: selected ? palette.blue : '#D0D5DD',
        borderRadius: 12,
        padding: 12,
        backgroundColor: selected ? '#EEF4FF' : '#fff',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Ionicons name={iconName} size={20} color={selected ? palette.blue : '#344054'} />
          <View>
            <Text style={{ fontWeight: '700', color: '#101828' }}>{label}</Text>
            <Text style={{ color: '#667085', fontSize: 12 }}>{logos}</Text>
          </View>
        </View>
        <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={20} color={selected ? palette.blue : '#98A2B3'} />
      </View>
    </Pressable>
  );
}

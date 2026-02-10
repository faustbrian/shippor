import { Pressable, Text, View } from 'react-native';
import type { Address } from '../types/models';

export function AddressBookSearchOption({
  entry,
  onPress,
}: {
  entry: Address;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: '#D0D5DD',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fff',
      }}
    >
      <View style={{ gap: 2 }}>
        <Text style={{ fontWeight: '700' }}>{entry.label || entry.name}</Text>
        <Text style={{ color: '#475467' }}>{entry.street}</Text>
        <Text style={{ color: '#475467' }}>{entry.postalCode ? `${entry.postalCode} ` : ''}{entry.city}</Text>
      </View>
    </Pressable>
  );
}

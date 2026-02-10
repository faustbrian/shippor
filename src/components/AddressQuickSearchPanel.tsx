import { Text, View } from 'react-native';
import type { Address } from '../types/models';
import { FieldInput, Label } from './ui';
import { AddressBookSearchOption } from './AddressBookSearchOption';

export function AddressQuickSearchPanel({
  title,
  value,
  placeholder,
  onChangeText,
  suggestions,
  onSelectSuggestion,
}: {
  title: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  suggestions: Address[];
  onSelectSuggestion: (entry: Address) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontWeight: '800', fontSize: 13, color: '#344054' }}>{title}</Text>
      <Label>Quick search</Label>
      <FieldInput value={value} onChangeText={onChangeText} placeholder={placeholder} />
      {suggestions.map((entry) => (
        <AddressBookSearchOption
          key={entry.id}
          entry={entry}
          onPress={() => onSelectSuggestion(entry)}
        />
      ))}
    </View>
  );
}

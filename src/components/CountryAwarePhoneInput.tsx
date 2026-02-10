import { View } from 'react-native';
import { FieldInput, Label } from './ui';
import { getCountryDialCode, parsePhoneLocalFromInput, stripDialCodePrefix } from '../utils/addressRules';

export function CountryAwarePhoneInput({
  country,
  value,
  onChange,
}: {
  country: string;
  value: string;
  onChange: (localValue: string) => void;
}) {
  const dialCode = getCountryDialCode(country);
  const localValue = stripDialCodePrefix(value, country);

  return (
    <View style={{ gap: 8 }}>
      <Label>Phone country code</Label>
      <FieldInput value={dialCode || 'N/A'} editable={false} />
      <Label>Phone</Label>
      <FieldInput
        value={localValue}
        onChangeText={(typed) => onChange(parsePhoneLocalFromInput(typed, country))}
        placeholder="Local number"
        keyboardType="phone-pad"
      />
    </View>
  );
}

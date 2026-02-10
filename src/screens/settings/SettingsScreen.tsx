import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { AppScreen, FieldInput, Heading, Label, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';

export function SettingsScreen() {
  const logout = useAppStore((state) => state.logout);
  const addresses = useAppStore((state) => state.addressBook);
  const addAddress = useAppStore((state) => state.addAddress);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('US');

  const submit = async () => {
    await addAddress({
      label,
      type: 'private',
      name,
      email,
      phone,
      street,
      city,
      postalCode,
      country,
    });

    setShowForm(false);
    setLabel('');
    setName('');
    setEmail('');
    setPhone('');
    setStreet('');
    setCity('');
    setPostalCode('');
    setCountry('US');
  };

  return (
    <AppScreen>
      <Heading>Settings</Heading>
      <SectionCard>
        <Text style={{ fontWeight: '700' }}>Address Book</Text>
        <SecondaryButton label={showForm ? 'Cancel' : 'Add address'} onPress={() => setShowForm((s) => !s)} />

        {showForm ? (
          <View style={{ gap: 8 }}>
            <Label>Label</Label>
            <FieldInput value={label} onChangeText={setLabel} />
            <Label>Name</Label>
            <FieldInput value={name} onChangeText={setName} />
            <Label>Email</Label>
            <FieldInput value={email} onChangeText={setEmail} autoCapitalize="none" />
            <Label>Phone</Label>
            <FieldInput value={phone} onChangeText={setPhone} />
            <Label>Street</Label>
            <FieldInput value={street} onChangeText={setStreet} />
            <Label>City</Label>
            <FieldInput value={city} onChangeText={setCity} />
            <Label>Postal code</Label>
            <FieldInput value={postalCode} onChangeText={setPostalCode} />
            <Label>Country</Label>
            <FieldInput value={country} onChangeText={setCountry} autoCapitalize="characters" />
            <PrimaryButton label="Save address" onPress={submit} />
          </View>
        ) : null}

        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#EEE' }}>
              <Text style={{ fontWeight: '700' }}>{item.label}</Text>
              <Text>{item.name}</Text>
              <Text>{item.street}, {item.city}</Text>
            </View>
          )}
        />
      </SectionCard>
      <PrimaryButton label="Logout" onPress={logout} />
    </AppScreen>
  );
}

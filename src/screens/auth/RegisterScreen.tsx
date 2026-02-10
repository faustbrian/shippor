import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, FieldInput, Heading, Label, PrimaryButton, SectionCard } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const register = useAppStore((state) => state.register);
  const isBusy = useAppStore((state) => state.isBusy);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();

  const submit = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    setError(undefined);
    await register(name, email, password);
  };

  return (
    <AppScreen>
      <Heading>Create account</Heading>
      <SectionCard>
        <Label>Name</Label>
        <FieldInput value={name} onChangeText={setName} />
        <Label>Email</Label>
        <FieldInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Label>Password</Label>
        <FieldInput value={password} onChangeText={setPassword} secureTextEntry />
        <ErrorText text={error} />
        <PrimaryButton label="Register" onPress={submit} loading={isBusy} />
      </SectionCard>
      <View>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text>Back to login</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

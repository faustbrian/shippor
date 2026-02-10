import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, FieldInput, Heading, Label, PrimaryButton, SectionCard } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('demo@shippor.app');
  const [password, setPassword] = useState('secret123');
  const [error, setError] = useState<string | undefined>();
  const onLogin = useAppStore((state) => state.login);
  const isBusy = useAppStore((state) => state.isBusy);

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    setError(undefined);
    await onLogin(email, password);
  };

  return (
    <AppScreen>
      <Heading>Shippor Login</Heading>
      <SectionCard>
        <Label>Email</Label>
        <FieldInput autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Label>Password</Label>
        <FieldInput secureTextEntry value={password} onChangeText={setPassword} />
        <ErrorText text={error} />
        <PrimaryButton label="Login" onPress={submit} loading={isBusy} />
      </SectionCard>
      <View style={{ gap: 10 }}>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text>Create account</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <Text>Forgot password</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

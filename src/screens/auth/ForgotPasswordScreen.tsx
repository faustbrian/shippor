import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, FieldInput, Heading, Label, PrimaryButton, SectionCard } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const forgotPassword = useAppStore((state) => state.forgotPassword);
  const message = useAppStore((state) => state.authMessage);
  const isBusy = useAppStore((state) => state.isBusy);
  const [email, setEmail] = useState('');

  const submit = async () => {
    await forgotPassword(email);
  };

  return (
    <AppScreen>
      <Heading>Forgot password</Heading>
      <SectionCard>
        <Label>Email</Label>
        <FieldInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <PrimaryButton label="Send reset link" onPress={submit} loading={isBusy} />
        {message ? <Text>{message}</Text> : null}
      </SectionCard>
      <View style={{ gap: 10 }}>
        <Pressable onPress={() => navigation.navigate('ResetPassword')}>
          <Text>Already have a token? Reset now</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text>Back to login</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

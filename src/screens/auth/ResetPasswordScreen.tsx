import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, FieldInput, Heading, Label, PrimaryButton, SectionCard } from '../../components/ui';
import { useAppStore } from '../../store/useAppStore';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen({ navigation }: Props) {
  const resetPassword = useAppStore((state) => state.resetPassword);
  const message = useAppStore((state) => state.authMessage);
  const isBusy = useAppStore((state) => state.isBusy);
  const [token, setToken] = useState('stub-reset-token');
  const [password, setPassword] = useState('');

  const submit = async () => {
    await resetPassword(token, password);
  };

  return (
    <AppScreen>
      <Heading>Reset password</Heading>
      <SectionCard>
        <Label>Reset token</Label>
        <FieldInput value={token} onChangeText={setToken} />
        <Label>New password</Label>
        <FieldInput value={password} onChangeText={setPassword} secureTextEntry />
        <PrimaryButton label="Reset password" onPress={submit} loading={isBusy} />
        {message ? <Text>{message}</Text> : null}
      </SectionCard>
      <View>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text>Back to login</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

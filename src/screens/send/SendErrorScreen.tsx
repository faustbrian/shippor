import { ScrollView, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, Heading, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import type { SendStackParamList } from '../../navigation/types';
import { useAppStore } from '../../store/useAppStore';
import { BackAndTryAgainCard } from '../../components/BackAndTryAgainCard';

type Props = NativeStackScreenProps<SendStackParamList, 'SendError'>;

export function SendErrorScreen({ navigation }: Props) {
  const checkoutError = useAppStore((state) => state.checkoutError);
  const resetCheckoutFailure = useAppStore((state) => state.resetCheckoutFailure);

  return (
    <AppScreen>
      <ScrollView>
        <Heading>Shipment Error</Heading>
        <BackAndTryAgainCard
          message={checkoutError || 'Unknown checkout error'}
          onBack={() => navigation.navigate('SendPayment')}
          onRetry={() => {
            resetCheckoutFailure();
            navigation.navigate('SendPayment');
          }}
        />
        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Recovery options</Text>
          <PrimaryButton label="Back to payment" onPress={() => navigation.navigate('SendPayment')} />
          <SecondaryButton label="Back to cart" onPress={() => navigation.navigate('SendCart')} />
          <SecondaryButton label="Start over" onPress={() => navigation.navigate('SendBasic')} />
        </SectionCard>
      </ScrollView>
    </AppScreen>
  );
}

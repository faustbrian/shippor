import { ScrollView, Switch, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, Heading, Label, PrimaryButton, SectionCard } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShipmentSummaryCard } from '../../components/ShipmentSummaryCard';
import { useAppStore, useCartTotals } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SendStackParamList, 'SendPayment'>;

const paymentOptions = [
  { id: 'card', label: 'Card' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'wallet', label: 'Wallet Balance' },
];

export function SendPaymentScreen({ navigation }: Props) {
  const cart = useAppStore((state) => state.cart);
  const selectedPaymentMethod = useAppStore((state) => state.selectedPaymentMethod);
  const agreeToTerms = useAppStore((state) => state.agreeToTerms);
  const checkoutError = useAppStore((state) => state.checkoutError);
  const setSelectedPaymentMethod = useAppStore((state) => state.setSelectedPaymentMethod);
  const setAgreeToTerms = useAppStore((state) => state.setAgreeToTerms);
  const submitCart = useAppStore((state) => state.submitCart);
  const isBusy = useAppStore((state) => state.isBusy);
  const totals = useCartTotals();

  const submit = async () => {
    const ok = await submitCart();
    if (ok) {
      navigation.replace('SendThankYou');
    }
  };

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={6} />
        <Heading>Send - Payment</Heading>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Payment method</Text>
          <View style={{ gap: 8 }}>
            {paymentOptions.map((option) => (
              <PrimaryButton
                key={option.id}
                label={`${selectedPaymentMethod === option.id ? 'Selected: ' : ''}${option.label}`}
                onPress={() => setSelectedPaymentMethod(option.id)}
              />
            ))}
          </View>
          <Text style={{ color: '#667085' }}>
            API payment gateways are stubbed. This screen mirrors cart payment
            selection flow.
          </Text>
        </SectionCard>

        <SectionCard>
          <Label>Agree to terms</Label>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>I have reviewed shipping terms and payment details.</Text>
            <Switch value={agreeToTerms} onValueChange={setAgreeToTerms} />
          </View>
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Checkout totals</Text>
          <Text>Items: {cart.length}</Text>
          <Text>Subtotal: ${totals.subtotal.toFixed(2)}</Text>
          <Text>Fee: ${totals.fee.toFixed(2)}</Text>
          <Text style={{ fontWeight: '700' }}>Total: ${totals.total.toFixed(2)}</Text>
        </SectionCard>

        {cart[0]?.draft ? <ShipmentSummaryCard draft={cart[0].draft} /> : null}

        <ErrorText text={checkoutError ?? undefined} />
        <PrimaryButton label="Pay & Send" onPress={submit} loading={isBusy} disabled={!cart.length} />
      </ScrollView>
    </AppScreen>
  );
}

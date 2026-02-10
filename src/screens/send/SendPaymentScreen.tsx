import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, ErrorText, Heading, PrimaryButton, SectionCard } from '../../components/ui';
import { SendStepHeader } from '../../components/SendStepHeader';
import { PaymentMethodCard } from '../../components/PaymentMethodCard';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { useAppStore, useCartTotals } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { PaymentStateBanner } from '../../components/PaymentStateBanner';
import { CartSidePanelMobile } from '../../components/CartSidePanelMobile';
import { PaymentSelectionFieldset } from '../../components/PaymentSelectionFieldset';
import { AgreeToTermsFieldset } from '../../components/AgreeToTermsFieldset';

type Props = NativeStackScreenProps<SendStackParamList, 'SendPayment'>;

const paymentOptions = [
  { id: 'card', label: 'Card' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'wallet', label: 'Wallet Balance' },
];

export function SendPaymentScreen({ navigation }: Props) {
  const cart = useAppStore((state) => state.cart);
  const cartItemErrors = useAppStore((state) => state.cartItemErrors);
  const selectedPaymentMethod = useAppStore((state) => state.selectedPaymentMethod);
  const agreeToTerms = useAppStore((state) => state.agreeToTerms);
  const checkoutError = useAppStore((state) => state.checkoutError);
  const checkoutFlowState = useAppStore((state) => state.checkoutFlowState);
  const setSelectedPaymentMethod = useAppStore((state) => state.setSelectedPaymentMethod);
  const setAgreeToTerms = useAppStore((state) => state.setAgreeToTerms);
  const resetCheckoutFailure = useAppStore((state) => state.resetCheckoutFailure);
  const submitCart = useAppStore((state) => state.submitCart);
  const isBusy = useAppStore((state) => state.isBusy);
  const totals = useCartTotals();
  const failedItemsCount = cart.filter((item) => item.state === 'failed-shipment-can-retry').length;

  const submit = async () => {
    if (failedItemsCount > 0) {
      navigation.navigate('SendCart');
      return;
    }
    const ok = await submitCart();
    if (ok) {
      navigation.replace('SendThankYou');
      return;
    }
    navigation.navigate('SendError');
  };

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={6} />
        <Heading>Send - Payment</Heading>
        <PaymentStateBanner
          state={checkoutFlowState}
          onRetry={() => {
            resetCheckoutFailure();
          }}
        />

        <PaymentSelectionFieldset>
          <View style={{ gap: 8 }}>
            {paymentOptions.map((option) => (
              <PaymentMethodCard
                key={option.id}
                id={option.id}
                label={option.label}
                selected={selectedPaymentMethod === option.id}
                onSelect={() => setSelectedPaymentMethod(option.id)}
              />
            ))}
          </View>
          <Text style={{ color: '#667085', fontSize: 12 }}>
            API payment gateways are stubbed. This screen mirrors cart payment
            selection flow.
          </Text>
        </PaymentSelectionFieldset>

        <AgreeToTermsFieldset value={agreeToTerms} onValueChange={setAgreeToTerms} />
        <SectionCard>
          <Text style={{ fontWeight: '800' }}>Payment and shipment status</Text>
          <Text>{selectedPaymentMethod ? 'Ready for payment' : 'Select method to continue'}</Text>
          <Text>{agreeToTerms ? 'Terms accepted' : 'Terms not accepted'}</Text>
          <Text>Flow state: {checkoutFlowState}</Text>
          {Object.values(cartItemErrors).some(Boolean) ? (
            <Text style={{ color: '#D92D20' }}>
              Failed cart items detected. Update failed items or retry non-failing items.
            </Text>
          ) : null}
          {failedItemsCount > 0 ? (
            <PrimaryButton
              label="Go to failed items"
              onPress={() => navigation.navigate('SendCart')}
            />
          ) : null}
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '800' }}>Checkout totals</Text>
          <Text>Items: {cart.length}</Text>
          <Text>Subtotal: ${totals.subtotal.toFixed(2)}</Text>
          <Text>Fee: ${totals.fee.toFixed(2)}</Text>
          <Text style={{ fontWeight: '700' }}>Total: ${totals.total.toFixed(2)}</Text>
        </SectionCard>
        <CartSidePanelMobile
          itemsCount={cart.length}
          failedItemsCount={failedItemsCount}
          subtotal={totals.subtotal}
          fee={totals.fee}
          total={totals.total}
          state={checkoutFlowState}
          selectedPayment={selectedPaymentMethod}
        />

        {cart[0]?.draft ? <ShippingFlowSidePanel draft={cart[0].draft} /> : null}

        <ErrorText text={checkoutError ?? undefined} />
        <PrimaryButton
          label={failedItemsCount > 0 ? 'Fix failed items first' : 'Pay & Send'}
          onPress={submit}
          loading={isBusy}
          disabled={!cart.length}
        />
      </ScrollView>
    </AppScreen>
  );
}

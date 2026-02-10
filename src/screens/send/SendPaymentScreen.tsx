import { useEffect } from 'react';
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
import { validateStepAddressDetails, validateStepBasic, validateStepShipmentDetails } from '../../domain/shipmentValidation';

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

  useEffect(() => {
    const currentDraft = cart[0]?.draft;
    if (!currentDraft) {
      navigation.replace('SendCart');
      return;
    }

    const basic = validateStepBasic(currentDraft);
    const hasBasicErrors =
      Object.keys(basic.senderAddress).length > 0 ||
      Object.keys(basic.recipientAddress).length > 0 ||
      Object.keys(basic.parcels).length > 0;
    if (hasBasicErrors) {
      navigation.replace('SendBasic');
      return;
    }

    const address = validateStepAddressDetails(currentDraft);
    if (address.senderAddress || address.recipientAddress) {
      navigation.replace('SendAddressDetails');
      return;
    }

    const details = validateStepShipmentDetails(currentDraft);
    if (Object.keys(details).length > 0) {
      navigation.replace('SendShipmentDetails');
      return;
    }
  }, [cart, navigation]);

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
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
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
          <Text style={{ color: '#475467' }}>{selectedPaymentMethod ? 'Ready for payment' : 'Select method to continue'}</Text>
          <Text style={{ color: '#475467' }}>{agreeToTerms ? 'Terms accepted' : 'Terms not accepted'}</Text>
          <Text style={{ color: '#475467' }}>Flow state: {checkoutFlowState}</Text>
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
          <Text style={{ color: '#475467' }}>Items: {cart.length}</Text>
          <Text style={{ color: '#475467' }}>Subtotal: ${totals.subtotal.toFixed(2)}</Text>
          <Text style={{ color: '#475467' }}>Fee: ${totals.fee.toFixed(2)}</Text>
          <View style={{ borderTopWidth: 1, borderTopColor: '#EAECF0', paddingTop: 8 }}>
            <Text style={{ fontWeight: '800' }}>Total: ${totals.total.toFixed(2)}</Text>
          </View>
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

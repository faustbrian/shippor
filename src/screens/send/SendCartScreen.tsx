import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, Heading, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { useAppStore, useCartTotals } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';
import { CartSidePanelMobile } from '../../components/CartSidePanelMobile';
import { PaymentStateBanner } from '../../components/PaymentStateBanner';
import { EmptyCartCard } from '../../components/EmptyCartCard';
import { CartLoadingCard } from '../../components/CartLoadingCard';
import { BackAndTryAgainCard } from '../../components/BackAndTryAgainCard';
import { ShipmentAccordionSummaryBar } from '../../components/ShipmentAccordionSummaryBar';
import { ShipmentInstructions } from '../../components/ShipmentInstructions';
import { CartActionButtons } from '../../components/CartActionButtons';

type Props = NativeStackScreenProps<SendStackParamList, 'SendCart'>;

export function SendCartScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const cart = useAppStore((state) => state.cart);
  const cartItemErrors = useAppStore((state) => state.cartItemErrors);
  const checkoutFlowState = useAppStore((state) => state.checkoutFlowState);
  const checkoutError = useAppStore((state) => state.checkoutError);
  const selectedPaymentMethod = useAppStore((state) => state.selectedPaymentMethod);
  const agreeToTerms = useAppStore((state) => state.agreeToTerms);
  const addDraftToCart = useAppStore((state) => state.addDraftToCart);
  const retryCartItem = useAppStore((state) => state.retryCartItem);
  const removeCartItem = useAppStore((state) => state.removeCartItem);
  const totals = useCartTotals();
  const failedItemsCount = cart.filter((item) => item.state === 'failed-shipment-can-retry').length;

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <SendStepHeader currentStep={5} />
        <Heading>Send - Cart & Checkout</Heading>

        <SectionCard>
          <Text style={{ fontWeight: '800' }}>Checkout State</Text>
          <Text style={{ color: '#475467' }}>Flow: {checkoutFlowState}</Text>
          <Text style={{ color: '#475467' }}>Selected payment: {selectedPaymentMethod || 'Not selected'}</Text>
          <Text style={{ color: '#475467' }}>Agreed to terms: {agreeToTerms ? 'Yes' : 'No'}</Text>
        </SectionCard>
        <PaymentStateBanner state={checkoutFlowState} />

        <SectionCard>
          <Text style={{ fontWeight: '800' }}>Current shipment draft</Text>
          <Text style={{ color: '#475467' }}>{draft.senderAddress.city || 'Sender'} {'->'} {draft.recipientAddress.city || 'Recipient'}</Text>
          <Text style={{ color: '#475467' }}>Method: {draft.selectedMethod?.label ?? 'Not selected'}</Text>
          <Text style={{ color: '#475467' }}>Price: ${draft.selectedMethod?.price.toFixed(2) ?? '0.00'}</Text>
          <PrimaryButton label="Add draft to cart" onPress={addDraftToCart} disabled={!draft.selectedMethod} />
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '800' }}>Cart items</Text>
          {!cart.length ? (
            <EmptyCartCard
              onGoMethods={() => navigation.navigate('SendMethods')}
              onGoSend={() => navigation.navigate('SendBasic')}
            />
          ) : (
            cart.map((item) => (
              <View key={item.id} style={{ borderWidth: 1, borderColor: '#EAECF0', borderRadius: 10, padding: 10, gap: 8 }}>
                <ShipmentAccordionSummaryBar
                  title={item.title}
                  price={item.price}
                  status={item.state}
                />
                <Text style={{ color: '#475467' }}>Service: {item.draft.selectedMethod?.label || '-'}</Text>
                {cartItemErrors[item.id] ? (
                  <Text style={{ color: '#D92D20' }}>{cartItemErrors[item.id]}</Text>
                ) : null}
                {item.state === 'failed-shipment-can-retry' ? (
                  <PrimaryButton
                    label="Retry this item"
                    onPress={() => {
                      retryCartItem(item.id);
                      navigation.navigate('SendShipmentDetails');
                    }}
                  />
                ) : null}
                <SecondaryButton label="Remove" onPress={() => removeCartItem(item.id)} />
              </View>
            ))
          )}
        </SectionCard>
        <ShipmentInstructions />
        {checkoutFlowState === 'pending' ? <CartLoadingCard /> : null}
        {checkoutFlowState === 'failed-payment' && checkoutError ? (
          <BackAndTryAgainCard
            message={checkoutError}
            onBack={() => navigation.navigate('SendMethods')}
            onRetry={() => navigation.navigate('SendPayment')}
          />
        ) : null}

        <CartSidePanelMobile
          itemsCount={cart.length}
          failedItemsCount={failedItemsCount}
          subtotal={totals.subtotal}
          fee={totals.fee}
          total={totals.total}
          state={checkoutFlowState}
          selectedPayment={selectedPaymentMethod}
        />
        <CartActionButtons
          onContinue={() => navigation.navigate('SendPayment')}
          onBack={() => navigation.navigate('SendMethods')}
          disableContinue={!cart.length}
        />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}

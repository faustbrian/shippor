import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScreen, Heading, PrimaryButton, SectionCard, SecondaryButton } from '../../components/ui';
import { useAppStore, useCartTotals } from '../../store/useAppStore';
import type { SendStackParamList } from '../../navigation/types';
import { SendStepHeader } from '../../components/SendStepHeader';
import { ShippingFlowSidePanel } from '../../components/ShippingFlowSidePanel';

type Props = NativeStackScreenProps<SendStackParamList, 'SendCart'>;

export function SendCartScreen({ navigation }: Props) {
  const draft = useAppStore((state) => state.currentDraft);
  const cart = useAppStore((state) => state.cart);
  const checkoutFlowState = useAppStore((state) => state.checkoutFlowState);
  const selectedPaymentMethod = useAppStore((state) => state.selectedPaymentMethod);
  const agreeToTerms = useAppStore((state) => state.agreeToTerms);
  const addDraftToCart = useAppStore((state) => state.addDraftToCart);
  const removeCartItem = useAppStore((state) => state.removeCartItem);
  const totals = useCartTotals();

  return (
    <AppScreen>
      <ScrollView>
        <SendStepHeader currentStep={5} />
        <Heading>Send - Cart & Checkout</Heading>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Checkout State</Text>
          <Text>Flow: {checkoutFlowState}</Text>
          <Text>Selected payment: {selectedPaymentMethod || 'Not selected'}</Text>
          <Text>Agreed to terms: {agreeToTerms ? 'Yes' : 'No'}</Text>
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Current shipment draft</Text>
          <Text>{draft.senderAddress.city || 'Sender'} {'->'} {draft.recipientAddress.city || 'Recipient'}</Text>
          <Text>Method: {draft.selectedMethod?.label ?? 'Not selected'}</Text>
          <Text>Price: ${draft.selectedMethod?.price.toFixed(2) ?? '0.00'}</Text>
          <PrimaryButton label="Add draft to cart" onPress={addDraftToCart} disabled={!draft.selectedMethod} />
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Cart items</Text>
          {cart.length ? (
            cart.map((item) => (
              <View key={item.id} style={{ borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 8 }}>
                <Text style={{ fontWeight: '700' }}>{item.title}</Text>
                <Text>{item.draft.selectedMethod?.label}</Text>
                <Text>${item.price.toFixed(2)}</Text>
                <SecondaryButton label="Remove" onPress={() => removeCartItem(item.id)} />
              </View>
            ))
          ) : (
            <Text>No items yet.</Text>
          )}
        </SectionCard>

        <SectionCard>
          <Text style={{ fontWeight: '700' }}>Totals</Text>
          <Text>Subtotal: ${totals.subtotal.toFixed(2)}</Text>
          <Text>Fee: ${totals.fee.toFixed(2)}</Text>
          <Text style={{ fontWeight: '700' }}>Total: ${totals.total.toFixed(2)}</Text>
        </SectionCard>
        <SectionCard>
          <Text style={{ color: '#667085' }}>
            Continue to payment to confirm gateway selection, agree to terms,
            and submit all shipments.
          </Text>
        </SectionCard>

        <PrimaryButton label="Continue to payment" onPress={() => navigation.navigate('SendPayment')} disabled={!cart.length} />
        <SecondaryButton label="Back to methods" onPress={() => navigation.navigate('SendMethods')} />
        <ShippingFlowSidePanel draft={draft} />
      </ScrollView>
    </AppScreen>
  );
}

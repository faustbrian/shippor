export type CartStateType =
  | 'loading'
  | 'not-created'
  | 'pending'
  | 'failed-payment'
  | 'paid'
  | 'shipped'
  | 'paylaterwithbilling'
  | 'abandoned';

export interface CartState {
  cartId: string;
  selectedPayment: string;
  state: CartStateType;
  agreeToTerms: boolean;
  price: number;
  priceVat0: number;
  errors: {
    general?: string;
    agreeToTerms?: string;
    errorsPerShipmentId?: Record<string, unknown>;
  };
}

export type CartAction =
  | { action: 'SET_CART_ID'; value: string }
  | { action: 'SET_CART_STATE'; value: CartStateType }
  | { action: 'SET_CART_PRICE'; value: number }
  | { action: 'SET_CART_PRICE_VAT_0'; value: number }
  | { action: 'SET_CART_ERRORS'; value: CartState['errors'] }
  | { action: 'SET_CART_ITEM_ERROR'; cartItemId: string; value: unknown }
  | { action: 'SET_PAYMENT_METHOD'; value: string }
  | { action: 'AGREE_TO_TERMS'; value: boolean };

export function createInitialCartState(): CartState {
  return {
    cartId: '',
    selectedPayment: '',
    state: 'not-created',
    agreeToTerms: false,
    price: 0,
    priceVat0: 0,
    errors: {},
  };
}

export function reduceCartState(state: CartState, payload: CartAction): CartState {
  switch (payload.action) {
    case 'SET_PAYMENT_METHOD':
      return { ...state, selectedPayment: payload.value };

    case 'AGREE_TO_TERMS':
      return { ...state, agreeToTerms: payload.value };

    case 'SET_CART_ID':
      return { ...state, cartId: payload.value };

    case 'SET_CART_STATE': {
      const nextState = { ...state, state: payload.value };
      if (['shipped', 'paid', 'failed-payment', 'paylaterwithbilling'].includes(payload.value)) {
        return { ...nextState, agreeToTerms: true };
      }
      return nextState;
    }

    case 'SET_CART_PRICE':
      return { ...state, price: payload.value };

    case 'SET_CART_PRICE_VAT_0':
      return { ...state, priceVat0: payload.value };

    case 'SET_CART_ERRORS':
      return { ...state, errors: payload.value };

    case 'SET_CART_ITEM_ERROR': {
      const errorsPerShipmentId = {
        ...(state.errors.errorsPerShipmentId ?? {}),
        [payload.cartItemId]: payload.value,
      };
      return {
        ...state,
        errors: {
          ...state.errors,
          errorsPerShipmentId,
        },
      };
    }
  }
}

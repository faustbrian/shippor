import { describe, expect, it } from 'vitest';
import { createInitialCartState, reduceCartState } from '../domain/cartState';

describe('cart state transitions', () => {
  it('sets agree to terms when cart becomes paid', () => {
    const initial = createInitialCartState();
    const next = reduceCartState(initial, {
      action: 'SET_CART_STATE',
      value: 'paid',
    });

    expect(next.state).toBe('paid');
    expect(next.agreeToTerms).toBe(true);
  });

  it('sets cart item level errors', () => {
    const initial = createInitialCartState();
    const next = reduceCartState(initial, {
      action: 'SET_CART_ITEM_ERROR',
      cartItemId: 'item-1',
      value: { general: 'Invalid shipment' },
    });

    expect(next.errors.errorsPerShipmentId?.['item-1']).toEqual({ general: 'Invalid shipment' });
  });
});

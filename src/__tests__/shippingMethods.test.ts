import { describe, expect, it } from 'vitest';
import { filterShippingMethodsByType, getShippingMethodValidationErrors, parseDeliveryEstimate } from '../domain/shippingMethods';
import type { ShippingMethod } from '../types/models';

describe('shipping methods parity rules', () => {
  it('requires a selected shipping method', () => {
    expect(getShippingMethodValidationErrors(null).shippingMethod).toBeDefined();
  });

  it('parses delivery estimate ranges', () => {
    expect(parseDeliveryEstimate('1-3')).toEqual([1, 3]);
    expect(parseDeliveryEstimate('x')).toEqual([9999, 9999]);
  });

  it('filters and sorts methods by price', () => {
    const methods: ShippingMethod[] = [
      {
        id: '1',
        label: 'A',
        eta: '2-4',
        carrier: 'C1',
        price: 30,
        deliveryTime: '2-4',
        serviceId: 's1',
        printerRequired: false,
        isPickupLocationMethod: false,
        isReturnService: false,
      },
      {
        id: '2',
        label: 'B',
        eta: '1-2',
        carrier: 'C2',
        price: 10,
        deliveryTime: '1-2',
        serviceId: 's2',
        printerRequired: false,
        isPickupLocationMethod: false,
        isReturnService: false,
      },
    ];

    const [home] = filterShippingMethodsByType(methods, false, 'price');
    expect(home[0].id).toBe('2');
  });
});

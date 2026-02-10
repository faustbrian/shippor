import type { ShippingMethod } from '../types/models';

export type SortShippingMethodsState = 'deliveryTime' | 'price';

export interface PickupLocation {
  id: string;
  name: string;
  address1: string;
  zipcode: string;
  serviceId: string;
}

export function getShippingMethodValidationErrors(shippingMethod: ShippingMethod | null): { shippingMethod?: string } {
  if (!shippingMethod) {
    return { shippingMethod: 'This field is required' };
  }

  return {};
}

export function canDoSameDayDelivery(serviceId: string): boolean {
  return serviceId.includes('wolt');
}

export function parseDeliveryEstimate(estimate: string): [number, number] {
  try {
    const parts = `${estimate}`.split('-').map((part) => part.trim());
    const min = Math.round(parseInt(parts[0], 10));

    if (Number.isNaN(min)) {
      return [9999, 9999];
    }

    const max = parts.length > 1 ? Math.round(parseInt(parts[1], 10)) : min;

    if (Number.isNaN(max)) {
      return [9999, 9999];
    }

    return [min, max];
  } catch {
    return [9999, 9999];
  }
}

export function filterShippingMethodsByType(
  shippingMethods: ShippingMethod[],
  noPrinterNeeded: boolean,
  sortShippingMethodsState: SortShippingMethodsState,
): [ShippingMethod[], ShippingMethod[], ShippingMethod[]] {
  let homeItems: ShippingMethod[] = [];
  let pickupItems: ShippingMethod[] = [];
  let returnItems: ShippingMethod[] = [];

  for (const method of shippingMethods) {
    if (!noPrinterNeeded || (noPrinterNeeded && !method.printerRequired)) {
      if (method.isReturnService) {
        returnItems.push(method);
      } else if (method.isPickupLocationMethod) {
        pickupItems.push(method);
      } else {
        homeItems.push(method);
      }
    }
  }

  const sortMethods = (a: ShippingMethod, b: ShippingMethod) => {
    let [aMin, aMax] = parseDeliveryEstimate(a.deliveryTime);
    let [bMin, bMax] = parseDeliveryEstimate(b.deliveryTime);

    let aSort = '';
    let bSort = '';

    if (sortShippingMethodsState === 'deliveryTime') {
      if (aMin === 0 && aMax === 0 && !canDoSameDayDelivery(a.serviceId)) {
        aMin = 999;
      }

      if (bMin === 0 && bMax === 0 && !canDoSameDayDelivery(b.serviceId)) {
        bMin = 999;
      }

      aSort = `${aMin}_${aMax}_${`${Math.round(a.price * 10)}`.padStart(10, '0')}`;
      bSort = `${bMin}_${bMax}_${`${Math.round(b.price * 10)}`.padStart(10, '0')}`;
    }

    if (sortShippingMethodsState === 'price') {
      aSort = `${`${Math.round(a.price * 10)}`.padStart(10, '0')}_${aMin}_${aMax}`;
      bSort = `${`${Math.round(b.price * 10)}`.padStart(10, '0')}_${bMin}_${bMax}`;
    }

    return aSort.localeCompare(bSort);
  };

  homeItems = homeItems.sort(sortMethods);
  pickupItems = pickupItems.sort(sortMethods);
  returnItems = returnItems.sort(sortMethods);

  return [homeItems, pickupItems, returnItems];
}

export function defaultSelectedPickupLocations(locations: PickupLocation[]): Record<string, string> {
  const selected: Record<string, string> = {};
  [...locations].reverse().forEach((location) => {
    selected[location.serviceId] = location.id;
  });
  return selected;
}

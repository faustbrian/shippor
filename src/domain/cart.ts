import type { ShipmentRecord } from '../types/models';

export interface CartLine {
  id: string;
  title: string;
  price: number;
}

export interface CartTotals {
  subtotal: number;
  fee: number;
  total: number;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateCartTotals(items: CartLine[]): CartTotals {
  const subtotal = round(items.reduce((sum, item) => sum + item.price, 0));
  const fee = round(subtotal * 0.06);
  const total = round(subtotal + fee);

  return { subtotal, fee, total };
}

export function buildShipmentStatusSummary(shipments: ShipmentRecord[]): {
  pending: number;
  outForDelivery: number;
  delivered: number;
} {
  return shipments.reduce(
    (summary, shipment) => {
      if (shipment.status === 'pending') {
        summary.pending += 1;
      }

      if (shipment.status === 'out-for-delivery') {
        summary.outForDelivery += 1;
      }

      if (shipment.status === 'delivered') {
        summary.delivered += 1;
      }

      return summary;
    },
    {
      pending: 0,
      outForDelivery: 0,
      delivered: 0,
    },
  );
}

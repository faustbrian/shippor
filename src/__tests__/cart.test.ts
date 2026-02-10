import { describe, expect, it } from 'vitest';
import { buildShipmentStatusSummary, calculateCartTotals } from '../domain/cart';
import type { ShipmentRecord } from '../types/models';

describe('cart and shipment summaries', () => {
  it('calculates totals for cart items', () => {
    const totals = calculateCartTotals([
      { id: '1', title: 'A', price: 12.2 },
      { id: '2', title: 'B', price: 7.8 },
    ]);

    expect(totals.subtotal).toBe(20);
    expect(totals.fee).toBe(1.2);
    expect(totals.total).toBe(21.2);
  });

  it('builds home status counts from shipments', () => {
    const shipments: ShipmentRecord[] = [
      { id: 's1', createdAt: '2026-01-01', status: 'pending', trackingNumber: 'TRK1', recipientName: 'A', senderName: 'B', service: 'Express', price: 10 },
      { id: 's2', createdAt: '2026-01-01', status: 'out-for-delivery', trackingNumber: 'TRK2', recipientName: 'A', senderName: 'B', service: 'Express', price: 10 },
      { id: 's3', createdAt: '2026-01-01', status: 'delivered', trackingNumber: 'TRK3', recipientName: 'A', senderName: 'B', service: 'Express', price: 10 },
      { id: 's4', createdAt: '2026-01-01', status: 'delivered', trackingNumber: 'TRK4', recipientName: 'A', senderName: 'B', service: 'Express', price: 10 },
    ];

    const summary = buildShipmentStatusSummary(shipments);

    expect(summary.pending).toBe(1);
    expect(summary.outForDelivery).toBe(1);
    expect(summary.delivered).toBe(2);
  });
});

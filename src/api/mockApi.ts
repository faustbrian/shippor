import { buildShipmentStatusSummary } from '../domain/cart';
import { createEmptyShipmentDraft } from '../domain/shipmentValidation';
import type {
  Address,
  DashboardData,
  ShipmentDraft,
  ShipmentRecord,
  ShippingMethod,
  TrackingEvent,
  User,
} from '../types/models';
import type { PickupLocation } from '../domain/shippingMethods';

const demoUser: User = {
  id: 'user-1',
  name: 'Shippor Demo',
  email: 'demo@shippor.app',
};

let accountBalance = 240.5;

let addressBook: Address[] = [
  {
    id: 'addr-1',
    label: 'Warehouse HQ',
    type: 'business',
    name: 'Alex Freight',
    email: 'alex@sender.com',
    phone: '+12025550118',
    organization: 'Shippor Warehouse',
    street: '500 Industrial Way',
    city: 'Austin',
    postalCode: '73301',
    country: 'US',
  },
  {
    id: 'addr-2',
    label: 'Main Recipient',
    type: 'private',
    name: 'Taylor Recipient',
    email: 'taylor@recipient.com',
    phone: '+12025550119',
    street: '77 Main Street',
    city: 'San Diego',
    postalCode: '92101',
    country: 'US',
  },
];

let shipments: ShipmentRecord[] = [
  {
    id: 'SHP-1001',
    createdAt: '2026-02-08T14:05:00Z',
    status: 'pending',
    trackingNumber: 'TRK1001',
    recipientName: 'Taylor Recipient',
    senderName: 'Alex Freight',
    service: 'Express Air',
    price: 19.99,
  },
  {
    id: 'SHP-1002',
    createdAt: '2026-02-07T09:30:00Z',
    status: 'out-for-delivery',
    trackingNumber: 'TRK1002',
    recipientName: 'Morgan Harper',
    senderName: 'Alex Freight',
    service: 'Economy Ground',
    price: 11.5,
  },
  {
    id: 'SHP-1003',
    createdAt: '2026-02-06T16:22:00Z',
    status: 'delivered',
    trackingNumber: 'TRK1003',
    recipientName: 'Jamie Stone',
    senderName: 'Alex Freight',
    service: 'Express Air',
    price: 14.0,
  },
];

let trackingEvents: TrackingEvent[] = [
  {
    id: 'evt-1',
    trackingNumber: 'TRK1001',
    status: 'Label created',
    location: 'Austin, TX',
    timestamp: '2026-02-08T14:06:00Z',
  },
  {
    id: 'evt-2',
    trackingNumber: 'TRK1002',
    status: 'Out for delivery',
    location: 'San Diego, CA',
    timestamp: '2026-02-10T08:10:00Z',
  },
  {
    id: 'evt-3',
    trackingNumber: 'TRK1003',
    status: 'Delivered',
    location: 'Los Angeles, CA',
    timestamp: '2026-02-09T12:44:00Z',
  },
];

const shippingMethods: ShippingMethod[] = [
  {
    id: 'm-1',
    label: 'Express Air',
    eta: '1-2 business days',
    carrier: 'DHL',
    price: 24.5,
    deliveryTime: '1-2',
    serviceId: 'dhl_express',
    printerRequired: false,
    isPickupLocationMethod: false,
    isReturnService: false,
    requiresEmailForRecipient: true,
    logo: '✈️',
    tags: ['Fastest', 'Door delivery'],
    infoText: [
      'Best for international parcels and urgent deliveries.',
      'Tracking updates every transit checkpoint.',
    ],
    dropOffTimes: ['Mon-Fri before 16:00 for same-day dispatch'],
    openingHours: ['Courier pickup window: 09:00-18:00'],
  },
  {
    id: 'm-2',
    label: 'Economy Ground',
    eta: '3-5 business days',
    carrier: 'UPS',
    price: 14.75,
    deliveryTime: '3-5',
    serviceId: 'ups_ground_pickup',
    printerRequired: true,
    isPickupLocationMethod: true,
    isReturnService: false,
    requiresEmailForRecipient: false,
    logo: '📦',
    tags: ['Cheapest', 'Pickup point'],
    infoText: [
      'Most affordable service for non-urgent deliveries.',
      'Pickup point handoff required.',
    ],
    dropOffTimes: ['Mon-Sat before 20:00 at selected pickup point'],
    openingHours: ['Pickup partner hours vary by location'],
  },
  {
    id: 'm-3',
    label: 'Courier Same Day',
    eta: 'Same day',
    carrier: 'Local Courier',
    price: 39.0,
    deliveryTime: '0',
    serviceId: 'wolt_same_day',
    printerRequired: false,
    isPickupLocationMethod: false,
    isReturnService: false,
    requiresEmailForRecipient: false,
    logo: '🛵',
    tags: ['Same day', 'Metro only'],
    infoText: [
      'Available for selected city zones only.',
      'Service cut-off depends on courier capacity.',
    ],
    dropOffTimes: ['Order before 14:00 for same-day route'],
    openingHours: ['Live courier windows shown during checkout'],
  },
];

function delay<T>(value: T, waitMs = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), waitMs);
  });
}

const pickupLocationsByService: Record<string, PickupLocation[]> = {
  ups_ground_pickup: [
    {
      id: 'pk-1',
      name: 'UPS Point Downtown',
      address1: '10 Front Street',
      zipcode: '92101',
      serviceId: 'ups_ground_pickup',
    },
    {
      id: 'pk-2',
      name: 'UPS Point Harbor',
      address1: '88 Harbor Rd',
      zipcode: '92102',
      serviceId: 'ups_ground_pickup',
    },
  ],
};

function nowIso(): string {
  return new Date().toISOString();
}

function draftTitle(draft: ShipmentDraft): string {
  return `${draft.senderAddress.city || 'Sender'} -> ${draft.recipientAddress.city || 'Recipient'}`;
}

export async function login(email: string, _password: string): Promise<{ user: User; token: string }> {
  return delay({
    user: {
      ...demoUser,
      email,
    },
    token: 'stub-token',
  });
}

export async function register(name: string, email: string, _password: string): Promise<{ user: User; token: string }> {
  return delay({
    user: {
      ...demoUser,
      name,
      email,
    },
    token: 'stub-token',
  });
}

export async function forgotPassword(_email: string): Promise<{ ok: true; message: string }> {
  return delay({ ok: true, message: 'Password reset email stub sent.' });
}

export async function resetPassword(_token: string, _password: string): Promise<{ ok: true; message: string }> {
  return delay({ ok: true, message: 'Password reset stub successful.' });
}

export async function fetchDashboard(): Promise<DashboardData> {
  const summary = buildShipmentStatusSummary(shipments);
  return delay({
    accountBalance,
    pending: summary.pending,
    outForDelivery: summary.outForDelivery,
    delivered: summary.delivered,
  });
}

export async function fetchShipments(): Promise<ShipmentRecord[]> {
  return delay(shipments);
}

export async function fetchAddressBook(): Promise<Address[]> {
  return delay(addressBook);
}

export async function addAddress(entry: Omit<Address, 'id'>): Promise<Address> {
  const created = {
    ...entry,
    id: `addr-${Math.random().toString(16).slice(2, 10)}`,
  };
  addressBook = [created, ...addressBook];
  return delay(created);
}

export async function searchAddressBook(query: string): Promise<Address[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return delay(addressBook);
  }

  return delay(
    addressBook.filter((entry) => {
      return [
        entry.label,
        entry.name,
        entry.street,
        entry.city,
        entry.postalCode,
      ].some((field) => field.toLowerCase().includes(normalized));
    }),
  );
}

export async function fetchShippingMethods(_draft: ShipmentDraft): Promise<ShippingMethod[]> {
  return delay(shippingMethods);
}

export async function fetchPickupLocations(serviceId: string): Promise<PickupLocation[]> {
  return delay(pickupLocationsByService[serviceId] ?? []);
}

export async function createShipmentFromDraft(draft: ShipmentDraft): Promise<ShipmentRecord> {
  const method = draft.selectedMethod ?? shippingMethods[1];
  const id = `SHP-${Math.floor(Math.random() * 90000 + 10000)}`;
  const trackingNumber = `TRK${Math.floor(Math.random() * 90000 + 10000)}`;

  const created: ShipmentRecord = {
    id,
    createdAt: nowIso(),
    status: 'pending',
    trackingNumber,
    recipientName: draft.recipientAddress.name,
    senderName: draft.senderAddress.name,
    service: method.label,
    price: method.price,
  };

  shipments = [created, ...shipments];
  accountBalance = Math.max(0, Number((accountBalance - method.price).toFixed(2)));

  trackingEvents = [
    {
      id: `evt-${Math.random().toString(16).slice(2, 10)}`,
      trackingNumber,
      status: `Shipment created (${draftTitle(draft)})`,
      location: draft.senderAddress.city,
      timestamp: nowIso(),
    },
    ...trackingEvents,
  ];

  return delay(created, 500);
}

export async function fetchTrackingHistory(): Promise<TrackingEvent[]> {
  return delay(trackingEvents);
}

export async function trackByNumber(trackingNumber: string): Promise<TrackingEvent[]> {
  return delay(
    trackingEvents.filter(
      (event) => event.trackingNumber.toLowerCase() === trackingNumber.trim().toLowerCase(),
    ),
  );
}

export function createNewDraft(): ShipmentDraft {
  return createEmptyShipmentDraft();
}

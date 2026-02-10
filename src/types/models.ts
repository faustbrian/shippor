export type AddressRole = 'sender' | 'recipient';

export type ShipmentStatus = 'pending' | 'out-for-delivery' | 'delivered';

export interface Address {
  id: string;
  label: string;
  type: 'private' | 'business' | '';
  name: string;
  email: string;
  phone: string;
  organization?: string;
  street: string;
  street2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

export interface Parcel {
  id: string;
  width: number | null;
  height: number | null;
  length: number | null;
  weight: number | null;
  copies: number | null;
}

export interface ShipmentItem {
  id: string;
  description: string;
  countryOfOrigin: string;
  hsTariffCode: string;
  quantity: number | null;
  quantityUnit: string | null;
  weight: number | null;
  value: number | null;
}

export interface ShippingMethod {
  id: string;
  label: string;
  eta: string;
  carrier: string;
  price: number;
  deliveryTime: string;
  serviceId: string;
  printerRequired: boolean;
  isPickupLocationMethod: boolean;
  isReturnService: boolean;
  requiresEmailForRecipient?: boolean;
}

export interface ShipmentDraft {
  senderAddress: Address;
  recipientAddress: Address;
  parcels: Parcel[];
  shipmentType: string;
  contents: string;
  reference: string;
  value: string;
  createCommerceProformaInvoice: boolean | null;
  items: ShipmentItem[];
  selectedMethod: ShippingMethod | null;
  pickupLocationId: string | null;
  addons: {
    cashOnDelivery: boolean;
    dangerous?: boolean;
    fragile?: boolean;
    proofOfDelivery?: boolean;
    callBeforeDelivery?: boolean;
    oversize?: boolean;
  };
  cashOnDelivery: {
    amount: string;
    currency: string;
    reference: string;
  };
}

export interface ShipmentRecord {
  id: string;
  createdAt: string;
  status: ShipmentStatus;
  trackingNumber: string;
  recipientName: string;
  senderName: string;
  service: string;
  price: number;
}

export interface TrackingEvent {
  id: string;
  trackingNumber: string;
  status: string;
  location: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface DashboardData {
  accountBalance: number;
  pending: number;
  outForDelivery: number;
  delivered: number;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  draft: ShipmentDraft;
}

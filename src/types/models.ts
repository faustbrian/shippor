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
  eori?: string;
  vatNumber?: string;
  socialSecurityNumber?: string;
  employerIdentificationNumber?: string;
  payerRelation?: string;
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
  priceVat0?: number;
  vatRate?: number;
  deliveryTime: string;
  serviceId: string;
  printerRequired: boolean;
  isPickupLocationMethod: boolean;
  isReturnService: boolean;
  requiresEmailForRecipient?: boolean;
  logo?: string;
  tags?: string[];
  infoText?: string[];
  dropOffTimes?: string[];
  openingHours?: string[];
}

export interface ShipmentDraft {
  senderAddress: Address;
  recipientAddress: Address;
  parcels: Parcel[];
  shipmentType: string;
  contents: string;
  reference: string;
  value: string;
  instructions?: string;
  instructionsPickUp?: string;
  returnFreightDoc: boolean;
  createCommerceProformaInvoice: boolean | null;
  items: ShipmentItem[];
  selectedMethod: ShippingMethod | null;
  pickupLocationId: string | null;
  addons: {
    cashOnDelivery: boolean;
    pickup?: boolean;
    delivery?: boolean;
    delivery09?: boolean;
    limitedQtys?: boolean;
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
  state: 'added' | 'failed-shipment-can-retry' | 'shipped';
}

import { create } from 'zustand';
import {
  addAddress,
  createNewDraft,
  createShipmentFromDraft,
  fetchAddressBook,
  fetchDashboard,
  fetchPickupLocations,
  fetchShipments,
  fetchShippingMethods,
  fetchTrackingHistory,
  forgotPassword,
  login,
  register,
  resetPassword,
  searchAddressBook,
  trackByNumber,
} from '../api/mockApi';
import { calculateCartTotals } from '../domain/cart';
import { defaultSelectedPickupLocations, filterShippingMethodsByType } from '../domain/shippingMethods';
import { normalizePhoneForCountry } from '../utils/addressRules';
import type {
  Address,
  AddressRole,
  CartItem,
  ShipmentDraft,
  ShipmentRecord,
  ShippingMethod,
  TrackingEvent,
  User,
} from '../types/models';
import type { PickupLocation, SortShippingMethodsState } from '../domain/shippingMethods';

interface AppState {
  user: User | null;
  token: string | null;
  isBusy: boolean;
  authMessage: string | null;
  dashboardBalance: number;
  shipments: ShipmentRecord[];
  trackingEvents: TrackingEvent[];
  trackingSearchResult: TrackingEvent[];
  addressBook: Address[];
  shippingMethods: ShippingMethod[];
  pickupLocations: PickupLocation[];
  sortShippingMethodsState: SortShippingMethodsState;
  currentDraft: ShipmentDraft;
  cart: CartItem[];
  cartItemErrors: Record<string, string>;
  selectedPaymentMethod: string;
  agreeToTerms: boolean;
  checkoutError: string | null;
  checkoutFlowState: 'not-started' | 'pending' | 'failed-payment' | 'paid' | 'shipped';
  lastCheckoutShipments: ShipmentRecord[];

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  logout: () => void;

  hydrateApp: () => Promise<void>;
  refreshDashboard: () => Promise<void>;

  setDraft: (draft: ShipmentDraft) => void;
  replaceDraftAddress: (role: AddressRole, address: Address) => void;
  updateAddressField: (role: AddressRole, field: keyof Address, value: string) => void;
  updateDraftField: (field: keyof ShipmentDraft, value: ShipmentDraft[keyof ShipmentDraft]) => void;
  updateParcelField: (parcelId: string, field: 'width' | 'height' | 'length' | 'weight' | 'copies', value: number | null) => void;
  upsertItem: (index: number, item: ShipmentDraft['items'][number]) => void;

  loadShippingMethods: () => Promise<void>;
  setSortShippingMethodsState: (value: SortShippingMethodsState) => void;
  loadPickupLocations: (serviceId: string) => Promise<void>;
  setSelectedPaymentMethod: (value: string) => void;
  setAgreeToTerms: (value: boolean) => void;
  resetCheckoutFailure: () => void;
  submitQuickShipment: () => Promise<boolean>;
  addDraftToCart: () => void;
  retryCartItem: (id: string) => void;
  removeCartItem: (id: string) => void;
  submitCart: () => Promise<boolean>;

  searchAddressBook: (query: string) => Promise<void>;
  addAddress: (entry: Omit<Address, 'id'>) => Promise<void>;
  searchTracking: (trackingNumber: string) => Promise<void>;
}

function draftToCartItem(draft: ShipmentDraft): CartItem {
  const method = draft.selectedMethod;
  return {
    id: `cart-${Math.random().toString(16).slice(2, 10)}`,
    title: `${draft.senderAddress.city || 'Sender'} -> ${draft.recipientAddress.city || 'Recipient'}`,
    price: method?.price ?? 0,
    draft: JSON.parse(JSON.stringify(draft)) as ShipmentDraft,
    state: 'added',
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  token: null,
  isBusy: false,
  authMessage: null,
  dashboardBalance: 0,
  shipments: [],
  trackingEvents: [],
  trackingSearchResult: [],
  addressBook: [],
  shippingMethods: [],
  pickupLocations: [],
  sortShippingMethodsState: 'deliveryTime',
  currentDraft: createNewDraft(),
  cart: [],
  cartItemErrors: {},
  selectedPaymentMethod: '',
  agreeToTerms: false,
  checkoutError: null,
  checkoutFlowState: 'not-started',
  lastCheckoutShipments: [],

  async login(email, password) {
    set({ isBusy: true, authMessage: null });
    const response = await login(email, password);
    set({ user: response.user, token: response.token, isBusy: false });
    await get().hydrateApp();
  },

  async register(name, email, password) {
    set({ isBusy: true, authMessage: null });
    const response = await register(name, email, password);
    set({ user: response.user, token: response.token, isBusy: false });
    await get().hydrateApp();
  },

  async forgotPassword(email) {
    set({ isBusy: true, authMessage: null });
    const response = await forgotPassword(email);
    set({ isBusy: false, authMessage: response.message });
  },

  async resetPassword(token, password) {
    set({ isBusy: true, authMessage: null });
    const response = await resetPassword(token, password);
    set({ isBusy: false, authMessage: response.message });
  },

  logout() {
    set({
      user: null,
      token: null,
      shipments: [],
      trackingEvents: [],
      trackingSearchResult: [],
      shippingMethods: [],
      pickupLocations: [],
      cart: [],
      cartItemErrors: {},
      selectedPaymentMethod: '',
      agreeToTerms: false,
      checkoutError: null,
      checkoutFlowState: 'not-started',
      lastCheckoutShipments: [],
      currentDraft: createNewDraft(),
      authMessage: null,
    });
  },

  async hydrateApp() {
    set({ isBusy: true });
    const [dashboard, shipments, addressBook, tracking] = await Promise.all([
      fetchDashboard(),
      fetchShipments(),
      fetchAddressBook(),
      fetchTrackingHistory(),
    ]);

    set({
      isBusy: false,
      dashboardBalance: dashboard.accountBalance,
      shipments,
      addressBook,
      trackingEvents: tracking,
      trackingSearchResult: tracking,
    });
  },

  async refreshDashboard() {
    const dashboard = await fetchDashboard();
    set({ dashboardBalance: dashboard.accountBalance });
  },

  setDraft(draft) {
    set({ currentDraft: draft });
  },

  replaceDraftAddress(role, address) {
    set((state) => ({
      currentDraft: {
        ...state.currentDraft,
        [role === 'sender' ? 'senderAddress' : 'recipientAddress']: {
          ...address,
        },
      },
    }));
  },

  updateAddressField(role, field, value) {
    set((state) => {
      const target = role === 'sender' ? 'senderAddress' : 'recipientAddress';
      const address = state.currentDraft[target];
      const normalizedValue = field === 'phone' ? normalizePhoneForCountry(value, address.country) : value;
      return {
        currentDraft: {
          ...state.currentDraft,
          [target]: {
            ...state.currentDraft[target],
            [field]: normalizedValue,
          },
        },
      };
    });
  },

  updateDraftField(field, value) {
    set((state) => ({
      currentDraft: {
        ...state.currentDraft,
        [field]: value,
      },
    }));
  },

  updateParcelField(parcelId, field, value) {
    set((state) => ({
      currentDraft: {
        ...state.currentDraft,
        parcels: state.currentDraft.parcels.map((parcel) =>
          parcel.id === parcelId ? { ...parcel, [field]: value } : parcel,
        ),
      },
    }));
  },

  upsertItem(index, item) {
    set((state) => {
      const items = [...state.currentDraft.items];
      items[index] = item;
      return {
        currentDraft: {
          ...state.currentDraft,
          items,
        },
      };
    });
  },

  async loadShippingMethods() {
    const { currentDraft, sortShippingMethodsState } = get();
    const methods = await fetchShippingMethods(currentDraft);
    const [homeMethods, pickupMethods, returnMethods] = filterShippingMethodsByType(
      methods,
      false,
      sortShippingMethodsState,
    );
    const nextMethods = [...homeMethods, ...pickupMethods, ...returnMethods];
    const selectedMethod = currentDraft.selectedMethod
      ? nextMethods.find((method) => method.id === currentDraft.selectedMethod?.id) ?? null
      : null;

    set({
      shippingMethods: nextMethods,
      currentDraft: {
        ...currentDraft,
        selectedMethod,
      },
    });
  },

  setSortShippingMethodsState(value) {
    set({ sortShippingMethodsState: value });
  },

  async loadPickupLocations(serviceId) {
    const locations = await fetchPickupLocations(serviceId);
    const defaults = defaultSelectedPickupLocations(locations);
    set((state) => {
      const pickupLocationId = defaults[serviceId] ?? null;
      return {
        pickupLocations: locations,
        currentDraft: {
          ...state.currentDraft,
          pickupLocationId,
        },
      };
    });
  },

  setSelectedPaymentMethod(value) {
    set({ selectedPaymentMethod: value, checkoutError: null });
  },

  setAgreeToTerms(value) {
    set({ agreeToTerms: value, checkoutError: null });
  },

  resetCheckoutFailure() {
    set({
      checkoutError: null,
      checkoutFlowState: 'not-started',
    });
  },

  async submitQuickShipment() {
    const draft = get().currentDraft;
    let selectedMethod = draft.selectedMethod;
    if (!selectedMethod) {
      const methods = await fetchShippingMethods(draft);
      if (methods.length) {
        selectedMethod = methods[0];
      }
    }

    if (!draft.senderAddress.name || !draft.recipientAddress.name || !selectedMethod) {
      set({
        checkoutError: 'Quick shipment requires sender, recipient, and method',
        checkoutFlowState: 'failed-payment',
      });
      return false;
    }

    set({ isBusy: true, checkoutError: null, checkoutFlowState: 'pending' });
    const created = await createShipmentFromDraft({
      ...draft,
      selectedMethod,
    });
    const [dashboard, nextShipments, tracking] = await Promise.all([
      fetchDashboard(),
      fetchShipments(),
      fetchTrackingHistory(),
    ]);

    set({
      isBusy: false,
      checkoutFlowState: 'shipped',
      dashboardBalance: dashboard.accountBalance,
      shipments: nextShipments,
      trackingEvents: tracking,
      trackingSearchResult: tracking,
      lastCheckoutShipments: [created],
      currentDraft: createNewDraft(),
      shippingMethods: [],
      pickupLocations: [],
      cart: [],
      cartItemErrors: {},
    });

    return true;
  },

  addDraftToCart() {
    const draft = get().currentDraft;
    const item = draftToCartItem(draft);
    set((state) => ({
      cart: [...state.cart, item],
      cartItemErrors: {
        ...state.cartItemErrors,
        [item.id]: '',
      },
      currentDraft: createNewDraft(),
      shippingMethods: [],
      pickupLocations: [],
    }));
  },

  retryCartItem(id) {
    set((state) => {
      const item = state.cart.find((cartItem) => cartItem.id === id);
      if (!item) {
        return state;
      }

      return {
        currentDraft: JSON.parse(JSON.stringify(item.draft)) as ShipmentDraft,
        cart: state.cart.filter((cartItem) => cartItem.id !== id),
        cartItemErrors: Object.fromEntries(
          Object.entries(state.cartItemErrors).filter(([key]) => key !== id),
        ),
        checkoutError: null,
        checkoutFlowState: 'not-started',
      };
    });
  },

  removeCartItem(id) {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
      cartItemErrors: Object.fromEntries(
        Object.entries(state.cartItemErrors).filter(([key]) => key !== id),
      ),
    }));
  },

  async submitCart() {
    const { cart, selectedPaymentMethod, agreeToTerms } = get();
    if (!cart.length) {
      set({ checkoutError: 'Cart is empty', checkoutFlowState: 'failed-payment' });
      return false;
    }

    if (!selectedPaymentMethod) {
      set({ checkoutError: 'Select a payment method', checkoutFlowState: 'failed-payment' });
      return false;
    }

    if (!agreeToTerms) {
      set({ checkoutError: 'You must agree to terms before payment', checkoutFlowState: 'failed-payment' });
      return false;
    }

    // Stubbed gateway behavior to exercise failed-payment flow in UI
    if (selectedPaymentMethod === 'invoice') {
      set({
        checkoutError: 'Invoice gateway stub returned failed-payment. Use card or wallet and retry.',
        checkoutFlowState: 'failed-payment',
      });
      return false;
    }

    set({ isBusy: true, checkoutError: null, checkoutFlowState: 'pending' });
    const created: ShipmentRecord[] = [];
    const failedItems: CartItem[] = [];
    const nextItemErrors: Record<string, string> = {};
    for (const item of cart) {
      // Stubbed shipment-controller partial failures for parity testing.
      if (item.draft.addons.dangerous) {
        failedItems.push({
          ...item,
          state: 'failed-shipment-can-retry',
        });
        nextItemErrors[item.id] = 'Dangerous goods shipment failed. Review details and retry.';
        continue;
      }

      created.push(await createShipmentFromDraft(item.draft));
    }

    if (!created.length && failedItems.length) {
      set({
        isBusy: false,
        cart: failedItems,
        cartItemErrors: nextItemErrors,
        checkoutFlowState: 'failed-payment',
        checkoutError: 'All shipments failed. Fix failed items and retry.',
      });
      return false;
    }

    set({ checkoutFlowState: 'paid' });

    const [dashboard, nextShipments, tracking] = await Promise.all([
      fetchDashboard(),
      fetchShipments(),
      fetchTrackingHistory(),
    ]);

    set({
      isBusy: false,
      cart: failedItems,
      cartItemErrors: nextItemErrors,
      selectedPaymentMethod: '',
      agreeToTerms: false,
      shipments: nextShipments,
      trackingEvents: tracking,
      trackingSearchResult: tracking,
      dashboardBalance: dashboard.accountBalance,
      lastCheckoutShipments: created,
      currentDraft: createNewDraft(),
      shippingMethods: [],
      pickupLocations: [],
      checkoutFlowState: failedItems.length ? 'failed-payment' : 'shipped',
      checkoutError: failedItems.length
        ? `${failedItems.length} shipment(s) failed. Successful shipments were created.`
        : null,
    });
    return failedItems.length === 0;
  },

  async searchAddressBook(query) {
    const entries = await searchAddressBook(query);
    set({ addressBook: entries });
  },

  async addAddress(entry) {
    await addAddress(entry);
    const entries = await fetchAddressBook();
    set({ addressBook: entries });
  },

  async searchTracking(trackingNumber) {
    if (!trackingNumber.trim()) {
      set({ trackingSearchResult: get().trackingEvents });
      return;
    }

    const events = await trackByNumber(trackingNumber);
    set({ trackingSearchResult: events });
  },
}));

export function useCartTotals() {
  const cart = useAppStore((state) => state.cart);
  return calculateCartTotals(cart);
}

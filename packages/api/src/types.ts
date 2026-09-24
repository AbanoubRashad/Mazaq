import type { CartLine, Fulfilment, PaymentMethod, PickupTime } from '@mazaq/cart';
import type { L10n, MarketCode } from '@mazaq/menu';

export type Service = 'drive-thru' | 'delivery' | 'outdoor-seating' | 'wifi' | 'roastery';

export interface OpeningHours {
  /** e.g. "Sat–Thu" */
  days: L10n;
  open: string; // "07:00"
  close: string; // "23:00"
}

export interface Store {
  id: string;
  market: MarketCode;
  city: L10n;
  cityKey: 'cairo' | 'alexandria' | 'dubai' | 'riyadh' | 'amman' | 'london';
  name: L10n;
  address: L10n;
  lat: number;
  lng: number;
  phone: string;
  hours: OpeningHours[];
  services: Service[];
  /** Placeholder addresses until the client confirms real locations. */
  placeholder: boolean;
}

export interface PlaceOrderInput {
  market: MarketCode;
  lines: CartLine[];
  fulfilment: Fulfilment;
  storeId: string | null;
  pickupTime: PickupTime;
  paymentMethod: PaymentMethod;
  payWithBeans: boolean;
  deliveryAddress?: string;
}

export type OrderStatus = 'received' | 'preparing' | 'ready';

export interface Order {
  id: string;
  number: string; // e.g. "MZ-4821"
  pickupCode: string; // e.g. "K7Q"
  createdAt: string;
  status: OrderStatus;
  input: PlaceOrderInput;
  total: number;
  currency: string;
  beansEarned: number;
  readyAt: string;
}

export type RewardTierId = 'extra' | 'bake' | 'drink' | 'beans';

export interface RewardTier {
  id: RewardTierId;
  beans: 50 | 100 | 150 | 300;
  reward: L10n;
}

export interface RewardsActivity {
  id: string;
  label: L10n;
  date: string; // ISO date
  beans: number; // +16 / -150
}

export interface RewardsAccount {
  memberId: string;
  name: string;
  initials: string;
  level: 'green' | 'gold';
  balance: number;
  tiers: RewardTier[];
  activity: RewardsActivity[];
}

export interface CorporateEnquiry {
  company: string;
  contact: string;
  email: string;
  phone?: string;
  headcount: number;
  date: string;
  message?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  topic: 'order' | 'feedback' | 'careers' | 'press' | 'other';
  message: string;
}

export interface FranchiseEnquiry {
  name: string;
  email: string;
  country: string;
  city: string;
  experience?: string;
}

export interface MazaqApi {
  getStores(query?: string): Promise<Store[]>;
  getStore(id: string): Promise<Store | undefined>;
  placeOrder(input: PlaceOrderInput): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getRewards(): Promise<RewardsAccount>;
  submitCorporateEnquiry(form: CorporateEnquiry): Promise<{ reference: string }>;
  submitFranchiseEnquiry(form: FranchiseEnquiry): Promise<{ reference: string }>;
  submitContact(form: ContactMessage): Promise<{ reference: string }>;
  requestOtp(phone: string): Promise<{ sent: true }>;
  verifyOtp(phone: string, code: string): Promise<{ ok: boolean; name?: string }>;
}

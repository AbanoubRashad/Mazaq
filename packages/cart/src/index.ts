import {
  beansEarned,
  calcItemPrice,
  DEFAULT_MARKET,
  getItem,
  markets,
  vatIncluded,
  type Currency,
  type ItemOptions,
  type MarketCode,
  type MenuItem,
} from '@mazaq/menu';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { createStore, type StoreApi } from 'zustand/vanilla';

export type Fulfilment = 'pickup' | 'delivery';
export type PaymentMethod = 'card' | 'cash';
/** 'asap' or a 24h "HH:mm" slot. */
export type PickupTime = 'asap' | string;

export interface CartLine {
  lineId: string;
  itemId: string;
  qty: number;
  options: ItemOptions;
}

export interface CartData {
  market: MarketCode;
  lines: CartLine[];
  fulfilment: Fulfilment;
  storeId: string | null;
  pickupTime: PickupTime;
  paymentMethod: PaymentMethod;
  payWithBeans: boolean;
}

export interface CartActions {
  add: (itemId: string, options: ItemOptions, qty?: number) => string;
  update: (lineId: string, options: ItemOptions) => void;
  setQty: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  setMarket: (market: MarketCode) => void;
  setFulfilment: (f: Fulfilment) => void;
  setStore: (storeId: string) => void;
  setPickupTime: (t: PickupTime) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
  setPayWithBeans: (on: boolean) => void;
}

export type CartState = CartData & CartActions;
export type CartStore = StoreApi<CartState>;

/** Beans needed to redeem a free drink of any size. */
export const FREE_DRINK_BEANS = 150;

export const initialCart: CartData = {
  market: DEFAULT_MARKET,
  lines: [],
  fulfilment: 'pickup',
  storeId: 'cai-zamalek',
  pickupTime: 'asap',
  paymentMethod: 'card',
  payWithBeans: false,
};

let counter = 0;
const newLineId = () => `l${Date.now().toString(36)}${(counter++).toString(36)}`;

const sameOptions = (a: ItemOptions, b: ItemOptions) => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<keyof ItemOptions>;
  for (const k of keys) if (a[k] !== b[k]) return false;
  return true;
};

export interface CreateCartOptions {
  /** Persist storage (localStorage on web, AsyncStorage on native). Omit for memory only. */
  storage?: StateStorage;
  name?: string;
  /** Defer rehydration until `store.persist.rehydrate()` (avoids SSR hydration mismatches). */
  skipHydration?: boolean;
}

export type PersistedCartStore = CartStore & {
  persist?: { rehydrate: () => Promise<void> | void; hasHydrated: () => boolean };
};

export function createCartStore({
  storage,
  name = 'mazaq-cart',
  skipHydration = false,
}: CreateCartOptions = {}): PersistedCartStore {
  const creator = (
    set: StoreApi<CartState>['setState'],
    get: StoreApi<CartState>['getState'],
  ): CartState => ({
    ...initialCart,
    add: (itemId, options, qty = 1) => {
      const existing = get().lines.find((l) => l.itemId === itemId && sameOptions(l.options, options));
      if (existing) {
        set({ lines: get().lines.map((l) => (l === existing ? { ...l, qty: l.qty + qty } : l)) });
        return existing.lineId;
      }
      const lineId = newLineId();
      set({ lines: [...get().lines, { lineId, itemId, qty, options }] });
      const s = get();
      if (s.fulfilment === 'delivery' && !canDeliver(s.lines)) set({ fulfilment: 'pickup' });
      return lineId;
    },
    update: (lineId, options) =>
      set({ lines: get().lines.map((l) => (l.lineId === lineId ? { ...l, options } : l)) }),
    setQty: (lineId, qty) =>
      set({
        lines:
          qty <= 0
            ? get().lines.filter((l) => l.lineId !== lineId)
            : get().lines.map((l) => (l.lineId === lineId ? { ...l, qty } : l)),
      }),
    remove: (lineId) => set({ lines: get().lines.filter((l) => l.lineId !== lineId) }),
    clear: () => set({ lines: [], payWithBeans: false, pickupTime: 'asap' }),
    setMarket: (market) => set({ market }),
    setFulfilment: (fulfilment) =>
      set({ fulfilment: fulfilment === 'delivery' && !canDeliver(get().lines) ? 'pickup' : fulfilment }),
    setStore: (storeId) => set({ storeId }),
    setPickupTime: (pickupTime) => set({ pickupTime }),
    setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
    setPayWithBeans: (payWithBeans) => set({ payWithBeans }),
  });

  if (!storage) return createStore<CartState>()(creator);

  return createStore<CartState>()(
    persist(creator, {
      name,
      version: 1,
      skipHydration,
      storage: createJSONStorage(() => storage),
      partialize: (s): CartData => ({
        market: s.market,
        lines: s.lines,
        fulfilment: s.fulfilment,
        storeId: s.storeId,
        pickupTime: s.pickupTime,
        paymentMethod: s.paymentMethod,
        payWithBeans: s.payWithBeans,
      }),
    }),
  );
}

export interface ResolvedLine extends CartLine {
  item: MenuItem;
  unitPrice: number;
  lineTotal: number;
}

export function resolveLines(lines: CartLine[], currency: Currency): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const line of lines) {
    const item = getItem(line.itemId);
    if (!item) continue;
    const unitPrice = calcItemPrice(item, line.options, currency);
    out.push({ ...line, item, unitPrice, lineTotal: Math.round(unitPrice * line.qty * 100) / 100 });
  }
  return out;
}

/** Delivery is available only when the basket holds beans only. */
export function canDeliver(lines: CartLine[]): boolean {
  return lines.length > 0 && lines.every((l) => getItem(l.itemId)?.kind === 'beans');
}

export function canPayWithBeans(balance: number, lines: CartLine[]): boolean {
  return balance >= FREE_DRINK_BEANS && lines.some((l) => isDrink(getItem(l.itemId)));
}

const isDrink = (item?: MenuItem) => item?.kind === 'hot' || item?.kind === 'iced';

export interface CartTotals {
  currency: Currency;
  count: number;
  subtotal: number;
  /** Value of the free drink redeemed with beans (0 if not used). */
  beansDiscount: number;
  total: number;
  vat: number;
  vatRate: number;
  beansToEarn: number;
  beansToSpend: number;
}

export function computeTotals(
  data: Pick<CartData, 'lines' | 'market' | 'payWithBeans'>,
  beansBalance = 0,
): CartTotals {
  const market = markets[data.market];
  const resolved = resolveLines(data.lines, market.currency);
  const subtotal = Math.round(resolved.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
  const count = resolved.reduce((s, l) => s + l.qty, 0);

  let beansDiscount = 0;
  if (data.payWithBeans && canPayWithBeans(beansBalance, data.lines)) {
    beansDiscount = Math.max(0, ...resolved.filter((l) => isDrink(l.item)).map((l) => l.unitPrice));
  }
  const total = Math.max(0, Math.round((subtotal - beansDiscount) * 100) / 100);

  return {
    currency: market.currency,
    count,
    subtotal,
    beansDiscount,
    total,
    vat: vatIncluded(total, market.vatRate),
    vatRate: market.vatRate,
    beansToEarn: beansEarned(total, data.market),
    beansToSpend: beansDiscount > 0 ? FREE_DRINK_BEANS : 0,
  };
}

/**
 * Pickup slots: ASAP (~8 min) plus the next 15-minute slots, starting at least
 * 15 minutes from now.
 */
export function pickupSlots(now: Date = new Date(), count = 6): string[] {
  const start = new Date(now.getTime() + 15 * 60_000);
  const minutes = start.getMinutes();
  const rounded = Math.ceil(minutes / 15) * 15;
  start.setMinutes(rounded, 0, 0);
  const slots: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = new Date(start.getTime() + i * 15 * 60_000);
    slots.push(`${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`);
  }
  return slots;
}

export const ASAP_MINUTES = 8;

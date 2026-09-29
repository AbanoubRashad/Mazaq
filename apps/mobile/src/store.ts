import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, type RewardsAccount } from '@mazaq/api';
import { computeTotals, createCartStore, type CartState } from '@mazaq/cart';
import { formatPrice, markets, type Currency, type MarketCode } from '@mazaq/menu';
import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { createStore } from 'zustand/vanilla';
import { useI18n } from './i18n';

/** Shared cart store (packages/cart), persisted with AsyncStorage. */
export const cartStore = createCartStore({ storage: AsyncStorage, name: 'mazaq-cart' });

export function useCart<T>(selector: (s: CartState) => T): T {
  return useStore(cartStore, useShallow(selector));
}

export function useMarket() {
  const code = useCart((s) => s.market);
  return markets[code];
}

export function useTotals(balance = 0) {
  const data = useCart((s) => ({ lines: s.lines, market: s.market, payWithBeans: s.payWithBeans }));
  return computeTotals(data, balance);
}

export function usePrice() {
  const { locale } = useI18n();
  const market = useMarket();
  return (amount: number, currency: Currency = market.currency) => formatPrice(amount, currency, locale);
}

/** App-level settings: onboarding, profile, favourites, notifications. */
interface AppState {
  onboarded: boolean;
  name: string;
  phone: string;
  favourites: string[];
  notifications: boolean;
  lastOrderId: string | null;
  setOnboarded: (name: string, phone: string) => void;
  signOut: () => void;
  toggleFavourite: (slug: string) => void;
  setNotifications: (on: boolean) => void;
  setLastOrder: (id: string) => void;
}

export const appStore = createStore<AppState>()(
  persist(
    (set, get) => ({
      onboarded: false,
      name: 'Nour',
      phone: '',
      favourites: [],
      notifications: true,
      lastOrderId: null,
      setOnboarded: (name, phone) => set({ onboarded: true, name, phone }),
      signOut: () => set({ onboarded: false, phone: '' }),
      toggleFavourite: (slug) => {
        const f = get().favourites;
        set({ favourites: f.includes(slug) ? f.filter((x) => x !== slug) : [...f, slug] });
      },
      setNotifications: (notifications) => set({ notifications }),
      setLastOrder: (lastOrderId) => set({ lastOrderId }),
    }),
    { name: 'mazaq-app', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

export function useApp<T>(selector: (s: AppState) => T): T {
  return useStore(appStore, useShallow(selector));
}

/** Wait for both persisted stores to load from AsyncStorage. */
export function useStoresHydrated() {
  const [ready, setReady] = useState(
    () => !!cartStore.persist?.hasHydrated() && appStore.persist.hasHydrated(),
  );
  useEffect(() => {
    if (ready) return;
    const check = () => {
      if (cartStore.persist?.hasHydrated() !== false && appStore.persist.hasHydrated()) setReady(true);
    };
    const unsubApp = appStore.persist.onFinishHydration(check);
    const t = setInterval(check, 50);
    return () => {
      unsubApp();
      clearInterval(t);
    };
  }, [ready]);
  return ready;
}

let rewardsCache: RewardsAccount | null = null;
export function useRewards() {
  const [data, setData] = useState<RewardsAccount | null>(rewardsCache);
  useEffect(() => {
    let alive = true;
    api.getRewards().then((r) => {
      rewardsCache = r;
      if (alive) setData(r);
    });
    return () => {
      alive = false;
    };
  }, []);
  return data;
}

export type { MarketCode };

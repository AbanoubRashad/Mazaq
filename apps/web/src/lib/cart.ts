'use client';

import { computeTotals, createCartStore, type CartState } from '@mazaq/cart';
import { DEFAULT_MARKET, isMarketCode, markets, type MarketCode } from '@mazaq/menu';
import { useEffect, useSyncExternalStore } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export const MARKET_COOKIE = 'mazaq-market';

const safeStorage = {
  getItem: (k: string) => (typeof window === 'undefined' ? null : window.localStorage.getItem(k)),
  setItem: (k: string, v: string) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(k, v);
  },
  removeItem: (k: string) => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(k);
  },
};

export const cartStore = createCartStore({ storage: safeStorage, skipHydration: true });

let hydrated = false;
const listeners = new Set<() => void>();

function readMarketCookie(): MarketCode | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${MARKET_COOKIE}=([^;]+)`));
  const value = match?.[1];
  return isMarketCode(value) ? value : null;
}

/** Rehydrate the persisted basket once, after mount, then sync the market cookie. */
export function useCartHydration() {
  useEffect(() => {
    if (hydrated) return;
    Promise.resolve(cartStore.persist?.rehydrate()).then(() => {
      const cookieMarket = readMarketCookie();
      if (cookieMarket) cartStore.getState().setMarket(cookieMarket);
      hydrated = true;
      listeners.forEach((l) => l());
    });
  }, []);
}

/** True once the persisted basket has been loaded (always false during SSR). */
export function useHydrated() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => hydrated,
    () => false,
  );
}

export function useCart<T>(selector: (s: CartState) => T): T {
  return useStore(cartStore, useShallow(selector));
}

export function useMarket() {
  const market = useCart((s) => s.market);
  const ready = useHydrated();
  const code = ready ? market : DEFAULT_MARKET;
  return markets[code];
}

export function setMarket(code: MarketCode) {
  document.cookie = `${MARKET_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
  cartStore.getState().setMarket(code);
}

export function useTotals(beansBalance = 0) {
  const data = useCart((s) => ({ lines: s.lines, market: s.market, payWithBeans: s.payWithBeans }));
  const ready = useHydrated();
  return computeTotals(
    ready ? data : { lines: [], market: DEFAULT_MARKET, payWithBeans: false },
    beansBalance,
  );
}

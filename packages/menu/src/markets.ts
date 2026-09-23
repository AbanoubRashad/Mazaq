import type { Currency, L10n, MarketCode, PriceTable } from './types';

export interface Market {
  code: MarketCode;
  currency: Currency;
  name: L10n;
  /** BCP-47 locales used by Intl for EN / AR price formatting. */
  intl: { en: string; ar: string };
  /** VAT rate included in shelf prices. */
  vatRate: number;
  /**
   * Multiplier applied to the EGP price to get a local shelf price.
   * PLACEHOLDER — the client must confirm local price lists per market.
   */
  priceIndex: number;
  /** Rounding step for local prices. */
  roundTo: number;
  /** Spend per bean earned (EGP 10 in Egypt). */
  beanUnit: number;
  /** Free delivery threshold for beans. */
  freeDeliveryOver: number;
  confirmed: boolean;
}

export const markets: Record<MarketCode, Market> = {
  EG: {
    code: 'EG',
    currency: 'EGP',
    name: { en: 'Egypt', ar: 'مصر' },
    intl: { en: 'en-EG', ar: 'ar-EG' },
    vatRate: 0.14,
    priceIndex: 1,
    roundTo: 1,
    beanUnit: 10,
    freeDeliveryOver: 900,
    confirmed: true,
  },
  AE: {
    code: 'AE',
    currency: 'AED',
    name: { en: 'UAE', ar: 'الإمارات' },
    intl: { en: 'en-AE', ar: 'ar-AE' },
    vatRate: 0.05,
    priceIndex: 0.17,
    roundTo: 1,
    beanUnit: 2,
    freeDeliveryOver: 150,
    confirmed: false,
  },
  SA: {
    code: 'SA',
    currency: 'SAR',
    name: { en: 'KSA', ar: 'السعودية' },
    intl: { en: 'en-SA', ar: 'ar-SA' },
    vatRate: 0.15,
    priceIndex: 0.17,
    roundTo: 1,
    beanUnit: 2,
    freeDeliveryOver: 150,
    confirmed: false,
  },
  JO: {
    code: 'JO',
    currency: 'JOD',
    name: { en: 'Jordan', ar: 'الأردن' },
    intl: { en: 'en-JO', ar: 'ar-JO' },
    vatRate: 0.16,
    priceIndex: 0.026,
    roundTo: 0.05,
    beanUnit: 0.25,
    freeDeliveryOver: 25,
    confirmed: false,
  },
  GB: {
    code: 'GB',
    currency: 'GBP',
    name: { en: 'UK', ar: 'المملكة المتحدة' },
    intl: { en: 'en-GB', ar: 'ar' },
    vatRate: 0.2,
    priceIndex: 0.034,
    roundTo: 0.05,
    beanUnit: 0.35,
    freeDeliveryOver: 30,
    confirmed: false,
  },
};

export const marketList = Object.values(markets);
export const DEFAULT_MARKET: MarketCode = 'EG';

export const currencyToMarket = Object.fromEntries(
  marketList.map((m) => [m.currency, m.code]),
) as Record<Currency, MarketCode>;

const round = (value: number, step: number) => Math.round(value / step) * step;
const fix = (n: number) => Math.round(n * 100) / 100;

/** Convert an EGP amount (shelf price or delta) to every market currency. */
export function priceTable(egp: number): PriceTable {
  const table = {} as PriceTable;
  for (const m of marketList) {
    table[m.currency] = m.code === 'EG' ? egp : fix(round(egp * m.priceIndex, m.roundTo));
  }
  return table;
}

/** Local price delta (e.g. +EGP 20 for an extra shot) in the given currency. */
export function delta(egp: number, currency: Currency): number {
  return priceTable(egp)[currency];
}

export function isMarketCode(value: unknown): value is MarketCode {
  return typeof value === 'string' && value in markets;
}

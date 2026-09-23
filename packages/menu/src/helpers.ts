import { menuItems } from './items';
import { delta, markets } from './markets';
import {
  EXTRA_SHOT_EGP,
  grinds,
  iceLevels,
  milks,
  sizes,
  SUBSCRIPTION_DISCOUNT,
  subscriptions,
  sweetnessLevels,
  syrups,
  temperatures,
  weights,
} from './options';
import type {
  Currency,
  ItemOptions,
  Locale,
  MarketCode,
  MenuCategory,
  MenuItem,
  Tag,
} from './types';

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Format a price for display. Arabic uses Arabic-Indic digits and the local
 * currency sign (e.g. "١٤٥ ج.م."); English shows e.g. "EGP 145".
 */
export function formatPrice(amount: number, currency: Currency, locale: Locale = 'en'): string {
  const market = Object.values(markets).find((m) => m.currency === currency) ?? markets.EG;
  const whole = Number.isInteger(round2(amount));
  const opts: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  };
  if (locale === 'ar') {
    return new Intl.NumberFormat(`${market.intl.ar}-u-nu-arab`, opts).format(amount);
  }
  // en: always lead with the ISO code for EGP/AED/SAR/JOD ("EGP 145"), £ for GBP.
  if (currency === 'GBP') return new Intl.NumberFormat('en-GB', opts).format(amount);
  const num = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: opts.minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currency} ${num}`;
}

/** Format a plain number with locale digits (kcal, beans, grams). */
export function formatNumber(value: number, locale: Locale = 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US').format(value);
}

/** Unit price of one item with the given options, in the given currency. VAT included. */
export function calcItemPrice(item: MenuItem, options: ItemOptions, currency: Currency): number {
  let price = item.basePrice[currency];

  if (item.kind === 'beans') {
    const w = weights.find((x) => x.id === (options.weight ?? '250g')) ?? weights[0]!;
    price = price * w.factor;
    if (options.subscription && options.subscription !== 'none') {
      price = price * (1 - SUBSCRIPTION_DISCOUNT);
    }
    return round2(price);
  }

  const size = sizes.find((s) => s.id === options.size);
  if (size?.deltaEGP) price += delta(size.deltaEGP, currency);

  const milk = milks.find((m) => m.id === options.milk);
  if (milk?.deltaEGP) price += delta(milk.deltaEGP, currency);

  const syrup = syrups.find((s) => s.id === options.syrup);
  if (syrup?.deltaEGP) price += delta(syrup.deltaEGP, currency);

  if (options.shots !== undefined && item.defaultShots !== undefined) {
    const extra = Math.max(0, options.shots - item.defaultShots);
    price += extra * delta(EXTRA_SHOT_EGP, currency);
  }

  return round2(price);
}

/** VAT portion of a VAT-inclusive total. For Egypt (14%): total * 14 / 114. */
export function vatIncluded(total: number, vatRate = 0.14): number {
  const pct = Math.round(vatRate * 100);
  return round2((total * pct) / (100 + pct));
}

/** Rewards beans earned for a spend (1 bean per EGP 10 in Egypt). */
export function beansEarned(total: number, market: MarketCode = 'EG'): number {
  return Math.floor(total / markets[market].beanUnit + 1e-9);
}

/** Human summary of chosen options, e.g. "Regular · Oat milk · 2 shots · Less sweet". */
export function describeOptions(item: MenuItem, o: ItemOptions, locale: Locale = 'en'): string {
  const parts: string[] = [];
  const pick = <T extends { id: string; label: Record<Locale, string> }>(list: T[], id?: string) =>
    list.find((x) => x.id === id)?.label[locale];

  if (item.kind === 'beans') {
    const w = pick(weights, o.weight);
    const g = pick(grinds, o.grind);
    const s = o.subscription && o.subscription !== 'none' ? pick(subscriptions, o.subscription) : null;
    return [w, g, s].filter(Boolean).join(' · ');
  }
  if (item.kind === 'food' || item.kind === 'bake') {
    const kcal = locale === 'ar' ? `${formatNumber(item.kcal, 'ar')} سعرة` : `${item.kcal} kcal`;
    if (item.proteinG === undefined) return kcal;
    const protein =
      locale === 'ar' ? `${formatNumber(item.proteinG, 'ar')} جم بروتين` : `${item.proteinG} g protein`;
    return `${kcal} · ${protein}`;
  }
  const size = pick(sizes, o.size);
  if (size) parts.push(size);
  if (o.milk && o.milk !== 'full-cream') {
    const m = pick(milks, o.milk);
    if (m) parts.push(locale === 'ar' ? `حليب ${m}` : `${m} milk`);
  }
  if (o.shots !== undefined && item.defaultShots !== undefined) {
    parts.push(
      locale === 'ar'
        ? `${formatNumber(o.shots, 'ar')} شوت`
        : `${o.shots} ${o.shots === 1 ? 'shot' : 'shots'}`,
    );
  }
  if (o.cardamom) parts.push(locale === 'ar' ? 'بالحبهان' : 'Cardamom');
  if (o.sweetness && o.sweetness !== 'regular') {
    const s = pick(sweetnessLevels, o.sweetness);
    if (s) parts.push(s);
  }
  if (o.ice && o.ice !== 'regular') {
    const i = pick(iceLevels, o.ice);
    if (i) parts.push(i);
  }
  if (o.syrup && o.syrup !== 'none') {
    const s = pick(syrups, o.syrup);
    if (s) parts.push(s);
  }
  if (o.temperature === 'extra-hot') {
    const t = pick(temperatures, o.temperature);
    if (t) parts.push(t);
  }
  return parts.join(' · ');
}

export function getItem(slugOrId: string): MenuItem | undefined {
  return menuItems.find((i) => i.slug === slugOrId || i.id === slugOrId);
}

export const menuCategories: MenuCategory[] = [
  'seasonal',
  'hot-coffee',
  'iced-coffee',
  'coffee-beans',
  'turkish-coffee',
  'healthy-breakfast',
  'bakes',
];

export function isMenuCategory(value: string): value is MenuCategory {
  return (menuCategories as string[]).includes(value);
}

export function itemsInCategory(category: MenuCategory): MenuItem[] {
  switch (category) {
    case 'seasonal':
      return menuItems.filter((i) => i.tags.includes('seasonal'));
    case 'turkish-coffee':
      return menuItems.filter((i) => i.tags.includes('turkish'));
    default:
      return menuItems.filter((i) => i.category === category);
  }
}

export type MenuFilter = 'dairy-free-option' | 'under-200' | 'decaf-available' | 'no-added-sugar';

export function applyFilters(items: MenuItem[], filters: MenuFilter[]): MenuItem[] {
  return items.filter((i) =>
    filters.every((f) => {
      if (f === 'under-200') return i.kcal < 200;
      if (f === 'dairy-free-option') {
        return i.tags.includes('dairy-free-option') || !i.allergens.includes('milk');
      }
      return i.tags.includes(f as Tag);
    }),
  );
}

export type BreakfastFilter = 'high-protein' | 'vegan' | 'gluten-free' | 'under-300';

export function searchItems(query: string, locale: Locale = 'en'): MenuItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return menuItems;
  return menuItems.filter(
    (i) =>
      i.name.en.toLowerCase().includes(q) ||
      i.name.ar.includes(query.trim()) ||
      i.description[locale].toLowerCase().includes(q),
  );
}

export function roastBucket(item: MenuItem): 'light' | 'medium' | 'dark' | null {
  const lvl = item.bean?.roastLevel;
  if (!lvl) return null;
  if (lvl <= 2) return 'light';
  if (lvl === 3) return 'medium';
  return 'dark';
}

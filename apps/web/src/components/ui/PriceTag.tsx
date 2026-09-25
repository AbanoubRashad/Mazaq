'use client';

import { formatPrice, type Currency, type PriceTable } from '@mazaq/menu';
import { useLocale } from 'next-intl';
import { useMarket } from '@/lib/cart';

/**
 * Renders a price in the visitor's market currency (cookie) and locale digits.
 * Server render shows EGP; the client switches after hydration.
 */
export function PriceTag({
  prices,
  amount,
  currency,
  className,
}: {
  prices?: PriceTable;
  amount?: number;
  currency?: Currency;
  className?: string;
}) {
  const locale = useLocale();
  const market = useMarket();
  const cur = currency ?? market.currency;
  const value = amount ?? prices?.[cur] ?? 0;
  return (
    <span className={className} dir="auto">
      {formatPrice(value, cur, locale)}
    </span>
  );
}

export function useFormatPrice() {
  const locale = useLocale();
  const market = useMarket();
  return (amount: number, currency: Currency = market.currency) => formatPrice(amount, currency, locale);
}

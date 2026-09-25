'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useTotals } from '@/lib/cart';
import { useFormatPrice } from '../ui/PriceTag';

/** Bottom "Order ahead" bar on small screens; becomes "View basket" once items are added. */
export function MobileOrderBar() {
  const t = useTranslations();
  const pathname = usePathname();
  const totals = useTotals();
  const fmt = useFormatPrice();
  if (pathname.startsWith('/checkout')) return null;

  const hasItems = totals.count > 0;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
      <Link
        href={hasItems ? '/checkout' : '/menu/seasonal'}
        className="flex h-14 items-center justify-between rounded-[18px] bg-teal-800 px-5 font-bold text-white"
      >
        {hasItems ? (
          <>
            <span className="flex items-center gap-2 text-[14px]">
              <span className="rounded-[10px] bg-saffron-500 px-2 py-0.5 text-teal-800">{totals.count}</span>
              {t('app.viewBasket')}
            </span>
            <span>{fmt(totals.total, totals.currency)}</span>
          </>
        ) : (
          <span className="w-full text-center">{t('common.orderAhead')}</span>
        )}
      </Link>
    </div>
  );
}

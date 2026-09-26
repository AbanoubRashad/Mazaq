import { formatNumber, type Locale, type MenuItem } from '@mazaq/menu';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ProductImage } from '../ProductImage';
import { PriceTag } from '../ui/PriceTag';
import { QuickAdd } from './QuickAdd';

/** Menu grid card: photo with quick-add "+", name, price and kcal. Opens the drawer. */
export async function ProductCard({
  item,
  locale,
  href,
  priority,
}: {
  item: MenuItem;
  locale: Locale;
  href: string;
  priority?: boolean;
}) {
  const t = await getTranslations();
  const name = item.name[locale];
  return (
    <article className="lift-img flex flex-col gap-3">
      <div className="relative aspect-[324/250] overflow-hidden rounded-[18px]" style={{ background: item.art.tone }}>
        <Link href={href} scroll={false} aria-label={t('menu.customize', { name })} className="absolute inset-0">
          <ProductImage item={item} locale={locale} sizes="(min-width: 1024px) 324px, (min-width: 640px) 45vw, 100vw" priority={priority} />
        </Link>
        {item.tags.includes('seasonal') || item.tags.includes('bestseller') ? (
          <span className="pointer-events-none absolute start-4 top-4 rounded-[12px] bg-saffron-500 px-2.5 py-1.5 font-mono text-[12px] font-bold tracking-[1px] text-teal-800">
            {item.tags.includes('seasonal') ? t('common.seasonal') : t('common.bestseller')}
          </span>
        ) : null}
        <QuickAdd item={item} name={name} className="absolute bottom-3.5 end-3.5" />
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[20px] font-bold leading-tight">
          <Link href={href} scroll={false} className="hover:underline">
            {name}
          </Link>
        </h3>
        <PriceTag prices={item.basePrice} className="whitespace-nowrap text-[15px] font-bold" />
      </div>
      <p className="-mt-1.5 font-mono text-[12px] text-muted">
        {t('common.kcalUpper', { value: formatNumber(item.kcal, locale) })}
        {item.proteinG !== undefined ? ` · ${t('common.proteinUpper', { value: formatNumber(item.proteinG, locale) })}` : ''}
        {item.placeholder ? ` · ${t('menu.placeholderItem')}` : ''}
      </p>
    </article>
  );
}

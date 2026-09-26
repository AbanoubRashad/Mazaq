import { formatNumber, type Locale, type MenuItem } from '@mazaq/menu';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { BeanBag } from '../BeanBag';
import { ProductImage } from '../ProductImage';
import { AddToBasketButton } from '../product/QuickAdd';
import { RoastMeter } from '../RoastMeter';
import { PriceTag } from '../ui/PriceTag';

export async function BeanCard({ item, locale }: { item: MenuItem; locale: Locale }) {
  const t = await getTranslations();
  const bean = item.bean!;
  return (
    <article className="lift-img flex w-full flex-col overflow-hidden rounded-[20px] bg-white">
      <Link href={`/beans/${item.slug}`} className="relative block aspect-[302/280]" style={{ background: item.art.tone }}>
        <BeanBag
          origin={bean.origin}
          label={bean.label}
          region={bean.region.en}
          className="lift-target h-full w-full"
          title={`${item.name[locale]} — ${t('common.brand')}`}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3.5 p-[22px]">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-[22px] font-bold leading-tight">
            <Link href={`/beans/${item.slug}`} className="hover:underline">
              {item.name[locale]}
            </Link>
          </h3>
          <p className="font-mono text-[12px] uppercase text-muted">
            {bean.region[locale]} · {bean.altitude}
          </p>
        </div>
        <div className="flex items-center gap-2.5 text-[13px] text-muted">
          <span className="min-w-[92px]">
            {t('home.beans.roast', { level: t(`beans.roastLevels.${bean.roast}`) })}
          </span>
          <RoastMeter level={bean.roastLevel} label={t('home.beans.roastMeter', { value: formatNumber(bean.roastLevel, locale) })} />
        </div>
        <ul className="flex flex-wrap gap-1.5" aria-label={t('beans.tastingNotes')}>
          {bean.notes.map((n) => (
            <li key={n.en} className="rounded-[12px] bg-ground px-2.5 py-1 text-[13px]">
              {n[locale]}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
          <div>
            <PriceTag prices={item.basePrice} className="text-[18px] font-bold" />{' '}
            <span className="text-[13px] text-muted">{t('common.per250')}</span>
          </div>
          <AddToBasketButton item={item} label={t('common.addToBasket')} />
        </div>
      </div>
    </article>
  );
}

export async function DrinkCard({ item, locale }: { item: MenuItem; locale: Locale }) {
  const t = await getTranslations();
  const badge = item.tags.includes('seasonal')
    ? t('common.seasonal')
    : item.tags.includes('bestseller')
      ? t('common.bestseller')
      : null;
  const href = `/menu/${item.category}?item=${item.slug}`;
  return (
    <article className="lift-img flex w-full flex-col gap-4">
      <Link href={href} className="relative block aspect-[302/320] overflow-hidden rounded-[20px]" style={{ background: item.art.tone }}>
        <ProductImage item={item} locale={locale} sizes="(min-width: 1024px) 302px, (min-width: 640px) 45vw, 100vw" />
        {badge && (
          <span className="absolute start-4 top-4 rounded-[12px] bg-saffron-500 px-2.5 py-1.5 font-mono text-[12px] font-bold tracking-[1px] text-teal-800">
            {badge}
          </span>
        )}
      </Link>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[22px] font-bold leading-tight">
          <Link href={href} className="hover:underline">
            {item.name[locale]}
          </Link>
        </h3>
        <PriceTag prices={item.basePrice} className="whitespace-nowrap text-[16px] font-bold" />
      </div>
      <p className="-mt-2 text-[15px] leading-normal text-muted">{item.description[locale]}</p>
      <p className="font-mono text-[12px] text-muted">
        {t('common.kcalUpper', { value: formatNumber(item.kcal, locale) })} · {t('home.drinks.regular')}
      </p>
    </article>
  );
}

export async function BreakfastCard({ item, locale }: { item: MenuItem; locale: Locale }) {
  const t = await getTranslations();
  const href = `/menu/healthy-breakfast?item=${item.slug}`;
  return (
    <article className="lift-img flex w-full items-center gap-5 rounded-[20px] bg-white p-4">
      <Link
        href={href}
        className="relative aspect-square w-[120px] shrink-0 overflow-hidden rounded-[14px] sm:w-[168px]"
        style={{ background: item.art.tone }}
        tabIndex={-1}
        aria-hidden
      >
        <ProductImage item={item} locale={locale} sizes="168px" />
      </Link>
      <div className="flex min-w-0 flex-col gap-2.5">
        <h3 className="font-display text-[21px] font-bold leading-tight">
          <Link href={href} className="hover:underline">
            {item.name[locale]}
          </Link>
        </h3>
        <p className="text-[14px] leading-normal text-muted">{item.description[locale]}</p>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-[8px] bg-sage-100 px-2 py-1 font-mono text-[12px] font-medium">
            {t('common.kcalUpper', { value: formatNumber(item.kcal, locale) })}
          </span>
          <span className="rounded-[8px] bg-sage-100 px-2 py-1 font-mono text-[12px] font-medium">
            {t('common.proteinUpper', { value: formatNumber(item.proteinG ?? 0, locale) })}
          </span>
        </div>
        <PriceTag prices={item.basePrice} className="text-[16px] font-bold" />
      </div>
    </article>
  );
}

export function CategoryCard({
  href,
  title,
  line,
  image,
  alt,
}: {
  href: string;
  title: string;
  line: string;
  image: string;
  alt: string;
}) {
  return (
    <Link href={href} className="lift-img group flex flex-col gap-4 text-ink">
      <div className="relative aspect-[302/240] overflow-hidden rounded-[151px_151px_20px_20px] bg-sand">
        <Image src={image} alt={alt} fill sizes="(min-width: 1024px) 302px, 50vw" className="object-cover" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-display text-[24px] font-bold group-hover:underline">{title}</span>
        <span className="text-[15px] leading-normal text-muted">{line}</span>
      </div>
    </Link>
  );
}

import { getItem, menuItems } from '@mazaq/menu';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { BreakfastCard } from '@/components/home/Cards';
import { JsonLd } from '@/components/JsonLd';
import { allergenLine } from '@/components/product/AllergenLine';
import { CustomizePanel } from '@/components/product/CustomizePanel';
import { NutritionTable } from '@/components/product/NutritionTable';
import { ProductImage } from '@/components/ProductImage';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { pageMetadata, SITE_URL } from '@/lib/seo';

type Params = { locale: 'en' | 'ar'; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    menuItems.filter((i) => i.kind !== 'beans').map((i) => ({ locale, slug: i.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = getItem(slug);
  if (!item) return {};
  return pageMetadata({
    locale,
    path: `/product/${slug}`,
    title: item.name[locale],
    description: item.description[locale],
    image: item.image ? `/images/${item.image.src}` : undefined,
  });
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const item = getItem(slug);
  if (!item || item.kind === 'beans') notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const pair = item.pairsWith ? getItem(item.pairsWith) : undefined;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'MenuItem',
    name: item.name[locale],
    description: item.description[locale],
    image: item.image ? `${SITE_URL}/images/${item.image.src}` : undefined,
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${item.kcal} calories`,
      ...(item.proteinG !== undefined ? { proteinContent: `${item.proteinG} g` } : {}),
    },
    offers: { '@type': 'Offer', price: item.basePrice.EGP, priceCurrency: 'EGP' },
  };

  return (
    <div className="px-4 py-8 lg:px-20 lg:py-12">
      <JsonLd data={ld} />
      <nav aria-label="Breadcrumb" className="mb-6 text-[14px] text-muted">
        <Link href="/" className="hover:underline">
          {t('product.breadcrumbHome')}
        </Link>{' '}
        /{' '}
        <Link href={`/menu/${item.category}`} className="hover:underline">
          {t(`categories.${item.category}`)}
        </Link>{' '}
        / <span aria-current="page">{item.name[locale]}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-16">
        <div className="flex flex-col gap-10">
          <div className="arch relative aspect-[4/5] max-h-[720px] overflow-hidden lg:aspect-[5/6]" style={{ background: item.art.tone }}>
            <ProductImage item={item} locale={locale} sizes="(min-width: 1024px) 50vw, 100vw" priority />
          </div>
          <div className="hidden lg:block">
            <NutritionTable item={item} locale={locale} />
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            {item.category === 'healthy-breakfast' && (
              <p className="eyebrow text-sage-600">{t('product.servedUntil')}</p>
            )}
            <h1 className="font-display text-[40px] font-extrabold leading-none display-tight lg:text-[56px]">
              {item.name[locale]}
            </h1>
            <p className="text-[17px] leading-normal text-muted">{item.description[locale]}</p>
            <p className="font-mono text-[12px] text-muted">{allergenLine(item, t, locale)}</p>
            {item.image?.credit.confirmed && (
              <p className="text-[12px] text-muted">{t('common.photoBy', { name: item.image.credit.name })}</p>
            )}
          </div>
          <div className="rounded-[20px] bg-white p-6 lg:p-8">
            <CustomizePanel item={item} layout="page" />
          </div>
          <div className="lg:hidden">
            <NutritionTable item={item} locale={locale} />
          </div>
          {pair && (
            <section aria-labelledby="pair-h" className="flex flex-col gap-3">
              <h2 id="pair-h" className="font-display text-[24px] font-bold">
                {t('product.pairsWell')}
              </h2>
              <BreakfastCard item={pair} locale={locale} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

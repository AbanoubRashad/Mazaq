import { formatNumber, getItem, itemsInCategory } from '@mazaq/menu';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BeanBag } from '@/components/BeanBag';
import { BrewGuide } from '@/components/BrewGuide';
import { JsonLd } from '@/components/JsonLd';
import { CustomizePanel } from '@/components/product/CustomizePanel';
import { RoastMeter } from '@/components/RoastMeter';
import { Tabs } from '@/components/ui/Tabs';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { pageMetadata, SITE_URL } from '@/lib/seo';

type Params = { locale: 'en' | 'ar'; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    itemsInCategory('coffee-beans').map((b) => ({ locale, slug: b.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = getItem(slug);
  if (!item?.bean) return {};
  return pageMetadata({
    locale,
    path: `/beans/${slug}`,
    title: item.name[locale],
    description: `${item.description[locale]} ${item.bean.notes.map((n) => n[locale]).join(', ')}.`,
  });
}

export default async function BeanPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const item = getItem(slug);
  if (!item?.bean) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const bean = item.bean;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name.en,
    description: item.description.en,
    brand: { '@type': 'Brand', name: 'Mazaq' },
    category: 'Coffee beans',
    sku: `MZQ-${item.slug.toUpperCase()}-250`,
    image: `${SITE_URL}/images/coffee-beans-closeup.jpg`,
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Origin', value: bean.region.en },
      { '@type': 'PropertyValue', name: 'Altitude', value: bean.altitude },
      { '@type': 'PropertyValue', name: 'Process', value: bean.process.en },
      { '@type': 'PropertyValue', name: 'Roast', value: bean.roast },
    ],
    offers: {
      '@type': 'Offer',
      price: item.basePrice.EGP,
      priceCurrency: 'EGP',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/${locale}/beans/${slug}`,
    },
  };

  const originRows: [string, string][] = [
    [t('beans.region'), bean.region[locale]],
    [t('beans.altitude'), bean.altitude],
    [t('beans.process'), bean.process[locale]],
    [t('beans.varietal'), bean.varietal[locale]],
    [t('beans.roast'), t(`beans.roastLevels.${bean.roast}`)],
  ];

  const originPanel = (
    <div className="grid gap-8 lg:grid-cols-2">
      <table className="w-full self-start overflow-hidden rounded-[18px] bg-white text-[15px]">
        <caption className="sr-only">{t('beans.origin')}</caption>
        <tbody>
          {originRows.map(([k, v]) => (
            <tr key={k} className="border-b border-line last:border-0">
              <th scope="row" className="px-5 py-3.5 text-start font-semibold">
                {k}
              </th>
              <td className="px-5 py-3.5 text-end font-mono text-[14px] uppercase" dir="auto">
                {v}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col gap-4">
        <h3 className="font-display text-[22px] font-bold">{t('beans.story')}</h3>
        <p className="text-[16px] leading-relaxed text-muted">{bean.story[locale]}</p>
        <div className="relative aspect-[3/2] overflow-hidden rounded-[18px]">
          <Image
            src={bean.blend ? '/images/coffee-cherries.jpg' : '/images/coffee-farm.jpg'}
            alt={
              bean.blend
                ? locale === 'ar'
                  ? 'يد تمسك غصنًا من ثمار البن'
                  : 'Hand holding a branch of coffee cherries'
                : locale === 'ar'
                  ? 'مزارعة تقطف ثمار البن الناضجة'
                  : 'Farmer hand-picking ripe coffee cherries'
            }
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-8 lg:px-20 lg:py-12">
      <JsonLd data={ld} />
      <nav aria-label="Breadcrumb" className="mb-6 text-[14px] text-muted">
        <Link href="/beans" className="hover:underline">
          {t('nav.beans')}
        </Link>{' '}
        / <span aria-current="page">{item.name[locale]}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-16">
        <div className="arch relative aspect-square overflow-hidden lg:aspect-[5/6]" style={{ background: item.art.tone }}>
          <BeanBag
            origin={bean.origin}
            label={bean.label}
            region={bean.region.en}
            className="absolute inset-0 h-full w-full"
            title={`${item.name[locale]} — Mazaq 250 g bag`}
          />
        </div>
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[12px] uppercase tracking-[1.5px] text-brown-600">
              {bean.region[locale]} · {bean.altitude} · {bean.process[locale]}
            </p>
            <h1 className="font-display text-[40px] font-extrabold leading-none display-tight lg:text-[56px]">
              {item.name[locale]}
            </h1>
            <p className="text-[17px] leading-normal text-muted">{item.description[locale]}</p>
            <div className="flex items-center gap-3 text-[14px] text-muted">
              <span>{t('home.beans.roast', { level: t(`beans.roastLevels.${bean.roast}`) })}</span>
              <RoastMeter level={bean.roastLevel} label={t('home.beans.roastMeter', { value: formatNumber(bean.roastLevel, locale) })} />
            </div>
            <ul className="flex flex-wrap gap-1.5" aria-label={t('beans.tastingNotes')}>
              {bean.notes.map((n) => (
                <li key={n.en} className="rounded-[12px] bg-white px-3 py-1.5 text-[14px]">
                  {n[locale]}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[20px] bg-white p-6 lg:p-8">
            <CustomizePanel item={item} layout="page" />
          </div>
        </div>
      </div>
      <section className="mt-14" aria-label={t('beans.tabsLabel')}>
        <Tabs
          label={t('beans.tabsLabel')}
          tabs={[
            { id: 'origin', label: t('beans.origin'), panel: originPanel },
            { id: 'brew', label: t('beans.brewing'), panel: <BrewGuide highlight={bean.origin === 'turkish' ? 'turkish' : undefined} /> },
          ]}
        />
      </section>
    </div>
  );
}

import { stores } from '@mazaq/api';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Suspense } from 'react';
import { JsonLd } from '@/components/JsonLd';
import { StoreFinder } from '@/components/stores/StoreFinder';
import { pageMetadata, SITE_URL } from '@/lib/seo';

type Props = { params: Promise<{ locale: 'en' | 'ar' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'stores' });
  return pageMetadata({ locale, path: '/stores', title: t('metaTitle'), description: t('metaDescription'), image: '/images/cafe-interior.jpg' });
}

const dayMap: Record<string, string[]> = {
  'Every day': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  'Sun–Thu': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  'Fri–Sat': ['Friday', 'Saturday'],
  'Mon–Fri': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  'Sat–Sun': ['Saturday', 'Sunday'],
};

export default async function StoresPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('stores');

  const ld = stores.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${SITE_URL}/${locale}/stores#${s.id}`,
    name: s.name[locale],
    image: `${SITE_URL}/images/cafe-interior.jpg`,
    telephone: s.phone,
    servesCuisine: 'Coffee',
    priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: s.address.en, addressLocality: s.city.en, addressCountry: s.market },
    geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng },
    hasMap: `https://www.google.com/maps?q=${s.lat},${s.lng}`,
    openingHoursSpecification: s.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayMap[h.days.en] ?? [],
      opens: h.open,
      closes: h.close === '00:00' ? '23:59' : h.close,
    })),
  }));

  return (
    <>
      <JsonLd data={ld} />
      <section className="relative overflow-hidden bg-teal-800 text-on-teal">
        <Image src="/images/cafe-interior.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
        <div className="relative flex flex-col gap-4 px-5 py-16 lg:px-20 lg:py-20">
          <h1 className="font-display text-[44px] font-extrabold leading-none tracking-[-0.03em] lg:text-[72px]">{t('title')}</h1>
          <p className="text-[18px] text-on-teal-muted">{t('body')}</p>
        </div>
      </section>
      <section className="px-4 py-10 lg:px-20 lg:py-14">
        <Suspense fallback={null}>
          <StoreFinder />
        </Suspense>
      </section>
    </>
  );
}

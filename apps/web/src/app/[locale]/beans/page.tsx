import { formatPrice, itemsInCategory, markets } from '@mazaq/menu';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { BrewGuide } from '@/components/BrewGuide';
import { BeanCard } from '@/components/home/Cards';
import { JsonLd } from '@/components/JsonLd';
import { pageMetadata, SITE_URL } from '@/lib/seo';

type Props = { params: Promise<{ locale: 'en' | 'ar' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'beans' });
  return pageMetadata({ locale, path: '/beans', title: t('metaTitle'), description: t('metaDescription'), image: '/images/coffee-beans.jpg' });
}

export default async function BeansPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const beans = itemsInCategory('coffee-beans');

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: beans.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${locale}/beans/${b.slug}`,
      name: b.name[locale],
    })),
  };

  return (
    <>
      <JsonLd data={ld} />
      <section className="relative overflow-hidden bg-teal-800 text-on-teal">
        <Image src="/images/coffee-beans.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
        <div className="relative flex max-w-[760px] flex-col gap-5 px-5 py-16 lg:px-20 lg:py-24">
          <p className="eyebrow text-saffron-500">{t('beans.eyebrow')}</p>
          <h1 className="font-display text-[44px] font-extrabold leading-none tracking-[-0.03em] lg:text-[72px]">
            {t('beans.title')}
          </h1>
          <p className="text-[17px] leading-[1.55] text-on-teal-muted lg:text-[19px]">{t('beans.body')}</p>
          <p className="font-mono text-[13px] tracking-[1px] uppercase">
            {t('beans.freeDelivery', { amount: formatPrice(markets.EG.freeDeliveryOver, 'EGP', locale) })} · {t('beans.delivery')}
          </p>
        </div>
      </section>
      <section className="px-5 py-14 lg:px-20 lg:py-[72px]">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {beans.map((b) => (
            <li key={b.id} className="flex">
              <BeanCard item={b} locale={locale} />
            </li>
          ))}
        </ul>
      </section>
      <section id="brewing" aria-labelledby="brew-h" className="flex flex-col gap-6 bg-sage-100 px-5 py-14 lg:px-20 lg:py-[72px]">
        <h2 id="brew-h" className="font-display text-[34px] font-extrabold display-tight lg:text-[48px]">
          {t('beans.brewing')}
        </h2>
        <BrewGuide />
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: 'en' | 'ar' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.story' });
  return pageMetadata({ locale, path: '/our-story', title: t('metaTitle'), description: t('lead'), image: '/images/barista-pour-over.jpg' });
}

export default async function StoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.story');
  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
        image="/images/barista-pour-over.jpg"
        imageAlt={locale === 'ar' ? 'باريستا يصب الماء في أداة التقطير' : 'Barista pouring water into a pour-over brewer'}
      />
      <section className="grid gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-20 lg:py-20">
        <div className="flex flex-col gap-5 text-[18px] leading-relaxed">
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-[20px]">
          <Image src="/images/cafe-interior.jpg" alt={locale === 'ar' ? 'مقهى مختص مشرق بالنباتات' : 'Bright café interior with plants'} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>
      <section aria-labelledby="values-h" className="flex flex-col gap-8 bg-white px-5 py-16 lg:px-20 lg:py-20">
        <h2 id="values-h" className="font-display text-[34px] font-extrabold display-tight lg:text-[48px]">
          {t('valuesTitle')}
        </h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {([1, 2, 3] as const).map((n) => (
            <li key={n} className="flex flex-col gap-2 border-t-2 border-ink pt-4">
              <h3 className="font-display text-[24px] font-bold">{t(`v${n}Title`)}</h3>
              <p className="text-[16px] leading-relaxed text-muted">{t(`v${n}`)}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

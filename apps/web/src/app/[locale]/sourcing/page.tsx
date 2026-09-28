import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/ui/Button';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: 'en' | 'ar' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.sourcing' });
  return pageMetadata({ locale, path: '/sourcing', title: t('metaTitle'), description: t('lead'), image: '/images/coffee-farm.jpg' });
}

export default async function SourcingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const stats = t.raw('pages.sourcing.stats') as { value: string; label: string }[];
  return (
    <>
      <PageHero
        eyebrow={t('pages.sourcing.eyebrow')}
        title={t('pages.sourcing.title')}
        lead={t('pages.sourcing.lead')}
        image="/images/coffee-farm.jpg"
        imageAlt={locale === 'ar' ? 'مزارعة تقطف ثمار البن الناضجة يدويًا' : 'Farmer hand-picking ripe coffee cherries'}
      />
      <section className="grid gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-20 lg:py-20">
        <div className="flex flex-col gap-5 text-[18px] leading-relaxed">
          <p>{t('pages.sourcing.p1')}</p>
          <p>{t('pages.sourcing.p2')}</p>
          <ButtonLink href="/beans" className="self-start">
            {t('nav.beans')}
          </ButtonLink>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-[20px]">
          <Image src="/images/coffee-cherries.jpg" alt={locale === 'ar' ? 'يد تمسك غصنًا من ثمار البن' : 'Hand holding a branch of coffee cherries'} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>
      <section className="bg-sage-100 px-5 py-14 lg:px-20">
        <dl className="grid gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1 border-t-2 border-ink pt-4">
              <dt className="font-mono text-[12px] tracking-[1.5px] text-muted uppercase">{s.label}</dt>
              <dd className="font-display text-[40px] font-extrabold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

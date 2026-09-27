import { formatNumber } from '@mazaq/menu';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RewardsSignup } from '@/components/forms/Forms';
import { JsonLd } from '@/components/JsonLd';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: 'en' | 'ar' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'rewards' });
  return pageMetadata({ locale, path: '/rewards', title: t('metaTitle'), description: t('metaDescription') });
}

const tiers = [
  { beans: 50, en: 'Extra shot or syrup', ar: 'شوت إضافي أو سيرب' },
  { beans: 100, en: 'Any bake or breakfast', ar: 'أي مخبوزات أو فطار' },
  { beans: 150, en: 'Any drink, any size', ar: 'أي مشروب بأي حجم' },
  { beans: 300, en: '250 g bag of beans', ar: 'كيس بن ٢٥٠ جم' },
];

export default async function RewardsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('rewards');
  const faq = t.raw('faq') as { q: string; a: string }[];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <section className="grid gap-10 bg-teal-800 px-5 py-16 text-on-teal lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:px-20 lg:py-20">
        <div className="flex flex-col gap-6">
          <p className="eyebrow text-saffron-500">{t('eyebrow')}</p>
          <h1 className="font-display text-[44px] font-extrabold leading-none tracking-[-0.03em] lg:text-[72px]">{t('title')}</h1>
          <p className="max-w-[560px] text-[18px] leading-[1.55] text-on-teal-muted">{t('body')}</p>
        </div>
        <div id="join" className="flex scroll-mt-28 flex-col gap-3">
          <h2 className="font-display text-[24px] font-bold">{t('signupTitle')}</h2>
          <RewardsSignup />
        </div>
      </section>

      <section aria-labelledby="how-h" className="flex flex-col gap-8 px-5 py-16 lg:px-20 lg:py-20">
        <h2 id="how-h" className="font-display text-[34px] font-extrabold display-tight lg:text-[48px]">
          {t('howTitle')}
        </h2>
        <ol className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className="flex flex-col gap-3 rounded-[20px] bg-white p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-saffron-500 font-display text-[20px] font-extrabold text-teal-800">
                {formatNumber(n, locale)}
              </span>
              <h3 className="font-display text-[22px] font-bold">{t(`how${n as 1 | 2 | 3}Title`)}</h3>
              <p className="text-[15px] leading-normal text-muted">{t(`how${n as 1 | 2 | 3}`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="tiers-h" className="flex flex-col gap-8 bg-white px-5 py-16 lg:px-20 lg:py-20">
        <h2 id="tiers-h" className="font-display text-[34px] font-extrabold display-tight lg:text-[48px]">
          {t('tiersTitle')}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <li key={tier.beans} className="flex flex-col gap-2 rounded-[20px] border border-line p-6">
              <span className="font-display text-[48px] font-extrabold leading-none text-brown-600">
                {formatNumber(tier.beans, locale)}
              </span>
              <span className="font-mono text-[12px] tracking-[1.5px] text-muted uppercase">
                {t('tier', { beans: formatNumber(tier.beans, locale) })}
              </span>
              <span className="text-[17px] font-semibold">{locale === 'ar' ? tier.ar : tier.en}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq-h" className="flex flex-col gap-6 px-5 py-16 lg:px-20 lg:py-20">
        <h2 id="faq-h" className="font-display text-[34px] font-extrabold display-tight lg:text-[48px]">
          {t('faqTitle')}
        </h2>
        <div className="flex max-w-[860px] flex-col gap-3">
          {faq.map((f) => (
            <details key={f.q} className="group rounded-[18px] bg-white p-5 open:pb-6">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-bold">
                {f.q}
                <span aria-hidden className="text-[22px] text-teal-800 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-[16px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

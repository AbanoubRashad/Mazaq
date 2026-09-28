import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CorporateForm } from '@/components/forms/Forms';
import { PageHero } from '@/components/PageHero';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: 'en' | 'ar' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.corporate' });
  return pageMetadata({ locale, path: '/corporate', title: t('metaTitle'), description: t('lead') });
}

export default async function CorporatePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.corporate');
  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
        image="/images/pastries-latte.jpg"
        imageAlt={locale === 'ar' ? 'معجنات حول كوب لاتيه' : 'Pastries around a latte'}
      />
      <section aria-labelledby="form-h" className="flex max-w-[900px] flex-col gap-6 px-5 py-16 lg:px-20">
        <h2 id="form-h" className="font-display text-[34px] font-extrabold display-tight">
          {t('formTitle')}
        </h2>
        <CorporateForm />
      </section>
    </>
  );
}

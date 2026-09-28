import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FranchiseForm } from '@/components/forms/Forms';
import { CheckIcon } from '@/components/icons';
import { PageHero } from '@/components/PageHero';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: 'en' | 'ar' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.franchise' });
  return pageMetadata({ locale, path: '/franchise', title: t('metaTitle'), description: t('lead') });
}

export default async function FranchisePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.franchise');
  const points = t.raw('points') as string[];
  return (
    <>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
        image="/images/cafe-interior.jpg"
        imageAlt={locale === 'ar' ? 'مقهى مختص مشرق' : 'Bright specialty café interior'}
      />
      <section className="grid gap-10 px-5 py-16 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-16 lg:px-20">
        <ul className="flex flex-col gap-4">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-[17px]">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-saffron-500 text-teal-800">
                <CheckIcon size={16} />
              </span>
              {p}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-[34px] font-extrabold display-tight">{t('formTitle')}</h2>
          <FranchiseForm />
        </div>
      </section>
    </>
  );
}

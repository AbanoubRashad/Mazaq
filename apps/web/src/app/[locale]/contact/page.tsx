import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/forms/Forms';
import { PageHero } from '@/components/PageHero';
import { Link } from '@/i18n/navigation';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: 'en' | 'ar' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.contact' });
  return pageMetadata({ locale, path: '/contact', title: t('metaTitle'), description: t('lead') });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <>
      <PageHero eyebrow={t('pages.contact.eyebrow')} title={t('pages.contact.title')} lead={t('pages.contact.lead')} />
      <section className="grid gap-10 px-5 py-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:px-20">
        <ContactForm />
        <aside className="flex flex-col gap-4 text-[16px]">
          <p className="font-semibold" dir="auto">
            {t('pages.contact.hotline')}
          </p>
          <a href={`mailto:${t('pages.contact.email')}`} className="font-semibold text-teal-800 underline" dir="ltr">
            {t('pages.contact.email')}
          </a>
          <Link href="/stores" className="font-semibold text-teal-800 underline">
            {t('nav.findStore')}
          </Link>
        </aside>
      </section>
    </>
  );
}

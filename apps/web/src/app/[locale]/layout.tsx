import { dir } from '@mazaq/i18n';
import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Bricolage_Grotesque, Figtree, IBM_Plex_Mono, IBM_Plex_Sans_Arabic, Reem_Kufi } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { CartHydrator } from '@/components/layout/HeaderControls';
import { MobileOrderBar } from '@/components/layout/MobileOrderBar';
import { routing } from '@/i18n/routing';
import { localeAlternates, SITE_URL } from '@/lib/seo';
import '../globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});
const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-figtree',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
  preload: false,
});
const reemKufi = Reem_Kufi({
  subsets: ['arabic'],
  weight: ['700'],
  variable: '--font-reem-kufi',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#0E3B36',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as 'en' | 'ar', namespace: 'home' });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t('metaTitle'), template: locale === 'ar' ? '%s | مذاق' : '%s | Mazaq' },
    description: t('metaDescription'),
    alternates: localeAlternates(locale, ''),
    applicationName: 'Mazaq',
    icons: { icon: '/icon.svg' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('common');

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${bricolage.variable} ${figtree.variable} ${plexMono.variable} ${plexArabic.variable} ${reemKufi.variable}`}
    >
      <body className="min-h-dvh bg-ground">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-saffron-500 focus:px-5 focus:py-3 focus:font-bold focus:text-teal-800"
          >
            {t('skipToContent')}
          </a>
          <CartHydrator />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MobileOrderBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

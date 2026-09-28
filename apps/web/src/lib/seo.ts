import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mazaq.coffee';

/** Per-locale canonical + hreflang alternates for a path like "/menu/iced-coffee". */
export function localeAlternates(locale: string, path = ''): Metadata['alternates'] {
  const clean = path === '/' ? '' : path;
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}${clean}`;
  languages['x-default'] = `${SITE_URL}/en${clean}`;
  return { canonical: `${SITE_URL}/${locale}${clean}`, languages };
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: string;
  path: string;
  title: string;
  description?: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path === '/' ? '' : path}`,
      siteName: 'Mazaq',
      locale: locale === 'ar' ? 'ar_EG' : 'en_GB',
      type: 'website',
      ...(image ? { images: [{ url: image, width: 1600, height: 1067 }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

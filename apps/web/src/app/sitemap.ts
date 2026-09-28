import { itemsInCategory, menuCategories, menuItems } from '@mazaq/menu';
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

const staticPaths = [
  '',
  '/beans',
  '/rewards',
  '/stores',
  '/our-story',
  '/sourcing',
  '/corporate',
  '/franchise',
  '/contact',
  '/allergens',
  '/privacy',
  '/terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...menuCategories.map((c) => `/menu/${c}`),
    ...menuItems.filter((i) => i.kind !== 'beans').map((i) => `/product/${i.slug}`),
    ...itemsInCategory('coffee-beans').map((b) => `/beans/${b.slug}`),
  ];
  const now = new Date();
  return paths.map((p) => ({
    url: `${SITE_URL}/${routing.defaultLocale}${p}`,
    lastModified: now,
    changeFrequency: p === '' ? 'weekly' : 'monthly',
    priority: p === '' ? 1 : p.startsWith('/menu') || p === '/beans' ? 0.8 : 0.6,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${p}`])),
    },
  }));
}

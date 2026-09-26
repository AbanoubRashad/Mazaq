import {
  applyFilters,
  isMenuCategory,
  itemsInCategory,
  menuCategories,
  menuItems,
  type MenuCategory,
  type MenuFilter,
  type MenuItem,
} from '@mazaq/menu';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { MenuBrowser, type BrowserItem } from '@/components/menu/MenuBrowser';
import { CustomizeDrawer } from '@/components/product/CustomizeDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

type Params = { locale: 'en' | 'ar'; category: string };

const ALL_FILTERS: MenuFilter[] = ['dairy-free-option', 'under-200', 'decaf-available', 'no-added-sugar'];

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    [...menuCategories, 'search'].map((category) => ({ locale, category })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, category } = await params;
  const t = await getTranslations({ locale });
  const name = isMenuCategory(category) ? t(`categories.${category}`) : t('common.search');
  return pageMetadata({
    locale,
    path: `/menu/${category}`,
    title: t('menu.metaTitle', { category: name }),
    description: t('menu.metaDescription', { category: name }),
  });
}

export default async function MenuPage({ params }: { params: Promise<Params> }) {
  const { locale, category } = await params;
  const isSearch = category === 'search';
  if (!isSearch && !isMenuCategory(category)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();

  const items: MenuItem[] = isSearch ? menuItems : itemsInCategory(category as MenuCategory);
  const title = isSearch ? t('common.search') : t(`categories.${category as MenuCategory}`);

  const browserItems: BrowserItem[] = await Promise.all(
    items.map(async (item, i) => ({
      id: item.id,
      node: (
        <ProductCard
          item={item}
          locale={locale}
          href={`/menu/${category}?item=${item.slug}`}
          priority={i < 3}
        />
      ),
      filters: ALL_FILTERS.filter((f) => applyFilters([item], [f]).length > 0),
      text: `${item.name.en} ${item.name.ar} ${item.description[locale]}`.toLowerCase(),
    })),
  );

  const nav = (
    <nav aria-label={t('menu.categoriesLabel')} className="flex flex-col gap-1">
      <div className="pb-2 font-mono text-[12px] tracking-[1.5px] text-muted">{t('menu.label')}</div>
      <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
        {menuCategories.map((c) => {
          const on = c === category;
          return (
            <li key={c} className="shrink-0">
              <Link
                href={`/menu/${c}`}
                aria-current={on ? 'page' : undefined}
                className={`flex h-11 items-center rounded-[12px] px-3.5 text-[15px] font-semibold ${
                  on ? 'bg-teal-800 text-white' : 'border border-line bg-white text-ink hover:bg-white lg:border-0 lg:bg-transparent'
                }`}
              >
                {t(`categories.${c}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  const heading = (
    <div className="flex flex-col gap-2">
      <nav aria-label="Breadcrumb" className="text-[14px] text-muted">
        <Link href="/menu/seasonal" className="hover:underline">
          {t('menu.breadcrumb')}
        </Link>{' '}
        / <span aria-current="page">{title}</span>
      </nav>
      <h1 className="font-display text-[40px] font-extrabold leading-none display-tight lg:text-[56px]">{title}</h1>
    </div>
  );

  return (
    <>
      <Suspense fallback={null}>
        <MenuBrowser items={browserItems} nav={nav} heading={heading} search={isSearch} />
      </Suspense>
      <Suspense fallback={null}>
        <CustomizeDrawer />
      </Suspense>
    </>
  );
}

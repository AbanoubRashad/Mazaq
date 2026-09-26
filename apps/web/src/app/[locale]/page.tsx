import { cities } from '@mazaq/api';
import { getItem, itemsInCategory, formatNumber, roastBucket, type MenuItem } from '@mazaq/menu';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArchImage } from '@/components/ArchImage';
import { BeanBag } from '@/components/BeanBag';
import { BeanCard, BreakfastCard, CategoryCard, DrinkCard } from '@/components/home/Cards';
import { DrinkTabs, FilterShelf } from '@/components/home/FilterShelf';
import { PhoneIcon } from '@/components/icons';
import { JsonLd } from '@/components/JsonLd';
import { ButtonLink } from '@/components/ui/Button';
import { PriceTag } from '@/components/ui/PriceTag';
import { Link } from '@/i18n/navigation';
import { pageMetadata, SITE_URL } from '@/lib/seo';

type Props = { params: Promise<{ locale: 'en' | 'ar' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    ...pageMetadata({ locale, path: '/', title: t('metaTitle'), description: t('metaDescription') }),
    title: { absolute: t('metaTitle') },
  };
}

const pick = (slugs: string[]) => slugs.map((s) => getItem(s)).filter(Boolean) as MenuItem[];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const saffron = getItem('saffron-honey-latte')!;
  const frappe = getItem('date-frappe')!;
  const turkish = getItem('mazaq-turkish-blend')!;
  const beans = itemsInCategory('coffee-beans');
  const breakfast = itemsInCategory('healthy-breakfast');
  const hot = pick(['saffron-honey-latte', 'spanish-latte', 'flat-white', 'turkish-coffee']);
  const iced = pick(['iced-spanish-latte', 'cold-brew', 'date-frappe', 'espresso-tonic']);

  const drinkGrid = async (list: MenuItem[]) => (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {await Promise.all(
        list.map(async (d) => (
          <li key={d.id} className="flex">
            <DrinkCard item={d} locale={locale} />
          </li>
        )),
      )}
    </ul>
  );

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mazaq Coffee Co.',
    alternateName: 'مذاق',
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/icon.svg`,
  };

  return (
    <>
      <JsonLd data={orgLd} />

      {/* hero */}
      <section className="overflow-hidden bg-teal-800 text-on-teal">
        <div className="flex flex-col gap-12 px-5 pb-16 pt-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-20 lg:pb-20 lg:pt-[72px]">
          <div className="flex max-w-[560px] flex-col gap-7">
            <p className="hero-rise eyebrow text-saffron-500" style={{ '--i': 0 } as React.CSSProperties}>
              {t('home.hero.eyebrow')}
            </p>
            <h1
              className="hero-rise font-display text-[52px] font-extrabold leading-[0.95] tracking-[-0.03em] text-balance sm:text-[68px] xl:text-[84px]"
              style={{ '--i': 1 } as React.CSSProperties}
            >
              {t('home.hero.title')}
            </h1>
            <p
              className="hero-rise max-w-[480px] text-[17px] leading-[1.55] text-on-teal-muted lg:text-[19px]"
              style={{ '--i': 2 } as React.CSSProperties}
            >
              {t('home.hero.body')}
            </p>
            <div className="hero-rise flex flex-wrap items-center gap-3" style={{ '--i': 3 } as React.CSSProperties}>
              <ButtonLink href="/menu/seasonal" variant="saffron" size="lg">
                {t('home.hero.ctaPrimary')}
              </ButtonLink>
              <ButtonLink href="/menu/hot-coffee" variant="outline-light" size="lg">
                {t('home.hero.ctaSecondary')}
              </ButtonLink>
            </div>
            <div
              className="hero-rise flex flex-col gap-2 border-t border-teal-rule pt-3 text-[14px] text-on-teal-muted sm:flex-row sm:gap-8"
              style={{ '--i': 4 } as React.CSSProperties}
            >
              <div>
                <span className="font-mono text-on-teal">{t('common.kcal', { value: formatNumber(saffron.kcal, locale) })}</span>{' '}
                {t('home.hero.kcalHot')}
              </div>
              <div>
                <span className="font-mono text-on-teal">{t('common.kcal', { value: formatNumber(frappe.kcal, locale) })}</span>{' '}
                {t('home.hero.kcalIced')}
              </div>
            </div>
          </div>
          <div className="flex items-end gap-4 sm:gap-7">
            <figure className="hero-rise flex w-[52%] flex-col gap-3.5 lg:w-[300px]" style={{ '--i': 2 } as React.CSSProperties}>
              <ArchImage
                src={`/images/${saffron.image!.src}`}
                alt={saffron.image!.alt[locale]}
                width={300}
                height={420}
                sizes="(min-width: 1024px) 300px, 52vw"
                priority
              />
              <figcaption className="text-[15px] font-semibold">
                {saffron.name[locale]}{' '}
                <span className="font-mono font-normal text-on-teal-muted">
                  · <PriceTag prices={saffron.basePrice} />
                </span>
              </figcaption>
            </figure>
            <figure className="hero-rise mb-14 flex w-[44%] flex-col gap-3.5 lg:w-[260px]" style={{ '--i': 3 } as React.CSSProperties}>
              <ArchImage
                src={`/images/${frappe.image!.src}`}
                alt={frappe.image!.alt[locale]}
                width={260}
                height={360}
                sizes="(min-width: 1024px) 260px, 44vw"
                priority
              />
              <figcaption className="text-[15px] font-semibold">
                {frappe.name[locale]}{' '}
                <span className="font-mono font-normal text-on-teal-muted">
                  · <PriceTag prices={frappe.basePrice} />
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* categories */}
      <section aria-labelledby="cat-h" className="flex flex-col gap-8 px-5 pb-10 pt-16 lg:px-20 lg:pt-[88px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="cat-h" className="font-display text-[34px] font-extrabold display-tight lg:text-[48px]">
            {t('home.categories.title')}
          </h2>
          <Link href="/menu/seasonal" className="flex h-11 items-center text-[15px] font-bold text-teal-800 underline underline-offset-4">
            {t('home.categories.browse')}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          <CategoryCard href="/beans" title={t('home.categories.beansTitle')} line={t('home.categories.beansLine')} image="/images/coffee-beans.jpg" alt="" />
          <CategoryCard href="/menu/hot-coffee" title={t('home.categories.hotTitle')} line={t('home.categories.hotLine')} image="/images/cappuccino.jpg" alt="" />
          <CategoryCard href="/menu/iced-coffee" title={t('home.categories.icedTitle')} line={t('home.categories.icedLine')} image="/images/iced-latte.jpg" alt="" />
          <CategoryCard
            href="/menu/healthy-breakfast"
            title={t('home.categories.breakfastTitle')}
            line={t('home.categories.breakfastLine')}
            image="/images/avocado-egg-sourdough.jpg"
            alt=""
          />
        </div>
      </section>

      {/* beans shelf */}
      <section aria-labelledby="beans-h" className="flex flex-col gap-9 px-5 py-16 lg:px-20 lg:py-[72px]">
        <FilterShelf
          label={t('home.beans.filterLabel')}
          mode="single"
          allValue="all"
          empty={t('home.beans.empty')}
          gridClass="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          header={
            <div className="flex max-w-[720px] flex-col gap-3">
              <p className="eyebrow text-brown-600">{t('home.beans.eyebrow')}</p>
              <h2 id="beans-h" className="font-display text-[34px] font-extrabold text-balance display-tight lg:text-[48px]">
                {t('home.beans.title')}
              </h2>
            </div>
          }
          options={[
            { value: 'all', label: t('home.beans.all') },
            { value: 'light', label: t('home.beans.light') },
            { value: 'medium', label: t('home.beans.medium') },
            { value: 'dark', label: t('home.beans.dark') },
            { value: 'turkish', label: t('home.beans.turkish') },
          ]}
          items={await Promise.all(
            beans.map(async (b) => ({
              id: b.id,
              groups: [roastBucket(b) ?? '', ...(b.tags.includes('turkish') ? ['turkish'] : [])],
              node: <BeanCard item={b} locale={locale} />,
            })),
          )}
        />
        <div className="flex flex-col items-start gap-5 rounded-[20px] bg-sand p-6 sm:flex-row sm:items-center sm:gap-6 sm:px-7">
          <div className="h-[120px] w-[120px] shrink-0">
            <BeanBag origin="turkish" label="TURKISH" region="with cardamom" background="#E7E1D6" className="h-full w-full" />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <h3 className="font-display text-[24px] font-bold">{t('home.beans.turkishTitle')}</h3>
            <p className="text-[15px] text-muted">
              {t.rich('home.beans.turkishBody', { price: () => <PriceTag prices={turkish.basePrice} /> })}
            </p>
          </div>
          <ButtonLink href="/menu/turkish-coffee" variant="outline">
            {t('home.beans.turkishCta')}
          </ButtonLink>
        </div>
      </section>

      {/* drinks */}
      <section aria-labelledby="drinks-h" className="bg-white px-5 py-16 lg:px-20 lg:py-[72px]">
        <div className="flex flex-col gap-9">
          <DrinkTabs
            header={
              <div className="flex flex-col gap-3">
                <p className="eyebrow text-teal-600">{t('home.drinks.eyebrow')}</p>
                <h2 id="drinks-h" className="font-display text-[34px] font-extrabold display-tight lg:text-[48px]">
                  {t('home.drinks.title')}
                </h2>
              </div>
            }
            labels={{ group: t('home.drinks.tabsLabel'), hot: t('home.drinks.hot'), iced: t('home.drinks.iced') }}
            hot={await drinkGrid(hot)}
            iced={await drinkGrid(iced)}
          />
        </div>
      </section>

      {/* breakfast */}
      <section aria-labelledby="bf-h" className="flex flex-col gap-10 bg-sage-100 px-5 py-16 lg:flex-row lg:gap-12 lg:p-20">
        <div className="flex shrink-0 flex-col gap-5 lg:w-[360px]">
          <p className="eyebrow text-sage-600">{t('home.breakfast.eyebrow')}</p>
          <h2 id="bf-h" className="font-display text-[34px] font-extrabold leading-[1.02] display-tight lg:text-[48px]">
            {t('home.breakfast.title')}
          </h2>
          <p className="text-[17px] leading-[1.55] text-[#3E4B47]">{t('home.breakfast.body')}</p>
          <Link href="/menu/healthy-breakfast" className="flex h-11 items-center text-[15px] font-bold underline underline-offset-4">
            {t('home.breakfast.seeAll')}
          </Link>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <FilterShelf
            label={t('home.breakfast.filterLabel')}
            mode="multi"
            tone="sage"
            empty={t('home.breakfast.empty')}
            gridClass="grid grid-cols-1 gap-5 xl:grid-cols-2"
            options={[
              { value: 'high-protein', label: t('home.breakfast.highProtein') },
              { value: 'vegan', label: t('home.breakfast.vegan') },
              { value: 'gluten-free', label: t('home.breakfast.glutenFree') },
              { value: 'under-300', label: t('home.breakfast.under300') },
            ]}
            items={await Promise.all(
              breakfast.map(async (b) => ({ id: b.id, groups: b.tags, node: <BreakfastCard item={b} locale={locale} /> })),
            )}
          />
        </div>
      </section>

      {/* rewards */}
      <section aria-labelledby="rw-h" className="flex flex-col items-center gap-12 bg-teal-800 px-5 py-16 text-on-teal lg:flex-row lg:gap-16 lg:p-20">
        <div className="flex flex-1 flex-col gap-6">
          <p className="eyebrow text-saffron-500">{t('home.rewards.eyebrow')}</p>
          <h2 id="rw-h" className="font-display text-[38px] font-extrabold leading-none text-balance tracking-[-0.03em] lg:text-[56px]">
            {t('home.rewards.title')}
          </h2>
          <p className="max-w-[560px] text-[18px] leading-[1.55] text-on-teal-muted">{t('home.rewards.body')}</p>
          <ul className="grid max-w-[640px] grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [50, 'Extra shot or syrup', 'شوت إضافي أو سيرب'],
              [100, 'Any bake or breakfast', 'أي مخبوزات أو فطار'],
              [150, 'Any drink, any size', 'أي مشروب بأي حجم'],
              [300, '250 g bag of beans', 'كيس بن ٢٥٠ جم'],
            ].map(([beans, en, ar]) => (
              <li key={beans} className="flex flex-col gap-1.5 rounded-[14px] border border-teal-rule p-3.5">
                <span className="font-display text-[28px] font-extrabold text-saffron-500">{formatNumber(beans as number, locale)}</span>
                <span className="text-[14px] leading-snug text-on-teal-muted">{locale === 'ar' ? ar : en}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <a href="#" className="flex h-14 items-center gap-2.5 rounded-[14px] bg-ground px-6 text-[15px] font-bold text-teal-800">
              <PhoneIcon /> {t('home.rewards.ios')}
            </a>
            <a href="#" className="flex h-14 items-center gap-2.5 rounded-[14px] border-[1.5px] border-teal-outline px-6 text-[15px] font-bold">
              <PhoneIcon /> {t('home.rewards.android')}
            </a>
          </div>
        </div>
        <div className="w-full max-w-[420px] shrink-0 p-4">
          <div className="flex -rotate-3 flex-col gap-[22px] rounded-[24px] bg-saffron-500 p-7 text-teal-800">
            <div className="flex items-center justify-between">
              <span className="font-display text-[24px] font-extrabold">{t('home.rewards.cardTitle')}</span>
              <span className="font-arabic-display text-[20px] font-bold">مذاق</span>
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-[72px] font-extrabold leading-none">{formatNumber(112, locale)}</span>
              <span className="text-[16px] font-semibold">{t('home.rewards.beans')}</span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-2 rounded bg-teal-800/20">
                <div className="h-2 w-3/4 rounded bg-teal-800" />
              </div>
              <span className="text-[14px] font-semibold">{t('home.rewards.toFree')}</span>
            </div>
            <span className="font-mono text-[13px] tracking-[1px]">{t('home.rewards.member')}</span>
          </div>
        </div>
      </section>

      {/* store finder teaser */}
      <section aria-labelledby="st-h" className="flex flex-col gap-10 px-5 py-16 lg:flex-row lg:gap-16 lg:p-20">
        <div className="flex shrink-0 flex-col gap-5 lg:w-[460px]">
          <h2 id="st-h" className="font-display text-[34px] font-extrabold display-tight lg:text-[48px]">
            {t('home.stores.title')}
          </h2>
          <p className="text-[17px] leading-[1.55] text-muted">{t('home.stores.body')}</p>
          <form action={`/${locale}/stores`} method="get" className="flex flex-col gap-2">
            <label htmlFor="storeSearch" className="text-[14px] font-semibold">
              {t('home.stores.label')}
            </label>
            <div className="flex gap-2">
              <input
                id="storeSearch"
                name="q"
                type="search"
                placeholder={t('home.stores.placeholder')}
                className="h-[52px] min-w-0 flex-1 rounded-[14px] border border-line-strong bg-white px-4 text-[16px] font-medium"
              />
              <button type="submit" className="h-[52px] rounded-[14px] bg-teal-800 px-[22px] text-[15px] font-bold text-white">
                {t('home.stores.search')}
              </button>
            </div>
          </form>
        </div>
        <ul className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-3">
          {cities.map((c) => (
            <li key={c.key}>
              <Link href={`/stores?city=${c.key}`} className="flex flex-col gap-1.5 border-t-2 border-ink pt-3.5 hover:text-teal-600">
                <span className="font-mono text-[12px] tracking-[1.5px] text-muted">{c.country[locale]}</span>
                <span className="font-display text-[24px] font-bold">{c.city[locale]}</span>
                <span className="text-[14px] text-muted">{c.spot[locale]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

import { formatNumber, itemsInCategory, type ItemCategory } from '@mazaq/menu';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: 'en' | 'ar' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.allergens' });
  return pageMetadata({ locale, path: '/allergens', title: t('metaTitle'), description: t('lead') });
}

const primary: ItemCategory[] = ['hot-coffee', 'iced-coffee', 'healthy-breakfast', 'bakes'];

export default async function AllergensPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const dash = '—';
  return (
    <>
      <PageHero eyebrow={t('pages.allergens.eyebrow')} title={t('pages.allergens.title')} lead={t('pages.allergens.lead')} />
      <section className="flex flex-col gap-12 px-4 py-14 lg:px-20">
        <p className="rounded-[14px] bg-saffron-500/20 p-4 text-[15px] font-semibold">{t('pages.allergens.note')}</p>
        {primary.map((cat) => (
          <div key={cat} className="flex flex-col gap-4">
            <h2 className="font-display text-[28px] font-extrabold">{t(`categories.${cat}`)}</h2>
            <div className="overflow-x-auto rounded-[18px] bg-white">
              <table className="w-full min-w-[640px] text-[15px]">
                <caption className="sr-only">{t(`categories.${cat}`)}</caption>
                <thead>
                  <tr className="border-b border-line text-start font-mono text-[12px] tracking-[1px] text-muted uppercase">
                    <th scope="col" className="px-4 py-3 text-start">{t('pages.allergens.item')}</th>
                    <th scope="col" className="px-4 py-3 text-end">{t('pages.allergens.kcal')}</th>
                    <th scope="col" className="px-4 py-3 text-end">{t('pages.allergens.protein')}</th>
                    <th scope="col" className="px-4 py-3 text-end">{t('pages.allergens.caffeine')}</th>
                    <th scope="col" className="px-4 py-3 text-start">{t('pages.allergens.allergens')}</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsInCategory(cat).map((i) => (
                    <tr key={i.id} className="border-b border-line last:border-0">
                      <th scope="row" className="px-4 py-3 text-start font-semibold">{i.name[locale]}</th>
                      <td className="px-4 py-3 text-end font-mono">{formatNumber(i.kcal, locale)}</td>
                      <td className="px-4 py-3 text-end font-mono">{i.proteinG !== undefined ? formatNumber(i.proteinG, locale) : dash}</td>
                      <td className="px-4 py-3 text-end font-mono">{i.caffeineMg !== undefined ? formatNumber(i.caffeineMg, locale) : dash}</td>
                      <td className="px-4 py-3">
                        {i.allergens.length ? i.allergens.map((a) => t(`allergens.${a}`)).join(locale === 'ar' ? '، ' : ', ') : t('product.none')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

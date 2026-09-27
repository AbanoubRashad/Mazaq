import { formatNumber, type Locale, type MenuItem } from '@mazaq/menu';
import { getTranslations } from 'next-intl/server';

export async function NutritionTable({ item, locale }: { item: MenuItem; locale: Locale }) {
  const t = await getTranslations();
  const size = item.customizations.includes('size')
    ? locale === 'ar'
      ? 'وسط ١٢ أونصة'
      : 'Regular 12 oz'
    : locale === 'ar'
      ? 'حصة واحدة'
      : '1 serving';
  const rows: [string, string][] = [
    [t('product.energy'), `${formatNumber(item.kcal, locale)} kcal`],
    [
      t('product.protein'),
      item.proteinG !== undefined ? `${formatNumber(item.proteinG, locale)} g` : t('product.notApplicable'),
    ],
    [
      t('product.caffeine'),
      item.caffeineMg !== undefined ? `${formatNumber(item.caffeineMg, locale)} mg` : t('product.notApplicable'),
    ],
    [
      t('product.allergens'),
      item.allergens.length
        ? item.allergens.map((a) => t(`allergens.${a}`)).join(locale === 'ar' ? '، ' : ', ')
        : t('product.none'),
    ],
  ];
  return (
    <section aria-labelledby="nutrition-h" className="flex flex-col gap-3">
      <h2 id="nutrition-h" className="font-display text-[24px] font-bold">
        {t('product.nutrition')}
      </h2>
      <table className="w-full overflow-hidden rounded-[14px] bg-white text-[15px]">
        <caption className="sr-only">{t('product.nutritionCaption', { size })}</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">{t('product.nutrient')}</th>
            <th scope="col">{t('product.amount')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-line last:border-0">
              <th scope="row" className="px-4 py-3 text-start font-semibold">
                {k}
              </th>
              <td className="px-4 py-3 text-end font-mono text-[14px]">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[13px] text-muted">{t('product.workingValues')}</p>
    </section>
  );
}

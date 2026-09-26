import { formatNumber, type Locale, type MenuItem } from '@mazaq/menu';

type Translate = (key: never, values?: Record<string, string | number>) => string;

/** "240 KCAL · 150 MG CAFFEINE · CONTAINS MILK" — shared by server and client components. */
export function allergenLine(item: MenuItem, translate: unknown, locale: Locale): string {
  const t = translate as (key: string, values?: Record<string, string | number>) => string;
  const parts: string[] = [];
  parts.push(t('common.kcalUpper', { value: formatNumber(item.kcal, locale) }));
  if (item.caffeineMg) parts.push(t('customize.caffeine', { value: formatNumber(item.caffeineMg, locale) }));
  if (item.proteinG !== undefined) parts.push(t('common.proteinUpper', { value: formatNumber(item.proteinG, locale) }));
  if (item.allergens.length) {
    const list = item.allergens.map((a) => t(`allergens.${a}`)).join(locale === 'ar' ? '، ' : ', ');
    parts.push(t('customize.contains', { list: locale === 'en' ? list.toUpperCase() : list }));
  } else if (item.kind !== 'beans') {
    parts.push(t('customize.noAllergens'));
  }
  return parts.join(' · ');
}

export type { Translate };

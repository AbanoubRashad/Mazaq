import ar from './ar.json';
import en from './en.json';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export type Messages = typeof en;

export const messages: Record<Locale, Messages> = { en, ar: ar as Messages };

export const dir = (locale: Locale): 'ltr' | 'rtl' => (locale === 'ar' ? 'rtl' : 'ltr');

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'ar';
}

export { en, ar };

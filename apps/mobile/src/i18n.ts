import AsyncStorage from '@react-native-async-storage/async-storage';
import { messages, type Locale } from '@mazaq/i18n';
import { reloadAppAsync } from 'expo';
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { DevSettings, I18nManager, Platform } from 'react-native';

const LANG_KEY = 'mazaq-lang';

export async function initI18n(): Promise<Locale> {
  const saved = (await AsyncStorage.getItem(LANG_KEY)) as Locale | null;
  const device = getLocales()[0]?.languageCode === 'ar' ? 'ar' : 'en';
  const lng: Locale = saved ?? device;

  await i18n.use(initReactI18next).init({
    lng,
    fallbackLng: 'en',
    resources: { en: { translation: messages.en }, ar: { translation: messages.ar } },
    // Share ICU-style {placeholders} with the web (next-intl) message files.
    interpolation: { escapeValue: false, prefix: '{', suffix: '}' },
    returnObjects: true,
  });

  await applyDirection(lng, true);
  return lng;
}

const RELOAD_GUARD = 'mazaq-rtl-reload';

/**
 * Keep layout direction in sync with the language. Native needs a reload for
 * I18nManager changes; web just sets <html dir>. A guard prevents reload loops.
 */
async function applyDirection(lng: Locale, onLaunch: boolean) {
  const wantRTL = lng === 'ar';
  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = wantRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
    }
    return;
  }
  I18nManager.allowRTL(true);
  if (I18nManager.isRTL === wantRTL) {
    await AsyncStorage.removeItem(RELOAD_GUARD);
    return;
  }
  if (onLaunch && (await AsyncStorage.getItem(RELOAD_GUARD)) === lng) return; // already tried once
  I18nManager.forceRTL(wantRTL);
  await AsyncStorage.setItem(RELOAD_GUARD, lng);
  await reload();
}

async function reload() {
  try {
    await reloadAppAsync('Switching layout direction');
  } catch {
    DevSettings.reload();
  }
}

/** Switch language; RTL changes need an app reload (the brief requires switch + reload). */
export async function setLanguage(lng: Locale) {
  await AsyncStorage.setItem(LANG_KEY, lng);
  await i18n.changeLanguage(lng);
  await AsyncStorage.removeItem(RELOAD_GUARD);
  await applyDirection(lng, false);
}

/** t() + current locale. */
export function useI18n() {
  const { t, i18n: inst } = useTranslation();
  const locale: Locale = inst.language === 'ar' ? 'ar' : 'en';
  return { t: t as (key: string, values?: Record<string, unknown>) => string, locale, ar: locale === 'ar' };
}

export { i18n };

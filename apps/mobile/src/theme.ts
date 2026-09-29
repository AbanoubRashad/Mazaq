import { nativeTheme } from '@mazaq/tokens/native';
import { I18nManager, type TextStyle } from 'react-native';

export const theme = nativeTheme;
export const c = nativeTheme.colors;
export const f = nativeTheme.fonts;
export const size = nativeTheme.type;

export const isRTL = () => I18nManager.isRTL;

/** Font families swap to Arabic faces when the app runs in Arabic. */
export function font(kind: 'display' | 'body' | 'medium' | 'semibold' | 'bold' | 'mono', ar: boolean): TextStyle {
  if (ar) {
    switch (kind) {
      case 'display':
        return { fontFamily: f.arabicDisplay };
      case 'bold':
        return { fontFamily: f.arabicBold };
      case 'semibold':
        return { fontFamily: f.arabicSemibold };
      case 'medium':
      case 'mono':
        return { fontFamily: f.arabicMedium };
      default:
        return { fontFamily: f.arabic };
    }
  }
  switch (kind) {
    case 'display':
      return { fontFamily: f.display, letterSpacing: -0.6 };
    case 'bold':
      return { fontFamily: f.bodyBold };
    case 'semibold':
      return { fontFamily: f.bodySemibold };
    case 'medium':
      return { fontFamily: f.bodyMedium };
    case 'mono':
      return { fontFamily: f.mono, letterSpacing: 1 };
    default:
      return { fontFamily: f.body };
  }
}

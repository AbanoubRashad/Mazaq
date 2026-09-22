import { colors, originColors, radii, spacing, touchTarget } from './index';

/**
 * React Native theme. Font family names match the keys loaded with
 * `useFonts` in apps/mobile/app/_layout.tsx (@expo-google-fonts).
 */
export const nativeFonts = {
  display: 'BricolageGrotesque_800ExtraBold',
  displayBold: 'BricolageGrotesque_700Bold',
  body: 'Figtree_400Regular',
  bodyMedium: 'Figtree_500Medium',
  bodySemibold: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  monoSemibold: 'IBMPlexMono_600SemiBold',
  arabic: 'IBMPlexSansArabic_400Regular',
  arabicMedium: 'IBMPlexSansArabic_500Medium',
  arabicSemibold: 'IBMPlexSansArabic_600SemiBold',
  arabicBold: 'IBMPlexSansArabic_700Bold',
  arabicDisplay: 'ReemKufi_700Bold',
} as const;

/** Mobile type scale: 32 / 28 / 24 / 18 / 15 / 13 / 11 */
export const nativeType = {
  xxl: 32,
  xl: 28,
  lg: 24,
  md: 18,
  body: 15,
  sm: 13,
  xs: 11,
} as const;

export const nativeTheme = {
  colors,
  originColors,
  fonts: nativeFonts,
  type: nativeType,
  spacing,
  radii: { ...radii, arch: 999 },
  touchTarget,
} as const;

export type NativeTheme = typeof nativeTheme;

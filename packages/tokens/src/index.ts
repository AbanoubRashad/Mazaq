/**
 * Mazaq design tokens — single source of truth for web (Tailwind v4 theme.css)
 * and native (native.ts). Keep theme.css in sync; `tokens.test.ts` checks it.
 */

export const colors = {
  teal900: '#0A2C28',
  teal800: '#0E3B36',
  teal600: '#1A5048',
  saffron500: '#E3A62B',
  ground: '#F0F2EE',
  paper: '#FFFFFF',
  ink: '#16201E',
  muted: '#55625F',
  line: '#D5DBD6',
  sage100: '#E1E9DC',
  brown600: '#8A5A2B',
  // Supporting shades observed in the design boards
  lineStrong: '#C3CCC6',
  onTeal: '#F0F2EE',
  onTealMuted: '#C5D5D0',
  tealRule: '#2A5B53',
  tealOutline: '#5C827B',
  utilityText: '#D6E2DE',
  sage600: '#3F5F4A',
  sageOutline: '#9FB29A',
  sand: '#E7E1D6',
} as const;

export type ColorToken = keyof typeof colors;

/** Coffee-bean pack colours, one per origin. */
export const originColors = {
  ethiopia: '#C8872A',
  colombia: '#A4452C',
  brazil: '#3F5F4A',
  kenya: '#6B2A3A',
  guatemala: '#7D5A2C',
  sumatra: '#2B2A33',
  house: '#0E3B36',
  turkish: '#8A3B2E',
} as const;

export type Origin = keyof typeof originColors;

export const fonts = {
  display: 'Bricolage Grotesque',
  body: 'Figtree',
  mono: 'IBM Plex Mono',
  arabic: 'IBM Plex Sans Arabic',
  arabicDisplay: 'Reem Kufi',
} as const;

export const typeScale = {
  web: [84, 56, 48, 34, 24, 22, 19, 17, 15, 13, 12] as const,
  mobile: [32, 28, 24, 18, 15, 13, 11] as const,
};

/** Display letter-spacing: -2% to -3% of font size. */
export const displayTracking = (size: number, pct = 0.025) => -Math.round(size * pct * 10) / 10;

export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80] as const;

export const radii = {
  input: 12,
  cardSm: 14,
  card: 18,
  cardLg: 20,
  pill: 999,
  /** CSS value for the Cairene arch frame. */
  arch: '999px 999px 24px 24px',
} as const;

export const touchTarget = 44;

export const motion = {
  heroRise: 16,
  heroDurationMs: 400,
  heroStaggerMs: 80,
  cardLift: 4,
} as const;

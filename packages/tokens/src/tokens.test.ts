import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { colors } from './index';

const css = readFileSync(fileURLToPath(new URL('./theme.css', import.meta.url)), 'utf8').toLowerCase();
const kebab = (k: string) => k.replace(/([a-z])(\d)/g, '$1-$2').replace(/([A-Z])/g, '-$1').toLowerCase();

describe('tokens', () => {
  it('theme.css mirrors every colour token', () => {
    for (const [key, hex] of Object.entries(colors)) {
      expect(css).toContain(`--color-${kebab(key)}: ${hex.toLowerCase()};`);
    }
  });

  it('muted text meets 4.5:1 on ground', () => {
    const lum = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => {
        const c = parseInt(hex.slice(i, i + 2), 16) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      }) as [number, number, number];
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratio = (lum(colors.ground) + 0.05) / (lum(colors.muted) + 0.05);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

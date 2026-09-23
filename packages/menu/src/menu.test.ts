import { describe, expect, it } from 'vitest';
import {
  applyFilters,
  beansEarned,
  calcItemPrice,
  defaultOptions,
  describeOptions,
  formatPrice,
  getItem,
  itemsInCategory,
  menuItems,
  priceTable,
  vatIncluded,
} from './index';

const item = (slug: string) => {
  const found = getItem(slug);
  if (!found) throw new Error(`missing ${slug}`);
  return found;
};

describe('menu data', () => {
  it('has unique slugs', () => {
    const slugs = menuItems.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('keeps every breakfast item under 450 kcal and lists protein', () => {
    for (const b of itemsInCategory('healthy-breakfast')) {
      expect(b.kcal).toBeLessThan(450);
      expect(b.proteinG).toBeTypeOf('number');
    }
  });

  it('has 8 bean origins with roast levels', () => {
    const beans = itemsInCategory('coffee-beans');
    expect(beans).toHaveLength(8);
    for (const b of beans) expect(b.bean?.roastLevel).toBeGreaterThan(0);
  });

  it('prices match the brief (EGP)', () => {
    expect(item('iced-spanish-latte').basePrice.EGP).toBe(145);
    expect(item('saffron-honey-latte').basePrice.EGP).toBe(155);
    expect(item('ethiopia-yirgacheffe').basePrice.EGP).toBe(520);
    expect(item('green-shakshuka').basePrice.EGP).toBe(175);
  });

  it('pairsWith references a real breakfast item', () => {
    for (const d of menuItems.filter((i) => i.pairsWith)) {
      expect(item(d.pairsWith!).category).toBe('healthy-breakfast');
    }
  });

  it('derives seasonal and turkish views', () => {
    expect(itemsInCategory('seasonal').map((i) => i.slug)).toContain('date-frappe');
    expect(itemsInCategory('turkish-coffee').map((i) => i.slug)).toEqual([
      'turkish-coffee',
      'mazaq-turkish-blend',
    ]);
  });
});

describe('calcItemPrice', () => {
  it('matches the design: Regular + Oat Iced Spanish Latte = EGP 160', () => {
    const latte = item('iced-spanish-latte');
    expect(calcItemPrice(latte, { ...defaultOptions(latte), milk: 'oat' }, 'EGP')).toBe(160);
  });

  it('applies size deltas', () => {
    const latte = item('iced-spanish-latte');
    expect(calcItemPrice(latte, { size: 'small' }, 'EGP')).toBe(125);
    expect(calcItemPrice(latte, { size: 'large' }, 'EGP')).toBe(165);
  });

  it('charges +20 per extra shot only above the default', () => {
    const flat = item('flat-white');
    expect(calcItemPrice(flat, { shots: 1 }, 'EGP')).toBe(110);
    expect(calcItemPrice(flat, { shots: 4 }, 'EGP')).toBe(150);
  });

  it('charges +15 for sugar-free vanilla only', () => {
    const latte = item('caffe-latte');
    expect(calcItemPrice(latte, { syrup: 'vanilla' }, 'EGP')).toBe(110);
    expect(calcItemPrice(latte, { syrup: 'sugar-free-vanilla' }, 'EGP')).toBe(125);
  });

  it('prices bean weights and subscriptions', () => {
    const eth = item('ethiopia-yirgacheffe');
    expect(calcItemPrice(eth, { weight: '250g' }, 'EGP')).toBe(520);
    expect(calcItemPrice(eth, { weight: '500g' }, 'EGP')).toBe(988);
    expect(calcItemPrice(eth, { weight: '250g', subscription: '4w' }, 'EGP')).toBe(468);
  });

  it('converts to other markets', () => {
    expect(priceTable(145).AED).toBeGreaterThan(0);
    expect(calcItemPrice(item('espresso'), {}, 'GBP')).toBeGreaterThan(0);
  });
});

describe('totals', () => {
  it('computes VAT included as total * 14 / 114', () => {
    expect(vatIncluded(345)).toBe(42.37);
    expect(vatIncluded(114)).toBe(14);
  });

  it('earns 1 bean per EGP 10', () => {
    expect(beansEarned(345)).toBe(34);
    expect(beansEarned(9.99)).toBe(0);
    expect(beansEarned(160)).toBe(16);
  });
});

describe('formatting', () => {
  it('formats EGP in English', () => {
    expect(formatPrice(145, 'EGP', 'en')).toBe('EGP 145');
    expect(formatPrice(42.37, 'EGP', 'en')).toBe('EGP 42.37');
  });

  it('uses Arabic-Indic digits in Arabic', () => {
    const ar = formatPrice(155, 'EGP', 'ar');
    expect(ar).toContain('١٥٥');
    expect(ar).toContain('ج.م');
  });

  it('describes options like the design', () => {
    const latte = item('iced-spanish-latte');
    expect(
      describeOptions(latte, { size: 'regular', milk: 'oat', shots: 2, sweetness: 'less', ice: 'regular' }),
    ).toBe('Regular · Oat milk · 2 shots · Less sweet');
  });
});

describe('filters', () => {
  it('filters under 200 kcal', () => {
    const r = applyFilters(itemsInCategory('iced-coffee'), ['under-200']);
    expect(r.every((i) => i.kcal < 200)).toBe(true);
    expect(r.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from 'vitest';
import { ar, en } from './index';

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function keys(obj: Json, prefix = ''): string[] {
  if (Array.isArray(obj)) return obj.flatMap((v, i) => keys(v, `${prefix}[${i}]`));
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();

function leaf(obj: Json, path: string): Json {
  return path
    .split(/\.|\[(\d+)\]/)
    .filter(Boolean)
    .reduce<Json>((o, k) => (o as Record<string, Json>)[k] as Json, obj);
}

describe('i18n messages', () => {
  const enKeys = keys(en as Json);
  const arKeys = keys(ar as Json);

  it('ar has exactly the same keys as en', () => {
    expect(arKeys.filter((k) => !enKeys.includes(k))).toEqual([]);
    expect(enKeys.filter((k) => !arKeys.includes(k))).toEqual([]);
  });

  it('keeps the same {placeholders} in both languages', () => {
    for (const k of enKeys) {
      const e = leaf(en as Json, k);
      const a = leaf(ar as Json, k);
      if (typeof e === 'string' && typeof a === 'string') {
        expect({ k, p: placeholders(a) }).toEqual({ k, p: placeholders(e) });
      }
    }
  });

  it('uses the brief’s Arabic copy', () => {
    expect(ar.app.greetingMorning).toBe('صباح الخير يا {name}');
    expect(ar.app.tabs).toEqual({ home: 'الرئيسية', menu: 'المنيو', order: 'الطلب', rewards: 'المكافآت' });
    expect(ar.app.seasonalTitle).toBe('لاتيه الزعفران والعسل رجع');
    expect(ar.app.byCategory).toBe('اطلب حسب القسم');
    expect(ar.app.usual).toBe('طلبك المعتاد');
    expect(ar.app.reorder).toBe('اطلبه تاني');
  });
});

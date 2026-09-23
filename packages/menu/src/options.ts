import type {
  GrindId,
  IceId,
  ItemOptions,
  L10n,
  MenuItem,
  MilkId,
  SizeId,
  SubscriptionId,
  SweetnessId,
  SyrupId,
  TemperatureId,
  WeightId,
} from './types';

export interface OptionDef<Id extends string> {
  id: Id;
  label: L10n;
  /** Price delta in EGP; converted per market. */
  deltaEGP?: number;
  meta?: L10n;
}

export const sizes: OptionDef<SizeId>[] = [
  { id: 'small', label: { en: 'Small', ar: 'صغير' }, meta: { en: '8 oz', ar: '٨ أونصة' }, deltaEGP: -20 },
  { id: 'regular', label: { en: 'Regular', ar: 'وسط' }, meta: { en: '12 oz', ar: '١٢ أونصة' }, deltaEGP: 0 },
  { id: 'large', label: { en: 'Large', ar: 'كبير' }, meta: { en: '16 oz', ar: '١٦ أونصة' }, deltaEGP: 20 },
];

export const milks: OptionDef<MilkId>[] = [
  { id: 'full-cream', label: { en: 'Full cream', ar: 'كامل الدسم' } },
  { id: 'skimmed', label: { en: 'Skimmed', ar: 'خالي الدسم' } },
  { id: 'oat', label: { en: 'Oat', ar: 'شوفان' }, deltaEGP: 15 },
  { id: 'almond', label: { en: 'Almond', ar: 'لوز' }, deltaEGP: 15 },
  { id: 'lactose-free', label: { en: 'Lactose-free', ar: 'خالي اللاكتوز' } },
];

export const sweetnessLevels: OptionDef<SweetnessId>[] = [
  { id: 'none', label: { en: 'No sugar', ar: 'بدون سكر' } },
  { id: 'less', label: { en: 'Less sweet', ar: 'سكر خفيف' } },
  { id: 'regular', label: { en: 'Regular', ar: 'عادي' } },
];

export const iceLevels: OptionDef<IceId>[] = [
  { id: 'light', label: { en: 'Light ice', ar: 'ثلج خفيف' } },
  { id: 'regular', label: { en: 'Regular ice', ar: 'ثلج عادي' } },
  { id: 'extra', label: { en: 'Extra ice', ar: 'ثلج زيادة' } },
];

export const syrups: OptionDef<SyrupId>[] = [
  { id: 'none', label: { en: 'No syrup', ar: 'بدون سيرب' } },
  { id: 'vanilla', label: { en: 'Vanilla', ar: 'فانيليا' } },
  { id: 'caramel', label: { en: 'Caramel', ar: 'كراميل' } },
  { id: 'hazelnut', label: { en: 'Hazelnut', ar: 'بندق' } },
  { id: 'sugar-free-vanilla', label: { en: 'Sugar-free vanilla', ar: 'فانيليا بدون سكر' }, deltaEGP: 15 },
];

export const temperatures: OptionDef<TemperatureId>[] = [
  { id: 'regular', label: { en: 'Regular', ar: 'عادي' } },
  { id: 'extra-hot', label: { en: 'Extra hot', ar: 'ساخن جدًا' } },
];

export const grinds: OptionDef<GrindId>[] = [
  { id: 'whole', label: { en: 'Whole bean', ar: 'حبوب كاملة' } },
  { id: 'espresso', label: { en: 'Espresso', ar: 'إسبريسو' } },
  { id: 'filter', label: { en: 'Filter', ar: 'فلتر' } },
  { id: 'french-press', label: { en: 'French press', ar: 'فرنش برس' } },
  { id: 'turkish', label: { en: 'Turkish', ar: 'تركي' } },
];

/** Weight multipliers relative to the 250 g price. */
export const weights: (OptionDef<WeightId> & { factor: number })[] = [
  { id: '250g', label: { en: '250 g', ar: '٢٥٠ جم' }, factor: 1 },
  { id: '500g', label: { en: '500 g', ar: '٥٠٠ جم' }, factor: 1.9 },
  { id: '1kg', label: { en: '1 kg', ar: '١ كجم' }, factor: 3.6 },
];

export const subscriptions: OptionDef<SubscriptionId>[] = [
  { id: 'none', label: { en: 'One-time purchase', ar: 'شراء مرة واحدة' } },
  { id: '2w', label: { en: 'Every 2 weeks', ar: 'كل أسبوعين' } },
  { id: '4w', label: { en: 'Every 4 weeks', ar: 'كل ٤ أسابيع' } },
];

export const SUBSCRIPTION_DISCOUNT = 0.1;
export const EXTRA_SHOT_EGP = 20;
export const MIN_SHOTS = 1;
export const MAX_SHOTS = 4;

/** Default options for an item, used when adding with quick-add "+". */
export function defaultOptions(item: MenuItem): ItemOptions {
  const o: ItemOptions = {};
  const c = item.customizations;
  if (c.includes('size')) o.size = 'regular';
  if (c.includes('milk')) o.milk = 'full-cream';
  if (c.includes('shots')) o.shots = item.defaultShots ?? 2;
  if (c.includes('sweetness')) o.sweetness = item.tags.includes('no-added-sugar') ? 'none' : 'regular';
  if (c.includes('ice')) o.ice = 'regular';
  if (c.includes('syrup')) o.syrup = 'none';
  if (c.includes('temperature')) o.temperature = 'regular';
  if (c.includes('cardamom')) o.cardamom = false;
  if (item.kind === 'beans') {
    o.grind = item.bean?.origin === 'turkish' ? 'turkish' : 'whole';
    o.weight = '250g';
    o.subscription = 'none';
  }
  return o;
}

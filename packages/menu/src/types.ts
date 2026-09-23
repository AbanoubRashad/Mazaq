import type { Origin } from '@mazaq/tokens';

export type Locale = 'en' | 'ar';
export type L10n = Record<Locale, string>;

export type Currency = 'EGP' | 'AED' | 'SAR' | 'JOD' | 'GBP';
export type MarketCode = 'EG' | 'AE' | 'SA' | 'JO' | 'GB';
export type PriceTable = Record<Currency, number>;

/** Primary category an item belongs to. */
export type ItemCategory = 'hot-coffee' | 'iced-coffee' | 'coffee-beans' | 'healthy-breakfast' | 'bakes';
/** Menu navigation categories — includes derived views (seasonal, turkish-coffee). */
export type MenuCategory = 'seasonal' | ItemCategory | 'turkish-coffee';

export type Allergen = 'milk' | 'eggs' | 'gluten' | 'nuts' | 'peanuts' | 'sesame' | 'soy';

export type Tag =
  | 'seasonal'
  | 'bestseller'
  | 'turkish'
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'high-protein'
  | 'under-300'
  | 'dairy-free-option'
  | 'decaf-available'
  | 'no-added-sugar';

export type ItemKind = 'hot' | 'iced' | 'beans' | 'food' | 'bake';

export type CustomizationKey =
  | 'size'
  | 'milk'
  | 'shots'
  | 'sweetness'
  | 'ice'
  | 'syrup'
  | 'temperature'
  | 'cardamom';

export type SizeId = 'small' | 'regular' | 'large';
export type MilkId = 'full-cream' | 'skimmed' | 'oat' | 'almond' | 'lactose-free';
export type SweetnessId = 'none' | 'less' | 'regular';
export type IceId = 'light' | 'regular' | 'extra';
export type SyrupId = 'none' | 'vanilla' | 'caramel' | 'hazelnut' | 'sugar-free-vanilla';
export type TemperatureId = 'regular' | 'extra-hot';

export type Roast = 'light' | 'light-medium' | 'medium' | 'medium-dark' | 'dark';
export type GrindId = 'whole' | 'espresso' | 'filter' | 'french-press' | 'turkish';
export type WeightId = '250g' | '500g' | '1kg';
export type SubscriptionId = 'none' | '2w' | '4w';

export interface ImageCredit {
  name: string;
  /** Unsplash photo page or profile. */
  url: string;
  /** False when the photographer name still has to be confirmed by the client. */
  confirmed: boolean;
}

export interface ImageRef {
  /** File name inside apps/web/public/images and apps/mobile/assets/images. */
  src: string;
  alt: L10n;
  credit: ImageCredit;
}

export interface BeanDetails {
  origin: Origin;
  label: string; // printed on the bag, e.g. ETHIOPIA
  region: L10n;
  altitude: string; // e.g. 1,900–2,200 M
  process: L10n;
  varietal: L10n;
  roast: Roast;
  /** 1 (light) – 5 (dark) for the roast meter. */
  roastLevel: 1 | 2 | 3 | 4 | 5;
  notes: L10n[];
  blend?: boolean;
  story: L10n;
}

export interface MenuItem {
  id: string;
  slug: string;
  category: ItemCategory;
  kind: ItemKind;
  name: L10n;
  description: L10n;
  kcal: number;
  proteinG?: number;
  caffeineMg?: number;
  allergens: Allergen[];
  tags: Tag[];
  /** Price in each currency for the default configuration (Regular / 250 g). VAT included. */
  basePrice: PriceTable;
  customizable: boolean;
  customizations: CustomizationKey[];
  /** Espresso shots included in the base price. */
  defaultShots?: number;
  /** Null when no verified photo exists yet — UI falls back to illustrated product art. */
  image: ImageRef | null;
  /** Illustration tint used by ProductArt / placeholders. */
  art: { tone: string; ink: string };
  bean?: BeanDetails;
  /** Slug of a breakfast item that pairs well (drinks only). */
  pairsWith?: string;
  /** Marks items the client must still confirm (placeholder bakes). */
  placeholder?: boolean;
}

export interface ItemOptions {
  size?: SizeId;
  milk?: MilkId;
  shots?: number;
  sweetness?: SweetnessId;
  ice?: IceId;
  syrup?: SyrupId;
  temperature?: TemperatureId;
  cardamom?: boolean;
  grind?: GrindId;
  weight?: WeightId;
  subscription?: SubscriptionId;
}

import type { Locale, MenuItem } from '@mazaq/menu';
import Image from 'next/image';
import { BeanBag } from './BeanBag';
import { ProductArt, type ArtKind } from './ProductArt';

const artKind = (item: MenuItem): ArtKind => {
  if (item.kind === 'iced') return 'iced';
  if (item.kind === 'hot') return 'hot';
  if (item.slug.includes('wrap')) return 'wrap';
  if (item.slug.includes('sourdough')) return 'toast';
  return 'bowl';
};

/**
 * Fills its (relatively positioned) parent with the item's photo, bean-bag art or
 * illustrated fallback.
 */
export function ProductImage({
  item,
  locale,
  sizes,
  priority = false,
  preferBag = true,
  className = '',
}: {
  item: MenuItem;
  locale: Locale;
  sizes: string;
  priority?: boolean;
  /** For beans: show the pack artwork instead of the bean photo. */
  preferBag?: boolean;
  className?: string;
}) {
  if (item.bean && preferBag) {
    return (
      <div className={`absolute inset-0 ${className}`} style={{ background: item.art.tone }}>
        <BeanBag
          origin={item.bean.origin}
          label={item.bean.label}
          region={item.bean.region.en}
          className="lift-target h-full w-full"
          title={`${item.name[locale]} — Mazaq bag`}
        />
      </div>
    );
  }
  if (!item.image) {
    return (
      <div className={`absolute inset-0 ${className}`} role="img" aria-label={item.name[locale]}>
        <ProductArt kind={artKind(item)} tone={item.art.tone} ink={item.art.ink} className="lift-target h-full w-full" />
      </div>
    );
  }
  return (
    <Image
      src={`/images/${item.image.src}`}
      alt={item.image.alt[locale]}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}

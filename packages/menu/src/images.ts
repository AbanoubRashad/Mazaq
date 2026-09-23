import catalogue from './images.json';
import type { ImageRef } from './types';

export type ImageKey = keyof typeof catalogue;

interface CatalogueEntry {
  file: string;
  unsplashId: string;
  photographer: string;
  confirmed: boolean;
  alt: { en: string; ar: string };
}

export const imageCatalogue = catalogue as Record<ImageKey, CatalogueEntry>;

export function unsplashUrl(id: string, width = 1600) {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=80&fm=jpg`;
}

export function img(key: ImageKey): ImageRef {
  const entry = imageCatalogue[key];
  return {
    src: entry.file,
    alt: entry.alt,
    credit: {
      name: entry.photographer,
      url: `https://unsplash.com/s/photos/${encodeURIComponent(entry.unsplashId)}`,
      confirmed: entry.confirmed,
    },
  };
}

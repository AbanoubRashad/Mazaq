import type { ImageSourcePropType } from 'react-native';

/**
 * Metro needs static requires, so every photo from packages/menu/src/images.json is
 * listed here. Files are copied into assets/images by `pnpm images:fetch`.
 */
export const photos: Record<string, ImageSourcePropType> = {
  'latte-art.jpg': require('../assets/images/latte-art.jpg'),
  'iced-coffee-glass.jpg': require('../assets/images/iced-coffee-glass.jpg'),
  'espresso.jpg': require('../assets/images/espresso.jpg'),
  'cappuccino.jpg': require('../assets/images/cappuccino.jpg'),
  'flat-white.jpg': require('../assets/images/flat-white.jpg'),
  'spanish-latte.jpg': require('../assets/images/spanish-latte.jpg'),
  'turkish-coffee.jpg': require('../assets/images/turkish-coffee.jpg'),
  'turkish-coffee-cezve.jpg': require('../assets/images/turkish-coffee-cezve.jpg'),
  'cold-brew.jpg': require('../assets/images/cold-brew.jpg'),
  'iced-latte-pour.jpg': require('../assets/images/iced-latte-pour.jpg'),
  'espresso-tonic.jpg': require('../assets/images/espresso-tonic.jpg'),
  'espresso-glass.jpg': require('../assets/images/espresso-glass.jpg'),
  'iced-latte.jpg': require('../assets/images/iced-latte.jpg'),
  'iced-coffee-bar.jpg': require('../assets/images/iced-coffee-bar.jpg'),
  'iced-coffee-cream.jpg': require('../assets/images/iced-coffee-cream.jpg'),
  'coffee-beans.jpg': require('../assets/images/coffee-beans.jpg'),
  'coffee-beans-closeup.jpg': require('../assets/images/coffee-beans-closeup.jpg'),
  'avocado-egg-sourdough.jpg': require('../assets/images/avocado-egg-sourdough.jpg'),
  'yogurt-parfait.jpg': require('../assets/images/yogurt-parfait.jpg'),
  'overnight-oats.jpg': require('../assets/images/overnight-oats.jpg'),
  'shakshuka.jpg': require('../assets/images/shakshuka.jpg'),
  'acai-bowl.jpg': require('../assets/images/acai-bowl.jpg'),
  'omelette.jpg': require('../assets/images/omelette.jpg'),
  'cafe-interior.jpg': require('../assets/images/cafe-interior.jpg'),
  'barista-pour-over.jpg': require('../assets/images/barista-pour-over.jpg'),
  'coffee-farm.jpg': require('../assets/images/coffee-farm.jpg'),
  'coffee-cherries.jpg': require('../assets/images/coffee-cherries.jpg'),
  'croissants.jpg': require('../assets/images/croissants.jpg'),
  'croissant-tray.jpg': require('../assets/images/croissant-tray.jpg'),
  'pastries-latte.jpg': require('../assets/images/pastries-latte.jpg'),
};

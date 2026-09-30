import type { Locale, MenuItem } from '@mazaq/menu';
import { originColors, type Origin } from '@mazaq/tokens';
import { Image } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { photos } from '../images';
import { f } from '../theme';

/** Mazaq pouch artwork (native version of the web BeanBag). */
export function BeanBag({ origin, label, region, size }: { origin: Origin; label: string; region: string; size: number }) {
  const ink = originColors[origin];
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Ellipse cx="100" cy="178" rx="54" ry="7" fill="#000" opacity={0.1} />
      <Path d="M56 34 L144 34 L152 170 Q100 180 48 170 Z" fill={ink} />
      <Path d="M56 34 L144 34 L145 48 L55 48 Z" fill="#000" opacity={0.22} />
      <Circle cx="100" cy="64" r="5" fill="#000" opacity={0.25} />
      <Rect x="66" y="82" width="68" height="70" rx="3" fill="#F6F4EF" />
      <SvgText x="100" y="96" fill="#0E3B36" fontFamily={f.monoSemibold} fontSize={7} letterSpacing={2.4} textAnchor="middle">
        MAZAQ
      </SvgText>
      <Line x1="76" y1="102" x2="124" y2="102" stroke="#0E3B36" strokeOpacity={0.25} strokeWidth={0.8} />
      <SvgText x="100" y="119" fill="#16201E" fontFamily={f.display} fontSize={label.length > 9 ? 9 : 11} textAnchor="middle">
        {label}
      </SvgText>
      <SvgText x="100" y="132" fill="#55625F" fontFamily={f.bodyMedium} fontSize={region.length > 18 ? 6.5 : 8} textAnchor="middle">
        {region}
      </SvgText>
      <SvgText x="100" y="146" fill="#55625F" fontFamily={f.mono} fontSize={5.5} textAnchor="middle">
        250 G · WHOLE BEAN
      </SvgText>
    </Svg>
  );
}

/** Illustrated fallback for items without a verified photo (e.g. the halloumi wrap). */
function WrapArt({ tone, ink }: { tone: string; ink: string }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
      <Rect width="200" height="200" fill={tone} />
      <Ellipse cx="100" cy="152" rx="80" ry="18" fill="#FBFAF7" />
      <Rect x="34" y="88" width="132" height="44" rx="22" fill={ink} transform="rotate(-18 100 110)" />
      <Ellipse cx="160" cy="92" rx="12" ry="22" fill="#E7C28E" transform="rotate(-18 100 110)" />
    </Svg>
  );
}

/** Photo, bean bag or illustration filling a rounded box. */
export function ProductVisual({
  item,
  locale,
  width,
  height,
  radius = 12,
  style,
  bag = true,
}: {
  item: MenuItem;
  locale: Locale;
  width: number | `${number}%`;
  height: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  bag?: boolean;
}) {
  const box: StyleProp<ViewStyle> = [
    { width, height, borderRadius: radius, overflow: 'hidden', backgroundColor: item.art.tone, alignItems: 'center', justifyContent: 'center' },
    style,
  ];
  if (item.bean && bag) {
    return (
      <View style={box} accessible accessibilityRole="image" accessibilityLabel={item.name[locale]}>
        <BeanBag origin={item.bean.origin} label={item.bean.label} region={item.bean.region.en} size={Math.min(height, typeof width === 'number' ? width : height)} />
      </View>
    );
  }
  const src = item.image ? photos[item.image.src] : undefined;
  if (!src) {
    return (
      <View style={box} accessible accessibilityRole="image" accessibilityLabel={item.name[locale]}>
        <WrapArt tone={item.art.tone} ink={item.art.ink} />
      </View>
    );
  }
  return (
    <View style={box}>
      <Image
        source={src}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={0}
        accessibilityLabel={item.image?.alt[locale]}
      />
    </View>
  );
}

export function Photo({
  file,
  alt,
  width,
  height,
  radius = 0,
  style,
}: {
  file: string;
  alt: string;
  width: number | `${number}%`;
  height: number;
  radius?: number | { tl: number; tr: number; bl: number; br: number };
  style?: StyleProp<ViewStyle>;
}) {
  const r =
    typeof radius === 'number'
      ? { borderRadius: radius }
      : { borderTopLeftRadius: radius.tl, borderTopRightRadius: radius.tr, borderBottomLeftRadius: radius.bl, borderBottomRightRadius: radius.br };
  return (
    <View style={[{ width, height, overflow: 'hidden' }, r, style]}>
      <Image source={photos[file]} style={{ width: '100%', height: '100%' }} contentFit="cover" accessibilityLabel={alt} />
    </View>
  );
}

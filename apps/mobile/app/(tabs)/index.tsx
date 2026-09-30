import { stores } from '@mazaq/api';
import { FREE_DRINK_BEANS } from '@mazaq/cart';
import { formatNumber, getItem } from '@mazaq/menu';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductVisual } from '@/components/art';
import { ChevronDown, PinIcon } from '@/components/icons';
import { Card, Txt } from '@/components/ui';
import { useI18n } from '@/i18n';
import { cartStore, useApp, useCart, usePrice, useRewards } from '@/store';
import { c } from '@/theme';

export default function HomeScreen() {
  const { t, locale, ar } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const price = usePrice();
  const name = useApp((s) => s.name);
  const storeId = useCart((s) => s.storeId);
  const rewards = useRewards();
  const balance = rewards?.balance ?? 0;
  const store = stores.find((s) => s.id === storeId) ?? stores[0]!;
  // "Zamalek, 26th of July St" — area first, then street (addresses are stored street-first).
  const sep = ar ? '، ' : ', ';
  const parts = store.address[locale].split(sep);
  const storeLine = parts.length > 1 ? `${parts[parts.length - 1]}${sep}${parts.slice(0, -1).join(sep)}` : parts[0];
  const saffron = getItem('saffron-honey-latte')!;
  const usual = getItem('flat-white')!;
  const usualOptions = { size: 'regular' as const, milk: 'oat' as const, shots: 2 };

  const hour = new Date().getHours();
  const greetingKey = hour < 12 ? 'app.greetingMorning' : hour < 18 ? 'app.greetingAfternoon' : 'app.greetingEvening';
  const date = new Intl.DateTimeFormat(ar ? 'ar-EG' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const toNext = Math.max(0, FREE_DRINK_BEANS - balance);
  const progress = Math.min(1, balance / FREE_DRINK_BEANS);

  const cats = [
    { key: 'coffee-beans', label: t('app.catBeans'), item: getItem('ethiopia-yirgacheffe')! },
    { key: 'hot-coffee', label: t('app.catHot'), item: getItem('cappuccino')! },
    { key: 'iced-coffee', label: t('app.catIced'), item: getItem('iced-flat-white')! },
    { key: 'healthy-breakfast', label: t('app.catBreakfast'), item: getItem('avocado-egg-sourdough')! },
  ];

  return (
    <ScrollView contentContainerStyle={[s.page, { paddingTop: insets.top + 20 }]}>
      <View style={[s.row, { gap: 12 }]}>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt size={14} color={c.muted}>
            {date}
          </Txt>
          <Txt weight="display" size={28} accessibilityRole="header">
            {t(greetingKey, { name: ar && name === 'Nour' ? 'نور' : name })}
          </Txt>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('app.account')}
          onPress={() => router.push('/account')}
          style={s.avatar}
        >
          <Txt weight="bold" size={15} color={c.saffron500}>
            {ar ? 'ن' : (rewards?.initials ?? name.slice(0, 1).toUpperCase())}
          </Txt>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/order')}
        style={s.storeChip}
      >
        <PinIcon />
        <Txt size={14} style={{ flex: 1 }} numberOfLines={1}>
          {t('app.pickup')}
          <Txt weight="bold" size={14}>
            {storeLine}
          </Txt>
        </Txt>
        <ChevronDown />
      </Pressable>

      <Pressable accessibilityRole="button" onPress={() => router.push('/rewards')} style={s.rewards}>
        <View style={[s.row, { alignItems: 'flex-end' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
            <Txt weight="display" size={40} color={c.saffron500}>
              {formatNumber(balance, locale)}
            </Txt>
            <Txt weight="semibold" size={15} color={c.onTeal}>
              {t('app.beans')}
            </Txt>
          </View>
          <Txt weight="mono" size={11} color={c.onTealMuted}>
            {t('app.gold')}
          </Txt>
        </View>
        <View style={s.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: FREE_DRINK_BEANS, now: balance }}>
          <View style={[s.fill, { width: `${progress * 100}%` }]} />
        </View>
        <Txt size={14} color={c.onTealMuted}>
          {t('app.rewardsToFree', { count: formatNumber(toNext, locale) })}
        </Txt>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/product/[slug]', params: { slug: saffron.slug } })}
        style={s.seasonal}
      >
        <View style={{ flex: 1, padding: 18, gap: 8 }}>
          <Txt weight="mono" size={11} color={c.teal800}>
            {t('app.seasonalEyebrow')}
          </Txt>
          <Txt weight="display" size={24} color={c.teal800}>
            {t('app.seasonalTitle')}
          </Txt>
          <Txt weight="bold" size={14} color={c.teal800} style={{ marginTop: 4 }}>
            {t('app.seasonalCta', { price: price(saffron.basePrice.EGP, 'EGP') })}
          </Txt>
        </View>
        <ProductVisual item={saffron} locale={locale} width={130} height={150} radius={0} />
      </Pressable>

      <View style={{ gap: 10 }}>
        <Txt weight="display" size={18} accessibilityRole="header">
          {t('app.byCategory')}
        </Txt>
        <View style={[s.row, { alignItems: 'flex-start' }]}>
          {cats.map((cat) => (
            <Pressable
              key={cat.key}
              accessibilityRole="button"
              accessibilityLabel={cat.label}
              onPress={() => router.push({ pathname: '/menu', params: { category: cat.key } })}
              style={s.cat}
            >
              <ProductVisual item={cat.item} locale={locale} width={76} height={76} radius={38} />
              <Txt weight="semibold" size={13}>
                {cat.label}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>

      <Card style={[s.row, { padding: 12, gap: 12 }]}>
        <ProductVisual item={usual} locale={locale} width={56} height={56} />
        <View style={{ flex: 1, gap: 2 }}>
          <Txt weight="mono" size={10} color={c.muted}>
            {t('app.usual')}
          </Txt>
          <Txt weight="bold" size={15}>
            {usual.name[locale]}
          </Txt>
          <Txt size={13} color={c.muted}>
            {ar ? `وسط · حليب شوفان · ${price(125)}` : `Regular · Oat milk · ${price(125)}`}
          </Txt>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            cartStore.getState().add(usual.id, usualOptions);
            router.push('/order');
          }}
          style={s.reorder}
        >
          <Txt weight="bold" size={14} color="#fff">
            {t('app.reorder')}
          </Txt>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingBottom: 32, gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.teal800, alignItems: 'center', justifyContent: 'center' },
  storeChip: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  rewards: { backgroundColor: c.teal800, borderRadius: 20, padding: 18, gap: 12 },
  track: { height: 8, backgroundColor: c.tealRule, borderRadius: 4, overflow: 'hidden' },
  fill: { height: 8, backgroundColor: c.saffron500, borderRadius: 4 },
  seasonal: { backgroundColor: c.saffron500, borderRadius: 20, flexDirection: 'row', overflow: 'hidden' },
  cat: { alignItems: 'center', gap: 6, width: '23%' },
  reorder: { height: 44, paddingHorizontal: 16, borderRadius: 22, backgroundColor: c.teal800, justifyContent: 'center' },
});

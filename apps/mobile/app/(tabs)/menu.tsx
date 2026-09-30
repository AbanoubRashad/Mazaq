import { defaultOptions, formatNumber, isMenuCategory, itemsInCategory, menuItems, type MenuCategory, type MenuItem } from '@mazaq/menu';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductVisual } from '@/components/art';
import { CheckIcon, PlusIcon, SearchIcon } from '@/components/icons';
import { Chip, Txt } from '@/components/ui';
import { useI18n } from '@/i18n';
import { cartStore, usePrice, useTotals } from '@/store';
import { c, font } from '@/theme';

const TABS: MenuCategory[] = ['seasonal', 'hot-coffee', 'iced-coffee', 'coffee-beans', 'turkish-coffee', 'healthy-breakfast', 'bakes'];

export default function MenuScreen() {
  const { t, locale, ar } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const initial = params.category && isMenuCategory(params.category) ? params.category : 'iced-coffee';
  const [category, setCategory] = useState<MenuCategory>(initial);
  const [lastParam, setLastParam] = useState(params.category);
  if (params.category !== lastParam) {
    setLastParam(params.category);
    if (params.category && isMenuCategory(params.category)) setCategory(params.category);
  }
  const [query, setQuery] = useState('');
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const price = usePrice();
  const totals = useTotals();

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return menuItems.filter((i) => i.name.en.toLowerCase().includes(q) || i.name.ar.includes(query.trim()));
    return itemsInCategory(category);
  }, [category, query]);

  const quickAdd = (item: MenuItem) => {
    cartStore.getState().add(item.id, defaultOptions(item));
    setJustAdded(item.id);
    setTimeout(() => setJustAdded((x) => (x === item.id ? null : x)), 1200);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[s.header, { paddingTop: insets.top + 20 }]}>
        <Txt weight="display" size={32} accessibilityRole="header">
          {t('app.menuTitle')}
        </Txt>
        <View style={s.search}>
          <SearchIcon />
          <TextInput
            accessibilityLabel={t('common.search')}
            placeholder={t('common.searchPlaceholder')}
            placeholderTextColor={c.muted}
            value={query}
            onChangeText={setQuery}
            style={[s.input, font('medium', ar), { textAlign: ar ? 'right' : 'left' }]}
            returnKeyType="search"
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} accessibilityRole="tablist">
          {TABS.map((cat) => (
            <Chip
              key={cat}
              solid
              label={t(`categories.${cat}`)}
              selected={!query && category === cat}
              onPress={() => {
                setQuery('');
                setCategory(cat);
              }}
              style={{ height: 40 }}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: totals.count ? 96 : 24, gap: 10 }}
        ListEmptyComponent={<Txt color={c.muted}>{t('menu.empty')}</Txt>}
        renderItem={({ item }) => (
          <View style={s.row}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('menu.customize', { name: item.name[locale] })}
              onPress={() => router.push({ pathname: '/product/[slug]', params: { slug: item.slug } })}
              style={s.rowMain}
            >
              <ProductVisual item={item} locale={locale} width={64} height={64} />
              <View style={{ flex: 1, gap: 3 }}>
                <Txt weight="bold" size={15}>
                  {item.name[locale]}
                </Txt>
                <Txt weight="mono" size={11} color={c.muted}>
                  {t('common.kcalUpper', { value: formatNumber(item.kcal, locale) })}
                  {item.proteinG !== undefined ? ` · ${t('common.proteinUpper', { value: formatNumber(item.proteinG, locale) })}` : ''}
                </Txt>
                <Txt weight="semibold" size={14}>
                  {price(item.basePrice[totals.currency])}
                </Txt>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('menu.quickAdd', { name: item.name[locale] })}
              onPress={() => quickAdd(item)}
              style={s.add}
            >
              {justAdded === item.id ? <CheckIcon /> : <PlusIcon color={c.teal800} />}
            </Pressable>
          </View>
        )}
      />

      {totals.count > 0 && (
        <Pressable accessibilityRole="button" onPress={() => router.push('/order')} style={s.basketBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={s.count}>
              <Txt weight="bold" size={14} color={c.teal800}>
                {formatNumber(totals.count, locale)}
              </Txt>
            </View>
            <Txt size={14} color="#fff">
              {t('app.viewBasket')}
            </Txt>
          </View>
          <Txt weight="bold" size={15} color="#fff">
            {price(totals.total)}
          </Txt>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 12, gap: 14 },
  search: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: c.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 15, color: c.ink, height: '100%' },
  row: { backgroundColor: '#fff', borderRadius: 16, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  add: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.sage100, alignItems: 'center', justifyContent: 'center' },
  basketBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    height: 56,
    borderRadius: 18,
    backgroundColor: c.teal800,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    shadowColor: '#0A2C28',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  count: { backgroundColor: c.saffron500, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
});

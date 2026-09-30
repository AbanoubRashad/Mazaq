import {
  calcItemPrice,
  defaultOptions,
  delta,
  describeOptions,
  EXTRA_SHOT_EGP,
  formatNumber,
  getItem,
  grinds,
  iceLevels,
  MAX_SHOTS,
  milks,
  MIN_SHOTS,
  sizes,
  subscriptions,
  sweetnessLevels,
  syrups,
  temperatures,
  weights,
  type ItemOptions,
} from '@mazaq/menu';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductVisual } from '@/components/art';
import { BackIcon, HeartIcon } from '@/components/icons';
import { Button, Chip, IconButton, Segmented, Stepper, Txt } from '@/components/ui';
import { useI18n } from '@/i18n';
import { appStore, cartStore, useApp, useMarket, usePrice } from '@/store';
import { c } from '@/theme';

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Txt weight="bold" size={15}>
        {label}
      </Txt>
      {children}
    </View>
  );
}

export default function CustomizeScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const item = getItem(slug ?? '');
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const market = useMarket();
  const price = usePrice();
  const favourite = useApp((s) => (item ? s.favourites.includes(item.slug) : false));
  const [o, setO] = useState<ItemOptions>(() => (item ? defaultOptions(item) : {}));

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Txt>{t('menu.empty')}</Txt>
      </View>
    );
  }
  const cur = market.currency;
  const set = (patch: ItemOptions) => setO((p) => ({ ...p, ...patch }));
  const has = (k: (typeof item.customizations)[number]) => item.customizations.includes(k);

  const meta = [
    t('common.kcalUpper', { value: formatNumber(item.kcal, locale) }),
    item.caffeineMg ? t('customize.caffeine', { value: formatNumber(item.caffeineMg, locale) }) : null,
    item.proteinG !== undefined ? t('common.proteinUpper', { value: formatNumber(item.proteinG, locale) }) : null,
    item.allergens.length ? item.allergens.map((a) => t(`allergens.${a}`)).join(locale === 'ar' ? '، ' : ', ').toUpperCase() : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const add = () => {
    cartStore.getState().add(item.id, o);
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} bounces={false}>
        <View>
          <ProductVisual item={item} locale={locale} width="100%" height={260 + insets.top} radius={0} />
          <IconButton label={t('common.back')} onPress={() => router.back()} style={[s.float, { top: insets.top + 12, start: 16 }]}>
            <BackIcon />
          </IconButton>
          <IconButton
            label={favourite ? t('customize.unfavourite') : t('customize.favourite')}
            onPress={() => appStore.getState().toggleFavourite(item.slug)}
            style={[s.float, { top: insets.top + 12, end: 16 }]}
          >
            <HeartIcon filled={favourite} color={favourite ? c.brown600 : c.ink} />
          </IconButton>
        </View>
        <View style={s.sheet}>
          <View style={{ gap: 6 }}>
            <Txt weight="display" size={28} accessibilityRole="header">
              {item.name[locale]}
            </Txt>
            <Txt size={14} color={c.muted} style={{ lineHeight: 20 }}>
              {item.description[locale]}
            </Txt>
            <Txt weight="mono" size={11} color={c.muted}>
              {meta}
            </Txt>
          </View>

          {has('size') && (
            <Section label={t('customize.size')}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {sizes.map((sz) => {
                  const on = o.size === sz.id;
                  return (
                    <Pressable
                      key={sz.id}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: on }}
                      onPress={() => set({ size: sz.id })}
                      style={[s.sizeCard, on ? s.on : s.off]}
                    >
                      <Txt weight="bold" size={14}>
                        {sz.label[locale]}
                      </Txt>
                      <Txt size={12} color={c.muted}>
                        {sz.meta?.[locale]}
                      </Txt>
                    </Pressable>
                  );
                })}
              </View>
            </Section>
          )}

          {has('milk') && (
            <Section label={t('customize.milk')}>
              <View style={s.wrap}>
                {milks.map((m) => (
                  <Chip
                    key={m.id}
                    label={m.deltaEGP ? `${m.label[locale]} +${price(delta(m.deltaEGP, cur))}` : m.label[locale]}
                    selected={o.milk === m.id}
                    onPress={() => set({ milk: m.id })}
                  />
                ))}
              </View>
            </Section>
          )}

          {has('cardamom') && (
            <Section label={t('customize.cardamom')}>
              <Segmented
                label={t('customize.cardamom')}
                value={o.cardamom ? 'yes' : 'no'}
                onChange={(v) => set({ cardamom: v === 'yes' })}
                options={[
                  { value: 'no', label: t('customize.plain') },
                  { value: 'yes', label: t('customize.withCardamom') },
                ]}
              />
            </Section>
          )}

          {has('shots') && o.shots !== undefined && (
            <View style={s.between}>
              <View style={{ gap: 2 }}>
                <Txt weight="bold" size={15}>
                  {t('customize.shots')}
                </Txt>
                <Txt size={12} color={c.muted}>
                  {t('customize.extraShot', { price: price(delta(EXTRA_SHOT_EGP, cur)) })}
                </Txt>
              </View>
              <Stepper
                value={o.shots}
                min={MIN_SHOTS}
                max={MAX_SHOTS}
                onChange={(shots) => set({ shots })}
                decLabel={t('customize.fewerShots')}
                incLabel={t('customize.moreShots')}
                display={formatNumber(o.shots, locale)}
              />
            </View>
          )}

          {has('sweetness') && (
            <Section label={t('customize.sweetness')}>
              <Segmented
                label={t('customize.sweetness')}
                value={o.sweetness ?? 'regular'}
                onChange={(sweetness) => set({ sweetness })}
                options={sweetnessLevels.map((x) => ({ value: x.id, label: x.label[locale] }))}
              />
            </Section>
          )}

          {has('ice') && (
            <Section label={t('customize.ice')}>
              <Segmented
                label={t('customize.ice')}
                value={o.ice ?? 'regular'}
                onChange={(ice) => set({ ice })}
                options={iceLevels.map((x) => ({ value: x.id, label: x.label[locale] }))}
              />
            </Section>
          )}

          {has('syrup') && (
            <Section label={t('customize.syrup')}>
              <View style={s.wrap}>
                {syrups.map((x) => (
                  <Chip
                    key={x.id}
                    label={x.deltaEGP ? `${x.label[locale]} +${price(delta(x.deltaEGP, cur))}` : x.label[locale]}
                    selected={o.syrup === x.id}
                    onPress={() => set({ syrup: x.id })}
                  />
                ))}
              </View>
            </Section>
          )}

          {has('temperature') && (
            <Section label={t('customize.temperature')}>
              <Segmented
                label={t('customize.temperature')}
                value={o.temperature ?? 'regular'}
                onChange={(temperature) => set({ temperature })}
                options={temperatures.map((x) => ({ value: x.id, label: x.label[locale] }))}
              />
            </Section>
          )}

          {item.kind === 'beans' && (
            <>
              <Section label={t('beans.grind')}>
                <View style={s.wrap}>
                  {grinds.map((g) => (
                    <Chip key={g.id} label={g.label[locale]} selected={o.grind === g.id} onPress={() => set({ grind: g.id })} />
                  ))}
                </View>
              </Section>
              <Section label={t('beans.weight')}>
                <Segmented
                  label={t('beans.weight')}
                  value={o.weight ?? '250g'}
                  onChange={(weight) => set({ weight })}
                  options={weights.map((w) => ({ value: w.id, label: w.label[locale] }))}
                />
              </Section>
              <Section label={t('beans.purchase')}>
                <View style={s.wrap}>
                  {subscriptions.map((x) => (
                    <Chip
                      key={x.id}
                      label={x.id === 'none' ? x.label[locale] : `${x.label[locale]} −10%`}
                      selected={o.subscription === x.id}
                      onPress={() => set({ subscription: x.id })}
                    />
                  ))}
                </View>
              </Section>
            </>
          )}
        </View>
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + 14 }]}>
        <View style={{ flexShrink: 1 }}>
          <Txt size={12} color={c.muted} numberOfLines={1}>
            {describeOptions(item, o, locale)}
          </Txt>
          <Txt weight="display" size={22} accessibilityLiveRegion="polite">
            {price(calcItemPrice(item, o, cur))}
          </Txt>
        </View>
        <Button label={t('common.addToOrder')} onPress={add} big style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  float: { position: 'absolute' },
  sheet: { marginTop: -24, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingTop: 22, gap: 18 },
  sizeCard: { flex: 1, height: 58, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 2 },
  on: { borderWidth: 2, borderColor: c.teal800, backgroundColor: c.sage100 },
  off: { borderWidth: 1, borderColor: c.lineStrong, backgroundColor: '#fff' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: c.line,
    backgroundColor: '#fff',
  },
});

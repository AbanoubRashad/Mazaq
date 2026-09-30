import { api, stores } from '@mazaq/api';
import { ASAP_MINUTES, canPayWithBeans, FREE_DRINK_BEANS, pickupSlots, resolveLines } from '@mazaq/cart';
import { describeOptions, formatNumber } from '@mazaq/menu';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductVisual } from '@/components/art';
import { Button, Card, Stepper, Txt } from '@/components/ui';
import { useI18n } from '@/i18n';
import { appStore, cartStore, useCart, useMarket, usePrice, useRewards, useTotals } from '@/store';
import { c } from '@/theme';

const toArabicDigits = (s: string) => s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]!);

export default function OrderScreen() {
  const { t, locale, ar } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const price = usePrice();
  const market = useMarket();
  const rewards = useRewards();
  const balance = rewards?.balance ?? 0;
  const cart = useCart((s) => ({
    lines: s.lines,
    market: s.market,
    fulfilment: s.fulfilment,
    storeId: s.storeId,
    pickupTime: s.pickupTime,
    paymentMethod: s.paymentMethod,
    payWithBeans: s.payWithBeans,
  }));
  const totals = useTotals(balance);
  const lines = useMemo(() => resolveLines(cart.lines, market.currency), [cart.lines, market.currency]);
  const [slots] = useState(() => pickupSlots(new Date(), 2));
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(false);
  const [picking, setPicking] = useState(false);
  const beansAllowed = canPayWithBeans(balance, cart.lines);
  const store = stores.find((s) => s.id === cart.storeId) ?? stores[0]!;
  const time = (s: string) => (ar ? toArabicDigits(s) : s);

  const place = async () => {
    setPlacing(true);
    setError(false);
    try {
      const order = await api.placeOrder({ ...cart, fulfilment: 'pickup', payWithBeans: cart.payWithBeans && beansAllowed });
      appStore.getState().setLastOrder(order.id);
      cartStore.getState().clear();
      router.push({ pathname: '/tracking/[id]', params: { id: order.id, number: order.number, code: order.pickupCode, store: order.input.storeId ?? '' } });
    } catch {
      setError(true);
    } finally {
      setPlacing(false);
    }
  };

  if (lines.length === 0) {
    return (
      <View style={[s.empty, { paddingTop: insets.top + 24 }]}>
        <Txt weight="display" size={26} accessibilityRole="header">
          {t('checkout.title')}
        </Txt>
        <Txt color={c.muted}>{t('checkout.empty')}</Txt>
        <Button label={t('checkout.emptyCta')} onPress={() => router.push('/menu')} style={{ alignSelf: 'flex-start' }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[s.page, { paddingTop: insets.top + 20 }]}>
        <Txt weight="display" size={26} accessibilityRole="header">
          {t('checkout.title')}
        </Txt>

        <Card style={{ gap: 12 }}>
          <View style={s.between}>
            <View style={{ flex: 1, gap: 2 }}>
              <Txt weight="mono" size={11} color={c.muted}>
                {t('checkout.pickupFrom')}
              </Txt>
              <Txt weight="bold" size={16}>
                {store.name[locale]}
              </Txt>
              <Txt size={13} color={c.muted}>
                {store.address[locale]}
              </Txt>
            </View>
            <Pressable accessibilityRole="button" onPress={() => setPicking((p) => !p)} hitSlop={10} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Txt weight="bold" size={14} color={c.teal800}>
                {t('common.change')}
              </Txt>
            </Pressable>
          </View>
          {picking && (
            <View style={{ gap: 6 }}>
              {stores
                .filter((st) => st.market === market.code)
                .map((st) => (
                  <Pressable
                    key={st.id}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: st.id === store.id }}
                    onPress={() => {
                      cartStore.getState().setStore(st.id);
                      setPicking(false);
                    }}
                    style={[s.storeOpt, st.id === store.id ? s.on : s.off]}
                  >
                    <Txt weight="semibold" size={14}>
                      {st.name[locale]}
                    </Txt>
                  </Pressable>
                ))}
            </View>
          )}
          <View style={{ flexDirection: 'row', gap: 8 }} accessibilityRole="radiogroup" accessibilityLabel={t('checkout.pickupTime')}>
            {['asap', ...slots].map((slot) => {
              const on = cart.pickupTime === slot;
              return (
                <Pressable
                  key={slot}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  onPress={() => cartStore.getState().setPickupTime(slot)}
                  style={[s.slot, on ? s.on : s.off]}
                >
                  <Txt weight={on ? 'bold' : 'semibold'} size={13}>
                    {slot === 'asap' ? t('checkout.asap', { min: formatNumber(ASAP_MINUTES, locale) }) : time(slot)}
                  </Txt>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card style={{ paddingVertical: 4 }}>
          {lines.map((l, i) => (
            <View key={l.lineId} style={[s.line, i < lines.length - 1 && s.rule]}>
              <ProductVisual item={l.item} locale={locale} width={56} height={56} />
              <View style={{ flex: 1, gap: 2 }}>
                <Txt weight="bold" size={15}>
                  {l.item.name[locale]}
                </Txt>
                <Txt size={12} color={c.muted}>
                  {describeOptions(l.item, l.options, locale)}
                </Txt>
                <Txt weight="bold" size={14}>
                  {price(l.lineTotal)}
                </Txt>
              </View>
              <Stepper
                value={l.qty}
                min={0}
                max={20}
                onChange={(q) => cartStore.getState().setQty(l.lineId, q)}
                decLabel={`${t('common.decrease')}: ${l.item.name[locale]}`}
                incLabel={`${t('common.increase')}: ${l.item.name[locale]}`}
                display={formatNumber(l.qty, locale)}
              />
            </View>
          ))}
        </Card>

        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ checked: cart.paymentMethod === 'card' }}
          onPress={() => cartStore.getState().setPaymentMethod(cart.paymentMethod === 'card' ? 'cash' : 'card')}
          style={[s.cardRow]}
        >
          <View style={s.visa}>
            <Txt weight="mono" size={10} color="#fff">
              {cart.paymentMethod === 'card' ? 'VISA' : 'CASH'}
            </Txt>
          </View>
          <View style={{ flex: 1 }}>
            <Txt weight="semibold" size={15}>
              {cart.paymentMethod === 'card' ? t('checkout.cardMock') : t('checkout.cash')}
            </Txt>
            <Txt size={12} color={c.muted}>
              {t('checkout.cardHint')}
            </Txt>
          </View>
          <Txt weight="bold" size={14} color={c.teal800}>
            {t('common.change')}
          </Txt>
        </Pressable>

        <View style={[s.cardRow, !beansAllowed && { opacity: 0.7 }]}>
          <View style={{ flex: 1 }}>
            <Txt weight="semibold" size={15}>
              {t('checkout.payWithBeans')}
            </Txt>
            <Txt size={12} color={c.muted}>
              {beansAllowed
                ? t('checkout.beansReady', { needed: formatNumber(FREE_DRINK_BEANS, locale) })
                : t('checkout.beansBalance', { balance: formatNumber(balance, locale), needed: formatNumber(FREE_DRINK_BEANS, locale) })}
            </Txt>
          </View>
          <Switch
            accessibilityLabel={t('checkout.payWithBeans')}
            value={cart.payWithBeans && beansAllowed}
            disabled={!beansAllowed}
            onValueChange={(v) => cartStore.getState().setPayWithBeans(v)}
            trackColor={{ true: c.teal800, false: c.line }}
          />
        </View>

        <View style={{ gap: 6, paddingHorizontal: 4 }}>
          <Row label={t('checkout.subtotal')} value={price(totals.subtotal)} />
          {totals.beansDiscount > 0 && <Row label={t('checkout.beansDiscount')} value={`−${price(totals.beansDiscount)}`} />}
          <Row label={t('checkout.vat', { rate: formatNumber(Math.round(totals.vatRate * 100), locale) })} value={price(totals.vat)} />
          <Row label={t('checkout.beansEarn')} value={`+${formatNumber(totals.beansToEarn, locale)}`} accent />
        </View>
        {error && (
          <Txt color="#B3261E" accessibilityRole="alert">
            {t('common.error')}
          </Txt>
        )}
      </ScrollView>

      <View style={[s.footer]}>
        <Button
          big
          label={placing ? t('checkout.placing') : t('checkout.placeOrder')}
          onPress={place}
          disabled={placing}
          trailing={
            placing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Txt weight="bold" size={16} color="#fff">
                {price(totals.total)}
              </Txt>
            )
          }
        />
      </View>
    </View>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={s.between}>
      <Txt size={14} color={c.muted}>
        {label}
      </Txt>
      <Txt weight={accent ? 'bold' : 'body'} size={14} color={accent ? c.brown600 : c.ink}>
        {value}
      </Txt>
    </View>
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 20, paddingBottom: 24, gap: 12 },
  empty: { flex: 1, paddingHorizontal: 20, gap: 14 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  slot: { flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  storeOpt: { minHeight: 44, borderRadius: 12, paddingHorizontal: 12, justifyContent: 'center' },
  on: { borderWidth: 2, borderColor: c.teal800, backgroundColor: c.sage100 },
  off: { borderWidth: 1, borderColor: c.lineStrong, backgroundColor: '#fff' },
  line: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  rule: { borderBottomWidth: 1, borderBottomColor: '#E4E8E4' },
  cardRow: { backgroundColor: '#fff', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  visa: { width: 44, height: 30, borderRadius: 6, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: c.line },
});

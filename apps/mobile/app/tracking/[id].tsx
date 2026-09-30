import { api, stores, type OrderStatus } from '@mazaq/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckIcon } from '@/components/icons';
import { Button, Txt } from '@/components/ui';
import { useI18n } from '@/i18n';
import { c } from '@/theme';

const STEPS: OrderStatus[] = ['received', 'preparing', 'ready'];

export default function Tracking() {
  const { id, number, code, store: storeId } = useLocalSearchParams<{ id: string; number?: string; code?: string; store?: string }>();
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>('received');
  const store = stores.find((s) => s.id === storeId);

  // Poll the (mock) API. The mock moves to "preparing" after a minute and "ready" at pickup time.
  useEffect(() => {
    let alive = true;
    const tick = () =>
      api.getOrder(id ?? '').then((o) => {
        if (alive && o) setStatus(o.status);
      });
    tick();
    const timer = setInterval(tick, 10_000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [id]);

  const current = STEPS.indexOf(status);

  return (
    <View style={[s.page, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20 }]}>
      <Txt weight="display" size={28} accessibilityRole="header">
        {t('app.tracking.title')}
      </Txt>
      <Txt weight="mono" size={13} color={c.muted}>
        {number}
        {store ? ` · ${t('app.tracking.at', { store: store.name[locale] })}` : ''}
      </Txt>

      <View style={s.codeCard} accessible accessibilityLabel={`${t('app.tracking.codeLabel')}: ${(code ?? '').split('').join(' ')}`}>
        <Txt weight="mono" size={12} color={c.onTealMuted}>
          {t('app.tracking.codeLabel')}
        </Txt>
        <Txt weight="display" size={72} color={c.saffron500} style={{ letterSpacing: 8, lineHeight: 80 }}>
          {code}
        </Txt>
      </View>

      <View style={{ gap: 0 }} accessibilityRole="list">
        {STEPS.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <View key={step} style={s.step} accessibilityState={{ selected: active }}>
              <View style={{ alignItems: 'center' }}>
                <View style={[s.dot, done || active ? s.dotOn : s.dotOff]}>{done ? <CheckIcon size={14} color="#fff" /> : null}</View>
                {i < STEPS.length - 1 && <View style={[s.bar, done ? { backgroundColor: c.teal800 } : null]} />}
              </View>
              <Txt weight={active ? 'bold' : 'medium'} size={17} color={done || active ? c.ink : c.muted} style={{ paddingTop: 2 }}>
                {t(`app.tracking.${step}`)}
              </Txt>
            </View>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />
      <Button big label={t('app.tracking.done')} onPress={() => router.replace('/')} />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: 20, gap: 16, backgroundColor: c.ground },
  codeCard: { backgroundColor: c.teal800, borderRadius: 24, padding: 24, alignItems: 'center', gap: 4, marginVertical: 8 },
  step: { flexDirection: 'row', gap: 14 },
  dot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: c.teal800 },
  dotOff: { borderWidth: 2, borderColor: c.lineStrong, backgroundColor: '#fff' },
  bar: { width: 2, height: 36, backgroundColor: c.lineStrong },
});

import { formatNumber } from '@mazaq/menu';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckIcon, LockIcon } from '@/components/icons';
import { Txt } from '@/components/ui';
import { useI18n } from '@/i18n';
import { useRewards } from '@/store';
import { c } from '@/theme';

const SCALE = [0, 50, 100, 150, 300];

/** Position on the 0/50/100/150/300 scale, where each step takes an equal quarter. */
function scalePosition(balance: number) {
  for (let i = 0; i < SCALE.length - 1; i++) {
    const a = SCALE[i]!;
    const b = SCALE[i + 1]!;
    if (balance <= b) return (i + (balance - a) / (b - a)) / (SCALE.length - 1);
  }
  return 1;
}

export default function RewardsScreen() {
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const rewards = useRewards();
  const [redeemed, setRedeemed] = useState<string[]>([]);

  if (!rewards) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={c.teal800} />
      </View>
    );
  }
  const balance = rewards.balance;

  return (
    <ScrollView>
      <View style={[s.header, { paddingTop: insets.top + 20 }]}>
        <View style={s.between}>
          <Txt weight="display" size={28} color={c.onTeal} accessibilityRole="header">
            {t('app.rewardsTitle')}
          </Txt>
          <Pressable accessibilityRole="button" onPress={() => router.push('/rewards-code')} style={s.codeBtn}>
            <Txt weight="semibold" size={13} color={c.onTeal}>
              {t('app.showCode')}
            </Txt>
          </Pressable>
        </View>
        <View style={s.card}>
          <View style={[s.between, { alignItems: 'flex-end' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <Txt weight="display" size={60} color={c.teal800} style={{ lineHeight: 64 }}>
                {formatNumber(balance, locale)}
              </Txt>
              <Txt weight="bold" size={16} color={c.teal800}>
                {t('app.beans')}
              </Txt>
            </View>
            <Txt weight="mono" size={11} color={c.teal800}>
              {t('app.goldShort')}
            </Txt>
          </View>
          <View style={s.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 300, now: balance }}>
            <View style={[s.fill, { width: `${scalePosition(balance) * 100}%` }]} />
          </View>
          <View style={s.between}>
            {SCALE.map((n) => (
              <Txt key={n} weight="mono" size={11} color={c.teal800}>
                {formatNumber(n, locale)}
              </Txt>
            ))}
          </View>
        </View>
      </View>

      <View style={s.body}>
        <Txt weight="display" size={18} accessibilityRole="header">
          {t('app.spend')}
        </Txt>
        {rewards.tiers.map((tier) => {
          const open = balance >= tier.beans;
          const done = redeemed.includes(tier.id);
          return (
            <View key={tier.id} style={s.tier}>
              <Txt weight="display" size={22} color={c.brown600} style={{ width: 48 }}>
                {formatNumber(tier.beans, locale)}
              </Txt>
              <View style={{ flex: 1, gap: 2 }}>
                <Txt weight="bold" size={15}>
                  {tier.reward[locale]}
                </Txt>
                <Txt size={12} color={c.muted}>
                  {done ? t('app.redeemed') : open ? t('app.readyToRedeem') : t('app.toGo', { count: formatNumber(tier.beans - balance, locale) })}
                </Txt>
              </View>
              {open ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${t('app.redeem')}: ${tier.reward[locale]}`}
                  disabled={done}
                  onPress={() => setRedeemed((r) => [...r, tier.id])}
                  style={[s.redeem, done && { backgroundColor: c.sage100 }]}
                >
                  {done ? (
                    <CheckIcon />
                  ) : (
                    <Txt weight="bold" size={13} color="#fff">
                      {t('app.redeem')}
                    </Txt>
                  )}
                </Pressable>
              ) : (
                <View accessible accessibilityLabel={t('app.locked')}>
                  <LockIcon />
                </View>
              )}
            </View>
          );
        })}

        <Txt weight="display" size={18} style={{ paddingTop: 6 }} accessibilityRole="header">
          {t('app.recent')}
        </Txt>
        {rewards.activity.map((a) => (
          <View key={a.id} style={[s.between, { paddingHorizontal: 4 }]}>
            <Txt size={14} style={{ flex: 1 }}>
              {a.label[locale]}
              <Txt size={14} color={c.muted}>
                {' · '}
                {new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short' }).format(new Date(a.date))}
              </Txt>
            </Txt>
            <Txt weight="bold" size={14} color={c.sage600}>
              {a.beans > 0 ? '+' : ''}
              {formatNumber(a.beans, locale)}
            </Txt>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  header: { backgroundColor: c.teal800, paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  codeBtn: { height: 44, paddingHorizontal: 14, borderRadius: 22, borderWidth: 1.5, borderColor: c.tealOutline, justifyContent: 'center' },
  card: { backgroundColor: c.saffron500, borderRadius: 22, padding: 20, gap: 14 },
  track: { height: 10, backgroundColor: 'rgba(14,59,54,0.2)', borderRadius: 5, overflow: 'hidden' },
  fill: { height: 10, backgroundColor: c.teal800, borderRadius: 5 },
  body: { padding: 20, gap: 12 },
  tier: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 14 },
  redeem: { height: 44, minWidth: 80, paddingHorizontal: 16, borderRadius: 22, backgroundColor: c.teal800, alignItems: 'center', justifyContent: 'center' },
});

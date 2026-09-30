import { stores } from '@mazaq/api';
import { marketList } from '@mazaq/menu';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackIcon } from '@/components/icons';
import { Chip, IconButton, Txt } from '@/components/ui';
import { setLanguage, useI18n } from '@/i18n';
import { appStore, cartStore, useApp, useCart } from '@/store';
import { c } from '@/theme';

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={s.section}>
      <Txt weight="bold" size={15} accessibilityRole="header">
        {title}
      </Txt>
      {hint ? (
        <Txt size={12} color={c.muted}>
          {hint}
        </Txt>
      ) : null}
      {children}
    </View>
  );
}

export default function Account() {
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { name, phone, favourites, notifications } = useApp((s) => ({
    name: s.name,
    phone: s.phone,
    favourites: s.favourites,
    notifications: s.notifications,
  }));
  const { market, storeId } = useCart((s) => ({ market: s.market, storeId: s.storeId }));
  const saved = stores.filter((st) => st.id === storeId || st.market === market).slice(0, 3);

  return (
    <ScrollView contentContainerStyle={[s.page, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}>
      <View style={s.top}>
        <IconButton label={t('common.back')} onPress={() => router.back()}>
          <BackIcon />
        </IconButton>
        <Txt weight="display" size={26} accessibilityRole="header">
          {t('app.accountScreen.title')}
        </Txt>
      </View>

      <Section title={t('app.accountScreen.profile')}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={s.avatar}>
            <Txt weight="bold" size={18} color={c.saffron500}>
              {name.slice(0, 1).toUpperCase()}
            </Txt>
          </View>
          <View>
            <Txt weight="bold" size={17}>
              {name}
            </Txt>
            <Txt size={13} color={c.muted} style={{ writingDirection: 'ltr' }}>
              {phone || '+20 ••• ••• ••21'}
            </Txt>
          </View>
        </View>
        {favourites.length > 0 && (
          <Txt size={13} color={c.muted}>
            ♥ {favourites.length}
          </Txt>
        )}
      </Section>

      <Section title={t('app.accountScreen.savedStores')}>
        {saved.map((st) => (
          <Pressable
            key={st.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: st.id === storeId }}
            onPress={() => cartStore.getState().setStore(st.id)}
            style={[s.option, st.id === storeId ? s.on : s.off]}
          >
            <Txt weight="semibold" size={14}>
              {st.name[locale]}
            </Txt>
            <Txt size={12} color={c.muted}>
              {st.address[locale]}
            </Txt>
          </Pressable>
        ))}
      </Section>

      <Section title={t('app.accountScreen.payments')}>
        <View style={[s.option, s.off, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
          <View style={s.visa}>
            <Txt weight="mono" size={10} color="#fff">
              VISA
            </Txt>
          </View>
          <Txt weight="semibold" size={14}>
            {t('checkout.cardMock')}
          </Txt>
        </View>
      </Section>

      <Section title={t('app.accountScreen.language')} hint={t('app.accountScreen.languageHint')}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip label="English" selected={locale === 'en'} onPress={() => setLanguage('en')} />
          <Chip label="العربية" selected={locale === 'ar'} onPress={() => setLanguage('ar')} />
        </View>
      </Section>

      <Section title={t('app.accountScreen.market')}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {marketList.map((m) => (
            <Chip
              key={m.code}
              label={`${m.name[locale]} · ${m.currency}`}
              selected={market === m.code}
              onPress={() => {
                cartStore.getState().setMarket(m.code);
                const first = stores.find((st) => st.market === m.code);
                if (first) cartStore.getState().setStore(first.id);
              }}
            />
          ))}
        </View>
      </Section>

      <View style={[s.section, { flexDirection: 'row', alignItems: 'center' }]}>
        <View style={{ flex: 1 }}>
          <Txt weight="bold" size={15}>
            {t('app.accountScreen.notifications')}
          </Txt>
          <Txt size={12} color={c.muted}>
            {t('app.accountScreen.notificationsHint')}
          </Txt>
        </View>
        <Switch
          accessibilityLabel={t('app.accountScreen.notifications')}
          value={notifications}
          onValueChange={(v) => appStore.getState().setNotifications(v)}
          trackColor={{ true: c.teal800, false: c.line }}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          appStore.getState().signOut();
          router.replace('/onboarding');
        }}
        style={s.signOut}
      >
        <Txt weight="bold" size={15} color="#B3261E">
          {t('app.accountScreen.signOut')}
        </Txt>
      </Pressable>
      <Txt size={12} color={c.muted} style={{ textAlign: 'center' }}>
        {t('app.accountScreen.version', { version: Constants.expoConfig?.version ?? '0.1.0' })}
      </Txt>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 20, gap: 12 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  section: { backgroundColor: '#fff', borderRadius: 18, padding: 16, gap: 10 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: c.teal800, alignItems: 'center', justifyContent: 'center' },
  option: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, minHeight: 44, justifyContent: 'center' },
  on: { borderWidth: 2, borderColor: c.teal800, backgroundColor: c.sage100 },
  off: { borderWidth: 1, borderColor: c.lineStrong },
  visa: { width: 44, height: 30, borderRadius: 6, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' },
  signOut: { height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: '#B3261E', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
});

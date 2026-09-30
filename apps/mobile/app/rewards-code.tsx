import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseIcon } from '@/components/icons';
import { Logo } from '@/components/Logo';
import { IconButton, Txt } from '@/components/ui';
import { useI18n } from '@/i18n';
import { useRewards } from '@/store';
import { c } from '@/theme';

export default function RewardsCode() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const rewards = useRewards();
  const id = rewards?.memberId ?? 'MZ-0042-7719';
  return (
    <View style={[s.page, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
      <View style={s.top}>
        <Logo height={28} light />
        <IconButton label={t('common.close')} onPress={() => router.back()}>
          <CloseIcon />
        </IconButton>
      </View>
      <View style={s.center}>
        <Txt weight="display" size={24} color={c.onTeal} accessibilityRole="header">
          {t('app.codeTitle')}
        </Txt>
        <View style={s.qr} accessible accessibilityRole="image" accessibilityLabel={`${t('app.codeTitle')}: ${id}`}>
          <QRCode value={`mazaq://member/${id}`} size={220} color={c.teal800} backgroundColor="#fff" />
        </View>
        <Txt weight="mono" size={18} color={c.saffron500} selectable>
          {id}
        </Txt>
        <Txt size={14} color={c.onTealMuted} style={{ textAlign: 'center' }}>
          {t('app.codeHint')}
        </Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: c.teal800, paddingHorizontal: 20 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  qr: { backgroundColor: '#fff', padding: 20, borderRadius: 24 },
});

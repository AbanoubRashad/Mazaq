import { api } from '@mazaq/api';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Photo } from '@/components/art';
import { Logo } from '@/components/Logo';
import { Button, Txt } from '@/components/ui';
import { setLanguage, useI18n } from '@/i18n';
import { appStore } from '@/store';
import { c, font } from '@/theme';

type Step = 0 | 1 | 2 | 'phone' | 'otp';

const slides = [
  { image: 'latte-art.jpg', title: 'app.onboarding.slide1Title', body: 'app.onboarding.slide1Body' },
  { image: 'iced-coffee-glass.jpg', title: 'app.onboarding.slide2Title', body: 'app.onboarding.slide2Body' },
  { image: 'coffee-farm.jpg', title: 'app.onboarding.slide3Title', body: 'app.onboarding.slide3Body' },
] as const;

export default function Onboarding() {
  const { t, locale, ar } = useI18n();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const codeRef = useRef<TextInput>(null);

  const sendCode = async () => {
    if (!/^\+?[\d\s-]{8,16}$/.test(phone.trim())) {
      setError(t('rewards.invalidPhone'));
      return;
    }
    setError(null);
    setBusy(true);
    await api.requestOtp(phone);
    setBusy(false);
    setStep('otp');
    setTimeout(() => codeRef.current?.focus(), 200);
  };

  const verify = async () => {
    setBusy(true);
    const r = await api.verifyOtp(phone, code);
    setBusy(false);
    if (!r.ok) {
      setError(t('app.onboarding.invalidCode'));
      return;
    }
    appStore.getState().setOnboarded(r.name ?? 'Nour', phone);
    router.replace('/');
  };

  if (typeof step === 'number') {
    const slide = slides[step]!;
    return (
      <View style={{ flex: 1, backgroundColor: c.teal800 }}>
        <View style={[s.topBar, { paddingTop: insets.top + 12 }]}>
          <Logo height={26} light />
          <View style={s.langToggle} accessibilityRole="radiogroup" accessibilityLabel={t('common.language')}>
            {(['en', 'ar'] as const).map((l) => (
              <Pressable
                key={l}
                accessibilityRole="radio"
                accessibilityState={{ checked: locale === l }}
                accessibilityLabel={l === 'en' ? 'English' : 'العربية'}
                onPress={() => setLanguage(l)}
                style={[s.langBtn, locale === l && { backgroundColor: c.saffron500 }]}
              >
                <Txt weight="bold" size={14} color={locale === l ? c.teal800 : c.onTeal}>
                  {l === 'en' ? 'EN' : 'ع'}
                </Txt>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={{ alignItems: 'center', paddingTop: 24 }}>
          <Photo file={slide.image} alt="" width={260} height={340} radius={{ tl: 130, tr: 130, bl: 24, br: 24 }} />
        </View>
        <View style={[s.slideText, { paddingBottom: insets.bottom + 20 }]}>
          <View style={{ flexDirection: 'row', gap: 6 }} accessibilityLabel={`${step + 1} / 3`}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[s.dot, i === step && { backgroundColor: c.saffron500, width: 24 }]} />
            ))}
          </View>
          <Txt weight="display" size={32} color={c.onTeal} accessibilityRole="header">
            {t(slide.title)}
          </Txt>
          <Txt size={16} color={c.onTealMuted} style={{ lineHeight: 24 }}>
            {t(slide.body)}
          </Txt>
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable accessibilityRole="button" onPress={() => setStep('phone')} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Txt weight="semibold" color={c.onTealMuted}>
                {t('app.onboarding.skip')}
              </Txt>
            </Pressable>
            <Button
              variant="saffron"
              big
              label={step === 2 ? t('app.onboarding.start') : t('app.onboarding.next')}
              onPress={() => setStep(step === 2 ? 'phone' : ((step + 1) as Step))}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.ground }}>
      <View style={[s.form, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 20 }]}>
        <Logo height={28} />
        {step === 'phone' ? (
          <>
            <Txt weight="display" size={28} accessibilityRole="header">
              {t('app.onboarding.phoneTitle')}
            </Txt>
            <Txt weight="semibold" size={14} nativeID="phoneLabel">
              {t('app.onboarding.phoneLabel')}
            </Txt>
            <TextInput
              accessibilityLabelledBy="phoneLabel"
              accessibilityLabel={t('app.onboarding.phoneLabel')}
              value={phone}
              onChangeText={(v) => {
                setPhone(v);
                setError(null);
              }}
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
              placeholder="+20 10 0000 0000"
              placeholderTextColor={c.muted}
              style={[s.input, font('medium', false), { writingDirection: 'ltr', textAlign: ar ? 'right' : 'left' }]}
            />
            {error && (
              <Txt color="#B3261E" accessibilityRole="alert">
                {error}
              </Txt>
            )}
            <View style={{ flex: 1 }} />
            <Button big label={busy ? t('common.sending') : t('app.onboarding.sendCode')} onPress={sendCode} disabled={busy} />
          </>
        ) : (
          <>
            <Txt weight="display" size={28} accessibilityRole="header">
              {t('app.onboarding.otpTitle')}
            </Txt>
            <Txt size={14} color={c.muted}>
              {t('app.onboarding.otpSent', { phone })}
            </Txt>
            <TextInput
              ref={codeRef}
              accessibilityLabel={t('app.onboarding.otpLabel')}
              value={code}
              onChangeText={(v) => {
                setCode(v.replace(/\D/g, '').slice(0, 4));
                setError(null);
              }}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              maxLength={4}
              style={[s.input, s.otp, font('display', false)]}
            />
            {error && (
              <Txt color="#B3261E" accessibilityRole="alert">
                {error}
              </Txt>
            )}
            <Pressable accessibilityRole="button" onPress={() => api.requestOtp(phone)} style={{ minHeight: 44, justifyContent: 'center' }}>
              <Txt weight="bold" color={c.teal800}>
                {t('app.onboarding.resend')}
              </Txt>
            </Pressable>
            <View style={{ flex: 1 }} />
            <Button big label={t('app.onboarding.verify')} onPress={verify} disabled={busy || code.length !== 4} />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  slideText: { flex: 1, paddingHorizontal: 24, paddingTop: 24, gap: 12 },
  langToggle: { flexDirection: 'row', borderRadius: 22, borderWidth: 1.5, borderColor: c.tealOutline, padding: 2 },
  langBtn: { minWidth: 44, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.tealRule },
  form: { flex: 1, paddingHorizontal: 20, gap: 14 },
  input: { height: 56, borderRadius: 14, borderWidth: 1, borderColor: c.lineStrong, backgroundColor: '#fff', paddingHorizontal: 16, fontSize: 18, color: c.ink },
  otp: { fontSize: 32, letterSpacing: 16, textAlign: 'center' },
});

import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useI18n } from '../i18n';
import { c, font, size } from '../theme';
import { MinusIcon, PlusIcon } from './icons';

type Weight = 'display' | 'body' | 'medium' | 'semibold' | 'bold' | 'mono';

/** Text that picks the right Latin / Arabic face and aligns to the start edge. */
export function Txt({
  weight = 'body',
  size: s = size.body,
  color = c.ink,
  style,
  ...props
}: TextProps & { weight?: Weight; size?: number; color?: string; style?: StyleProp<TextStyle> }) {
  const { ar } = useI18n();
  return (
    <Text
      {...props}
      style={[
        { fontSize: s, color, textAlign: 'auto', writingDirection: ar ? 'rtl' : 'ltr' },
        font(weight, ar),
        // Reem Kufi / Plex Arabic have tall ascenders — give them room so glyphs aren't clipped.
        ar ? { lineHeight: Math.round(s * (weight === 'display' ? 1.6 : 1.5)) } : null,
        ar && weight === 'display' ? { paddingTop: Math.round(s * 0.2) } : null,
        style,
      ]}
    />
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
  trailing,
  accessibilityLabel,
  big,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'saffron' | 'outline' | 'sage';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  trailing?: ReactNode;
  accessibilityLabel?: string;
  big?: boolean;
}) {
  const bg = { primary: c.teal800, saffron: c.saffron500, outline: 'transparent', sage: c.sage100 }[variant];
  const fg = { primary: '#fff', saffron: c.teal800, outline: c.ink, sage: c.teal800 }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        big && { height: 56, paddingHorizontal: 24 },
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === 'outline' && { borderWidth: 1.5, borderColor: c.ink },
        trailing ? { justifyContent: 'space-between' } : null,
        style,
      ]}
    >
      <Txt weight="bold" size={big ? 16 : 14} color={fg}>
        {label}
      </Txt>
      {trailing}
    </Pressable>
  );
}

/** Option pill (milk, sweetness…). Selected = sage fill + 2px teal ring. */
export function Chip({
  label,
  selected,
  onPress,
  solid,
  style,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Category tabs use a solid teal selected state. */
  solid?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const on = solid
    ? { backgroundColor: c.teal800, borderColor: c.teal800, borderWidth: 1 }
    : { backgroundColor: c.sage100, borderColor: c.teal800, borderWidth: 2 };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected ? on : { backgroundColor: '#fff', borderColor: solid ? c.line : c.lineStrong, borderWidth: 1 }, style]}
    >
      <Txt weight="semibold" size={13} color={selected && solid ? '#fff' : c.ink}>
        {label}
      </Txt>
    </Pressable>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.segmented}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            onPress={() => onChange(o.value)}
            style={[
              styles.segment,
              on ? { borderWidth: 2, borderColor: c.teal800, backgroundColor: c.sage100 } : { borderWidth: 1, borderColor: c.lineStrong },
            ]}
          >
            <Txt weight="semibold" size={13}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Stepper({
  value,
  min,
  max,
  onChange,
  decLabel,
  incLabel,
  display,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  decLabel: string;
  incLabel: string;
  display?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={decLabel}
        disabled={value <= min}
        onPress={() => onChange(Math.max(min, value - 1))}
        style={[styles.stepBtn, value <= min && { opacity: 0.4 }]}
      >
        <MinusIcon />
      </Pressable>
      <Txt weight="display" size={20} accessibilityLiveRegion="polite" style={{ minWidth: 18, textAlign: 'center' }}>
        {display ?? String(value)}
      </Txt>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={incLabel}
        disabled={value >= max}
        onPress={() => onChange(Math.min(max, value + 1))}
        style={[styles.stepBtn, value >= max && { opacity: 0.4 }]}
      >
        <PlusIcon />
      </Pressable>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function IconButton({
  label,
  onPress,
  children,
  style,
}: { label: string; onPress?: () => void; children: ReactNode; style?: StyleProp<ViewStyle> } & Omit<PressableProps, 'style' | 'children'>) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.iconBtn, style]} hitSlop={4}>
      {children}
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 999,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chip: { height: 44, paddingHorizontal: 14, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  segmented: { flexDirection: 'row', gap: 8 },
  segment: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: c.lineStrong,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 16 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});

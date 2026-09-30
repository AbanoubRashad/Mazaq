import { colors } from '@mazaq/tokens';
import Svg, { Text as SvgText } from 'react-native-svg';
import { f } from '../theme';

/** "mazaq" (Bricolage 800, teal) + "مذاق" (Reem Kufi 700, saffron). Never mirrored. */
export function Logo({ height = 28, light = false }: { height?: number; light?: boolean }) {
  return (
    <Svg width={(height * 150) / 36} height={height} viewBox="0 0 150 36" accessibilityLabel="Mazaq">
      <SvgText x="0" y="27" fill={light ? colors.onTeal : colors.teal800} fontFamily={f.display} fontSize={30} letterSpacing={-0.8}>
        mazaq
      </SvgText>
      <SvgText x="104" y="27" fill={colors.saffron500} fontFamily={f.arabicDisplay} fontSize={22}>
        مذاق
      </SvgText>
    </Svg>
  );
}

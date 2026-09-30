import { I18nManager } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { c } from '../theme';

type P = { size?: number; color?: string };
const props = (s: number, color: string, w = 2) => ({
  width: s,
  height: s,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth: w,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const HomeIcon = ({ size = 22, color = c.muted }: P) => (
  <Svg {...props(size, color)}>
    <Path d="M4 11l8-7 8 7v9H4z" />
  </Svg>
);
export const CupIcon = ({ size = 22, color = c.muted }: P) => (
  <Svg {...props(size, color)}>
    <Path d="M5 8h12v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z" />
    <Path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
  </Svg>
);
export const BagIcon = ({ size = 22, color = c.muted }: P) => (
  <Svg {...props(size, color)}>
    <Path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
    <Path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);
export const BeanIcon = ({ size = 22, color = c.muted }: P) => (
  <Svg {...props(size, color)}>
    <Ellipse cx="12" cy="12" rx="6" ry="8.5" transform="rotate(30 12 12)" />
    <Path d="M9 5.5c3 3 3 10 6 13" />
  </Svg>
);
export const PinIcon = ({ size = 18, color = c.teal800 }: P) => (
  <Svg {...props(size, color)}>
    <Path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <Circle cx="12" cy="9.5" r="2.5" />
  </Svg>
);
export const ChevronDown = ({ size = 16, color = c.ink }: P) => (
  <Svg {...props(size, color)}>
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);
/** Directional: mirrored in RTL. */
export const BackIcon = ({ size = 20, color = c.ink }: P) => (
  <Svg {...props(size, color, 2.2)} style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}>
    <Path d="M15 6l-6 6 6 6" />
  </Svg>
);
export const ChevronForward = ({ size = 18, color = c.muted }: P) => (
  <Svg {...props(size, color)} style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}>
    <Path d="M9 6l6 6-6 6" />
  </Svg>
);
export const HeartIcon = ({ size = 20, color = c.ink, filled }: P & { filled?: boolean }) => (
  <Svg {...props(size, color)}>
    <Path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={filled ? color : 'none'} />
  </Svg>
);
export const SearchIcon = ({ size = 18, color = c.muted }: P) => (
  <Svg {...props(size, color)}>
    <Circle cx="11" cy="11" r="7" />
    <Path d="M20 20l-4-4" />
  </Svg>
);
export const PlusIcon = ({ size = 18, color = c.ink }: P) => (
  <Svg {...props(size, color, 2.4)}>
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);
export const MinusIcon = ({ size = 18, color = c.ink }: P) => (
  <Svg {...props(size, color, 2.4)}>
    <Path d="M5 12h14" />
  </Svg>
);
export const CloseIcon = ({ size = 20, color = c.ink }: P) => (
  <Svg {...props(size, color, 2.2)}>
    <Path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const LockIcon = ({ size = 20, color = c.muted }: P) => (
  <Svg {...props(size, color)}>
    <Rect x="5" y="11" width="14" height="9" rx="2" />
    <Path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);
export const CheckIcon = ({ size = 18, color = c.teal800 }: P) => (
  <Svg {...props(size, color, 2.4)}>
    <Path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

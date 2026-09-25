import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, props: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
});

export const GlobeIcon = ({ size = 14, ...p }: IconProps) => (
  <svg {...base(size, { strokeWidth: 1.8, ...p })}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
  </svg>
);

export const SearchIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </svg>
);

export const BagIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const PinIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const PlusIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, { strokeWidth: 2.4, ...p })}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, { strokeWidth: 2.4, ...p })}>
    <path d="M5 12h14" />
  </svg>
);

export const CloseIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, { strokeWidth: 2.2, ...p })}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const MenuIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

/** Directional — mirrored in RTL via the `rtl:-scale-x-100` class at call sites. */
export const ChevronBackIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, { strokeWidth: 2.2, ...p })}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const ChevronDownIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ArrowIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const PhoneIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <rect x="6" y="2" width="12" height="20" rx="3" />
    <path d="M11 18h2" />
  </svg>
);

export const CheckIcon = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size, { strokeWidth: 2.4, ...p })}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const LockIcon = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export const BeanIcon = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <ellipse cx="12" cy="12" rx="6" ry="8.5" transform="rotate(30 12 12)" />
    <path d="M9 5.5c3 3 3 10 6 13" />
  </svg>
);

export const ClockIcon = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

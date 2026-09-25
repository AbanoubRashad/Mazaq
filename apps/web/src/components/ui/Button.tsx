import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type Variant = 'primary' | 'saffron' | 'outline' | 'outline-light' | 'ghost' | 'light';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-teal-800 text-white hover:bg-teal-600 disabled:bg-line-strong disabled:text-muted',
  saffron: 'bg-saffron-500 text-teal-800 hover:brightness-105',
  outline: 'border-[1.5px] border-ink text-ink hover:bg-ink/5',
  'outline-light': 'border-[1.5px] border-teal-outline text-on-teal hover:bg-white/5',
  ghost: 'text-ink hover:bg-ink/5',
  light: 'bg-ground text-teal-800 hover:bg-white',
};

const sizes: Record<Size, string> = {
  sm: 'h-11 px-[18px] text-[14px]',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-7 text-[16px]',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return [
    'inline-flex items-center justify-center gap-2.5 rounded-full font-bold whitespace-nowrap',
    'transition-colors disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    extra,
  ].join(' ');
}

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({
  variant,
  size,
  className = '',
  ...props
}: Common & ComponentProps<'button'>) {
  return <button type="button" className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className = '',
  ...props
}: Common & ComponentProps<typeof Link>) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

'use client';

import type { ComponentProps } from 'react';

type Tone = 'teal' | 'sage';

/** Toggle pill. Selected state is exposed with aria-pressed. */
export function Chip({
  selected,
  tone = 'teal',
  className = '',
  size = 'md',
  ...props
}: ComponentProps<'button'> & { selected: boolean; tone?: Tone; size?: 'sm' | 'md' }) {
  const on = tone === 'sage' ? 'bg-sage-600 text-white border-sage-600' : 'bg-teal-800 text-white border-teal-800';
  const off =
    tone === 'sage'
      ? 'border-sage-outline text-ink hover:bg-white/40'
      : 'border-line-strong text-ink hover:bg-white';
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex shrink-0 items-center rounded-full border px-4 font-semibold ${
        size === 'sm' ? 'h-10 text-[14px]' : 'h-11 px-[18px] text-[14px]'
      } ${selected ? on : off} ${className}`}
      {...props}
    />
  );
}

/** Option chip used in the customize drawer (sage fill + teal ring when selected). */
export function OptionChip({
  selected,
  className = '',
  ...props
}: ComponentProps<'button'> & { selected: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex h-11 items-center rounded-full px-4 text-[14px] font-semibold text-ink ${
        selected ? 'border-2 border-teal-800 bg-sage-100' : 'border border-line-strong bg-white hover:bg-ground'
      } ${className}`}
      {...props}
    />
  );
}

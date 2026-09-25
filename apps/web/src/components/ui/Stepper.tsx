'use client';

import { MinusIcon, PlusIcon } from '../icons';

export function Stepper({
  value,
  min,
  max,
  onChange,
  decrementLabel,
  incrementLabel,
  display,
  size = 'md',
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  decrementLabel: string;
  incrementLabel: string;
  /** Localised display of the value (e.g. Arabic-Indic digits). */
  display?: string;
  size?: 'sm' | 'md';
}) {
  const btn =
    'flex items-center justify-center rounded-full border border-line-strong bg-white text-ink disabled:opacity-40 ' +
    (size === 'sm' ? 'h-11 w-11' : 'h-11 w-11');
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        className={btn}
        aria-label={decrementLabel}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <MinusIcon />
      </button>
      <output aria-live="polite" className="w-6 text-center font-display text-[22px] font-extrabold">
        {display ?? value}
      </output>
      <button
        type="button"
        className={btn}
        aria-label={incrementLabel}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <PlusIcon />
      </button>
    </div>
  );
}

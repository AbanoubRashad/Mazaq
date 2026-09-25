'use client';

import { useRef, type KeyboardEvent } from 'react';

export interface Segment<T extends string> {
  value: T;
  label: string;
}

/**
 * Tab-style segmented control (role="tablist"). Arrow keys move selection and
 * respect RTL (ArrowRight moves "forward" visually).
 */
export function SegmentedControl<T extends string>({
  label,
  segments,
  value,
  onChange,
  className = '',
  controls,
}: {
  label: string;
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /** id of the controlled panel */
  controls?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const forward = (e.key === 'ArrowRight') !== rtl;
    const idx = segments.findIndex((s) => s.value === value);
    const next = (idx + (forward ? 1 : -1) + segments.length) % segments.length;
    const seg = segments[next];
    if (!seg) return;
    onChange(seg.value);
    refs.current[next]?.focus();
    e.preventDefault();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKey}
      className={`inline-flex rounded-[26px] bg-ground p-1 ${className}`}
    >
      {segments.map((s, i) => {
        const selected = s.value === value;
        return (
          <button
            key={s.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={controls}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(s.value)}
            className={`h-11 rounded-full px-[26px] text-[15px] ${
              selected ? 'bg-teal-800 font-bold text-white' : 'font-semibold text-ink'
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';

const inputClass =
  'w-full rounded-[12px] border border-line-strong bg-white px-4 text-[16px] text-ink aria-[invalid=true]:border-[#B3261E]';

/** Labelled form field with an accessible error message. */
export function Field({
  id,
  label,
  error,
  hint,
  optionalLabel,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optionalLabel?: string;
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string; className: string }) => ReactNode;
}) {
  const describedBy = [error ? `${id}-err` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[14px] font-semibold">
        {label}
        {optionalLabel ? <span className="ms-1 font-normal text-muted">({optionalLabel})</span> : null}
      </label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': describedBy, className: inputClass })}
      {hint && (
        <p id={`${id}-hint`} className="text-[13px] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="text-[14px] text-[#B3261E]">
          {error}
        </p>
      )}
    </div>
  );
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => /^\+?[\d\s-]{8,16}$/.test(v.trim());

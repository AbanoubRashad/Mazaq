'use client';

import { defaultOptions, type MenuItem } from '@mazaq/menu';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cartStore } from '@/lib/cart';
import { CheckIcon, PlusIcon } from '../icons';

export function QuickAdd({
  item,
  name,
  className = '',
  tone = 'teal',
}: {
  item: MenuItem;
  name: string;
  className?: string;
  tone?: 'teal' | 'sage';
}) {
  const t = useTranslations('menu');
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={t('quickAdd', { name })}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        cartStore.getState().add(item.id, defaultOptions(item));
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
        tone === 'teal' ? 'bg-teal-800 text-white hover:bg-teal-600' : 'bg-sage-100 text-teal-800'
      } ${className}`}
    >
      {done ? <CheckIcon /> : <PlusIcon />}
    </button>
  );
}

export function AddToBasketButton({ item, label }: { item: MenuItem; label: string }) {
  const t = useTranslations('common');
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        cartStore.getState().add(item.id, defaultOptions(item));
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className="inline-flex h-11 items-center gap-2 rounded-full bg-teal-800 px-[18px] text-[14px] font-bold text-white hover:bg-teal-600"
    >
      {done ? <CheckIcon size={16} /> : null}
      {done ? t('added') : label}
    </button>
  );
}

'use client';

import type { MenuFilter } from '@mazaq/menu';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useId, useMemo, useState, type ReactNode } from 'react';
import { SearchIcon } from '../icons';

export interface BrowserItem {
  id: string;
  node: ReactNode;
  filters: MenuFilter[];
  text: string;
}

const FILTERS: MenuFilter[] = ['dairy-free-option', 'under-200', 'decaf-available', 'no-added-sugar'];

/** Sidebar filters + product grid. Filtering is client-side over server-rendered cards. */
export function MenuBrowser({
  items,
  nav,
  heading,
  search = false,
}: {
  items: BrowserItem[];
  nav: ReactNode;
  heading: ReactNode;
  search?: boolean;
}) {
  const t = useTranslations('menu');
  const tc = useTranslations('common');
  const params = useSearchParams();
  const [active, setActive] = useState<MenuFilter[]>([]);
  const [query, setQuery] = useState(params.get('q') ?? '');
  const searchId = useId();

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) => active.every((f) => i.filters.includes(f)) && (!search || !q || i.text.includes(q)),
    );
  }, [items, active, query, search]);

  const toggle = (f: MenuFilter) =>
    setActive((a) => (a.includes(f) ? a.filter((x) => x !== f) : [...a, f]));

  return (
    <div className="flex flex-col gap-8 px-4 py-8 lg:flex-row lg:gap-10 lg:px-5 lg:py-10 xl:px-20">
      <aside className="flex shrink-0 flex-col gap-6 lg:w-[220px] lg:gap-8">
        {nav}
        <fieldset className="flex flex-col gap-1">
          <legend className="pb-2 font-mono text-[12px] tracking-[1.5px] text-muted">{t('filter')}</legend>
          <div className="flex flex-wrap gap-x-5 lg:flex-col">
            {FILTERS.map((f) => (
              <label key={f} className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[15px]">
                <input
                  type="checkbox"
                  checked={active.includes(f)}
                  onChange={() => toggle(f)}
                  className="h-[18px] w-[18px] accent-teal-800"
                />
                {t(`filters.${f}`)}
              </label>
            ))}
          </div>
        </fieldset>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-7">
        {heading}
        {search && (
          <div className="flex h-12 max-w-xl items-center gap-2.5 rounded-[14px] border border-line bg-white px-3.5">
            <SearchIcon className="text-muted" />
            <label htmlFor={searchId} className="sr-only">
              {tc('search')}
            </label>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tc('searchPlaceholder')}
              className="h-full flex-1 bg-transparent text-[15px] outline-none"
            />
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {t('count', { count: shown.length })}
        </p>
        {shown.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-[18px] bg-white p-8">
            <p className="text-[17px]">{t('empty')}</p>
            {active.length > 0 && (
              <button type="button" onClick={() => setActive([])} className="font-bold text-teal-800 underline">
                {t('clearFilters')}
              </button>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((i) => (
              <li key={i.id}>{i.node}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

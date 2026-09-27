'use client';

import { directionsUrl, stores, cities, type Store } from '@mazaq/api';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useId, useMemo, useState } from 'react';
import { ArrowIcon, ClockIcon, PinIcon } from '../icons';
import { Chip } from '../ui/Chip';

const toArabicDigits = (s: string) => s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]!);

export function StoreFinder() {
  const t = useTranslations('stores');
  const locale = useLocale();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [city, setCity] = useState<string>(params.get('city') ?? 'all');
  const inputId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stores.filter((s) => {
      if (city !== 'all' && s.cityKey !== city) return false;
      if (!q) return true;
      return [s.name.en, s.name.ar, s.city.en, s.city.ar, s.address.en, s.address.ar].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [query, city]);

  const time = (s: string) => (locale === 'ar' ? toArabicDigits(s) : s);

  return (
    <div className="flex flex-col gap-6">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="flex max-w-xl flex-col gap-2">
        <label htmlFor={inputId} className="text-[14px] font-semibold">
          {t('label')}
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-[52px] rounded-[14px] border border-line-strong bg-white px-4 text-[16px] font-medium"
        />
      </form>
      <div role="group" aria-label={t('all')} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <Chip selected={city === 'all'} onClick={() => setCity('all')}>
          {t('all')}
        </Chip>
        {cities.map((c) => (
          <Chip key={c.key} selected={city === c.key} onClick={() => setCity(c.key)}>
            {c.city[locale]}
          </Chip>
        ))}
      </div>
      <p aria-live="polite" className="font-mono text-[12px] tracking-[1.5px] text-muted uppercase">
        {results.length ? t('results', { count: results.length }) : t('noResults', { query })}
      </p>
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {results.map((s) => (
          <StoreCard key={s.id} store={s} time={time} />
        ))}
      </ul>
    </div>
  );
}

function StoreCard({ store, time }: { store: Store; time: (s: string) => string }) {
  const t = useTranslations('stores');
  const locale = useLocale();
  return (
    <li className="flex flex-col gap-4 rounded-[20px] bg-white p-6">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-[12px] tracking-[1.5px] text-muted uppercase">{store.city[locale]}</span>
        <h2 className="font-display text-[24px] font-bold leading-tight">{store.name[locale]}</h2>
        <p className="flex items-start gap-2 text-[15px] text-muted">
          <PinIcon className="mt-1 shrink-0 text-teal-800" />
          {store.address[locale]}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="sr-only">{t('hours')}</h3>
        {store.hours.map((h) => (
          <p key={h.days.en} className="flex items-center gap-2 text-[14px]">
            <ClockIcon className="text-teal-800" />
            <span className="font-semibold">{h.days[locale]}</span>
            <span className="font-mono text-[13px]" dir="ltr">
              {time(h.open)}–{time(h.close)}
            </span>
          </p>
        ))}
      </div>
      <div>
        <h3 className="sr-only">{t('services')}</h3>
        <ul className="flex flex-wrap gap-1.5">
          {store.services.map((sv) => (
            <li key={sv} className="rounded-[10px] bg-sage-100 px-2.5 py-1 text-[13px] font-medium">
              {t(`service.${sv}`)}
            </li>
          ))}
        </ul>
      </div>
      <a
        href={directionsUrl(store)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('directionsLabel', { name: store.name[locale] })}
        className="mt-auto inline-flex h-11 items-center gap-2 self-start rounded-full border-[1.5px] border-ink px-5 text-[14px] font-bold hover:bg-ink/5"
      >
        {t('directions')}
        <ArrowIcon size={16} className="rtl:-scale-x-100" />
      </a>
    </li>
  );
}

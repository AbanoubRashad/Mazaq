'use client';

import { formatPrice, marketList, type MarketCode } from '@mazaq/menu';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { setMarket, useCart, useCartHydration, useHydrated, useMarket } from '@/lib/cart';
import { BagIcon, CloseIcon, GlobeIcon, MenuIcon, SearchIcon } from '../icons';
import { Logo } from '../Logo';

export function CartHydrator() {
  useCartHydration();
  return null;
}

export function MarketSelect({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const market = useMarket();
  const id = useId();
  return (
    <div className="relative flex items-center gap-1.5">
      <GlobeIcon className="pointer-events-none" />
      <label htmlFor={id} className="sr-only">
        {t('market')}
      </label>
      <select
        id={id}
        value={market.code}
        onChange={(e) => setMarket(e.target.value as MarketCode)}
        className={`h-11 cursor-pointer appearance-none bg-transparent pe-1 font-[inherit] ${
          tone === 'dark' ? 'text-utility-text' : 'text-ink'
        }`}
      >
        {marketList.map((m) => (
          <option key={m.code} value={m.code} className="text-ink">
            {m.name[locale]} · {m.currency}
          </option>
        ))}
      </select>
    </div>
  );
}

export function LanguageSwitch({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const search = useSearchParams();
  const qs = search.toString();
  const href = qs ? `${pathname}?${qs}` : pathname;
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <Link
        href={href}
        locale="en"
        lang="en"
        aria-current={locale === 'en' ? 'true' : undefined}
        className={`flex h-11 items-center ${locale === 'en' ? 'font-semibold underline underline-offset-4' : 'opacity-85'}`}
      >
        English
      </Link>
      <Link
        href={href}
        locale="ar"
        lang="ar"
        aria-current={locale === 'ar' ? 'true' : undefined}
        className={`flex h-11 items-center font-arabic ${locale === 'ar' ? 'font-semibold underline underline-offset-4' : 'opacity-85'}`}
      >
        العربية
      </Link>
    </span>
  );
}

export function BasketButton() {
  const t = useTranslations('common');
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const ready = useHydrated();
  const shown = ready ? count : 0;
  return (
    <Link
      href="/checkout"
      aria-label={t('basketCount', { count: shown })}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink hover:border-line-strong"
    >
      <BagIcon />
      {shown > 0 && (
        <span className="absolute -end-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-saffron-500 px-1 text-[11px] font-bold text-teal-800">
          {shown}
        </span>
      )}
    </Link>
  );
}

export function SearchButton() {
  const t = useTranslations('common');
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    dialog.current?.close();
    router.push(`/menu/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <button
        type="button"
        aria-label={t('search')}
        onClick={() => dialog.current?.showModal()}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink hover:border-line-strong"
      >
        <SearchIcon />
      </button>
      <dialog
        ref={dialog}
        aria-label={t('search')}
        className="m-auto mt-24 w-[min(640px,calc(100vw-32px))] rounded-[20px] bg-white p-0 text-ink"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <form onSubmit={submit} className="flex items-center gap-3 p-4">
          <SearchIcon className="text-muted" />
          <label htmlFor="site-search" className="sr-only">
            {t('search')}
          </label>
          <input
            id="site-search"
            type="search"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="h-12 flex-1 bg-transparent text-[17px] outline-none"
          />
          <button
            type="button"
            aria-label={t('close')}
            onClick={() => dialog.current?.close()}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ground"
          >
            <CloseIcon />
          </button>
        </form>
      </dialog>
    </>
  );
}

export function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  // Close the drawer after navigation (adjust state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label={t('openMenu')}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white lg:hidden"
      >
        <MenuIcon />
      </button>
      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        aria-label={t('main')}
        className="m-0 ms-auto h-dvh max-h-dvh w-[min(360px,100vw)] max-w-none bg-ground p-0 text-ink"
      >
        <div className="flex h-full flex-col gap-6 p-5">
          <div className="flex items-center justify-between">
            <Logo height={30} />
            <button
              type="button"
              aria-label={t('closeMenu')}
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white"
            >
              <CloseIcon />
            </button>
          </div>
          <nav aria-label={t('main')} className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex h-14 items-center border-b border-line font-display text-[22px] font-bold"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 text-[15px]">
            <Link href="/stores" className="flex h-11 items-center">
              {t('findStore')}
            </Link>
            <Link href="/corporate" className="flex h-11 items-center">
              {t('corporate')}
            </Link>
            <Link href="/franchise" className="flex h-11 items-center">
              {t('franchise')}
            </Link>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <MarketSelect tone="light" />
              <Suspense fallback={null}>
                <LanguageSwitch />
              </Suspense>
            </div>
            <Link href="/rewards" className="flex h-11 items-center font-semibold">
              {tc('signIn')}
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const section = href.split('/').slice(0, 2).join('/');
  // "/menu/healthy-breakfast" is its own nav item; every other /menu/* page highlights "Menu".
  const active =
    pathname === href ||
    (href === '/menu/seasonal'
      ? pathname.startsWith('/menu') && !pathname.startsWith('/menu/healthy-breakfast')
      : href !== '/menu/healthy-breakfast' && pathname.startsWith(section));
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`flex h-11 items-center ${
        active ? 'text-teal-800 underline underline-offset-[6px]' : 'text-ink hover:text-teal-600'
      }`}
    >
      {children}
    </Link>
  );
}

export function FreeDelivery() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const market = useMarket();
  return (
    <span className="font-mono text-[12px] tracking-[1px] uppercase">
      {t('freeDelivery', { amount: formatPrice(market.freeDeliveryOver, market.currency, locale) })}
    </span>
  );
}

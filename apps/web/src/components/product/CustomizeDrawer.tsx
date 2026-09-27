'use client';

import { getItem } from '@mazaq/menu';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { CloseIcon } from '../icons';
import { ProductImage } from '../ProductImage';
import { allergenLine } from './AllergenLine';
import { CustomizePanel } from './CustomizePanel';

/**
 * Right-side customize sheet. State lives in the URL (?item=iced-spanish-latte) so the
 * drawer is linkable, survives reloads and closes with the browser back button.
 */
export function CustomizeDrawer() {
  const params = useSearchParams();
  const slug = params.get('item');
  const item = slug ? getItem(slug) : undefined;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);

  const close = useCallback(() => {
    const next = new URLSearchParams(params.toString());
    next.delete('item');
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, pathname, router]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
  }, [item]);

  return (
    <dialog
      ref={dialog}
      onClose={() => item && close()}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
      aria-labelledby="drawer-title"
      className="m-0 ms-auto h-dvh max-h-dvh w-full max-w-[480px] overflow-y-auto bg-white p-0 text-ink shadow-[-24px_0_60px_rgba(10,44,40,0.25)]"
    >
      {item && (
        <div className="flex min-h-full flex-col">
          <div className="relative h-[300px] shrink-0 overflow-hidden sm:h-[340px]" style={{ background: item.art.tone }}>
            <ProductImage item={item} locale={locale} sizes="480px" />
            <button
              type="button"
              aria-label={t('common.close')}
              onClick={close}
              autoFocus
              className="absolute end-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-[26px] px-8 pt-7">
            <div className="flex flex-col gap-2">
              <h2 id="drawer-title" className="font-display text-[34px] font-extrabold leading-tight display-tight">
                {item.name[locale]}
              </h2>
              <p className="text-[16px] leading-normal text-muted">{item.description[locale]}</p>
              <p className="font-mono text-[12px] text-muted">{allergenLine(item, t, locale)}</p>
              <Link
                href={item.kind === 'beans' ? `/beans/${item.slug}` : `/product/${item.slug}`}
                className="text-[14px] font-bold text-teal-800 underline underline-offset-4"
              >
                {t('customize.viewFull')}
              </Link>
            </div>
            <CustomizePanel key={item.id} item={item} />
          </div>
        </div>
      )}
    </dialog>
  );
}

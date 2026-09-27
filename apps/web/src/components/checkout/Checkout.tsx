'use client';

import { api, stores, type Order } from '@mazaq/api';
import {
  ASAP_MINUTES,
  canDeliver,
  canPayWithBeans,
  computeTotals,
  FREE_DRINK_BEANS,
  pickupSlots,
  resolveLines,
  type ResolvedLine,
} from '@mazaq/cart';
import { describeOptions, formatNumber } from '@mazaq/menu';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { cartStore, useCart, useHydrated, useMarket } from '@/lib/cart';
import { useRewards } from '@/lib/rewards';
import { CheckIcon, CloseIcon } from '../icons';
import { ProductImage } from '../ProductImage';
import { CustomizePanel } from '../product/CustomizePanel';
import { buttonClass } from '../ui/Button';
import { useFormatPrice } from '../ui/PriceTag';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Stepper } from '../ui/Stepper';

const card = 'rounded-[18px] bg-white p-5 lg:p-6';

export function Checkout() {
  const t = useTranslations();
  const locale = useLocale();
  const ready = useHydrated();
  const market = useMarket();
  const fmt = useFormatPrice();
  const rewards = useRewards();
  const balance = rewards?.balance ?? 0;
  const cart = useCart((s) => ({
    lines: s.lines,
    market: s.market,
    fulfilment: s.fulfilment,
    storeId: s.storeId,
    pickupTime: s.pickupTime,
    paymentMethod: s.paymentMethod,
    payWithBeans: s.payWithBeans,
  }));
  const [order, setOrder] = useState<Order | null>(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState(false);
  const [editing, setEditing] = useState<ResolvedLine | null>(null);
  // Rendered only after hydration (see `ready` below), so the server/client clock never mismatch.
  const [slots] = useState<string[]>(() => pickupSlots(new Date(), 6));
  const storeSelect = useId();
  const addressId = useId();
  const editDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (editing) editDialog.current?.showModal();
    else editDialog.current?.close();
  }, [editing]);

  const lines = useMemo(() => resolveLines(cart.lines, market.currency), [cart.lines, market.currency]);
  const totals = computeTotals(cart, balance);
  const deliverable = canDeliver(cart.lines);
  const beansAllowed = canPayWithBeans(balance, cart.lines);
  const marketStores = stores.filter((s) => s.market === market.code);
  const storeOptions = marketStores.length ? marketStores : stores;
  const store = stores.find((s) => s.id === cart.storeId) ?? storeOptions[0];

  useEffect(() => {
    if (ready && store && cart.storeId !== store.id) cartStore.getState().setStore(store.id);
  }, [ready, store, cart.storeId]);
  useEffect(() => {
    if (ready && cart.payWithBeans && !beansAllowed) cartStore.getState().setPayWithBeans(false);
  }, [ready, cart.payWithBeans, beansAllowed]);

  const place = async () => {
    setError(null);
    if (cart.fulfilment === 'delivery' && address.trim().length < 8) {
      setAddressError(true);
      document.getElementById(addressId)?.focus();
      return;
    }
    setPlacing(true);
    try {
      const o = await api.placeOrder({ ...cart, deliveryAddress: address || undefined });
      setOrder(o);
      cartStore.getState().clear();
      window.scrollTo({ top: 0 });
    } catch {
      setError(t('common.error'));
    } finally {
      setPlacing(false);
    }
  };

  if (!ready) {
    return <p className="px-5 py-16 lg:px-20">{t('common.loading')}</p>;
  }

  if (order) {
    const readyTime = new Date(order.readyAt).toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const orderStore = stores.find((s) => s.id === order.input.storeId);
    const isDelivery = order.input.fulfilment === 'delivery';
    return (
      <section aria-labelledby="done-h" className="mx-auto flex max-w-[640px] flex-col items-center gap-6 px-5 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-teal-800">
          <CheckIcon size={30} />
        </span>
        <h1 id="done-h" className="font-display text-[44px] font-extrabold display-tight" tabIndex={-1}>
          {t('checkout.confirm.title')}
        </h1>
        <p className="text-[17px] text-muted">{isDelivery ? t('checkout.confirm.bodyDelivery') : t('checkout.confirm.body')}</p>
        <div className="flex w-full flex-col gap-5 rounded-[24px] bg-teal-800 p-7 text-on-teal">
          {!isDelivery && (
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono text-[12px] tracking-[1.5px] text-on-teal-muted">{t('checkout.confirm.code')}</span>
              <span className="font-display text-[72px] font-extrabold leading-none tracking-[0.12em] text-saffron-500" data-testid="pickup-code">
                {order.pickupCode}
              </span>
            </div>
          )}
          <dl className="grid grid-cols-2 gap-4 border-t border-teal-rule pt-5 text-start">
            <div>
              <dt className="font-mono text-[12px] tracking-[1.5px] text-on-teal-muted">{t('checkout.confirm.number')}</dt>
              <dd className="text-[20px] font-bold" data-testid="order-number">
                {order.number}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[12px] tracking-[1.5px] text-on-teal-muted">{t('checkout.total')}</dt>
              <dd className="text-[20px] font-bold">{fmt(order.total, market.currency)}</dd>
            </div>
            {!isDelivery && (
              <div className="col-span-2">
                <dd className="text-[15px]">
                  {t('checkout.confirm.readyAt', { time: readyTime })}
                  {orderStore ? ` · ${orderStore.name[locale]}` : ''}
                </dd>
              </div>
            )}
          </dl>
        </div>
        <p className="font-semibold text-brown-600">
          {t('checkout.confirm.earned', { beans: formatNumber(order.beansEarned, locale) })}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonClass('primary')}>
            {t('checkout.confirm.continue')}
          </Link>
          <Link href="/menu/seasonal" className={buttonClass('outline')}>
            {t('checkout.confirm.again')}
          </Link>
        </div>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="flex flex-col items-start gap-4 px-5 py-16 lg:px-20">
        <h1 className="font-display text-[44px] font-extrabold display-tight">{t('checkout.title')}</h1>
        <p className="text-[17px] text-muted">{t('checkout.empty')}</p>
        <Link href="/menu/seasonal" className={buttonClass('primary')}>
          {t('checkout.emptyCta')}
        </Link>
      </section>
    );
  }

  return (
    <div className="px-4 py-8 lg:px-20 lg:py-12">
      <h1 className="mb-8 font-display text-[40px] font-extrabold display-tight lg:text-[56px]">{t('checkout.title')}</h1>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10">
        <div className="flex flex-col gap-5">
          {/* fulfilment */}
          <section aria-labelledby="ful-h" className={`${card} flex flex-col gap-4`}>
            <h2 id="ful-h" className="text-[17px] font-bold">
              {t('checkout.fulfilment')}
            </h2>
            <SegmentedControl
              label={t('checkout.fulfilment')}
              value={cart.fulfilment}
              onChange={(v) => cartStore.getState().setFulfilment(v)}
              segments={[
                { value: 'pickup', label: t('checkout.pickup') },
                ...(deliverable ? [{ value: 'delivery' as const, label: t('checkout.delivery') }] : []),
              ]}
            />
            {!deliverable && <p className="text-[14px] text-muted">{t('checkout.deliveryBeansOnly')}</p>}

            {cart.fulfilment === 'pickup' ? (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor={storeSelect} className="font-mono text-[12px] tracking-[1.2px] text-muted">
                    {t('checkout.pickupFrom')}
                  </label>
                  <select
                    id={storeSelect}
                    value={store?.id}
                    onChange={(e) => cartStore.getState().setStore(e.target.value)}
                    className="h-12 rounded-[12px] border border-line-strong bg-white px-3 text-[16px] font-semibold"
                  >
                    {storeOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name[locale]} — {s.address[locale]}
                      </option>
                    ))}
                  </select>
                </div>
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-[15px] font-bold">{t('checkout.pickupTime')}</legend>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {['asap', ...slots].map((s) => {
                      const on = cart.pickupTime === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={on}
                          onClick={() => cartStore.getState().setPickupTime(s)}
                          className={`h-12 rounded-[12px] text-[14px] ${
                            on ? 'border-2 border-teal-800 bg-sage-100 font-bold' : 'border border-line-strong bg-white font-semibold'
                          } ${s === 'asap' ? 'col-span-2 sm:col-span-1' : ''}`}
                        >
                          {s === 'asap'
                            ? t('checkout.asap', { min: formatNumber(ASAP_MINUTES, locale) })
                            : locale === 'ar'
                              ? s.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]!)
                              : s}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <label htmlFor={addressId} className="text-[15px] font-bold">
                  {t('checkout.address')}
                </label>
                <textarea
                  id={addressId}
                  rows={2}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setAddressError(false);
                  }}
                  aria-invalid={addressError}
                  aria-describedby={addressError ? `${addressId}-err` : undefined}
                  placeholder={t('checkout.addressPlaceholder')}
                  className="rounded-[12px] border border-line-strong bg-white p-3 text-[16px] aria-[invalid=true]:border-[#B3261E]"
                />
                {addressError && (
                  <p id={`${addressId}-err`} className="text-[14px] text-[#B3261E]">
                    {t('forms.errors.required')}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* items */}
          <section aria-labelledby="items-h" className={`${card} flex flex-col`}>
            <h2 id="items-h" className="mb-2 text-[17px] font-bold">
              {t('checkout.items')}
            </h2>
            <ul>
              {lines.map((l) => (
                <li key={l.lineId} className="flex flex-wrap items-center gap-3 border-b border-line py-3 last:border-0 sm:flex-nowrap">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px]" style={{ background: l.item.art.tone }}>
                    <ProductImage item={l.item} locale={locale} sizes="56px" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[15px] font-bold">{l.item.name[locale]}</span>
                    <span className="text-[13px] text-muted">{describeOptions(l.item, l.options, locale)}</span>
                    <span className="flex gap-3 text-[13px]">
                      {(l.item.customizable || l.item.kind === 'beans') && (
                        <button type="button" onClick={() => setEditing(l)} className="min-h-11 font-bold text-teal-800 underline sm:min-h-0">
                          {t('common.edit')}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => cartStore.getState().remove(l.lineId)}
                        className="min-h-11 font-bold text-muted underline sm:min-h-0"
                        aria-label={`${t('common.remove')} ${l.item.name[locale]}`}
                      >
                        {t('common.remove')}
                      </button>
                    </span>
                  </div>
                  <Stepper
                    value={l.qty}
                    min={0}
                    max={20}
                    onChange={(q) => cartStore.getState().setQty(l.lineId, q)}
                    decrementLabel={`${t('common.decrease')}: ${l.item.name[locale]}`}
                    incrementLabel={`${t('common.increase')}: ${l.item.name[locale]}`}
                    display={formatNumber(l.qty, locale)}
                  />
                  <span className="w-24 text-end text-[15px] font-bold">{fmt(l.lineTotal, market.currency)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* payment */}
          <section aria-labelledby="pay-h" className={`${card} flex flex-col gap-3`}>
            <h2 id="pay-h" className="text-[17px] font-bold">
              {t('checkout.payment')}
            </h2>
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">{t('checkout.payment')}</legend>
              {(['card', 'cash'] as const).map((m) => (
                <label
                  key={m}
                  className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-[14px] px-4 ${
                    cart.paymentMethod === m ? 'border-2 border-teal-800 bg-sage-100' : 'border border-line-strong'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m}
                    checked={cart.paymentMethod === m}
                    onChange={() => cartStore.getState().setPaymentMethod(m)}
                    className="h-[18px] w-[18px] accent-teal-800"
                  />
                  {m === 'card' ? (
                    <>
                      <span className="flex h-[30px] w-11 items-center justify-center rounded-[6px] bg-ink font-mono text-[10px] font-bold text-white">
                        VISA
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[15px] font-semibold">{t('checkout.cardMock')}</span>
                        <span className="text-[12px] text-muted">{t('checkout.cardHint')}</span>
                      </span>
                    </>
                  ) : (
                    <span className="text-[15px] font-semibold">
                      {cart.fulfilment === 'delivery' ? t('checkout.cashDelivery') : t('checkout.cash')}
                    </span>
                  )}
                </label>
              ))}
            </fieldset>
            <label className={`flex min-h-14 items-center gap-3 rounded-[14px] border border-line-strong px-4 ${beansAllowed ? 'cursor-pointer' : 'opacity-70'}`}>
              <span className="flex flex-1 flex-col">
                <span className="text-[15px] font-semibold">{t('checkout.payWithBeans')}</span>
                <span className="text-[12px] text-muted">
                  {beansAllowed
                    ? t('checkout.beansReady', { needed: formatNumber(FREE_DRINK_BEANS, locale) })
                    : t('checkout.beansBalance', {
                        balance: formatNumber(balance, locale),
                        needed: formatNumber(FREE_DRINK_BEANS, locale),
                      })}
                </span>
              </span>
              <input
                type="checkbox"
                role="switch"
                aria-checked={cart.payWithBeans}
                checked={cart.payWithBeans}
                disabled={!beansAllowed}
                onChange={(e) => cartStore.getState().setPayWithBeans(e.target.checked)}
                className="h-[22px] w-[22px] accent-teal-800"
              />
            </label>
          </section>
        </div>

        {/* summary */}
        <aside aria-labelledby="sum-h" className="lg:sticky lg:top-28 lg:self-start">
          <div className={`${card} flex flex-col gap-3`}>
            <h2 id="sum-h" className="text-[17px] font-bold">
              {t('checkout.summary')}
            </h2>
            <dl className="flex flex-col gap-2 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-muted">{t('checkout.subtotal')}</dt>
                <dd>{fmt(totals.subtotal, totals.currency)}</dd>
              </div>
              {totals.beansDiscount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted">{t('checkout.beansDiscount')}</dt>
                  <dd>−{fmt(totals.beansDiscount, totals.currency)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">{t('checkout.vat', { rate: formatNumber(Math.round(totals.vatRate * 100), locale) })}</dt>
                <dd data-testid="vat">{fmt(totals.vat, totals.currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{t('checkout.beansEarn')}</dt>
                <dd className="font-bold text-brown-600">+{formatNumber(totals.beansToEarn, locale)}</dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-line pt-3 text-[18px] font-bold">
                <dt>{t('checkout.total')}</dt>
                <dd data-testid="total">{fmt(totals.total, totals.currency)}</dd>
              </div>
            </dl>
            {error && (
              <p role="alert" className="text-[14px] text-[#B3261E]">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={place}
              disabled={placing}
              className="mt-2 flex h-14 w-full items-center justify-between rounded-full bg-teal-800 px-6 text-[16px] font-bold text-white hover:bg-teal-600 disabled:opacity-70"
            >
              <span>{placing ? t('checkout.placing') : t('checkout.placeOrder')}</span>
              <span>{fmt(totals.total, totals.currency)}</span>
            </button>
            <p className="text-[12px] text-muted">{t('common.vatNote')}</p>
          </div>
        </aside>
      </div>

      <dialog
        ref={editDialog}
        onClose={() => setEditing(null)}
        aria-label={editing ? editing.item.name[locale] : undefined}
        className="m-auto w-[min(520px,calc(100vw-24px))] rounded-[24px] bg-white p-0 text-ink"
      >
        {editing && (
          <div className="flex max-h-[85dvh] flex-col gap-5 overflow-y-auto p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[26px] font-extrabold">{editing.item.name[locale]}</h2>
              <button
                type="button"
                aria-label={t('common.close')}
                onClick={() => setEditing(null)}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ground"
              >
                <CloseIcon />
              </button>
            </div>
            <CustomizePanel
              key={editing.lineId}
              item={editing.item}
              initialOptions={editing.options}
              editLineId={editing.lineId}
              layout="page"
              onAdded={() => setEditing(null)}
            />
          </div>
        )}
      </dialog>
    </div>
  );
}

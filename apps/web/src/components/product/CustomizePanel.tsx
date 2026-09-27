'use client';

import {
  calcItemPrice,
  defaultOptions,
  delta,
  describeOptions,
  EXTRA_SHOT_EGP,
  formatNumber,
  grinds,
  iceLevels,
  MAX_SHOTS,
  milks,
  MIN_SHOTS,
  sizes,
  subscriptions,
  sweetnessLevels,
  syrups,
  temperatures,
  weights,
  type ItemOptions,
  type MenuItem,
} from '@mazaq/menu';
import { useLocale, useTranslations } from 'next-intl';
import { useId, useState } from 'react';
import { cartStore, useMarket } from '@/lib/cart';
import { CheckIcon } from '../icons';
import { OptionChip } from '../ui/Chip';
import { useFormatPrice } from '../ui/PriceTag';
import { Stepper } from '../ui/Stepper';

function Group({ label, children, id }: { label: string; children: React.ReactNode; id?: string }) {
  const gid = useId();
  return (
    <div role="group" aria-labelledby={id ?? gid} className="flex flex-col gap-2.5">
      <div id={id ?? gid} className="text-[15px] font-bold">
        {label}
      </div>
      {children}
    </div>
  );
}

export function CustomizePanel({
  item,
  onAdded,
  layout = 'drawer',
  initialOptions,
  editLineId,
}: {
  item: MenuItem;
  onAdded?: () => void;
  layout?: 'drawer' | 'page';
  initialOptions?: ItemOptions;
  /** When set, the button saves changes to this basket line instead of adding. */
  editLineId?: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const market = useMarket();
  const fmt = useFormatPrice();
  const [o, setO] = useState<ItemOptions>(initialOptions ?? defaultOptions(item));
  const [added, setAdded] = useState(false);
  const c = item.customizations;
  const set = (patch: ItemOptions) => {
    setAdded(false);
    setO((prev) => ({ ...prev, ...patch }));
  };

  const cur = market.currency;
  const total = calcItemPrice(item, o, cur);
  const sweetId = useId();
  const iceId = useId();
  const syrupId = useId();

  const add = () => {
    if (editLineId) cartStore.getState().update(editLineId, o);
    else cartStore.getState().add(item.id, o);
    setAdded(true);
    onAdded?.();
  };

  const sizePrice = (id: (typeof sizes)[number]['id']) => calcItemPrice(item, { ...o, size: id }, cur);

  return (
    <div className="flex flex-1 flex-col gap-[26px]">
      {c.includes('size') && (
        <Group label={t('customize.size')}>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((s) => {
              const on = o.size === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set({ size: s.id })}
                  className={`flex h-16 flex-col items-center justify-center gap-0.5 rounded-[14px] ${
                    on ? 'border-2 border-teal-800 bg-sage-100' : 'border border-line-strong bg-white hover:bg-ground'
                  }`}
                >
                  <span className="text-[15px] font-bold">{s.label[locale]}</span>
                  <span className="text-[12px] text-muted">
                    {s.meta?.[locale]} · {fmt(sizePrice(s.id), cur)}
                  </span>
                </button>
              );
            })}
          </div>
        </Group>
      )}

      {c.includes('milk') && (
        <Group label={t('customize.milk')}>
          <div className="flex flex-wrap gap-2">
            {milks.map((m) => (
              <OptionChip key={m.id} selected={o.milk === m.id} onClick={() => set({ milk: m.id })}>
                {m.label[locale]}
                {m.deltaEGP ? <span className="ms-1">{t('customize.surcharge', { price: fmt(delta(m.deltaEGP, cur), cur) })}</span> : null}
              </OptionChip>
            ))}
          </div>
        </Group>
      )}

      {c.includes('cardamom') && (
        <Group label={t('customize.cardamom')}>
          <div className="flex flex-wrap gap-2">
            <OptionChip selected={!o.cardamom} onClick={() => set({ cardamom: false })}>
              {t('customize.plain')}
            </OptionChip>
            <OptionChip selected={!!o.cardamom} onClick={() => set({ cardamom: true })}>
              {t('customize.withCardamom')}
            </OptionChip>
          </div>
        </Group>
      )}

      {c.includes('shots') && o.shots !== undefined && (
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold">{t('customize.shots')}</span>
            <span className="text-[13px] text-muted">
              {t('customize.extraShot', { price: fmt(delta(EXTRA_SHOT_EGP, cur), cur) })}
            </span>
          </div>
          <Stepper
            value={o.shots}
            min={MIN_SHOTS}
            max={MAX_SHOTS}
            onChange={(shots) => set({ shots })}
            decrementLabel={t('customize.fewerShots')}
            incrementLabel={t('customize.moreShots')}
            display={formatNumber(o.shots, locale)}
          />
        </div>
      )}

      {(c.includes('sweetness') || c.includes('ice')) && (
        <div className="grid grid-cols-2 gap-4">
          {c.includes('sweetness') && (
            <div className="flex flex-col gap-2">
              <label htmlFor={sweetId} className="text-[15px] font-bold">
                {t('customize.sweetness')}
              </label>
              <select
                id={sweetId}
                value={o.sweetness}
                onChange={(e) => set({ sweetness: e.target.value as ItemOptions['sweetness'] })}
                className="h-12 rounded-[12px] border border-line-strong bg-white px-3 text-[15px] font-medium"
              >
                {sweetnessLevels.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label[locale]}
                  </option>
                ))}
              </select>
            </div>
          )}
          {c.includes('ice') && (
            <div className="flex flex-col gap-2">
              <label htmlFor={iceId} className="text-[15px] font-bold">
                {t('customize.ice')}
              </label>
              <select
                id={iceId}
                value={o.ice}
                onChange={(e) => set({ ice: e.target.value as ItemOptions['ice'] })}
                className="h-12 rounded-[12px] border border-line-strong bg-white px-3 text-[15px] font-medium"
              >
                {iceLevels.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label[locale]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {(c.includes('syrup') || c.includes('temperature')) && (
        <div className="grid grid-cols-2 gap-4">
          {c.includes('syrup') && (
            <div className="flex flex-col gap-2">
              <label htmlFor={syrupId} className="text-[15px] font-bold">
                {t('customize.syrup')}
              </label>
              <select
                id={syrupId}
                value={o.syrup}
                onChange={(e) => set({ syrup: e.target.value as ItemOptions['syrup'] })}
                className="h-12 rounded-[12px] border border-line-strong bg-white px-3 text-[15px] font-medium"
              >
                {syrups.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label[locale]}
                    {s.deltaEGP ? ` +${fmt(delta(s.deltaEGP, cur), cur)}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          {c.includes('temperature') && (
            <Group label={t('customize.temperature')}>
              <div className="flex gap-2">
                {temperatures.map((x) => (
                  <OptionChip key={x.id} selected={o.temperature === x.id} onClick={() => set({ temperature: x.id })}>
                    {x.label[locale]}
                  </OptionChip>
                ))}
              </div>
            </Group>
          )}
        </div>
      )}

      {item.kind === 'beans' && (
        <>
          <Group label={t('beans.grind')}>
            <div className="flex flex-wrap gap-2">
              {grinds.map((g) => (
                <OptionChip key={g.id} selected={o.grind === g.id} onClick={() => set({ grind: g.id })}>
                  {g.label[locale]}
                </OptionChip>
              ))}
            </div>
          </Group>
          <Group label={t('beans.weight')}>
            <div className="grid grid-cols-3 gap-2">
              {weights.map((w) => {
                const on = o.weight === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set({ weight: w.id })}
                    className={`flex h-16 flex-col items-center justify-center gap-0.5 rounded-[14px] ${
                      on ? 'border-2 border-teal-800 bg-sage-100' : 'border border-line-strong bg-white hover:bg-ground'
                    }`}
                  >
                    <span className="text-[15px] font-bold">{w.label[locale]}</span>
                    <span className="text-[12px] text-muted">
                      {fmt(calcItemPrice(item, { ...o, weight: w.id, subscription: 'none' }, cur), cur)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Group>
          <Group label={t('beans.purchase')}>
            <div className="flex flex-col gap-2">
              {subscriptions.map((s) => (
                <label
                  key={s.id}
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-[14px] px-4 ${
                    o.subscription === s.id ? 'border-2 border-teal-800 bg-sage-100' : 'border border-line-strong bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name={`sub-${item.id}`}
                    value={s.id}
                    checked={o.subscription === s.id}
                    onChange={() => set({ subscription: s.id })}
                    className="h-[18px] w-[18px] accent-teal-800"
                  />
                  <span className="flex-1 text-[15px] font-semibold">{s.label[locale]}</span>
                  {s.id !== 'none' && (
                    <span className="rounded-full bg-saffron-500 px-2.5 py-1 font-mono text-[11px] font-semibold text-teal-800">
                      −10%
                    </span>
                  )}
                </label>
              ))}
              <p className="text-[13px] text-muted">{t('beans.subscriptionHint')}</p>
            </div>
          </Group>
        </>
      )}

      <div
        className={`mt-auto flex items-center gap-3 border-t border-line pt-5 ${
          layout === 'drawer' ? 'sticky bottom-0 -mx-8 bg-white px-8 pb-6' : ''
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-[13px] text-muted">{describeOptions(item, o, locale)}</span>
          <span className="font-display text-[26px] font-extrabold" aria-live="polite">
            {fmt(total, cur)}
          </span>
        </div>
        <button
          type="button"
          onClick={add}
          className="inline-flex h-14 items-center gap-2 rounded-full bg-teal-800 px-7 text-[16px] font-bold text-white hover:bg-teal-600"
        >
          {added ? <CheckIcon /> : null}
          {editLineId ? t('common.save') : added ? t('common.added') : t('common.addToOrder')}
        </button>
      </div>
    </div>
  );
}

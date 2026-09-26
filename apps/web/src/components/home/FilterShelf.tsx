'use client';

import { useState, type ReactNode } from 'react';
import { Chip } from '../ui/Chip';
import { SegmentedControl } from '../ui/SegmentedControl';

export interface ShelfItem {
  id: string;
  node: ReactNode;
  groups: string[];
}

/**
 * Single-select pill filter (roast shelf) or multi-select chips (breakfast band) over
 * server-rendered cards.
 */
export function FilterShelf({
  items,
  options,
  label,
  mode,
  limit = 4,
  empty,
  gridClass,
  tone = 'teal',
  header,
  allValue,
}: {
  items: ShelfItem[];
  options: { value: string; label: string }[];
  label: string;
  mode: 'single' | 'multi';
  limit?: number;
  empty: string;
  gridClass: string;
  tone?: 'teal' | 'sage';
  header?: ReactNode;
  allValue?: string;
}) {
  const [single, setSingle] = useState(allValue ?? options[0]?.value ?? '');
  const [multi, setMulti] = useState<string[]>([]);

  const shown = items
    .filter((i) =>
      mode === 'single'
        ? single === allValue || i.groups.includes(single)
        : multi.every((m) => i.groups.includes(m)),
    )
    .slice(0, limit);

  const chips = (
    <div role="group" aria-label={label} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
      {options.map((o) => {
        const selected = mode === 'single' ? single === o.value : multi.includes(o.value);
        return (
          <Chip
            key={o.value}
            tone={tone}
            size={tone === 'sage' ? 'sm' : 'md'}
            selected={selected}
            onClick={() =>
              mode === 'single'
                ? setSingle(o.value)
                : setMulti((m) => (m.includes(o.value) ? m.filter((x) => x !== o.value) : [...m, o.value]))
            }
          >
            {o.label}
          </Chip>
        );
      })}
    </div>
  );

  return (
    <>
      {header ? header : null}
      {chips}
      <div aria-live="polite" className="contents">
        {shown.length === 0 ? (
          <p className="rounded-[18px] bg-white/70 p-6 text-[15px]">{empty}</p>
        ) : (
          <ul className={gridClass}>
            {shown.map((i) => (
              <li key={i.id} className="flex">
                {i.node}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export function DrinkTabs({
  hot,
  iced,
  labels,
  header,
}: {
  hot: ReactNode;
  iced: ReactNode;
  labels: { group: string; hot: string; iced: string };
  header: ReactNode;
}) {
  const [tab, setTab] = useState<'hot' | 'iced'>('iced');
  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        {header}
        <SegmentedControl
        label={labels.group}
        value={tab}
        onChange={setTab}
        controls="drinks-panel"
        segments={[
          { value: 'hot', label: labels.hot },
          { value: 'iced', label: labels.iced },
        ]}
          className="shrink-0 self-start sm:self-end"
        />
      </div>
      <div id="drinks-panel" role="tabpanel" className="w-full">
        <div hidden={tab !== 'hot'}>{hot}</div>
        <div hidden={tab !== 'iced'}>{iced}</div>
      </div>
    </>
  );
}

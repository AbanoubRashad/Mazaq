'use client';

import { useId, useState, type ReactNode } from 'react';
import { SegmentedControl } from './SegmentedControl';

export function Tabs({ label, tabs }: { label: string; tabs: { id: string; label: string; panel: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? '');
  const base = useId();
  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl
        label={label}
        value={active}
        onChange={setActive}
        controls={`${base}-${active}`}
        segments={tabs.map((t) => ({ value: t.id, label: t.label }))}
        className="self-start bg-white"
      />
      {tabs.map((t) => (
        <div key={t.id} id={`${base}-${t.id}`} role="tabpanel" hidden={t.id !== active}>
          {t.panel}
        </div>
      ))}
    </div>
  );
}

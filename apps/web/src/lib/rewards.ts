'use client';

import { api, type RewardsAccount } from '@mazaq/api';
import { useEffect, useState } from 'react';

let cache: RewardsAccount | null = null;

/** Mock signed-in member (Nour). Replace with real auth + API. */
export function useRewards(): RewardsAccount | null {
  const [data, setData] = useState<RewardsAccount | null>(cache);
  useEffect(() => {
    let alive = true;
    api.getRewards().then((r) => {
      cache = r;
      if (alive) setData(r);
    });
    return () => {
      alive = false;
    };
  }, []);
  return data;
}

import { computeTotals } from '@mazaq/cart';
import { stores } from './stores';
import type { MazaqApi, Order, PlaceOrderInput, RewardsAccount } from './types';

/** Mock backend. Swap for a real implementation (e.g. Supabase) behind MazaqApi. */

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const LATENCY = 250;

const PICKUP_ALPHABET = 'ACDEFHJKLMNPQRTUVWXY3479'; // no look-alikes (0/O, 1/I, 5/S…)
const randomCode = (len: number) =>
  Array.from({ length: len }, () => PICKUP_ALPHABET[Math.floor(Math.random() * PICKUP_ALPHABET.length)]).join('');

const orders = new Map<string, Order>();

const rewards: RewardsAccount = {
  memberId: 'MZ-0042-7719',
  name: 'Nour Hassan',
  initials: 'NH',
  level: 'gold',
  balance: 112,
  tiers: [
    { id: 'extra', beans: 50, reward: { en: 'Extra shot or syrup', ar: 'شوت إضافي أو سيرب' } },
    { id: 'bake', beans: 100, reward: { en: 'Any bake or breakfast', ar: 'أي مخبوزات أو فطار' } },
    { id: 'drink', beans: 150, reward: { en: 'Any drink, any size', ar: 'أي مشروب بأي حجم' } },
    { id: 'beans', beans: 300, reward: { en: '250 g bag of beans', ar: 'كيس بن ٢٥٠ جم' } },
  ],
  activity: [
    { id: 'a1', label: { en: 'Iced Spanish Latte', ar: 'آيس سبانيش لاتيه' }, date: '2026-09-27', beans: 16 },
    { id: 'a2', label: { en: 'Ethiopia Yirgacheffe 250 g', ar: 'إثيوبيا يرجاتشيفي ٢٥٠ جم' }, date: '2026-09-21', beans: 52 },
    { id: 'a3', label: { en: 'Flat White', ar: 'فلات وايت' }, date: '2026-09-18', beans: 12 },
  ],
};

function statusFor(order: Order, now = Date.now()): Order['status'] {
  const created = new Date(order.createdAt).getTime();
  const ready = new Date(order.readyAt).getTime();
  if (now >= ready) return 'ready';
  if (now - created > 60_000) return 'preparing';
  return 'received';
}

export const mockApi: MazaqApi = {
  async getStores(query) {
    await wait(LATENCY);
    const q = query?.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter((s) =>
      [s.name.en, s.name.ar, s.city.en, s.city.ar, s.address.en, s.address.ar].some((v) =>
        v.toLowerCase().includes(q),
      ),
    );
  },

  async getStore(id) {
    await wait(LATENCY / 2);
    return stores.find((s) => s.id === id);
  },

  async placeOrder(input: PlaceOrderInput) {
    await wait(LATENCY * 2);
    if (input.lines.length === 0) throw new Error('Basket is empty');
    const totals = computeTotals(input, rewards.balance);
    const now = new Date();
    const readyAt =
      input.pickupTime === 'asap'
        ? new Date(now.getTime() + 8 * 60_000)
        : (() => {
            const [h, m] = input.pickupTime.split(':').map(Number);
            const d = new Date(now);
            d.setHours(h ?? 0, m ?? 0, 0, 0);
            return d;
          })();
    const order: Order = {
      id: `ord_${now.getTime().toString(36)}`,
      number: `MZ-${String(Math.floor(1000 + Math.random() * 9000))}`,
      pickupCode: randomCode(3),
      createdAt: now.toISOString(),
      status: 'received',
      input,
      total: totals.total,
      currency: totals.currency,
      beansEarned: totals.beansToEarn,
      readyAt: readyAt.toISOString(),
    };
    rewards.balance += totals.beansToEarn - totals.beansToSpend;
    orders.set(order.id, order);
    return order;
  },

  async getOrder(id) {
    await wait(LATENCY / 2);
    const order = orders.get(id);
    return order ? { ...order, status: statusFor(order) } : undefined;
  },

  async getRewards() {
    await wait(LATENCY);
    return structuredClone(rewards);
  },

  async submitCorporateEnquiry() {
    await wait(LATENCY * 2);
    return { reference: `CORP-${randomCode(5)}` };
  },

  async submitFranchiseEnquiry() {
    await wait(LATENCY * 2);
    return { reference: `FR-${randomCode(5)}` };
  },

  async submitContact() {
    await wait(LATENCY * 2);
    return { reference: `MSG-${randomCode(5)}` };
  },

  async requestOtp() {
    await wait(LATENCY);
    return { sent: true };
  },

  async verifyOtp(_phone, code) {
    await wait(LATENCY);
    // Mock: any 4-digit code works except 0000.
    const ok = /^\d{4}$/.test(code) && code !== '0000';
    return ok ? { ok, name: 'Nour' } : { ok };
  },
};

import { describe, expect, it } from 'vitest';
import { canDeliver, computeTotals, createCartStore, pickupSlots } from './index';

describe('cart store', () => {
  it('adds, merges identical lines and removes', () => {
    const cart = createCartStore();
    const a = cart.getState().add('iced-spanish-latte', { size: 'regular', milk: 'oat', shots: 2 });
    const b = cart.getState().add('iced-spanish-latte', { size: 'regular', milk: 'oat', shots: 2 });
    expect(a).toBe(b);
    expect(cart.getState().lines[0]?.qty).toBe(2);
    cart.getState().add('iced-spanish-latte', { size: 'large', milk: 'oat', shots: 2 });
    expect(cart.getState().lines).toHaveLength(2);
    cart.getState().remove(a);
    expect(cart.getState().lines).toHaveLength(1);
  });

  it('setQty(0) removes the line', () => {
    const cart = createCartStore();
    const id = cart.getState().add('espresso', { shots: 2 });
    cart.getState().setQty(id, 0);
    expect(cart.getState().lines).toHaveLength(0);
  });

  it('matches the app checkout design: EGP 345, VAT 42.37, +34 beans', () => {
    const cart = createCartStore();
    cart.getState().add('iced-spanish-latte', { size: 'regular', milk: 'oat', shots: 2, sweetness: 'less', ice: 'regular' });
    cart.getState().add('avocado-egg-sourdough', {});
    const t = computeTotals(cart.getState(), 112);
    expect(t.subtotal).toBe(345);
    expect(t.vat).toBe(42.37);
    expect(t.beansToEarn).toBe(34);
    expect(t.count).toBe(2);
  });

  it('only allows delivery for beans-only baskets', () => {
    const cart = createCartStore();
    cart.getState().add('ethiopia-yirgacheffe', { weight: '250g', grind: 'whole' });
    expect(canDeliver(cart.getState().lines)).toBe(true);
    cart.getState().setFulfilment('delivery');
    expect(cart.getState().fulfilment).toBe('delivery');
    cart.getState().add('espresso', { shots: 2 });
    expect(cart.getState().fulfilment).toBe('pickup');
    cart.getState().setFulfilment('delivery');
    expect(cart.getState().fulfilment).toBe('pickup');
  });

  it('pays with beans only when balance >= 150', () => {
    const cart = createCartStore();
    cart.getState().add('flat-white', { size: 'regular', shots: 2 });
    cart.getState().setPayWithBeans(true);
    expect(computeTotals(cart.getState(), 112).beansDiscount).toBe(0);
    const t = computeTotals(cart.getState(), 160);
    expect(t.beansDiscount).toBe(110);
    expect(t.total).toBe(0);
  });

  it('switches currency with the market', () => {
    const cart = createCartStore();
    cart.getState().add('espresso', { shots: 2 });
    cart.getState().setMarket('GB');
    expect(computeTotals(cart.getState()).currency).toBe('GBP');
  });
});

describe('pickupSlots', () => {
  it('returns 15-minute slots at least 15 minutes out', () => {
    const slots = pickupSlots(new Date(2026, 8, 29, 8, 7), 3);
    expect(slots).toEqual(['08:30', '08:45', '09:00']);
  });
});

import { describe, expect, it } from 'vitest';
import { api, directionsUrl, stores } from './index';

describe('mock api', () => {
  it('searches stores by city in either language', async () => {
    expect((await api.getStores('zamalek')).map((s) => s.id)).toEqual(['cai-zamalek']);
    expect((await api.getStores('دبي')).length).toBe(2);
    expect((await api.getStores()).length).toBe(stores.length);
  });

  it('places an order with a number and pickup code', async () => {
    const order = await api.placeOrder({
      market: 'EG',
      lines: [{ lineId: 'x', itemId: 'flat-white', qty: 1, options: { size: 'regular', shots: 2 } }],
      fulfilment: 'pickup',
      storeId: 'cai-zamalek',
      pickupTime: 'asap',
      paymentMethod: 'card',
      payWithBeans: false,
    });
    expect(order.number).toMatch(/^MZ-\d{4}$/);
    expect(order.pickupCode).toHaveLength(3);
    expect(order.total).toBe(110);
    expect(order.beansEarned).toBe(11);
    expect((await api.getOrder(order.id))?.status).toBe('received');
  });

  it('rejects empty orders', async () => {
    await expect(
      api.placeOrder({
        market: 'EG',
        lines: [],
        fulfilment: 'pickup',
        storeId: null,
        pickupTime: 'asap',
        paymentMethod: 'cash',
        payWithBeans: false,
      }),
    ).rejects.toThrow();
  });

  it('builds Google Maps directions links', () => {
    expect(directionsUrl({ lat: 1, lng: 2 })).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=1,2',
    );
  });
});

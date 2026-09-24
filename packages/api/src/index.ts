import { mockApi } from './mock';
import type { MazaqApi } from './types';

export * from './types';
export { stores, cities, directionsUrl } from './stores';

let impl: MazaqApi = mockApi;

/** Swap the backend implementation (e.g. a Supabase adapter) at app start-up. */
export function setApi(api: MazaqApi) {
  impl = api;
}

export const api: MazaqApi = {
  getStores: (q) => impl.getStores(q),
  getStore: (id) => impl.getStore(id),
  placeOrder: (input) => impl.placeOrder(input),
  getOrder: (id) => impl.getOrder(id),
  getRewards: () => impl.getRewards(),
  submitCorporateEnquiry: (f) => impl.submitCorporateEnquiry(f),
  submitFranchiseEnquiry: (f) => impl.submitFranchiseEnquiry(f),
  submitContact: (f) => impl.submitContact(f),
  requestOtp: (p) => impl.requestOtp(p),
  verifyOtp: (p, c) => impl.verifyOtp(p, c),
};

export const getStores = api.getStores;
export const placeOrder = api.placeOrder;
export const getRewards = api.getRewards;

import { describe, it, expect } from 'vitest';

import { filterAndSortServices } from '@/utils/filterAndSortServices';
import type { ServiceItem } from '@/types/service';

function service(overrides: Partial<ServiceItem>): ServiceItem {
  return {
    id: 1,
    providerId: 1,
    categoryId: 1,
    name: 'قاعة الماسة',
    description: null,
    price: 5000,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    imageUrl: null,
    ...overrides,
  };
}

describe('filterAndSortServices', () => {
  it('matches the keyword against the name, case-insensitively', () => {
    const items = [service({ id: 1, name: 'Diamond Hall' }), service({ id: 2, name: 'قاعة الورد' })];

    const result = filterAndSortServices(items, { keyword: 'diamond' }, 'newest');

    expect(result.map((item) => item.id)).toEqual([1]);
  });

  it('keeps items within the given price range', () => {
    const items = [
      service({ id: 1, price: 3000 }),
      service({ id: 2, price: 8000 }),
      service({ id: 3, price: 15000 }),
    ];

    const result = filterAndSortServices(items, { minPrice: 5000, maxPrice: 10000 }, 'newest');

    expect(result.map((item) => item.id)).toEqual([2]);
  });

  it('sorts by price ascending', () => {
    const items = [service({ id: 1, price: 9000 }), service({ id: 2, price: 3000 })];

    const result = filterAndSortServices(items, {}, 'price_asc');

    expect(result.map((item) => item.id)).toEqual([2, 1]);
  });

  it('sorts by price descending', () => {
    const items = [service({ id: 1, price: 3000 }), service({ id: 2, price: 9000 })];

    const result = filterAndSortServices(items, {}, 'price_desc');

    expect(result.map((item) => item.id)).toEqual([2, 1]);
  });

  it('sorts newest first by default', () => {
    const items = [
      service({ id: 1, createdAt: '2026-01-01T00:00:00Z' }),
      service({ id: 2, createdAt: '2026-06-01T00:00:00Z' }),
    ];

    const result = filterAndSortServices(items, {}, 'newest');

    expect(result.map((item) => item.id)).toEqual([2, 1]);
  });

  it('does not mutate the original array', () => {
    const items = [service({ id: 1, price: 9000 }), service({ id: 2, price: 3000 })];

    filterAndSortServices(items, {}, 'price_asc');

    expect(items.map((item) => item.id)).toEqual([1, 2]);
  });
});

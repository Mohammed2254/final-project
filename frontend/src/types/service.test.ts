import { describe, it, expect } from 'vitest';

import { toServiceItem, type ServiceRecord } from '@/types/service';

const record: ServiceRecord = {
  service_id: 5,
  provider_profile_id: 3,
  category_id: 1,
  service_name: 'قاعة العبدلي',
  description: 'قاعة أفراح في الرياض',
  price: '10000.00',
  is_active: true,
  created_at: '2026-07-21T21:39:32',
};

describe('toServiceItem', () => {
  it('maps the backend snake_case fields to camelCase', () => {
    const item = toServiceItem(record);

    expect(item.id).toBe(5);
    expect(item.providerId).toBe(3);
    expect(item.categoryId).toBe(1);
    expect(item.name).toBe('قاعة العبدلي');
    expect(item.isActive).toBe(true);
  });

  it('converts the price from string to number', () => {
    // The API sends prices as strings to avoid float rounding issues.
    const item = toServiceItem(record);

    expect(item.price).toBe(10000);
    expect(typeof item.price).toBe('number');
  });

  it('starts with no image (media is fetched separately)', () => {
    expect(toServiceItem(record).imageUrl).toBeNull();
  });

  it('keeps a null description as null', () => {
    const item = toServiceItem({ ...record, description: null });

    expect(item.description).toBeNull();
  });
});

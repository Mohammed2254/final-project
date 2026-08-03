import { describe, it, expect } from 'vitest';

import { sortMediaMainFirst } from '@/hooks/useServiceGallery';
import type { ServiceMediaRecord } from '@/types/service';

function media(overrides: Partial<ServiceMediaRecord>): ServiceMediaRecord {
  return {
    media_id: 1,
    service_id: 1,
    media_url: 'https://example.com/a.jpg',
    media_type: 'IMAGE',
    is_main: false,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('sortMediaMainFirst', () => {
  it('puts the main image first regardless of its original position', () => {
    const items = [
      media({ media_id: 1, is_main: false }),
      media({ media_id: 2, is_main: false }),
      media({ media_id: 3, is_main: true }),
    ];

    expect(sortMediaMainFirst(items).map((item) => item.media_id)).toEqual([3, 1, 2]);
  });

  it('does not mutate the original array', () => {
    const items = [media({ media_id: 1, is_main: false }), media({ media_id: 2, is_main: true })];

    sortMediaMainFirst(items);

    expect(items.map((item) => item.media_id)).toEqual([1, 2]);
  });

  it('leaves an empty list empty', () => {
    expect(sortMediaMainFirst([])).toEqual([]);
  });
});

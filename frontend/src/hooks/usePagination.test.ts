import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { usePagination } from '@/hooks/usePagination';

const items = Array.from({ length: 25 }, (_, i) => i + 1);

describe('usePagination', () => {
  it('slices the first page and reports the range', () => {
    const { result } = renderHook(() => usePagination(items, { pageSize: 10 }));

    expect(result.current.pageItems).toHaveLength(10);
    expect(result.current.pageItems[0]).toBe(1);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.rangeStart).toBe(1);
    expect(result.current.rangeEnd).toBe(10);
    expect(result.current.total).toBe(25);
  });

  it('returns the remainder on the last page', () => {
    const { result } = renderHook(() => usePagination(items, { pageSize: 10 }));

    act(() => result.current.setPage(3));

    expect(result.current.pageItems).toEqual([21, 22, 23, 24, 25]);
    expect(result.current.rangeEnd).toBe(25);
  });

  it('clamps the page when the list shrinks under it', () => {
    // Page 3 of 25 items, then a filter leaves only 5 - page 3 no longer exists.
    const { result, rerender } = renderHook(({ list }) => usePagination(list, { pageSize: 10 }), {
      initialProps: { list: items },
    });

    act(() => result.current.setPage(3));
    rerender({ list: items.slice(0, 5) });

    expect(result.current.page).toBe(1);
    expect(result.current.pageItems).toHaveLength(5);
  });

  it('stays on one page for an empty list', () => {
    const { result } = renderHook(() => usePagination([], { pageSize: 10 }));

    expect(result.current.totalPages).toBe(1);
    expect(result.current.rangeStart).toBe(0);
    expect(result.current.rangeEnd).toBe(0);
  });
});

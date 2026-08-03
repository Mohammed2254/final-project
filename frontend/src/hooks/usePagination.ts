import { useMemo, useState } from 'react';

interface UsePaginationOptions {
  pageSize?: number;
}

/** Client-side, because the list endpoints return every row at once. */
export function usePagination<T>(items: T[], { pageSize = 9 }: UsePaginationOptions = {}) {
  const [requestedPage, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // A filter can shrink the list below the current page - clamp during render,
  // not in an effect, so there is no frame showing an empty grid.
  const page = Math.min(requestedPage, totalPages);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return {
    page,
    setPage,
    totalPages,
    pageItems,
    rangeStart: items.length === 0 ? 0 : (page - 1) * pageSize + 1,
    rangeEnd: Math.min(page * pageSize, items.length),
    total: items.length,
  };
}

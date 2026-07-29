import { useMemo, useState } from 'react';

interface UsePaginationOptions {
  pageSize?: number;
}

/**
 * Client-side pagination. The list endpoints return every row at once, so
 * slicing here keeps the DOM small without needing backend support. Swap the
 * slice for a `?page=` query the day the API paginates - the component API
 * stays the same.
 */
export function usePagination<T>(items: T[], { pageSize = 9 }: UsePaginationOptions = {}) {
  const [requestedPage, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Filters can shrink the list under the current page (e.g. you're on page 4
  // and a search leaves 5 results). Clamping here rather than in an effect
  // keeps the render consistent - no frame showing an empty grid first.
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

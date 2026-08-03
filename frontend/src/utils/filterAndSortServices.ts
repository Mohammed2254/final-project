import type { ServiceItem } from '@/types/service';

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price_asc', label: 'الأقل سعراً' },
  { value: 'price_desc', label: 'الأعلى سعراً' },
];

export interface ServiceFilters {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function filterAndSortServices<T extends ServiceItem>(
  items: T[],
  filters: ServiceFilters,
  sortBy: SortOption,
): T[] {
  const term = filters.keyword?.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (term && !item.name.toLowerCase().includes(term)) return false;
    if (filters.minPrice !== undefined && item.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && item.price > filters.maxPrice) return false;
    return true;
  });

  const sorted = [...filtered];
  if (sortBy === 'price_asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    sorted.sort((a, b) => b.price - a.price);
  } else {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return sorted;
}

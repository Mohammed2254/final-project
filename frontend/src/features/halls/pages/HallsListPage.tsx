import { useMemo, useState } from 'react';

import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { HallCard } from '@/features/halls/components/HallCard';
import { HallFilters, type HallFiltersValue } from '@/features/halls/components/HallFilters';
import { useHalls } from '@/features/halls/hooks/useHalls';
import { usePagination } from '@/hooks/usePagination';
import { filterAndSortServices, type SortOption } from '@/utils/filterAndSortServices';

const EMPTY_FILTERS: HallFiltersValue = { keyword: '', minPrice: '', maxPrice: '' };

function parsePrice(value: string): number | undefined {
  if (value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function HallsListPage() {
  const [filters, setFilters] = useState<HallFiltersValue>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const { halls, isLoading, error, reload } = useHalls();

  // Filtering and sorting run against the already-fetched list on every
  // keystroke - no network round trip, so there's nothing to debounce.
  const visibleHalls = useMemo(
    () =>
      filterAndSortServices(
        halls,
        {
          keyword: filters.keyword,
          minPrice: parsePrice(filters.minPrice),
          maxPrice: parsePrice(filters.maxPrice),
        },
        sortBy,
      ),
    [halls, filters, sortBy],
  );

  const { page, setPage, totalPages, pageItems, rangeStart, rangeEnd, total } =
    usePagination(visibleHalls);

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <SectionHeader
        title="قاعات الأفراح"
        subtitle="تصفحوا القاعات المتاحة واختاروا الأنسب لزفافكم"
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <HallFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters(EMPTY_FILTERS)}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </aside>

        <div>
          {isLoading && <SkeletonGrid count={6} />}

          {!isLoading && error && <ErrorState message={error} onRetry={reload} />}

          {!isLoading && !error && visibleHalls.length === 0 && (
            <EmptyState
              title="لا توجد نتائج"
              description="لم نجد أي قاعات تطابق بحثكم، جرّبوا تعديل الفلاتر."
            />
          )}

          {!isLoading && !error && visibleHalls.length > 0 && (
            <>
              <p className="mb-4 text-sm text-muted-foreground" role="status">
                عرض {rangeStart}–{rangeEnd} من {total} قاعة
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((hall) => (
                  <HallCard key={hall.id} hall={hall} />
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                className="mt-8"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

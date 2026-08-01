import { useMemo, useState } from 'react';

import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { PhotographerCard } from '@/features/photographers/components/PhotographerCard';
import {
  PhotographerFilters,
  type PhotographerFiltersValue,
} from '@/features/photographers/components/PhotographerFilters';
import { usePhotographers } from '@/features/photographers/hooks/usePhotographers';
import { usePagination } from '@/hooks/usePagination';
import { filterAndSortServices, type SortOption } from '@/utils/filterAndSortServices';

const EMPTY_FILTERS: PhotographerFiltersValue = { keyword: '', minPrice: '', maxPrice: '' };

function parsePrice(value: string): number | undefined {
  if (value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function PhotographersListPage() {
  const [filters, setFilters] = useState<PhotographerFiltersValue>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const { photographers, isLoading, error, reload } = usePhotographers();

  // Filtering and sorting run against the already-fetched list on every
  // keystroke - no network round trip, so there's nothing to debounce.
  const visiblePhotographers = useMemo(
    () =>
      filterAndSortServices(
        photographers,
        {
          keyword: filters.keyword,
          minPrice: parsePrice(filters.minPrice),
          maxPrice: parsePrice(filters.maxPrice),
        },
        sortBy,
      ),
    [photographers, filters, sortBy],
  );

  const { page, setPage, totalPages, pageItems, rangeStart, rangeEnd, total } =
    usePagination(visiblePhotographers);

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <SectionHeader
        title="مصورو الأفراح"
        subtitle="تصفحوا مزودي خدمات التصوير واختاروا الأنسب لزفافكم"
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <PhotographerFilters
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

          {!isLoading && !error && visiblePhotographers.length === 0 && (
            <EmptyState
              title="لا توجد نتائج"
              description="لم نجد أي مصورين يطابقون بحثكم، جرّبوا تعديل الفلاتر."
            />
          )}

          {!isLoading && !error && visiblePhotographers.length > 0 && (
            <>
              <p className="mb-4 text-sm text-muted-foreground" role="status">
                عرض {rangeStart}–{rangeEnd} من {total} مصوّر
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pageItems.map((photographer) => (
                  <PhotographerCard key={photographer.id} photographer={photographer} />
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

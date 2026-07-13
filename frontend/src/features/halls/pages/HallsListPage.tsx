import { useMemo, useState } from 'react';

import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { HallCard } from '@/features/halls/components/HallCard';
import { HallFilters, type HallFiltersValue } from '@/features/halls/components/HallFilters';
import { useHalls } from '@/features/halls/hooks/useHalls';

const EMPTY_FILTERS: HallFiltersValue = { keyword: '', minPrice: '', maxPrice: '' };

function parsePrice(value: string): number | undefined {
  if (value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function HallsListPage() {
  const [filters, setFilters] = useState<HallFiltersValue>(EMPTY_FILTERS);

  const queryParams = useMemo(
    () => ({
      keyword: filters.keyword,
      minPrice: parsePrice(filters.minPrice),
      maxPrice: parsePrice(filters.maxPrice),
    }),
    [filters],
  );

  const { halls, isLoading, error, reload } = useHalls(queryParams);

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
          />
        </aside>

        <div>
          {isLoading && <SkeletonGrid count={6} />}

          {!isLoading && error && <ErrorState message={error} onRetry={reload} />}

          {!isLoading && !error && halls.length === 0 && (
            <EmptyState
              title="لا توجد نتائج"
              description="لم نجد أي قاعات تطابق بحثكم، جرّبوا تعديل الفلاتر."
            />
          )}

          {!isLoading && !error && halls.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {halls.map((hall) => (
                <HallCard key={hall.id} hall={hall} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

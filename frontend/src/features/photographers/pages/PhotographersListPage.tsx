import { useMemo, useState } from 'react';

import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { PhotographerCard } from '@/features/photographers/components/PhotographerCard';
import {
  PhotographerFilters,
  type PhotographerFiltersValue,
} from '@/features/photographers/components/PhotographerFilters';
import { usePhotographers } from '@/features/photographers/hooks/usePhotographers';

const EMPTY_FILTERS: PhotographerFiltersValue = { keyword: '', minPrice: '', maxPrice: '' };

function parsePrice(value: string): number | undefined {
  if (value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function PhotographersListPage() {
  const [filters, setFilters] = useState<PhotographerFiltersValue>(EMPTY_FILTERS);

  const queryParams = useMemo(
    () => ({
      keyword: filters.keyword,
      minPrice: parsePrice(filters.minPrice),
      maxPrice: parsePrice(filters.maxPrice),
    }),
    [filters],
  );

  const { photographers, isLoading, error, reload } = usePhotographers(queryParams);

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
          />
        </aside>

        <div>
          {isLoading && <SkeletonGrid count={6} />}

          {!isLoading && error && <ErrorState message={error} onRetry={reload} />}

          {!isLoading && !error && photographers.length === 0 && (
            <EmptyState
              title="لا توجد نتائج"
              description="لم نجد أي مصورين يطابقون بحثكم، جرّبوا تعديل الفلاتر."
            />
          )}

          {!isLoading && !error && photographers.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {photographers.map((photographer) => (
                <PhotographerCard key={photographer.id} photographer={photographer} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

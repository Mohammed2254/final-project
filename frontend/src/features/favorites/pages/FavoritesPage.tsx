import { useCallback, useEffect, useState } from 'react';

import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { ServiceCard } from '@/components/common/ServiceCard';
import { favoriteService } from '@/features/favorites/services/favorite.service';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ApiException } from '@/types/api';
import type { ServiceItem } from '@/types/service';

export default function FavoritesPage() {
  const { isAuthenticated, account } = useAuth();
  const canFavorite = isAuthenticated && account?.role === 'Customer';

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!canFavorite) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const items = await favoriteService.listServices();
      setServices(items);
    } catch (err) {
      setError(
        err instanceof ApiException ? err.message : 'تعذر تحميل المفضلة، يرجى المحاولة مرة أخرى.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [canFavorite]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <SectionHeader title="المفضلة" subtitle="الخدمات التي حفظتموها للرجوع إليها لاحقاً" />

      <div className="mt-6">
        {!canFavorite && (
          <EmptyState
            title="سجّلوا الدخول لعرض المفضلة"
            description="يجب تسجيل الدخول بحساب عميل لحفظ الخدمات ومتابعتها هنا."
          />
        )}

        {canFavorite && isLoading && <SkeletonGrid count={6} />}

        {canFavorite && !isLoading && error && <ErrorState message={error} onRetry={load} />}

        {canFavorite && !isLoading && !error && services.length === 0 && (
          <EmptyState
            title="لا توجد عناصر في المفضلة"
            description="تصفّحوا القاعات والمصورين واضغطوا على أيقونة القلب لحفظ ما يعجبكم."
          />
        )}

        {canFavorite && !isLoading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

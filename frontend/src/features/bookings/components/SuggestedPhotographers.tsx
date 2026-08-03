import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ServiceCard } from '@/components/common/ServiceCard';
import { Spinner } from '@/components/common/Loading';
import { serviceEndpoints } from '@/services/api/endpoints';
import { toServiceItem, type ServiceItem } from '@/types/service';
import { withMainImages } from '@/utils/attachServiceImages';
import { ROUTES } from '@/constants/routes';

/** Seeded at boot in a fixed order - see _seed_service_categories. */
const PHOTOGRAPHER_CATEGORY_ID = 2;

/**
 * Shown after a hall booking succeeds. A venue is booked but the day still
 * needs covering, so pointing at photographers is a more useful next step
 * than sending the customer back to browse more halls.
 */
export function SuggestedPhotographers({ limit = 3 }: { limit?: number }) {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await serviceEndpoints.byCategory(PHOTOGRAPHER_CATEGORY_ID);
      const active = data.data.filter((record) => record.is_active).map(toServiceItem);
      setItems(await withMainImages(active.slice(0, limit)));
    } catch {
      // A failed suggestion must never overshadow a successful booking -
      // render nothing rather than an error the customer can't act on.
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner size={22} />
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-foreground">أكملوا يومكم بمصوّر</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            حجزتم القاعة، والخطوة التالية عادةً هي تغطية المناسبة.
          </p>
        </div>
        <Link
          to={ROUTES.PHOTOGRAPHERS}
          className="shrink-0 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          عرض الكل
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ServiceCard key={item.id} service={item} />
        ))}
      </div>
    </section>
  );
}

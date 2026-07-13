import { serviceEndpoints } from '@/services/api/endpoints';
import { toServiceItem, type ServiceItem } from '@/types/service';

export interface HallListParams {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
}

function applyPriceRange(items: ServiceItem[], minPrice?: number, maxPrice?: number) {
  return items.filter((item) => {
    if (minPrice !== undefined && item.price < minPrice) return false;
    if (maxPrice !== undefined && item.price > maxPrice) return false;
    return true;
  });
}

/**
 * Business-logic layer over the generic Service API (see
 * back end/app/routes/service_routes.py). There is no hall-specific
 * endpoint yet - "halls" are every active Service record. Keyword
 * search goes through the backend's /services/search (name match);
 * price range has no backend support, so it's applied client-side.
 */
export const hallService = {
  async list(params: HallListParams = {}): Promise<ServiceItem[]> {
    const { data } =
      params.keyword && params.keyword.trim().length > 0
        ? await serviceEndpoints.search(params.keyword.trim())
        : await serviceEndpoints.list();

    const items = data.data.filter((record) => record.is_active).map(toServiceItem);
    return applyPriceRange(items, params.minPrice, params.maxPrice);
  },

  async getById(id: number | string): Promise<ServiceItem> {
    const { data } = await serviceEndpoints.details(id);
    return toServiceItem(data.data);
  },
};

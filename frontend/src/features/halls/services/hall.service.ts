import { hallEndpoints, serviceEndpoints } from '@/services/api/endpoints';
import { toServiceItem, type ServiceItem } from '@/types/service';
import { toHallItem, type HallItem } from '@/types/hall';
import { ApiException } from '@/types/api';

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

  async getById(id: number | string): Promise<HallItem> {
    const { data: serviceResponse } = await serviceEndpoints.details(id);

    try {
      const { data: detailsResponse } = await hallEndpoints.byService(id);
      return toHallItem(serviceResponse.data, detailsResponse.data);
    } catch (err) {
      // Not every service is a hall (or has hall_details yet) - render the
      // page with what we have instead of failing it entirely.
      if (err instanceof ApiException && err.status === 404) {
        return toHallItem(serviceResponse.data, null);
      }
      throw err;
    }
  },
};

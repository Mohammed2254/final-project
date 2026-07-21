import { photographerEndpoints, serviceEndpoints } from '@/services/api/endpoints';
import { toPhotographerItem, type PhotographerItem } from '@/types/photographer';
import { withMainImage, withMainImages } from '@/utils/attachServiceImages';

export interface PhotographerListParams {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
}

function applyFilters(
  items: PhotographerItem[],
  keyword?: string,
  minPrice?: number,
  maxPrice?: number,
) {
  const term = keyword?.trim().toLowerCase();
  return items.filter((item) => {
    if (term && !item.name.toLowerCase().includes(term)) return false;
    if (minPrice !== undefined && item.price < minPrice) return false;
    if (maxPrice !== undefined && item.price > maxPrice) return false;
    return true;
  });
}

/**
 * Business-logic layer over the Photographer resource. There is no
 * categories-list endpoint (see back end/app/routes/service_routes.py), so
 * the only reliable way to know which services are photographers is to
 * start from /api/photographers/ and join each row out to its Service
 * record. Keyword/price filtering happens client-side after the join,
 * since /services/search has no category awareness either.
 */
export const photographerService = {
  async list(params: PhotographerListParams = {}): Promise<PhotographerItem[]> {
    const { data: detailsResponse } = await photographerEndpoints.list();

    const results = await Promise.allSettled(
      detailsResponse.data.map(async (details) => {
        const { data: serviceResponse } = await serviceEndpoints.details(details.service_id);
        return toPhotographerItem(serviceResponse.data, details);
      }),
    );

    // A photographer_details row whose linked service was removed shouldn't
    // fail the whole listing - just skip that one row.
    const items = results
      .filter(
        (result): result is PromiseFulfilledResult<PhotographerItem> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value);

    const active = items.filter((item) => item.isActive);
    const withImages = await withMainImages(active);
    return applyFilters(withImages, params.keyword, params.minPrice, params.maxPrice);
  },

  async getById(serviceId: number | string): Promise<PhotographerItem> {
    const [{ data: serviceResponse }, { data: detailsResponse }] = await Promise.all([
      serviceEndpoints.details(serviceId),
      photographerEndpoints.byService(serviceId),
    ]);

    return withMainImage(toPhotographerItem(serviceResponse.data, detailsResponse.data));
  },
};

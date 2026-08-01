import { hallEndpoints, serviceEndpoints } from '@/services/api/endpoints';
import { toHallItem, type HallItem } from '@/features/halls/types';
import { ApiException } from '@/types/api';
import { withMainImage, withMainImages } from '@/utils/attachServiceImages';

/**
 * Business-logic layer over the Hall resource. Same real-join pattern as
 * photographer.service.ts: start from /api/halls/ (hall_details rows only)
 * and join each out to its Service record, so services from other
 * categories (photographers, etc.) never leak into the halls list.
 *
 * Keyword/price/sort are applied client-side by the caller (see
 * filterAndSortServices) against this same fetched list - not requested
 * here, since re-running this join on every keystroke would mean an extra
 * network round trip per hall, per character typed.
 */
export const hallService = {
  async list(): Promise<HallItem[]> {
    const { data: detailsResponse } = await hallEndpoints.list();

    const results = await Promise.allSettled(
      detailsResponse.data.map(async (details) => {
        const { data: serviceResponse } = await serviceEndpoints.details(details.service_id);
        return toHallItem(serviceResponse.data, details);
      }),
    );

    // A hall_details row whose linked service was removed shouldn't fail
    // the whole listing - just skip that one row.
    const items = results
      .filter((result): result is PromiseFulfilledResult<HallItem> => result.status === 'fulfilled')
      .map((result) => result.value);

    const active = items.filter((item) => item.isActive);
    return withMainImages(active);
  },

  async getById(id: number | string): Promise<HallItem> {
    const { data: serviceResponse } = await serviceEndpoints.details(id);

    try {
      const { data: detailsResponse } = await hallEndpoints.byService(id);
      return withMainImage(toHallItem(serviceResponse.data, detailsResponse.data));
    } catch (err) {
      // Not every service is a hall (or has hall_details yet) - render the
      // page with what we have instead of failing it entirely.
      if (err instanceof ApiException && err.status === 404) {
        return withMainImage(toHallItem(serviceResponse.data, null));
      }
      throw err;
    }
  },
};

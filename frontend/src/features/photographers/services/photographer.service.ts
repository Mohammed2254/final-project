import { photographerEndpoints, serviceEndpoints } from '@/services/api/endpoints';
import { toPhotographerItem, type PhotographerItem } from '@/features/photographers/types';
import { withMainImage, withMainImages } from '@/utils/attachServiceImages';

/**
 * Business-logic layer over the Photographer resource. There is no
 * categories-list endpoint (see back end/app/routes/service_routes.py), so
 * the only reliable way to know which services are photographers is to
 * start from /api/photographers/ and join each row out to its Service
 * record.
 *
 * Keyword/price/sort are applied client-side by the caller (see
 * filterAndSortServices) against this same fetched list - not requested
 * here, since re-running this join on every keystroke would mean an extra
 * network round trip per photographer, per character typed.
 */
export const photographerService = {
  async list(): Promise<PhotographerItem[]> {
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
    return withMainImages(active);
  },

  async getById(serviceId: number | string): Promise<PhotographerItem> {
    const [{ data: serviceResponse }, { data: detailsResponse }] = await Promise.all([
      serviceEndpoints.details(serviceId),
      photographerEndpoints.byService(serviceId),
    ]);

    return withMainImage(toPhotographerItem(serviceResponse.data, detailsResponse.data));
  },
};

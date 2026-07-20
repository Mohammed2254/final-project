import { favoriteEndpoints, serviceEndpoints } from '@/services/api/endpoints';
import { toServiceItem, type ServiceItem } from '@/types/service';

/**
 * Business-logic layer over the Favorite resource. The backend only stores
 * (user_profile_id, service_id) pairs (see favorite_routes.py) - there is no
 * nested service data in the response, so listing full service details goes
 * through the same real-join pattern as photographer.service.ts.
 */
export const favoriteService = {
  async listServiceIds(): Promise<number[]> {
    const { data } = await favoriteEndpoints.list();
    return data.data.map((favorite) => favorite.service_id);
  },

  async listServices(): Promise<ServiceItem[]> {
    const { data } = await favoriteEndpoints.list();

    const results = await Promise.allSettled(
      data.data.map(async (favorite) => {
        const { data: serviceResponse } = await serviceEndpoints.details(favorite.service_id);
        return toServiceItem(serviceResponse.data);
      }),
    );

    return results
      .filter((result): result is PromiseFulfilledResult<ServiceItem> => result.status === 'fulfilled')
      .map((result) => result.value);
  },

  async add(serviceId: number): Promise<void> {
    await favoriteEndpoints.add({ service_id: serviceId });
  },

  async remove(serviceId: number): Promise<void> {
    await favoriteEndpoints.remove(serviceId);
  },
};

import { serviceMediaEndpoints } from '@/services/api/endpoints';
import type { ServiceItem } from '@/types/service';

/**
 * The Service API has no media field of its own (see service_schema.py) -
 * the main image lives in service_media and must be joined in separately,
 * same real-join pattern used for hall/photographer details.
 */
export async function withMainImage<T extends ServiceItem>(item: T): Promise<T> {
  try {
    const { data } = await serviceMediaEndpoints.mainByService(item.id);
    return { ...item, imageUrl: data.data.media_url };
  } catch {
    // No main image set for this service yet - not an error, just no image.
    return item;
  }
}

export async function withMainImages<T extends ServiceItem>(items: T[]): Promise<T[]> {
  const results = await Promise.allSettled(items.map((item) => withMainImage(item)));

  return results.map((result, index) =>
    result.status === 'fulfilled' ? result.value : items[index],
  );
}

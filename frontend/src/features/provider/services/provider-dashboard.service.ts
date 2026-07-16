import {
  hallEndpoints,
  photographerEndpoints,
  serviceEndpoints,
  serviceMediaEndpoints,
} from '@/services/api/endpoints';
import { toServiceItem, type ServiceItem } from '@/types/service';
import type { ProviderServiceFormValues } from '@/features/provider/schemas/provider-service.schema';

function nullableText(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const providerDashboardService = {
  async listServices(providerProfileId: number): Promise<ServiceItem[]> {
    const { data } = await serviceEndpoints.byProvider(providerProfileId);
    return data.data.map(toServiceItem);
  },

  async createService(
    providerProfileId: number,
    values: ProviderServiceFormValues,
  ): Promise<ServiceItem> {
    const { data: serviceResponse } = await serviceEndpoints.create({
      provider_profile_id: providerProfileId,
      category_id: values.category_id,
      service_name: values.service_name,
      description: nullableText(values.description),
      price: values.price.toFixed(2),
    });

    const service = serviceResponse.data;

    if (values.serviceType === 'hall') {
      await hallEndpoints.create({
        service_id: service.service_id,
        min_capacity: values.min_capacity ?? 1,
        max_capacity: values.max_capacity ?? 1,
        city: values.city?.trim() ?? '',
        address: values.address?.trim() ?? '',
        latitude: nullableText(values.latitude),
        longitude: nullableText(values.longitude),
      });
    }

    if (values.serviceType === 'photographer') {
      await photographerEndpoints.create({
        service_id: service.service_id,
        coverage_hours: values.coverage_hours ?? 1,
        camera_type: nullableText(values.camera_type),
        has_video: Boolean(values.has_video),
        has_drone: Boolean(values.has_drone),
        portfolio_url: nullableText(values.portfolio_url),
      });
    }

    const mediaUrl = nullableText(values.media_url);
    if (mediaUrl) {
      await serviceMediaEndpoints.create({
        service_id: service.service_id,
        media_url: mediaUrl,
        media_type: 'IMAGE',
        is_main: values.is_main ?? true,
      });
    }

    return toServiceItem(service);
  },
};

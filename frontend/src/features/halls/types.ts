import { toServiceItem, type HallDetailsRecord, type ServiceItem, type ServiceRecord } from '@/types/service';

export interface HallItem extends ServiceItem {
  hallDetailsId: number | null;
  minCapacity: number | null;
  maxCapacity: number | null;
  city: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
}

export function toHallItem(
  serviceRecord: ServiceRecord,
  detailsRecord: HallDetailsRecord | null,
): HallItem {
  return {
    ...toServiceItem(serviceRecord),
    hallDetailsId: detailsRecord?.hall_details_id ?? null,
    minCapacity: detailsRecord?.min_capacity ?? null,
    maxCapacity: detailsRecord?.max_capacity ?? null,
    city: detailsRecord?.city ?? null,
    address: detailsRecord?.address ?? null,
    latitude: detailsRecord?.latitude ?? null,
    longitude: detailsRecord?.longitude ?? null,
  };
}

import { toServiceItem, type ServiceItem, type ServiceRecord } from '@/types/service';

/**
 * Mirrors back end/app/schemas/photographer_details_schema.py's
 * PhotographerDetailsResponseSchema exactly - no rating, city, style tags,
 * or pricing-package fields exist on the backend, so none are modeled here.
 */
export interface PhotographerDetailsRecord {
  photographer_details_id: number;
  service_id: number;
  camera_type: string | null;
  coverage_hours: number;
  has_video: boolean;
  has_drone: boolean;
  portfolio_url: string | null;
}

export interface PhotographerItem extends ServiceItem {
  photographerDetailsId: number;
  cameraType: string | null;
  coverageHours: number;
  hasVideo: boolean;
  hasDrone: boolean;
  portfolioUrl: string | null;
}

export function toPhotographerItem(
  serviceRecord: ServiceRecord,
  detailsRecord: PhotographerDetailsRecord,
): PhotographerItem {
  return {
    ...toServiceItem(serviceRecord),
    photographerDetailsId: detailsRecord.photographer_details_id,
    cameraType: detailsRecord.camera_type,
    coverageHours: detailsRecord.coverage_hours,
    hasVideo: detailsRecord.has_video,
    hasDrone: detailsRecord.has_drone,
    portfolioUrl: detailsRecord.portfolio_url,
  };
}

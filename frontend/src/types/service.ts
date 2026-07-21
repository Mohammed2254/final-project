
export interface ServiceRecord {
  service_id: number;
  provider_profile_id: number;
  category_id: number;
  service_name: string;
  description: string | null;
  price: string;
  is_active: boolean;
  created_at: string;
}

export interface ServiceCreatePayload {
  provider_profile_id: number;
  category_id: number;
  service_name: string;
  description?: string | null;
  price: string;
}

export interface HallDetailsRecord {
  hall_details_id: number;
  service_id: number;
  min_capacity: number;
  max_capacity: number;
  city: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
}

export interface HallDetailsCreatePayload {
  service_id: number;
  min_capacity: number;
  max_capacity: number;
  city: string;
  address: string;
  latitude?: string | null;
  longitude?: string | null;
}

export interface PhotographerDetailsCreatePayload {
  service_id: number;
  coverage_hours: number;
  camera_type?: string | null;
  has_video?: boolean;
  has_drone?: boolean;
  portfolio_url?: string | null;
}

export interface ServiceMediaRecord {
  media_id: number;
  service_id: number;
  media_url: string;
  media_type: string;
  is_main: boolean;
  created_at: string;
}

export interface ServiceMediaCreatePayload {
  service_id: number;
  media_url: string;
  media_type?: string;
  is_main?: boolean;
}

export interface ServiceMediaUpdatePayload {
  media_url?: string;
  media_type?: string;
  is_main?: boolean;
}

export interface ServiceCategoryRecord {
  category_id: number;
  category_name: string;
  description: string | null;
}


export interface ServiceItem {
  id: number;
  providerId: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  createdAt: string;
  /** Populated separately via serviceMediaEndpoints - the Service API itself has no media field. */
  imageUrl: string | null;
}

export function toServiceItem(record: ServiceRecord): ServiceItem {
  return {
    id: record.service_id,
    providerId: record.provider_profile_id,
    categoryId: record.category_id,
    name: record.service_name,
    description: record.description,
    price: Number(record.price),
    isActive: record.is_active,
    createdAt: record.created_at,
    imageUrl: null,
  };
}

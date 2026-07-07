
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


export interface ServiceItem {
  id: number;
  providerId: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  createdAt: string;
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
  };
}
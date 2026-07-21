export interface FavoriteRecord {
  favorite_id: number;
  user_profile_id: number;
  service_id: number;
  created_at: string;
}

export interface FavoriteCreatePayload {
  service_id: number;
}

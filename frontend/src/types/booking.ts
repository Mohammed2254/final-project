export interface BookingItemPayload {
  service_id: number;
  quantity: number;
  price_at_booking: string;
  notes?: string | null;
}

export interface BookingCreatePayload {
  event_date: string;
  notes?: string | null;
  items: BookingItemPayload[];
}

export interface BookingItem {
  booking_item_id: number;
  service_id: number;
  quantity: number;
  price_at_booking: string;
  notes: string | null;
}

export interface Booking {
  booking_id: number;
  customer_profile_id: number;
  event_date: string;
  status: string;
  notes: string | null;
  total_price: string;
  created_at: string;
  items: BookingItem[];
}
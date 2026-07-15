import { bookingEndpoints } from '@/services/api/endpoints';
import type { BookingCreatePayload } from '@/types/booking';

export const bookingService = {
  async create(payload: BookingCreatePayload) {
    const { data } = await bookingEndpoints.create(payload);
    return data.data;
  },

  async list() {
    const { data } = await bookingEndpoints.list();
    return data.data;
  },

  async details(bookingId: number | string) {
    const { data } = await bookingEndpoints.details(bookingId);
    return data.data;
  },

  async byCustomer(customerProfileId: number | string) {
    const { data } = await bookingEndpoints.byCustomer(customerProfileId);
    return data.data;
  },
};
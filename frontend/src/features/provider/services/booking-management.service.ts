import { bookingEndpoints } from '@/services/api/endpoints';
import type { Booking, BookingStatus } from '@/types/booking';

export const bookingManagementService = {
  async listMine(): Promise<Booking[]> {
    const { data } = await bookingEndpoints.providerMine();
    return data.data;
  },

  async updateStatus(bookingId: number, status: BookingStatus): Promise<Booking> {
    const { data } = await bookingEndpoints.updateStatus(bookingId, status);
    return data.data;
  },
};

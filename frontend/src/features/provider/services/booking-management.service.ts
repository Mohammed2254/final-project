import { bookingEndpoints } from '@/services/api/endpoints';
import type { Booking, BookingStatus } from '@/features/bookings/types';

export const bookingManagementService = {
  async listMine(): Promise<Booking[]> {
    const { data } = await bookingEndpoints.providerMine();
    return data.data;
  },

  async updateStatus(bookingId: number, status: BookingStatus, rejectionReason?: string): Promise<Booking> {
    const { data } = await bookingEndpoints.updateStatus(bookingId, status, rejectionReason);
    return data.data;
  },
};

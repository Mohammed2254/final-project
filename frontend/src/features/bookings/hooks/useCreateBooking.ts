import { useState } from 'react';

import { bookingService } from '@/features/bookings/services/booking.service';
import type {
  Booking,
  BookingCreatePayload,
} from '@/types/booking';

export function useCreateBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (
    payload: BookingCreatePayload,
  ): Promise<Booking | null> => {
    try {
      setIsLoading(true);
      setError(null);

      return await bookingService.create(payload);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'تعذر إتمام الحجز.',
      );

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading,
    error,
  };
}
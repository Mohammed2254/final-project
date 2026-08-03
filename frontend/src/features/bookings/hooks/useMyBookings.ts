import { useCallback, useEffect, useState } from 'react';

import { bookingService } from '@/features/bookings/services/booking.service';
import { ApiException } from '@/types/api';
import type { Booking } from '@/features/bookings/types';

export function useMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await bookingService.mine();
      setBookings(data);
    } catch (err) {
      setError(
        err instanceof ApiException
          ? err.message
          : 'تعذر تحميل الحجوزات، يرجى المحاولة مرة أخرى.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchBookings();
  }, [fetchBookings]);

  return { bookings, isLoading, error, reload: fetchBookings };
}

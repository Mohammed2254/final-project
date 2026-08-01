import { useCallback, useEffect, useState } from 'react';

import { bookingManagementService } from '@/features/provider/services/booking-management.service';
import { toastActions } from '@/store/toast.store';
import { ApiException } from '@/types/api';
import type { Booking, BookingStatus } from '@/features/bookings/types';

export function useProviderBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await bookingManagementService.listMine();
      setBookings(items);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : 'تعذر تحميل الحجوزات.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const updateStatus = useCallback(
    async (bookingId: number, status: BookingStatus, rejectionReason?: string) => {
      setUpdatingId(bookingId);
      setError(null);
      try {
        const updated = await bookingManagementService.updateStatus(bookingId, status, rejectionReason);
        setBookings((current) =>
          current.map((booking) => (booking.booking_id === bookingId ? updated : booking)),
        );
        toastActions.success(status === 'CONFIRMED' ? 'تم قبول الحجز.' : 'تم رفض الحجز.');
        return true;
      } catch (err) {
        setError(err instanceof ApiException ? err.message : 'تعذر تحديث حالة الحجز.');
        return false;
      } finally {
        setUpdatingId(null);
      }
    },
    [],
  );

  return { bookings, isLoading, updatingId, error, refresh: load, updateStatus };
}

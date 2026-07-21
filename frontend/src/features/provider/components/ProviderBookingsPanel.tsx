import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/common/Button';
import { Card, CardBody } from '@/components/common/Card';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { PriceText } from '@/components/common/PriceText';
import { useProviderBookings } from '@/features/provider/hooks/useProviderBookings';
import { formatPrice } from '@/utils/format';
import type { BookingStatus } from '@/types/booking';

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: 'بانتظار الرد',
  CONFIRMED: 'مؤكد',
  REJECTED: 'مرفوض',
};

const STATUS_CLASS: Record<BookingStatus, string> = {
  PENDING: 'text-muted-foreground',
  CONFIRMED: 'text-emerald-600',
  REJECTED: 'text-destructive',
};

export function ProviderBookingsPanel() {
  const { bookings, isLoading, updatingId, error, refresh, updateStatus } = useProviderBookings();

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">الحجوزات الواردة</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              راجع الحجوزات على خدماتك وأكّد أو ارفض كل طلب.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={refresh}>
            <RefreshCw />
            تحديث
          </Button>
        </div>

        {isLoading && <SkeletonGrid count={3} />}

        {!isLoading && error && bookings.length === 0 && (
          <ErrorState message={error} onRetry={refresh} />
        )}

        {!isLoading && bookings.length === 0 && !error && (
          <EmptyState
            title="لا توجد حجوزات بعد"
            description="ستظهر هنا الحجوزات الواردة من العملاء على خدماتك."
          />
        )}

        {!isLoading && bookings.length > 0 && (
          <div className="space-y-3">
            {error && (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            {bookings.map((booking) => (
              <div key={booking.booking_id} className="rounded-md border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-foreground">
                      {booking.customer_name ?? 'عميل'}
                    </p>
                    <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      تاريخ المناسبة: {booking.event_date}
                    </p>
                  </div>

                  <span className={`text-sm font-bold ${STATUS_CLASS[booking.status]}`}>
                    {STATUS_LABEL[booking.status]}
                  </span>
                </div>

                <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
                  {booking.items.map((item) => (
                    <li key={item.booking_item_id} className="flex items-center justify-between">
                      <span>
                        {item.service_name ?? `خدمة #${item.service_id}`} × {item.quantity}
                      </span>
                      <span>{formatPrice(Number(item.price_at_booking))}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                  <p className="font-bold text-foreground">
                    الإجمالي: <PriceText price={Number(booking.total_price)} />
                  </p>

                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        isLoading={updatingId === booking.booking_id}
                        onClick={() => updateStatus(booking.booking_id, 'CONFIRMED')}
                      >
                        قبول
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        isLoading={updatingId === booking.booking_id}
                        onClick={() => updateStatus(booking.booking_id, 'REJECTED')}
                      >
                        رفض
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

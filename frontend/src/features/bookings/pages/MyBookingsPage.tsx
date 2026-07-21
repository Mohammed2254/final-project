import { Link } from 'react-router-dom';

import { Card } from '@/components/common/Card';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { PriceText } from '@/components/common/PriceText';
import { SectionHeader } from '@/components/common/SectionHeader';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { useMyBookings } from '@/features/bookings/hooks/useMyBookings';
import { ROUTES } from '@/constants/routes';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'قيد الانتظار',
  CONFIRMED: 'مؤكد',
  CANCELLED: 'ملغي',
};

export default function MyBookingsPage() {
  const { bookings, isLoading, error, reload } = useMyBookings();

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <SectionHeader title="حجوزاتي" subtitle="تابع حالة حجوزاتك وتفاصيلها" />

      <div className="mt-6">
        {isLoading && <SkeletonGrid count={3} />}

        {!isLoading && error && <ErrorState message={error} onRetry={reload} />}

        {!isLoading && !error && bookings.length === 0 && (
          <EmptyState
            title="لا توجد حجوزات"
            description="لم تقم بأي حجز حتى الآن. تصفح القاعات وابدأ التخطيط لزفافك."
            action={
              <Link to={ROUTES.HALLS} className={cn(buttonVariants({ size: 'sm' }))}>
                تصفح القاعات
              </Link>
            }
          />
        )}

        {!isLoading && !error && bookings.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {bookings.map((booking) => (
              <Card key={booking.booking_id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">
                    حجز رقم #{booking.booking_id}
                  </p>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {STATUS_LABELS[booking.status] ?? booking.status}
                  </span>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  تاريخ المناسبة: {booking.event_date}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  عدد الخدمات: {booking.items?.length ?? 0}
                </p>

                {booking.notes && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {booking.notes}
                  </p>
                )}

                <div className="mt-3">
                  <PriceText price={Number(booking.total_price)} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

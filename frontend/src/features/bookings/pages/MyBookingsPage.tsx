import { Link } from 'react-router-dom';
import { Calendar, ClipboardList, StickyNote } from 'lucide-react';

import { StatusBadge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { PriceText } from '@/components/common/PriceText';
import { SectionHeader } from '@/components/common/SectionHeader';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { useMyBookings } from '@/features/bookings/hooks/useMyBookings';
import { ROUTES } from '@/constants/routes';

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
              <Card
                key={booking.booking_id}
                className="flex flex-col overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-3">
                  <p className="text-sm font-bold text-foreground">
                    حجز #{booking.booking_id}
                  </p>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={13} aria-hidden="true" className="shrink-0" />
                    تاريخ المناسبة: {booking.event_date}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ClipboardList size={13} aria-hidden="true" className="shrink-0" />
                    {booking.items?.length ?? 0} خدمة ضمن هذا الحجز
                  </div>

                  {booking.notes && (
                    <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground">
                      <StickyNote size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
                      <p className="line-clamp-3">{booking.notes}</p>
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">الإجمالي</span>
                    <PriceText price={Number(booking.total_price)} className="text-base" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

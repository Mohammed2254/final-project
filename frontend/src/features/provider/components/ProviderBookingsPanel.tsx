import { useState } from 'react';
import { CheckCircle2, Clock, RefreshCw, StickyNote, Wallet, XCircle } from 'lucide-react';

import { StatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card, CardBody } from '@/components/common/Card';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { PriceText } from '@/components/common/PriceText';
import { useProviderBookings } from '@/features/provider/hooks/useProviderBookings';
import { formatPrice } from '@/utils/format';

const STAT_ICON_CLASS = 'flex size-9 items-center justify-center rounded-lg';

/**
 * Reuses the bookings this panel already has in memory - no extra request.
 * Deliberately excludes REJECTED from revenue: it was never actually paid.
 */
function BookingStats({ bookings }: { bookings: ReturnType<typeof useProviderBookings>['bookings'] }) {
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const revenue = confirmedBookings.reduce((sum, b) => sum + Number(b.total_price), 0);

  const stats = [
    { icon: Clock, label: 'بانتظار الرد', value: pendingCount, tone: 'bg-warning-subtle text-warning' },
    { icon: CheckCircle2, label: 'حجوزات مؤكدة', value: confirmedBookings.length, tone: 'bg-success-subtle text-success' },
    { icon: Wallet, label: 'الإيرادات المؤكدة', value: formatPrice(revenue), tone: 'bg-gold/10 text-gold' },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map(({ icon: Icon, label, value, tone }) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-border p-3">
          <span className={`${STAT_ICON_CLASS} ${tone}`}>
            <Icon size={17} aria-hidden="true" />
          </span>
          <div>
            <p className="text-lg font-extrabold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProviderBookingsPanel() {
  const { bookings, isLoading, updatingId, error, refresh, updateStatus } = useProviderBookings();

  // Only one booking's reject form is open at a time - simpler than a
  // per-booking state map, and matches how confirmation UI works elsewhere
  // in the app (e.g. the wedding-plan delete confirmation).
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [reason, setReason] = useState('');

  const startRejecting = (bookingId: number) => {
    setRejectingId(bookingId);
    setReason('');
  };

  const confirmRejection = async (bookingId: number) => {
    const ok = await updateStatus(bookingId, 'REJECTED', reason);
    if (ok) {
      setRejectingId(null);
      setReason('');
    }
  };

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

        {!isLoading && bookings.length > 0 && <BookingStats bookings={bookings} />}

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

                  <StatusBadge
                    status={
                      booking.status === 'CONFIRMED' && !booking.is_paid
                        ? 'AWAITING_PAYMENT'
                        : booking.status
                    }
                  />
                </div>

                {/* The customer's own note when booking - was captured on
                    creation but never surfaced anywhere in this panel. */}
                {booking.notes && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-muted/40 p-2.5 text-xs text-muted-foreground">
                    <StickyNote size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
                    <p>{booking.notes}</p>
                  </div>
                )}

                {booking.status === 'REJECTED' && booking.rejection_reason && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                    <XCircle size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
                    <p>سبب الرفض: {booking.rejection_reason}</p>
                  </div>
                )}

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

                  {booking.status === 'PENDING' && rejectingId !== booking.booking_id && (
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
                        onClick={() => startRejecting(booking.booking_id)}
                      >
                        رفض
                      </Button>
                    </div>
                  )}
                </div>

                {rejectingId === booking.booking_id && (
                  <div className="mt-3 space-y-2 rounded-md border border-destructive/40 bg-destructive/5 p-3">
                    <label
                      htmlFor={`reject-reason-${booking.booking_id}`}
                      className="text-xs font-medium text-foreground"
                    >
                      سبب الرفض (يظهر للعميل)
                    </label>
                    <textarea
                      id={`reject-reason-${booking.booking_id}`}
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      rows={2}
                      placeholder="مثال: التاريخ المطلوب محجوز مسبقاً"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        isLoading={updatingId === booking.booking_id}
                        disabled={!reason.trim()}
                        onClick={() => confirmRejection(booking.booking_id)}
                      >
                        تأكيد الرفض
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setRejectingId(null)}
                      >
                        تراجع
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

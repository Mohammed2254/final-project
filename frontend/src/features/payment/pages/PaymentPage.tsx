import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Lock } from 'lucide-react';

import { Card, CardBody } from '@/components/common/Card';
import { GoldButton } from '@/components/common/GoldButton';
import { PriceText } from '@/components/common/PriceText';
import { ErrorState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Loading';
import { SectionHeader } from '@/components/common/SectionHeader';
import { bookingService } from '@/features/bookings/services/booking.service';
import { usePayBooking } from '@/features/payment/hooks/usePayBooking';
import { ApiException } from '@/types/api';
import type { Booking } from '@/features/bookings/types';

const inputClass =
  'mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground';

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [cvc, setCvc] = useState('');

  const { payNow, isSubmitting, error: payError } = usePayBooking(Number(bookingId));

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;

    (async () => {
      try {
        const data = await bookingService.details(bookingId);
        if (!cancelled) setBooking(data);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof ApiException ? err.message : 'تعذر تحميل بيانات الحجز.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const canSubmit =
    name.trim().length > 0 &&
    number.replace(/\s+/g, '').length >= 12 &&
    month.trim().length > 0 &&
    year.trim().length === 4 &&
    cvc.trim().length >= 3;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!booking || !canSubmit) return;

    payNow(Number(booking.total_price), `حجز #${booking.booking_id} - فرح`, {
      name: name.trim(),
      number: number.replace(/\s+/g, ''),
      month: month.trim(),
      year: year.trim(),
      cvc: cvc.trim(),
    });
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <SectionHeader title="إتمام الدفع" subtitle="ادفعوا بأمان عبر ميسر" />

      <div className="mt-6">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {!isLoading && loadError && <ErrorState message={loadError} />}

        {!isLoading && !loadError && booking && (
          <Card>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm text-muted-foreground">المبلغ المطلوب</span>
                <PriceText price={Number(booking.total_price)} className="text-lg" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="card-name" className="text-sm font-medium text-foreground">
                    الاسم على البطاقة
                  </label>
                  <input
                    id="card-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="كما هو مكتوب على البطاقة"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="card-number" className="text-sm font-medium text-foreground">
                    رقم البطاقة
                  </label>
                  <input
                    id="card-number"
                    value={number}
                    onChange={(event) => setNumber(event.target.value)}
                    inputMode="numeric"
                    placeholder="4111 1111 1111 1111"
                    maxLength={19}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor="card-month" className="text-sm font-medium text-foreground">
                      الشهر
                    </label>
                    <input
                      id="card-month"
                      value={month}
                      onChange={(event) => setMonth(event.target.value)}
                      inputMode="numeric"
                      placeholder="MM"
                      maxLength={2}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="card-year" className="text-sm font-medium text-foreground">
                      السنة
                    </label>
                    <input
                      id="card-year"
                      value={year}
                      onChange={(event) => setYear(event.target.value)}
                      inputMode="numeric"
                      placeholder="YYYY"
                      maxLength={4}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="card-cvc" className="text-sm font-medium text-foreground">
                      CVC
                    </label>
                    <input
                      id="card-cvc"
                      value={cvc}
                      onChange={(event) => setCvc(event.target.value)}
                      inputMode="numeric"
                      placeholder="123"
                      maxLength={4}
                      className={inputClass}
                    />
                  </div>
                </div>

                {payError && (
                  <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {payError}
                  </p>
                )}

                <GoldButton
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}
                  loadingText="جارٍ التحويل..."
                  disabled={!canSubmit}
                >
                  ادفع الآن
                </GoldButton>

                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock size={12} aria-hidden="true" />
                  الدفع مؤمّن عبر ميسر، بيانات بطاقتكم لا تصل خوادمنا
                </p>
              </form>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';

import { Card, CardBody } from '@/components/common/Card';
import { GoldButton } from '@/components/common/GoldButton';
import { PriceText } from '@/components/common/PriceText';
import { ErrorState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Loading';
import { SectionHeader } from '@/components/common/SectionHeader';
import { TextInput } from '@/components/forms/TextInput';
import { Button } from '@/components/common/Button';
import { bookingService } from '@/features/bookings/services/booking.service';
import { usePayBooking } from '@/features/payment/hooks/usePayBooking';
import { PAYMENT_DEMO_MODE } from '@/features/payment/constants';
import {
  cardSchema,
  digitsOnly,
  toFourDigitYear,
  type CardFormValues,
} from '@/features/payment/schemas/card.schema';
import { ApiException } from '@/types/api';
import type { Booking } from '@/features/bookings/types';

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: { name: '', number: '', month: '', year: '', cvc: '' },
  });

  const { payNow, payAsDemo, isSubmitting, error: payError } = usePayBooking(Number(bookingId));

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

  const onSubmit = handleSubmit((values) => {
    if (!booking) return;

    payNow(Number(booking.total_price), `حجز #${booking.booking_id} - فرح`, {
      name: values.name.trim(),
      number: digitsOnly(values.number),
      month: digitsOnly(values.month),
      year: toFourDigitYear(values.year),
      cvc: digitsOnly(values.cvc),
    });
  });

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

              <form onSubmit={onSubmit} noValidate className="space-y-3">
                <TextInput
                  label="الاسم على البطاقة"
                  autoComplete="cc-name"
                  placeholder="كما هو مكتوب على البطاقة"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <TextInput
                  label="رقم البطاقة"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4111 1111 1111 1111"
                  maxLength={23}
                  error={errors.number?.message}
                  {...register('number')}
                />

                <div className="grid grid-cols-3 gap-2">
                  <TextInput
                    label="الشهر"
                    inputMode="numeric"
                    autoComplete="cc-exp-month"
                    placeholder="MM"
                    maxLength={2}
                    error={errors.month?.message}
                    {...register('month')}
                  />
                  <TextInput
                    label="السنة"
                    inputMode="numeric"
                    autoComplete="cc-exp-year"
                    placeholder="YY"
                    maxLength={2}
                    error={errors.year?.message}
                    {...register('year')}
                  />
                  <TextInput
                    label="CVC"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    maxLength={4}
                    error={errors.cvc?.message}
                    {...register('cvc')}
                  />
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
                >
                  ادفع الآن
                </GoldButton>

                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Lock size={12} aria-hidden="true" />
                  الدفع مؤمّن عبر ميسر، بيانات بطاقتكم لا تصل خوادمنا
                </p>
              </form>

              {PAYMENT_DEMO_MODE && (
                <div className="space-y-2 rounded-md border border-dashed border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">
                    وضع العرض التجريبي مفعّل. مفاتيح ميسر التجريبية ترفض البطاقات الحقيقية، لذا
                    يكمل هذا الزر العملية بنفس المسار دون تحصيل فعلي.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    isLoading={isSubmitting}
                    onClick={payAsDemo}
                  >
                    إتمام الدفع (عرض تجريبي)
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ServiceImage } from '@/components/common/ServiceImage';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCreateBooking } from '@/features/bookings/hooks/useCreateBooking';
import { serviceEndpoints, serviceMediaEndpoints } from '@/services/api/endpoints';
import { ROUTES } from '@/constants/routes';
import type { ServiceRecord } from '@/types/service';

/*
 * هذه الإضافات تجعل الصفحة متوافقة مع أكثر من تسمية محتملة
 * لحقول الخدمة، مثل service_id أو id، وbase_price أو price.
 */
type BookableService = ServiceRecord & {
  id?: number;
  service_id?: number;

  name?: string;
  title?: string;
  service_name?: string;

  price?: string | number;
  base_price?: string | number;

  description?: string | null;
};

function getServiceId(service: BookableService): number | null {
  const value = service.service_id ?? service.id;

  if (value === undefined || value === null) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function getServiceName(service: BookableService): string {
  return (
    service.name ??
    service.title ??
    service.service_name ??
    'القاعة المختارة'
  );
}

function getServicePrice(service: BookableService): string {
  const value = service.base_price ?? service.price;

  if (value === undefined || value === null) {
    return '0.00';
  }

  return String(value);
}

export default function BookingPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const { account } = useAuth();

  const {
    createBooking,
    isLoading,
    error,
  } = useCreateBooking();

  const [service, setService] =
    useState<BookableService | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');

  const [isLoadingService, setIsLoadingService] =
    useState(true);

  const [pageError, setPageError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadService() {
      if (!serviceId) {
        setPageError('لم يتم تحديد القاعة المراد حجزها.');
        setIsLoadingService(false);
        return;
      }

      try {
        setIsLoadingService(true);
        setPageError(null);

        const { data } =
          await serviceEndpoints.details(serviceId);

        setService(data.data);

        try {
          const { data: mediaResponse } = await serviceMediaEndpoints.mainByService(serviceId);
          setImageUrl(mediaResponse.data.media_url);
        } catch {
          // No main image set for this service yet - not an error, just no image.
        }
      } catch {
        setPageError('تعذر تحميل بيانات القاعة.');
      } finally {
        setIsLoadingService(false);
      }
    }

    void loadService();
  }, [serviceId]);

  const handleConfirmBooking = async () => {
    setPageError(null);
    setSuccessMessage(null);

    if (!account) {
      setPageError('يجب تسجيل الدخول لإتمام الحجز.');
      return;
    }

    if (account.role !== 'Customer') {
      setPageError('الحجز متاح لحسابات العملاء فقط.');
      return;
    }

    if (!service) {
      setPageError('بيانات القاعة غير متاحة.');
      return;
    }

    if (!eventDate) {
      setPageError('يرجى اختيار تاريخ المناسبة.');
      return;
    }

    const selectedServiceId = getServiceId(service);

    if (!selectedServiceId) {
      setPageError('معرف القاعة غير صحيح.');
      return;
    }

    const booking = await createBooking({
      event_date: eventDate,
      notes: notes.trim() || null,

      items: [
        {
          service_id: selectedServiceId,
          quantity: 1,
          price_at_booking: getServicePrice(service),
          notes: null,
        },
      ],
    });

    if (!booking) {
      return;
    }

    setSuccessMessage(
      `تم إنشاء الحجز بنجاح. رقم الحجز: ${booking.booking_id}`,
    );
  };

  if (isLoadingService) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <p role="status">
          جارٍ تحميل بيانات القاعة...
        </p>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <Card className="space-y-4 p-6">
          <p
            role="alert"
            className="text-destructive"
          >
            {pageError ?? 'القاعة غير موجودة.'}
          </p>

          <Button
            type="button"
            onClick={() => navigate(ROUTES.HALLS)}
          >
            العودة إلى القاعات
          </Button>
        </Card>
      </main>
    );
  }

  const serviceName = getServiceName(service);
  const servicePrice = getServicePrice(service);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <header>
        <h1 className="text-2xl font-extrabold text-foreground">
          تأكيد حجز القاعة
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          راجع بيانات القاعة، واختر تاريخ المناسبة، ثم أكد الحجز.
        </p>
      </header>

      <Card className="mt-6 overflow-hidden">
        <ServiceImage
          imageUrl={imageUrl}
          className="h-52 w-full"
          label={serviceName}
        />

        <div className="space-y-3 p-5">
          <h2 className="text-lg font-bold text-foreground">
            {serviceName}
          </h2>

          {service.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          )}

          <p className="font-bold text-foreground">
            السعر: {servicePrice} ريال
          </p>
        </div>
      </Card>

      <Card className="mt-6 space-y-5 p-5">
        {(pageError || error) && (
          <p
            role="alert"
            className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {pageError || error}
          </p>
        )}

        {successMessage ? (
          <div
            role="status"
            className="rounded-md border border-border px-4 py-4"
          >
            <p className="font-bold text-foreground">
              {successMessage}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={() => navigate(ROUTES.HOME)}
              >
                العودة إلى الصفحة الرئيسية
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.HALLS)}
              >
                تصفح قاعات أخرى
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label
                htmlFor="event-date"
                className="text-sm font-medium text-foreground"
              >
                تاريخ المناسبة
              </label>

              <input
                id="event-date"
                type="date"
                value={eventDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(event) =>
                  setEventDate(event.target.value)
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="booking-notes"
                className="text-sm font-medium text-foreground"
              >
                ملاحظات إضافية
              </label>

              <textarea
                id="booking-notes"
                rows={4}
                maxLength={500}
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="اكتب أي ملاحظات تخص الحجز"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
              />

              <p className="text-xs text-muted-foreground">
                {notes.length}/500
              </p>
            </div>

            <Button
              type="button"
              className="w-full"
              isLoading={isLoading}
              loadingText="جارٍ تأكيد الحجز..."
              onClick={handleConfirmBooking}
            >
              تأكيد الحجز
            </Button>
          </>
        )}
      </Card>
    </main>
  );
}

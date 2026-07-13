import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Card } from '@/components/common/Card';
import { PlaceholderImage } from '@/components/common/PlaceholderImage';
import { ErrorState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Loading';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { useHallDetails } from '@/features/halls/hooks/useHallDetails';

export default function HallDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { hall, isLoading, error, notFound, reload } = useHallDetails(id);

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <Link
        to={ROUTES.HALLS}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight size={16} aria-hidden="true" />
        العودة إلى القاعات
      </Link>

      <div className="mt-5">
        {isLoading && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner size={28} />
          </div>
        )}

        {!isLoading && notFound && (
          <Card className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-base font-bold text-foreground">القاعة غير موجودة</p>
            <p className="text-sm text-muted-foreground">
              ربما تم حذف هذه القاعة أو أن الرابط غير صحيح.
            </p>
            <Link to={ROUTES.HALLS} className={cn(buttonVariants({ size: 'sm' }))}>
              تصفح القاعات
            </Link>
          </Card>
        )}

        {!isLoading && !notFound && error && <ErrorState message={error} onRetry={reload} />}

        {!isLoading && !notFound && !error && hall && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <PlaceholderImage className="h-72 w-full rounded-lg lg:h-96" label={hall.name} />

              <h1 className="mt-5 text-xl font-extrabold text-foreground lg:text-2xl">
                {hall.name}
              </h1>

              {hall.description && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {hall.description}
                </p>
              )}

              {/*
                The Service model has no capacity/city/amenities/gallery
                fields yet (see back end/app/models/service.py and the
                empty hall_details.py), so this page only renders what the
                backend actually returns rather than inventing details.
              */}
            </div>

            <Card className="h-fit space-y-4 p-5">
              <div>
                <p className="text-xs text-muted-foreground">السعر</p>
                <p className="text-lg font-extrabold text-foreground">
                  {formatPrice(hall.price)}
                </p>
              </div>

              {/*
                Booking has no backend endpoint yet
                (back end/app/routes/booking_routes.py is empty), so this
                links to a Coming Soon page instead of a form with
                nowhere to submit to.
              */}
              <Link
                to={ROUTES.BOOKING}
                className={cn(buttonVariants({ size: 'default' }), 'w-full')}
              >
                احجزوا الآن
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Card } from '@/components/common/Card';
import { ServiceImage } from '@/components/common/ServiceImage';
import { PriceText } from '@/components/common/PriceText';
import { ErrorState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Loading';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { useHallDetails } from '@/features/halls/hooks/useHallDetails';

export default function HallDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    hall,
    isLoading,
    error,
    notFound,
    reload,
  } = useHallDetails(id);

  return (
    <main className="container mx-auto px-4 py-8 lg:px-8">
      <Link
        to={ROUTES.HALLS}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight
          size={16}
          aria-hidden="true"
        />

        العودة إلى القاعات
      </Link>

      <div className="mt-5">
        {isLoading && (
          <div
            className="flex min-h-[40vh] items-center justify-center"
            role="status"
            aria-label="جارٍ تحميل بيانات القاعة"
          >
            <Spinner size={28} />
          </div>
        )}

        {!isLoading && notFound && (
          <Card className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-base font-bold text-foreground">
              القاعة غير موجودة
            </p>

            <p className="text-sm text-muted-foreground">
              ربما تم حذف هذه القاعة أو أن الرابط غير صحيح.
            </p>

            <Link
              to={ROUTES.HALLS}
              className={cn(
                buttonVariants({
                  size: 'sm',
                }),
              )}
            >
              تصفح القاعات
            </Link>
          </Card>
        )}

        {!isLoading && !notFound && error && (
          <ErrorState
            message={error}
            onRetry={reload}
          />
        )}

        {!isLoading && !notFound && !error && hall && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
            <section>
              <ServiceImage
                imageUrl={hall.imageUrl}
                className="h-72 w-full rounded-lg lg:h-96"
                label={hall.name}
              />

              <h1 className="mt-5 text-xl font-extrabold text-foreground lg:text-2xl">
                {hall.name}
              </h1>

              {hall.description && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {hall.description}
                </p>
              )}

              {(hall.city || hall.address || (hall.minCapacity && hall.maxCapacity)) && (
                <Card className="mt-5 space-y-2 p-5">
                  <p className="text-sm font-bold text-foreground">تفاصيل القاعة</p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {hall.city && <li>المدينة: {hall.city}</li>}
                    {hall.address && <li>العنوان: {hall.address}</li>}
                    {hall.minCapacity && hall.maxCapacity && (
                      <li>
                        السعة: من {hall.minCapacity} إلى {hall.maxCapacity} شخص
                      </li>
                    )}
                  </ul>
                </Card>
              )}
            </section>

            <Card className="h-fit space-y-4 p-5">
              <div>
                <p className="text-xs text-muted-foreground">
                  السعر
                </p>

                <PriceText
                  price={hall.price}
                  className="text-lg"
                />
              </div>

              <Link
                to={ROUTES.BOOKING(hall.id)}
                className={cn(
                  buttonVariants({
                    variant: 'gold',
                    size: 'default',
                  }),
                  'w-full',
                )}
              >
                احجزوا الآن
              </Link>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
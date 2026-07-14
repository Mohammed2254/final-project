import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Card } from '@/components/common/Card';
import { PlaceholderImage } from '@/components/common/PlaceholderImage';
import { PriceText } from '@/components/common/PriceText';
import { ErrorState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Loading';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { usePhotographerDetails } from '@/features/photographers/hooks/usePhotographerDetails';

export default function PhotographerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { photographer, isLoading, error, notFound, reload } = usePhotographerDetails(id);

  const features = photographer
    ? [
        `مدة التغطية: ${photographer.coverageHours} ساعة`,
        photographer.cameraType ? `نوع الكاميرا: ${photographer.cameraType}` : null,
        photographer.hasVideo ? 'يشمل تصوير فيديو' : null,
        photographer.hasDrone ? 'يشمل تصوير بالدرون' : null,
      ].filter((line): line is string => line !== null)
    : [];

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <Link
        to={ROUTES.PHOTOGRAPHERS}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight size={16} aria-hidden="true" />
        العودة إلى المصورين
      </Link>

      <div className="mt-5">
        {isLoading && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner size={28} />
          </div>
        )}

        {!isLoading && notFound && (
          <Card className="flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-base font-bold text-foreground">المصور غير موجود</p>
            <p className="text-sm text-muted-foreground">
              ربما تم حذف هذا المصور أو أن الرابط غير صحيح.
            </p>
            <Link to={ROUTES.PHOTOGRAPHERS} className={cn(buttonVariants({ size: 'sm' }))}>
              تصفح المصورين
            </Link>
          </Card>
        )}

        {!isLoading && !notFound && error && <ErrorState message={error} onRetry={reload} />}

        {!isLoading && !notFound && !error && photographer && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-5">
              <PlaceholderImage
                className="h-72 w-full rounded-lg lg:h-96"
                label={photographer.name}
              />

              <div>
                <h1 className="text-xl font-extrabold text-foreground lg:text-2xl">
                  {photographer.name}
                </h1>

                {photographer.description && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {photographer.description}
                  </p>
                )}
              </div>

              {features.length > 0 && (
                <Card className="space-y-2 p-5">
                  <p className="text-sm font-bold text-foreground">تفاصيل الخدمة</p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </Card>
              )}

              {photographer.portfolioUrl && (
                <a
                  href={photographer.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-sm font-medium text-gold underline-offset-4 hover:underline"
                >
                  عرض معرض الأعمال
                </a>
              )}

              {/*
                No rating/review, city, style-tag, or multi-package pricing
                fields exist on the backend (see photographer_details_schema.py) -
                only what the API actually returns is rendered here.
              */}
            </div>

            <Card className="h-fit space-y-4 p-5">
              <div>
                <p className="text-xs text-muted-foreground">السعر</p>
                <PriceText price={photographer.price} className="text-lg" />
              </div>

              <Link
                to={ROUTES.BOOKING}
                className={cn(buttonVariants({ variant: 'gold', size: 'default' }), 'w-full')}
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

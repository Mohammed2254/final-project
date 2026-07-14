import { Link } from 'react-router-dom';
import { Mail, Users, Settings, TrendingUp } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button-variants';
import { Card } from '@/components/common/Card';
import { PlaceholderImage } from '@/components/common/PlaceholderImage';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ServiceCard } from '@/components/common/ServiceCard';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { useFeaturedServices } from '@/hooks/useFeaturedServices';
import type { ServiceItem } from '@/types/service';

const HOW_IT_WORKS = [
  { icon: Mail, label: 'ادعو شريككم' },
  { icon: Users, label: 'خططوا معاً' },
  { icon: Settings, label: 'اختاروا الخدمات' },
  { icon: TrendingUp, label: 'تابعوا تقدمكم' },
] as const;

// Static for now: the backend has no categories-list endpoint, so this
// isn't data-driven yet. Both destinations resolve to a real page -
// /halls is the full listing, /photographers is a Coming Soon
// placeholder until the backend can tell service categories apart.
const CATEGORIES = [
  { label: 'قاعات الأفراح', to: ROUTES.HALLS },
  { label: 'التصوير', to: ROUTES.PHOTOGRAPHERS },
] as const;

function FeaturedGrid({
  services,
  isLoading,
  error,
  onRetry,
  emptyMessage,
}: {
  services: ServiceItem[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  emptyMessage: string;
}) {
  if (isLoading) return <SkeletonGrid count={4} />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (services.length === 0) return <EmptyState title={emptyMessage} />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { services, isLoading, error, reload } = useFeaturedServices();

  // Same fetch powers both sections below (see useFeaturedServices) -
  // sliced in half just to keep the two sections visually distinct until
  // the backend can tell halls and photography services apart.
  const featuredHalls = services.slice(0, 4);
  const featuredServices = services.slice(4, 8);

  return (
    <div>
      {/* Hero */}
      <section className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:px-8 lg:py-16">
        <PlaceholderImage className="h-64 w-full rounded-lg lg:h-72" label="فرح" />
        <div>
          <h1 className="text-2xl font-extrabold leading-relaxed text-foreground lg:text-3xl">
            خططوا زفافكم معاً
            <br />
            في مكان واحد
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            منصة فرح تساعدكم على التخطيط المشترك لزفافكم.
            <br />
            اختاروا أفضل مزودي الخدمات وشاركوا كل التفاصيل مع شريككم.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to={ROUTES.HALLS} className={cn(buttonVariants({ variant: 'gold', size: 'lg' }))}>
              ابدأوا التخطيط
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              ابدأوا الآن
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-8 lg:px-8">
        <h2 className="text-center text-lg font-extrabold text-foreground">كيف تعمل فرح؟</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {HOW_IT_WORKS.map(({ icon: Icon, label }) => (
            <Card key={label} className="flex flex-col items-center gap-2.5 p-4 text-center">
              <span className="flex size-10 items-center justify-center rounded-lg border border-border">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-foreground">{label}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8 lg:px-8">
        <SectionHeader title="تصفحوا حسب الفئة" />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CATEGORIES.map((category) => (
            <Link key={category.label} to={category.to}>
              <Card className="flex h-28 items-center justify-center text-base font-bold text-foreground transition-colors hover:border-foreground/30">
                {category.label}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Halls */}
      <section className="container mx-auto px-4 py-8 lg:px-8">
        <SectionHeader
          title="قاعات مميزة"
          subtitle="أبرز القاعات المتاحة على المنصة"
          action={
            <Link
              to={ROUTES.HALLS}
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              عرض الكل
            </Link>
          }
        />
        <div className="mt-5">
          <FeaturedGrid
            services={featuredHalls}
            isLoading={isLoading}
            error={error}
            onRetry={reload}
            emptyMessage="لا توجد قاعات متاحة حالياً"
          />
        </div>
      </section>

      {/* Featured Services */}
      <section className="container mx-auto px-4 py-8 lg:px-8">
        <SectionHeader
          title="خدمات مميزة"
          subtitle="مزودو خدمات موصى بهم لزفافكم"
          action={
            <Link
              to={ROUTES.HALLS}
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              عرض الكل
            </Link>
          }
        />
        <div className="mt-5">
          <FeaturedGrid
            services={featuredServices}
            isLoading={isLoading}
            error={error}
            onRetry={reload}
            emptyMessage="لا توجد خدمات متاحة حالياً"
          />
        </div>
      </section>

      {/* CTA */}
<section className="container mx-auto px-4 py-10 lg:px-8">
  <Card className="flex flex-col items-center gap-5 bg-muted/40 p-8 text-center">
    <div>
      <p className="text-base font-extrabold text-foreground">
        ابدأوا رحلتكم مع فرح
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        أنشئوا حسابًا للتخطيط لحفل زفافكم، أو انضموا للمنصة كمقدم خدمة.
      </p>
    </div>

    <div className="flex flex-wrap justify-center gap-3">
      <Link
        to={ROUTES.REGISTER}
        className={cn(
          buttonVariants({
            variant: 'gold',
            size: 'lg',
          }),
        )}
      >
        إنشاء حساب
      </Link>

      <Link
        to={ROUTES.PROVIDER_REGISTER}
        className={cn(
          buttonVariants({
            variant: 'outline',
            size: 'lg',
          }),
        )}
      >
        انضم كمقدم خدمة
      </Link>
    </div>
  </Card>
</section>
    </div>
  );
}
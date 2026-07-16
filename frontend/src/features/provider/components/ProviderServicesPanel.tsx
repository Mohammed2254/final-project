import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/common/Button';
import { Card, CardBody } from '@/components/common/Card';
import { EmptyState, SkeletonGrid } from '@/components/common/EmptyState';
import { formatPrice } from '@/utils/format';
import type { ServiceItem } from '@/types/service';

interface ProviderServicesPanelProps {
  services: ServiceItem[];
  isLoading: boolean;
  onReload: () => void;
}

export function ProviderServicesPanel({
  services,
  isLoading,
  onReload,
}: ProviderServicesPanelProps) {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">خدماتي</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              متابعة الخدمات التي أضفتها وربطها بملف مقدم الخدمة.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onReload}>
            <RefreshCw />
            تحديث
          </Button>
        </div>

        {isLoading && <SkeletonGrid count={3} />}

        {!isLoading && services.length === 0 && (
          <EmptyState
            title="لا توجد خدمات بعد"
            description="ابدأ بإضافة أول خدمة حتى تظهر للعملاء ضمن القاعات أو المصورين."
          />
        )}

        {!isLoading && services.length > 0 && (
          <div className="overflow-hidden rounded-md border border-border">
            <div className="grid grid-cols-[1fr_120px_110px] gap-3 bg-muted px-4 py-3 text-xs font-bold text-muted-foreground">
              <span>الخدمة</span>
              <span>السعر</span>
              <span>الحالة</span>
            </div>
            <div className="divide-y divide-border">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="grid grid-cols-[1fr_120px_110px] gap-3 px-4 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{service.name}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {service.description ?? 'لا يوجد وصف'}
                    </p>
                  </div>
                  <span className="text-foreground">{formatPrice(service.price)}</span>
                  <span
                    className={
                      service.isActive
                        ? 'text-emerald-600'
                        : 'text-muted-foreground'
                    }
                  >
                    {service.isActive ? 'نشطة' : 'غير نشطة'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

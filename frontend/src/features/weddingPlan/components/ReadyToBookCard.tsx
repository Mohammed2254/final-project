import { ShoppingBag } from 'lucide-react';

import { Card, CardBody } from '@/components/common/Card';
import { GoldButton } from '@/components/common/GoldButton';
import { PriceText } from '@/components/common/PriceText';

interface ReadyToBookCardProps {
  approvedCount: number;
  approvedTotal: number;
  eventDate: string;
  isMutating: boolean;
  onBook: () => void;
}

/**
 * Without this the plan is a dead end: partners agree on services and then
 * have no way to actually book them.
 */
export function ReadyToBookCard({
  approvedCount,
  approvedTotal,
  eventDate,
  isMutating,
  onBook,
}: ReadyToBookCardProps) {
  return (
    <Card className="border-gold/40 bg-gold/5">
      <CardBody className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 font-bold text-foreground">
            <ShoppingBag size={16} aria-hidden="true" />
            جاهزون للحجز
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {approvedCount} خدمة متفق عليها بقيمة <PriceText price={approvedTotal} />، ستُحجز
            جميعها بتاريخ {eventDate}
          </p>
        </div>

        <GoldButton
          type="button"
          isLoading={isMutating}
          loadingText="جارٍ إنشاء الحجز..."
          onClick={onBook}
        >
          احجزوا الخدمات المعتمدة
        </GoldButton>
      </CardBody>
    </Card>
  );
}

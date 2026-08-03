import { StatusBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Card, CardBody } from '@/components/common/Card';
import { PriceText } from '@/components/common/PriceText';
import type { WeddingPlanSelectionWithService } from '@/features/weddingPlan/services/weddingPlan.service';

interface SelectionCardProps {
  item: WeddingPlanSelectionWithService;
  currentProfileId: number | null;
  onReview: (planServiceId: number, decision: 'approve' | 'reject') => void;
  onRemove: (planServiceId: number) => void;
}

export function SelectionCard({ item, currentProfileId, onReview, onRemove }: SelectionCardProps) {
  const { selection, service } = item;

  const isAddedByMe = selection.added_by_profile_id === currentProfileId;
  // The backend rejects self-review outright, so the buttons only exist for
  // the partner who did not add this service.
  const canReview = selection.status === 'PENDING' && !isAddedByMe;
  // The backend only lets the member who added a selection delete it - the
  // other member's recourse is to reject it, not remove someone else's choice.
  const canRemove = isAddedByMe && selection.status !== 'BOOKED';

  // Once booked, the provider's answer is the status that matters - showing
  // "waiting for the provider" after they already replied is just stale.
  const displayStatus =
    selection.status === 'BOOKED' && selection.booking_status === 'CONFIRMED'
      ? 'BOOKED_CONFIRMED'
      : selection.status === 'BOOKED' && selection.booking_status === 'REJECTED'
        ? 'BOOKED_REJECTED'
        : selection.status;

  return (
    <Card>
      <CardBody className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-bold text-foreground">
            {service?.name ?? `خدمة #${selection.service_id}`}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>أضافها {isAddedByMe ? 'أنتم' : 'شريككم'}</span>
            <StatusBadge status={displayStatus} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PriceText price={Number(selection.estimated_price)} />

          {canReview && (
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => onReview(selection.plan_service_id, 'approve')}
              >
                موافقة
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onReview(selection.plan_service_id, 'reject')}
              >
                رفض
              </Button>
            </div>
          )}

          {canRemove && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onRemove(selection.plan_service_id)}
            >
              حذف
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

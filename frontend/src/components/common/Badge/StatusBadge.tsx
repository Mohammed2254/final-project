import { CheckCircle2, Clock, XCircle } from 'lucide-react';

import { Badge } from '@/components/common/Badge/Badge';
import type { BookingStatus } from '@/types/booking';
import type { WeddingPlanSelectionStatus } from '@/types/weddingPlan';

type Status = BookingStatus | WeddingPlanSelectionStatus;

/**
 * Single source of truth for how a PENDING/CONFIRMED/APPROVED/REJECTED value
 * is rendered. Bookings and wedding-plan selections share the same three
 * states, so they share one badge instead of each page mapping its own
 * labels (which is how `REJECTED` previously fell through untranslated).
 */
const STATUS_MAP = {
  PENDING: { label: 'قيد الانتظار', variant: 'warning', Icon: Clock },
  CONFIRMED: { label: 'مؤكد', variant: 'success', Icon: CheckCircle2 },
  APPROVED: { label: 'مقبول', variant: 'success', Icon: CheckCircle2 },
  REJECTED: { label: 'مرفوض', variant: 'danger', Icon: XCircle },
} as const;

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const entry = STATUS_MAP[status];

  // An unknown status from the API is still worth showing, just unstyled.
  if (!entry) return <Badge className={className}>{status}</Badge>;

  const { label, variant, Icon } = entry;

  return (
    <Badge variant={variant} icon={<Icon />} className={className}>
      {label}
    </Badge>
  );
}

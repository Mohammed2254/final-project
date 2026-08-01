import { CheckCircle2, Clock, XCircle } from 'lucide-react';

import { Badge } from '@/components/common/Badge/Badge';

/**
 * Bookings and wedding-plan selections each define their own status union
 * (in their own feature), but both are drawn from this same set of values -
 * spelled out locally instead of importing either feature's type, so this
 * shared component has no dependency on either one.
 */
type Status = 'PENDING' | 'CONFIRMED' | 'APPROVED' | 'REJECTED';
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

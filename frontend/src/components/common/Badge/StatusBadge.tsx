import { CheckCircle2, Clock, CreditCard, ShoppingBag, XCircle } from 'lucide-react';

import { Badge } from '@/components/common/Badge/Badge';

/**
 * Bookings and wedding-plan selections each define their own status union
 * (in their own feature), but both are drawn from this same set of values -
 * spelled out locally instead of importing either feature's type, so this
 * shared component has no dependency on either one.
 *
 * AWAITING_PAYMENT is not a real backend status (a booking is just
 * CONFIRMED, paid or not - see BookingItemSchema.get_is_paid) - callers
 * compute it themselves (status === 'CONFIRMED' && !is_paid) so "confirmed"
 * and "confirmed but I still owe money" don't look identical at a glance.
 */
type Status = 'PENDING' | 'CONFIRMED' | 'AWAITING_PAYMENT' | 'APPROVED' | 'REJECTED' | 'BOOKED';
const STATUS_MAP = {
  PENDING: { label: 'قيد الانتظار', variant: 'warning', Icon: Clock },
  CONFIRMED: { label: 'مؤكد', variant: 'success', Icon: CheckCircle2 },
  AWAITING_PAYMENT: { label: 'بانتظار الدفع', variant: 'warning', Icon: CreditCard },
  APPROVED: { label: 'مقبول', variant: 'success', Icon: CheckCircle2 },
  REJECTED: { label: 'مرفوض', variant: 'danger', Icon: XCircle },
  BOOKED: { label: 'محجوزة، بانتظار تأكيد المزوّد', variant: 'gold', Icon: ShoppingBag },
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

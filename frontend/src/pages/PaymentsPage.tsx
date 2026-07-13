import { CreditCard } from 'lucide-react';

import { ComingSoon } from '@/components/common/ComingSoon';

/**
 * No payment route exists on the backend yet (only unused
 * PAYMENT_GATEWAY_KEY/PAYMENT_WEBHOOK_SECRET config values) - this page
 * only exists so the URL resolves once booking links here in the future.
 */
export default function PaymentsPage() {
  return (
    <ComingSoon
      icon={CreditCard}
      title="الدفع الإلكتروني قريباً"
      description="نعمل على تفعيل خيارات الدفع الآمن داخل المنصة. سنعلمكم فور توفرها."
    />
  );
}
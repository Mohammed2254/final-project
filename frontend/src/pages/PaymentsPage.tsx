import { CreditCard } from 'lucide-react';

import { ComingSoon } from '@/components/common/ComingSoon';

/** Placeholder: `payment_routes.py` is still empty. Payments are out of MVP scope. */
export default function PaymentsPage() {
  return (
    <ComingSoon
      icon={CreditCard}
      title="الدفع الإلكتروني قريباً"
      description="نعمل على تفعيل خيارات الدفع الآمن داخل المنصة. سنعلمكم فور توفرها."
    />
  );
}
import { CalendarCheck } from 'lucide-react';

import { ComingSoon } from '@/components/common/ComingSoon';
import { ROUTES } from '@/constants/routes';

/**
 * back end/app/routes/booking_routes.py is an empty file - there's no
 * endpoint to submit a booking to yet, so "احجزوا الآن" leads here
 * instead of a form with nowhere to send its data.
 */
export default function BookingPage() {
  return (
    <ComingSoon
      icon={CalendarCheck}
      title="الحجز عبر المنصة قريباً"
      description="نعمل على تفعيل خاصية الحجز المباشر للقاعات ومزودي الخدمات. يمكنكم حالياً تصفح القاعات والتواصل مع مزودي الخدمة."
      backLabel="تصفح القاعات"
      backTo={ROUTES.HALLS}
    />
  );
}
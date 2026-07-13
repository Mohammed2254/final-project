import { Heart } from 'lucide-react';

import { ComingSoon } from '@/components/common/ComingSoon';
import { ROUTES } from '@/constants/routes';

/** No backend route exists yet for saving/listing favorites. */
export default function FavoritesPage() {
  return (
    <ComingSoon
      icon={Heart}
      title="المفضلة قريباً"
      description="ستتمكنون قريباً من حفظ القاعات ومزودي الخدمات المفضّلين لديكم للرجوع إليهم بسهولة."
      backLabel="تصفح القاعات"
      backTo={ROUTES.HALLS}
    />
  );
}
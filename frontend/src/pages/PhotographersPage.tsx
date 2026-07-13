import { Camera } from 'lucide-react';

import { ComingSoon } from '@/components/common/ComingSoon';

/**
 * Photographers live in the same generic Service table as Halls, but
 * there's no categories-list endpoint to reliably tell them apart by
 * category_id yet - so this can't reuse the Halls listing safely
 * without risking mixed results. Placeholder until that's resolved.
 */
export default function PhotographersPage() {
  return (
    <ComingSoon
      icon={Camera}
      title="مصورو الأفراح قريباً"
      description="نعمل على تجهيز صفحة تصفح مزودي خدمات التصوير، لتتمكنوا من مقارنة الباقات واختيار المصور المناسب لزفافكم."
    />
  );
}
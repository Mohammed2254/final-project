import { ClipboardList } from 'lucide-react';

import { ComingSoon } from '@/components/common/ComingSoon';

/** No backend route exists yet for wedding plans (checklist/timeline/budget). */
export default function WeddingPlannerPage() {
  return (
    <ComingSoon
      icon={ClipboardList}
      title="مخطط الزفاف قريباً"
      description="ستتمكنون قريباً من إدارة قائمة المهام والجدول الزمني وميزانية زفافكم في مكان واحد."
    />
  );
}
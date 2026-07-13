import { LayoutDashboard } from 'lucide-react';

import { ComingSoon } from '@/components/common/ComingSoon';

/** back end/app/routes/provider_routes.py is an empty file. */
export default function ProviderDashboardPage() {
  return (
    <ComingSoon
      icon={LayoutDashboard}
      title="لوحة تحكم مزودي الخدمات قريباً"
      description="ستتمكنون قريباً من إدارة خدماتكم وعروضكم ومتابعة الحجوزات من هذه اللوحة."
    />
  );
}
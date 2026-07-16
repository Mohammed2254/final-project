import { Building2, Camera, LayoutDashboard } from 'lucide-react';

import { Card, CardBody } from '@/components/common/Card';
import { ErrorState } from '@/components/common/EmptyState';
import { ProviderServiceForm } from '@/features/provider/components/ProviderServiceForm';
import { ProviderServicesPanel } from '@/features/provider/components/ProviderServicesPanel';
import { useProviderServices } from '@/features/provider/hooks/useProviderServices';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function ProviderDashboardPage() {
  const { account, providerProfile } = useAuth();
  const providerProfileId = providerProfile?.provider_profile_id;

  const {
    services,
    isLoading,
    isCreating,
    error,
    createService,
    reload,
  } = useProviderServices(providerProfileId);

  if (!providerProfileId) {
    return (
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <ErrorState
          message="لم يتم العثور على ملف مقدم الخدمة. سجل الخروج ثم سجل الدخول مرة أخرى كمقدم خدمة."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8 lg:px-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-sm text-muted-foreground">
            <LayoutDashboard size={16} />
            لوحة مقدم الخدمة
          </div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {providerProfile.business_name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            أضف خدماتك وتابع ظهورها للعملاء من مكان واحد.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">{account?.email}</div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-sm text-muted-foreground">إجمالي الخدمات</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{services.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 size={16} />
              القاعات
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {services.filter((service) => service.categoryId === 1).length}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Camera size={16} />
              خدمات التصوير
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {services.filter((service) => service.categoryId !== 1).length}
            </p>
          </CardBody>
        </Card>
      </section>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <ProviderServicesPanel
          services={services}
          isLoading={isLoading}
          onReload={reload}
        />
        <ProviderServiceForm isLoading={isCreating} onSubmit={createService} />
      </div>
    </div>
  );
}

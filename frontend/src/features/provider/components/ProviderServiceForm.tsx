import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { GoldButton } from '@/components/common/GoldButton';
import { Card, CardBody } from '@/components/common/Card';
import { TextInput } from '@/components/forms/TextInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import {
  providerServiceSchema,
  type ProviderServiceFormInput,
  type ProviderServiceFormValues,
} from '@/features/provider/schemas/provider-service.schema';

interface ProviderServiceFormProps {
  isLoading: boolean;
  onSubmit: (values: ProviderServiceFormValues) => Promise<boolean>;
}

const DEFAULT_VALUES: ProviderServiceFormInput = {
  serviceType: 'hall',
  category_id: 1,
  service_name: '',
  description: '',
  price: 0,
  media_url: '',
  is_main: true,
  min_capacity: 1,
  max_capacity: 1,
  city: '',
  address: '',
  latitude: '',
  longitude: '',
  coverage_hours: 1,
  camera_type: '',
  has_video: false,
  has_drone: false,
  portfolio_url: '',
};

export function ProviderServiceForm({ isLoading, onSubmit }: ProviderServiceFormProps) {
  const { categories, isLoading: isLoadingCategories } = useServiceCategories();

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ProviderServiceFormInput, unknown, ProviderServiceFormValues>({
    resolver: zodResolver(providerServiceSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const serviceType = watch('serviceType');

  const submit = handleSubmit(async (values) => {
    const created = await onSubmit(values);
    if (created) {
      reset({ ...DEFAULT_VALUES, serviceType: values.serviceType });
    }
  });

  return (
    <Card>
      <CardBody className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-foreground">إضافة خدمة</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            أضف بيانات الخدمة الأساسية ثم أكمل تفاصيل القاعة أو المصور.
          </p>
        </div>

        <form onSubmit={submit} noValidate className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="serviceType">نوع الخدمة</Label>
              <select
                id="serviceType"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                {...register('serviceType')}
              >
                <option value="hall">قاعة</option>
                <option value="photographer">مصور</option>
              </select>
            </div>

            <div>
              <Label htmlFor="category_id">التصنيف</Label>
              <select
                id="category_id"
                disabled={isLoadingCategories || categories.length === 0}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                {...register('category_id')}
              >
                {categories.length === 0 && (
                  <option value="">
                    {isLoadingCategories ? 'جارٍ تحميل التصنيفات...' : 'لا توجد تصنيفات متاحة'}
                  </option>
                )}
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                  {errors.category_id.message}
                </p>
              )}
            </div>

            <TextInput
              label="اسم الخدمة"
              placeholder="مثال: قاعة النخبة"
              error={errors.service_name?.message}
              {...register('service_name')}
            />

            <TextInput
              label="السعر"
              type="number"
              min={1}
              step="0.01"
              placeholder="8000"
              error={errors.price?.message}
              {...register('price')}
            />
          </div>

          <div>
            <Label htmlFor="description">وصف الخدمة</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="اكتب وصفًا مختصرًا يظهر للعملاء"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              {...register('description')}
            />
            {errors.description && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {serviceType === 'hall' && (
            <div className="grid gap-4 border-t border-border pt-5 md:grid-cols-2">
              <TextInput
                label="أقل سعة"
                type="number"
                min={1}
                error={errors.min_capacity?.message}
                {...register('min_capacity')}
              />
              <TextInput
                label="أكبر سعة"
                type="number"
                min={1}
                error={errors.max_capacity?.message}
                {...register('max_capacity')}
              />
              <TextInput
                label="المدينة"
                placeholder="الرياض"
                error={errors.city?.message}
                {...register('city')}
              />
              <TextInput
                label="العنوان"
                placeholder="حي النرجس"
                error={errors.address?.message}
                {...register('address')}
              />
              <TextInput label="خط العرض" placeholder="24.7136000" {...register('latitude')} />
              <TextInput label="خط الطول" placeholder="46.6753000" {...register('longitude')} />
            </div>
          )}

          {serviceType === 'photographer' && (
            <div className="grid gap-4 border-t border-border pt-5 md:grid-cols-2">
              <TextInput
                label="ساعات التغطية"
                type="number"
                min={1}
                error={errors.coverage_hours?.message}
                {...register('coverage_hours')}
              />
              <TextInput
                label="نوع الكاميرا"
                placeholder="Sony A7 IV"
                {...register('camera_type')}
              />
              <TextInput
                label="رابط الأعمال"
                placeholder="https://example.com"
                error={errors.portfolio_url?.message}
                {...register('portfolio_url')}
              />
              <div className="flex items-end gap-6 pb-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Input type="checkbox" className="h-4 w-4" {...register('has_video')} />
                  يتوفر فيديو
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Input type="checkbox" className="h-4 w-4" {...register('has_drone')} />
                  يتوفر درون
                </label>
              </div>
            </div>
          )}

          <div className="grid gap-4 border-t border-border pt-5 md:grid-cols-[1fr_auto]">
            <TextInput
              label="رابط الصورة الرئيسية"
              type="url"
              placeholder="https://example.com/image.jpg"
              error={errors.media_url?.message}
              {...register('media_url')}
            />
            <label className="flex items-end gap-2 pb-3 text-sm font-medium">
              <Input type="checkbox" className="h-4 w-4" {...register('is_main')} />
              صورة رئيسية
            </label>
          </div>

          <GoldButton
            type="submit"
            className="w-full md:w-auto"
            isLoading={isLoading}
            loadingText="جارٍ إضافة الخدمة..."
          >
            {serviceType === 'hall' ? <Plus /> : <ImagePlus />}
            إضافة الخدمة
          </GoldButton>
        </form>
      </CardBody>
    </Card>
  );
}

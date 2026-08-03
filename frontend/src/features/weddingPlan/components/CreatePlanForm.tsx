import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardBody } from '@/components/common/Card';
import { GoldButton } from '@/components/common/GoldButton';
import { TextInput } from '@/components/forms/TextInput';
import {
  createPlanSchema,
  type CreatePlanFormValues,
} from '@/features/weddingPlan/schemas/plan.schema';

interface CreatePlanFormProps {
  isMutating: boolean;
  onCreate: (
    planName: string,
    eventDate: string,
    budget: string,
    notes: string | null,
  ) => Promise<boolean>;
}

export function CreatePlanForm({ isMutating, onCreate }: CreatePlanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePlanFormValues>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: { planName: '', eventDate: '', budget: '', notes: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await onCreate(
      values.planName.trim(),
      values.eventDate,
      values.budget.trim(),
      values.notes.trim() || null,
    );
  });

  return (
    <Card>
      <CardBody>
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">أنشئوا خطة زفافكم</h2>
          <p className="text-sm text-muted-foreground">
            ابدؤوا بإنشاء خطة الزفاف، ثم يمكنكم دعوة شريككم للتخطيط معاً واختيار الخدمات المناسبة.
          </p>

          <TextInput
            label="اسم الخطة"
            placeholder="مثال: زفاف سارة وأحمد"
            error={errors.planName?.message}
            {...register('planName')}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="تاريخ المناسبة"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              error={errors.eventDate?.message}
              {...register('eventDate')}
            />

            <TextInput
              label="الميزانية التقديرية (ريال)"
              type="number"
              min="0"
              placeholder="0"
              error={errors.budget?.message}
              {...register('budget')}
            />
          </div>

          <div className="w-full">
            <label htmlFor="plan-notes" className="text-sm font-medium text-foreground">
              ملاحظات (اختياري)
            </label>
            <textarea
              id="plan-notes"
              rows={3}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
              {...register('notes')}
            />
            {errors.notes && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                {errors.notes.message}
              </p>
            )}
          </div>

          <GoldButton
            type="submit"
            className="w-full"
            isLoading={isMutating}
            loadingText="جارٍ الإنشاء..."
          >
            إنشاء الخطة
          </GoldButton>
        </form>
      </CardBody>
    </Card>
  );
}

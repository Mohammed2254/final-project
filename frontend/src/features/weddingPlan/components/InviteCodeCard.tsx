import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { TextInput } from '@/components/forms/TextInput';
import {
  inviteCodeSchema,
  type InviteCodeFormValues,
} from '@/features/weddingPlan/schemas/plan.schema';

interface InviteCodeCardProps {
  isMutating: boolean;
  onAccept: (code: string) => Promise<boolean>;
  onReject: (code: string) => Promise<boolean>;
}

export function InviteCodeCard({ isMutating, onAccept, onReject }: InviteCodeCardProps) {
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteCodeFormValues>({
    resolver: zodResolver(inviteCodeSchema),
    defaultValues: { code: '' },
  });

  // Accept and reject share one validated field, so both buttons run the same
  // resolver and only differ in which action they hand the code to.
  const submitWith = (
    action: (code: string) => Promise<boolean>,
    successMessage: string,
  ) =>
    handleSubmit(async (values) => {
      setMessage(null);
      const ok = await action(values.code.trim());
      setMessage(ok ? successMessage : null);
    });

  return (
    <Card>
      <CardBody>
        <form noValidate className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">لديكم رمز دعوة؟</h2>
          <p className="text-xs text-muted-foreground">
            إن دعاكم شريككم للانضمام إلى خطة زفافه، أدخلوا الرمز الذي أرسله لكم هنا.
          </p>

          <TextInput
            label="رمز الدعوة"
            placeholder="رمز الدعوة"
            error={errors.code?.message}
            {...register('code')}
          />

          {message && <p className="text-xs text-muted-foreground">{message}</p>}

          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              isLoading={isMutating}
              onClick={submitWith(onAccept, 'تم قبول الدعوة بنجاح.')}
            >
              قبول
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={submitWith(onReject, 'تم رفض الدعوة.')}
            >
              رفض
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

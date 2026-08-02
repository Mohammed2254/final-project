import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardBody } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { TextInput } from '@/components/forms/TextInput';
import {
  invitePartnerSchema,
  type InvitePartnerFormValues,
} from '@/features/weddingPlan/schemas/plan.schema';

interface InvitePartnerCardProps {
  isMutating: boolean;
  lastInviteCode: string | null;
  onInvite: (invitedEmail: string) => Promise<boolean>;
}

export function InvitePartnerCard({ isMutating, lastInviteCode, onInvite }: InvitePartnerCardProps) {
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvitePartnerFormValues>({
    resolver: zodResolver(invitePartnerSchema),
    defaultValues: { invitedEmail: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setCopied(false);
    const ok = await onInvite(values.invitedEmail.trim());
    if (ok) reset();
  });

  return (
    <Card>
      <CardBody>
        <form onSubmit={onSubmit} noValidate className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">دعوة الشريك</h2>
          <p className="text-xs text-muted-foreground">
            أدخلوا البريد الإلكتروني لحساب شريككم على المنصة لإرسال دعوة انضمام إلى الخطة.
          </p>

          <div className="flex flex-wrap items-start gap-2">
            <div className="min-w-0 flex-1">
              <TextInput
                label="بريد الشريك الإلكتروني"
                type="email"
                autoComplete="email"
                placeholder="partner@example.com"
                error={errors.invitedEmail?.message}
                {...register('invitedEmail')}
              />
            </div>
            <Button type="submit" className="mt-6" isLoading={isMutating}>
              إرسال الدعوة
            </Button>
          </div>

          {lastInviteCode && (
            <div className="space-y-2 rounded-md border border-gold/40 bg-gold/5 p-3">
              <p className="text-xs text-muted-foreground">
                تم إرسال الدعوة. شاركوا هذا الرمز مع شريككم ليدخلوه في صفحة خطة الزفاف الخاصة بهم:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <code className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-bold tracking-wide text-foreground">
                  {lastInviteCode}
                </code>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(lastInviteCode);
                    setCopied(true);
                  }}
                >
                  {copied ? 'تم النسخ' : 'نسخ الرمز'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  );
}

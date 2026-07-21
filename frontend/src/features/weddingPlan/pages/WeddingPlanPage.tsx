import { useState } from 'react';

import { Button } from '@/components/common/Button';
import { GoldButton } from '@/components/common/GoldButton';
import { GoldBadge } from '@/components/common/GoldBadge';
import { Card, CardBody } from '@/components/common/Card';
import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { PriceText } from '@/components/common/PriceText';
import { Spinner } from '@/components/common/Loading';
import { useWeddingPlan } from '@/features/weddingPlan/hooks/useWeddingPlan';
import type { WeddingPlanSelectionStatus } from '@/types/weddingPlan';

const SELECTION_STATUS_LABEL: Record<WeddingPlanSelectionStatus, string> = {
  PENDING: 'بانتظار موافقة الشريك',
  APPROVED: 'تمت الموافقة',
  REJECTED: 'مرفوضة',
};

function CreatePlanForm({
  isMutating,
  onCreate,
}: {
  isMutating: boolean;
  onCreate: (planName: string, eventDate: string, budget: string, notes: string | null) => Promise<boolean>;
}) {
  const [planName, setPlanName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!planName.trim() || !eventDate || !budget.trim()) return;
    await onCreate(planName.trim(), eventDate, budget.trim(), notes.trim() || null);
  };

  return (
    <Card>
      <CardBody className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">أنشئوا خطة زفافكم</h2>
        <p className="text-sm text-muted-foreground">
          ابدؤوا بإنشاء خطة الزفاف، ثم يمكنكم دعوة شريككم للتخطيط معاً واختيار الخدمات المناسبة.
        </p>

        <div className="space-y-2">
          <label htmlFor="plan-name" className="text-sm font-medium text-foreground">
            اسم الخطة
          </label>
          <input
            id="plan-name"
            value={planName}
            onChange={(event) => setPlanName(event.target.value)}
            placeholder="مثال: زفاف سارة وأحمد"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="plan-date" className="text-sm font-medium text-foreground">
              تاريخ المناسبة
            </label>
            <input
              id="plan-date"
              type="date"
              value={eventDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(event) => setEventDate(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="plan-budget" className="text-sm font-medium text-foreground">
              الميزانية التقديرية (ريال)
            </label>
            <input
              id="plan-budget"
              type="number"
              min="0"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder="0"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="plan-notes" className="text-sm font-medium text-foreground">
            ملاحظات (اختياري)
          </label>
          <textarea
            id="plan-notes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
          />
        </div>

        <GoldButton
          type="button"
          className="w-full"
          isLoading={isMutating}
          loadingText="جارٍ الإنشاء..."
          onClick={handleSubmit}
          disabled={!planName.trim() || !eventDate || !budget.trim()}
        >
          إنشاء الخطة
        </GoldButton>
      </CardBody>
    </Card>
  );
}

function InviteCodeCard({
  isMutating,
  onAccept,
  onReject,
}: {
  isMutating: boolean;
  onAccept: (code: string) => Promise<boolean>;
  onReject: (code: string) => Promise<boolean>;
}) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Card>
      <CardBody className="space-y-3">
        <h2 className="text-sm font-bold text-foreground">لديكم رمز دعوة؟</h2>
        <p className="text-xs text-muted-foreground">
          إن دعاكم شريككم للانضمام إلى خطة زفافه، أدخلوا الرمز الذي أرسله لكم هنا.
        </p>

        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="رمز الدعوة"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
        />

        {message && <p className="text-xs text-muted-foreground">{message}</p>}

        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            isLoading={isMutating}
            disabled={!code.trim()}
            onClick={async () => {
              setMessage(null);
              const ok = await onAccept(code.trim());
              setMessage(ok ? 'تم قبول الدعوة بنجاح.' : null);
            }}
          >
            قبول
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!code.trim()}
            onClick={async () => {
              setMessage(null);
              const ok = await onReject(code.trim());
              setMessage(ok ? 'تم رفض الدعوة.' : null);
            }}
          >
            رفض
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default function WeddingPlanPage() {
  const {
    canUsePlanner,
    currentProfileId,
    plan,
    selections,
    isLoading,
    isMutating,
    error,
    lastInviteCode,
    refresh,
    createPlan,
    invitePartner,
    acceptInvitation,
    rejectInvitation,
    removeService,
    reviewService,
  } = useWeddingPlan();

  const [inviteEmail, setInviteEmail] = useState('');
  const [copied, setCopied] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <SectionHeader
        title="خطة الزفاف"
        subtitle="خططوا لزفافكم معاً: أنشئوا الخطة، وادعوا شريككم، واختاروا الخدمات سوياً"
      />

      <div className="mt-6 space-y-6">
        {!canUsePlanner && (
          <EmptyState
            title="سجّلوا الدخول لعرض خطة الزفاف"
            description="يجب تسجيل الدخول بحساب عميل لإنشاء خطة زفاف ومتابعتها هنا."
          />
        )}

        {canUsePlanner && isLoading && <SkeletonGrid count={3} />}

        {canUsePlanner && !isLoading && error && !plan && <ErrorState message={error} onRetry={refresh} />}

        {canUsePlanner && !isLoading && !plan && (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <CreatePlanForm isMutating={isMutating} onCreate={createPlan} />
            <InviteCodeCard isMutating={isMutating} onAccept={acceptInvitation} onReject={rejectInvitation} />
          </div>
        )}

        {canUsePlanner && !isLoading && plan && (
          <div className="space-y-6">
            {error && (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Card>
              <CardBody className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-foreground">{plan.plan_name}</h2>
                  <GoldBadge>{plan.status}</GoldBadge>
                </div>

                <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                  <p>تاريخ المناسبة: {plan.event_date}</p>
                  <p>الميزانية: <PriceText price={Number(plan.budget)} /></p>
                  <p>{plan.partner_profile_id ? 'الشريك: منضم' : 'بانتظار انضمام الشريك'}</p>
                </div>

                {plan.notes && <p className="text-sm text-muted-foreground">{plan.notes}</p>}
              </CardBody>
            </Card>

            {!plan.partner_profile_id && (
              <Card>
                <CardBody className="space-y-3">
                  <h2 className="text-sm font-bold text-foreground">دعوة الشريك</h2>
                  <p className="text-xs text-muted-foreground">
                    أدخلوا البريد الإلكتروني لحساب شريككم على المنصة لإرسال دعوة انضمام إلى الخطة.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(event) => setInviteEmail(event.target.value)}
                      placeholder="partner@example.com"
                      className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-foreground"
                    />
                    <Button
                      type="button"
                      isLoading={isMutating}
                      disabled={!inviteEmail.trim()}
                      onClick={async () => {
                        setCopied(false);
                        const ok = await invitePartner(inviteEmail.trim());
                        if (ok) setInviteEmail('');
                      }}
                    >
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
                </CardBody>
              </Card>
            )}

            <div>
              <h2 className="mb-3 text-lg font-bold text-foreground">الخدمات المختارة</h2>

              {selections.length === 0 ? (
                <EmptyState
                  title="لا توجد خدمات مختارة بعد"
                  description="تصفّحوا القاعات والمصورين وأضيفوا ما يناسبكم إلى خطة الزفاف."
                />
              ) : (
                <div className="space-y-3">
                  {selections.map(({ selection, service }) => {
                    const isAddedByMe = selection.added_by_profile_id === currentProfileId;
                    const canReview = selection.status === 'PENDING' && !isAddedByMe;

                    return (
                      <Card key={selection.plan_service_id}>
                        <CardBody className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-foreground">
                              {service?.name ?? `خدمة #${selection.service_id}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              أضافها {isAddedByMe ? 'أنتم' : 'شريككم'} · {SELECTION_STATUS_LABEL[selection.status]}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <PriceText price={Number(selection.estimated_price)} />

                            {canReview && (
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => reviewService(selection.plan_service_id, 'approve')}
                                >
                                  موافقة
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => reviewService(selection.plan_service_id, 'reject')}
                                >
                                  رفض
                                </Button>
                              </div>
                            )}

                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeService(selection.plan_service_id)}
                            >
                              حذف
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {canUsePlanner && !isLoading && isMutating && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}

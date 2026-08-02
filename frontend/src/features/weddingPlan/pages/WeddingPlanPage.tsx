import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Trash2 } from 'lucide-react';

import { Button } from '@/components/common/Button';
import { GoldBadge } from '@/components/common/GoldBadge';
import { Card, CardBody } from '@/components/common/Card';
import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState, ErrorState, SkeletonGrid } from '@/components/common/EmptyState';
import { PriceText } from '@/components/common/PriceText';
import { Spinner } from '@/components/common/Loading';
import { BudgetBar } from '@/features/weddingPlan/components/BudgetBar';
import { CreatePlanForm } from '@/features/weddingPlan/components/CreatePlanForm';
import { InviteCodeCard } from '@/features/weddingPlan/components/InviteCodeCard';
import { InvitePartnerCard } from '@/features/weddingPlan/components/InvitePartnerCard';
import { ReadyToBookCard } from '@/features/weddingPlan/components/ReadyToBookCard';
import { SelectionCard } from '@/features/weddingPlan/components/SelectionCard';
import { useWeddingPlan } from '@/features/weddingPlan/hooks/useWeddingPlan';
import { daysUntil, formatDaysRemaining, summarizeBudget } from '@/features/weddingPlan/utils/planSummary';
import { ROUTES } from '@/constants/routes';

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
    deletePlan,
    bookApprovedServices,
  } = useWeddingPlan();

  const navigate = useNavigate();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const approvedCount = selections.filter(
    ({ selection }) => selection.status === 'APPROVED',
  ).length;

  const isOwner = plan !== null && plan.owner_profile_id === currentProfileId;

  // Safe to compute before we know there is a plan - with no plan there are no
  // selections either, so every total is zero and nothing is rendered anyway.
  const budget = summarizeBudget(selections, plan?.budget ?? '0');

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
                  <div className="flex items-center gap-2">
                    <GoldBadge>{plan.status}</GoldBadge>
                    {isOwner && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setConfirmingDelete(true)}
                      >
                        <Trash2 size={14} aria-hidden="true" className="ms-1.5" />
                        حذف الخطة
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                  <p className="flex items-center gap-1.5">
                    <CalendarDays size={14} aria-hidden="true" />
                    {plan.event_date}
                    <span className="font-medium text-gold">
                      ({formatDaysRemaining(daysUntil(plan.event_date))})
                    </span>
                  </p>
                  <p>الميزانية: <PriceText price={budget.budget} /></p>
                  <p>{plan.partner_profile_id ? 'الشريك: منضم' : 'بانتظار انضمام الشريك'}</p>
                </div>

                <BudgetBar summary={budget} />

                {plan.notes && <p className="text-sm text-muted-foreground">{plan.notes}</p>}

                {confirmingDelete && (
                  <div className="space-y-2 rounded-md border border-destructive/40 bg-destructive/5 p-3">
                    <p className="text-xs text-destructive">
                      هذا الإجراء لا يمكن التراجع عنه، سيُحذف الخطة، ودعوة الشريك، وكل الخدمات
                      المختارة فيها. هل أنتم متأكدون؟
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        isLoading={isMutating}
                        onClick={async () => {
                          const ok = await deletePlan();
                          if (ok) setConfirmingDelete(false);
                        }}
                      >
                        نعم، احذف الخطة نهائياً
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setConfirmingDelete(false)}
                      >
                        تراجع
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {!plan.partner_profile_id && (
              <InvitePartnerCard
                isMutating={isMutating}
                lastInviteCode={lastInviteCode}
                onInvite={invitePartner}
              />
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
                  {selections.map((item) => (
                    <SelectionCard
                      key={item.selection.plan_service_id}
                      item={item}
                      currentProfileId={currentProfileId}
                      onReview={reviewService}
                      onRemove={removeService}
                    />
                  ))}
                </div>
              )}
            </div>

            {approvedCount > 0 && (
              <ReadyToBookCard
                approvedCount={approvedCount}
                approvedTotal={budget.approved}
                eventDate={plan.event_date}
                isMutating={isMutating}
                onBook={async () => {
                  const booking = await bookApprovedServices();
                  if (booking) navigate(ROUTES.MY_BOOKINGS);
                }}
              />
            )}
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

import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  weddingPlanService,
  type WeddingPlanSelectionWithService,
} from '@/features/weddingPlan/services/weddingPlan.service';
import { toastActions } from '@/store/toast.store';
import { ApiException } from '@/types/api';
import type { WeddingPlanRecord } from '@/features/weddingPlan/types';

function extractErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiException ? error.message : fallback;
}

export function useWeddingPlan() {
  const { isAuthenticated, account, userProfile } = useAuth();
  const canUsePlanner = isAuthenticated && account?.role === 'Customer';

  const [plan, setPlan] = useState<WeddingPlanRecord | null>(null);
  const [selections, setSelections] = useState<WeddingPlanSelectionWithService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInviteCode, setLastInviteCode] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!canUsePlanner) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const myPlan = await weddingPlanService.getMine();
      setPlan(myPlan);

      if (myPlan) {
        const items = await weddingPlanService.listSelections(myPlan.plan_id);
        setSelections(items);
      } else {
        setSelections([]);
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'تعذر تحميل خطة الزفاف.'));
    } finally {
      setIsLoading(false);
    }
  }, [canUsePlanner]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const createPlan = useCallback(
    async (planName: string, eventDate: string, budget: string, notes: string | null) => {
      setIsMutating(true);
      setError(null);
      try {
        const created = await weddingPlanService.create({
          plan_name: planName,
          event_date: eventDate,
          budget,
          notes,
        });
        setPlan(created);
        setSelections([]);
        toastActions.success('تم إنشاء خطة الزفاف.');
        return true;
      } catch (err) {
        setError(extractErrorMessage(err, 'تعذر إنشاء خطة الزفاف.'));
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [],
  );

  const invitePartner = useCallback(
    async (invitedEmail: string) => {
      if (!plan) return false;

      setIsMutating(true);
      setError(null);
      setLastInviteCode(null);
      try {
        const invitation = await weddingPlanService.invitePartner(plan.plan_id, invitedEmail);
        setLastInviteCode(invitation.invite_code);
        return true;
      } catch (err) {
        setError(extractErrorMessage(err, 'تعذر إرسال الدعوة.'));
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [plan],
  );

  const acceptInvitation = useCallback(async (inviteCode: string) => {
    setIsMutating(true);
    setError(null);
    try {
      const joinedPlan = await weddingPlanService.acceptInvitation(inviteCode);
      setPlan(joinedPlan);
      const items = await weddingPlanService.listSelections(joinedPlan.plan_id);
      setSelections(items);
      toastActions.success('انضممتم إلى خطة الزفاف.');
      return true;
    } catch (err) {
      setError(extractErrorMessage(err, 'تعذر قبول الدعوة.'));
      return false;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const rejectInvitation = useCallback(async (inviteCode: string) => {
    setIsMutating(true);
    setError(null);
    try {
      await weddingPlanService.rejectInvitation(inviteCode);
      return true;
    } catch (err) {
      setError(extractErrorMessage(err, 'تعذر رفض الدعوة.'));
      return false;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const addService = useCallback(
    async (serviceId: number, estimatedPrice: string) => {
      if (!plan) return false;

      setError(null);
      try {
        await weddingPlanService.addService(plan.plan_id, serviceId, estimatedPrice);
        const items = await weddingPlanService.listSelections(plan.plan_id);
        setSelections(items);
        return true;
      } catch (err) {
        setError(extractErrorMessage(err, 'تعذر إضافة الخدمة إلى الخطة.'));
        return false;
      }
    },
    [plan],
  );

  const removeService = useCallback(async (planServiceId: number) => {
    setError(null);
    const previous = selections;
    setSelections((current) => current.filter((item) => item.selection.plan_service_id !== planServiceId));
    try {
      await weddingPlanService.removeService(planServiceId);
      toastActions.success('حُذفت الخدمة من الخطة.');
    } catch (err) {
      setSelections(previous);
      setError(extractErrorMessage(err, 'تعذر حذف الخدمة من الخطة.'));
    }
  }, [selections]);

  const deletePlan = useCallback(async () => {
    if (!plan) return false;

    setIsMutating(true);
    setError(null);
    try {
      await weddingPlanService.deletePlan(plan.plan_id);
      // Cascades on the backend (invitations + selections) - mirror that
      // here so the page falls straight back to "create a plan" instead
      // of showing stale selections for a plan that no longer exists.
      setPlan(null);
      setSelections([]);
      setLastInviteCode(null);
      toastActions.success('حُذفت خطة الزفاف.');
      return true;
    } catch (err) {
      setError(extractErrorMessage(err, 'تعذر حذف خطة الزفاف.'));
      return false;
    } finally {
      setIsMutating(false);
    }
  }, [plan]);

  const reviewService = useCallback(
    async (planServiceId: number, decision: 'approve' | 'reject') => {
      setError(null);
      try {
        const updated =
          decision === 'approve'
            ? await weddingPlanService.approveService(planServiceId)
            : await weddingPlanService.rejectService(planServiceId);

        setSelections((current) =>
          current.map((item) =>
            item.selection.plan_service_id === planServiceId ? { ...item, selection: updated } : item,
          ),
        );

        toastActions.success(
          decision === 'approve' ? 'تمت الموافقة على الخدمة.' : 'تم رفض الخدمة.',
        );
      } catch (err) {
        setError(extractErrorMessage(err, 'تعذر تحديث حالة الخدمة.'));
      }
    },
    [],
  );

  return {
    canUsePlanner,
    currentProfileId: userProfile?.user_profile_id ?? null,
    plan,
    selections,
    isLoading,
    isMutating,
    error,
    lastInviteCode,
    refresh: load,
    createPlan,
    invitePartner,
    acceptInvitation,
    rejectInvitation,
    addService,
    removeService,
    reviewService,
    deletePlan,
  };
}

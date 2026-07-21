import {
  weddingPlanEndpoints,
  weddingPlanInvitationEndpoints,
  weddingPlanSelectionEndpoints,
  serviceEndpoints,
} from '@/services/api/endpoints';
import { toServiceItem, type ServiceItem } from '@/types/service';
import type {
  WeddingPlanCreatePayload,
  WeddingPlanInvitationRecord,
  WeddingPlanRecord,
  WeddingPlanSelectionRecord,
} from '@/types/weddingPlan';

export interface WeddingPlanSelectionWithService {
  selection: WeddingPlanSelectionRecord;
  service: ServiceItem | null;
}

/**
 * Business-logic layer over the wedding-plan resources. Selections only
 * store (plan_id, service_id) - there is no nested service data in the
 * response, so listing full service details goes through the same
 * real-join pattern as favorite.service.ts / photographer.service.ts.
 */
export const weddingPlanService = {
  async getMine(): Promise<WeddingPlanRecord | null> {
    const { data } = await weddingPlanEndpoints.mine();
    return data.data[0] ?? null;
  },

  async create(payload: WeddingPlanCreatePayload): Promise<WeddingPlanRecord> {
    const { data } = await weddingPlanEndpoints.create(payload);
    return data.data;
  },

  async invitePartner(planId: number, invitedEmail: string): Promise<WeddingPlanInvitationRecord> {
    const { data } = await weddingPlanInvitationEndpoints.create({
      plan_id: planId,
      invited_email: invitedEmail,
    });
    return data.data;
  },

  async acceptInvitation(inviteCode: string): Promise<WeddingPlanRecord> {
    const { data } = await weddingPlanInvitationEndpoints.accept(inviteCode);
    return weddingPlanEndpoints.details(data.data.plan_id).then((response) => response.data.data);
  },

  async rejectInvitation(inviteCode: string): Promise<void> {
    await weddingPlanInvitationEndpoints.reject(inviteCode);
  },

  async listSelections(planId: number): Promise<WeddingPlanSelectionWithService[]> {
    const { data } = await weddingPlanSelectionEndpoints.byPlan(planId);

    const results = await Promise.allSettled(
      data.data.map(async (selection) => {
        try {
          const { data: serviceResponse } = await serviceEndpoints.details(selection.service_id);
          return { selection, service: toServiceItem(serviceResponse.data) };
        } catch {
          return { selection, service: null };
        }
      }),
    );

    return results
      .filter(
        (result): result is PromiseFulfilledResult<WeddingPlanSelectionWithService> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value);
  },

  async addService(planId: number, serviceId: number, estimatedPrice: string): Promise<WeddingPlanSelectionRecord> {
    const { data } = await weddingPlanSelectionEndpoints.create({
      plan_id: planId,
      service_id: serviceId,
      estimated_price: estimatedPrice,
    });
    return data.data;
  },

  async removeService(planServiceId: number): Promise<void> {
    await weddingPlanSelectionEndpoints.remove(planServiceId);
  },

  async approveService(planServiceId: number): Promise<WeddingPlanSelectionRecord> {
    const { data } = await weddingPlanSelectionEndpoints.approve(planServiceId);
    return data.data;
  },

  async rejectService(planServiceId: number): Promise<WeddingPlanSelectionRecord> {
    const { data } = await weddingPlanSelectionEndpoints.reject(planServiceId);
    return data.data;
  },
};

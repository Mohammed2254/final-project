export interface WeddingPlanRecord {
  plan_id: number;
  owner_profile_id: number;
  partner_profile_id: number | null;
  plan_name: string;
  event_date: string;
  budget: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface WeddingPlanCreatePayload {
  plan_name: string;
  event_date: string;
  budget: string;
  notes?: string | null;
}

export type WeddingPlanInvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface WeddingPlanInvitationRecord {
  invitation_id: number;
  plan_id: number;
  invited_email: string;
  invite_code: string;
  status: WeddingPlanInvitationStatus;
  accepted_by_profile_id: number | null;
  expires_at: string;
  created_at: string;
}

export interface WeddingPlanInvitationCreatePayload {
  plan_id: number;
  invited_email: string;
}

export type WeddingPlanSelectionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface WeddingPlanSelectionRecord {
  plan_service_id: number;
  plan_id: number;
  service_id: number;
  added_by_profile_id: number;
  estimated_price: string;
  status: WeddingPlanSelectionStatus;
  notes: string | null;
  created_at: string;
}

export interface WeddingPlanSelectionCreatePayload {
  plan_id: number;
  service_id: number;
  estimated_price: string;
  notes?: string | null;
}

import type { WeddingPlanSelectionWithService } from '@/features/weddingPlan/services/weddingPlan.service';

export interface BudgetSummary {
  budget: number;
  approved: number;
  pending: number;
  remaining: number;
  isOverBudget: boolean;
  /** Capped at 100 so overspending cannot overflow the bar. */
  approvedPercent: number;
}

export function summarizeBudget(
  selections: WeddingPlanSelectionWithService[],
  budget: string,
): BudgetSummary {
  const sumOf = (status: 'APPROVED' | 'PENDING') =>
    selections
      .filter((item) => item.selection.status === status)
      .reduce((total, item) => total + Number(item.selection.estimated_price), 0);

  const budgetValue = Number(budget);
  const approved = sumOf('APPROVED');
  const pending = sumOf('PENDING');

  return {
    budget: budgetValue,
    approved,
    pending,
    remaining: budgetValue - approved,
    isOverBudget: approved > budgetValue,
    approvedPercent: budgetValue > 0 ? Math.min((approved / budgetValue) * 100, 100) : 0,
  };
}

/** Both dates are pinned to midnight, or a wedding at 11pm today reads as -1. */
export function daysUntil(eventDate: string, today = new Date()): number {
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setHours(0, 0, 0, 0);

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((event.getTime() - start.getTime()) / MS_PER_DAY);
}

/** Arabic counts days in four shapes, so `${days} يوم` reads wrong for most values. */
export function formatDaysRemaining(days: number): string {
  if (days < 0) return 'انقضى موعد المناسبة';
  if (days === 0) return 'المناسبة اليوم';
  if (days === 1) return 'باقي يوم واحد';
  if (days === 2) return 'باقي يومان';
  if (days <= 10) return `باقي ${days} أيام`;

  return `باقي ${days} يوماً`;
}

import { describe, it, expect } from 'vitest';

import {
  daysUntil,
  formatDaysRemaining,
  summarizeBudget,
} from '@/features/weddingPlan/utils/planSummary';
import type { WeddingPlanSelectionWithService } from '@/features/weddingPlan/services/weddingPlan.service';

function selection(
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'BOOKED',
  estimatedPrice: string,
): WeddingPlanSelectionWithService {
  return {
    selection: {
      plan_service_id: 1,
      plan_id: 1,
      service_id: 1,
      added_by_profile_id: 1,
      estimated_price: estimatedPrice,
      status,
      notes: null,
      created_at: '2026-01-01',
      booking_id: null,
      booking_status: null,
    },
    service: null,
  };
}

describe('summarizeBudget', () => {
  it('counts approved and pending selections separately', () => {
    const summary = summarizeBudget(
      [selection('APPROVED', '10000'), selection('PENDING', '4000')],
      '50000',
    );

    expect(summary.approved).toBe(10000);
    expect(summary.pending).toBe(4000);
  });

  it('keeps counting a selection after it is booked', () => {
    // Booking used to drop it out of the total, emptying the budget bar at
    // the exact moment the money was actually committed.
    const summary = summarizeBudget([selection('BOOKED', '10000')], '50000');

    expect(summary.approved).toBe(10000);
    expect(summary.remaining).toBe(40000);
  });

  it('ignores rejected selections entirely', () => {
    const summary = summarizeBudget([selection('REJECTED', '99000')], '50000');

    expect(summary.approved).toBe(0);
    expect(summary.pending).toBe(0);
  });

  it('leaves what is left after the approved total only', () => {
    const summary = summarizeBudget(
      [selection('APPROVED', '20000'), selection('PENDING', '30000')],
      '50000',
    );

    expect(summary.remaining).toBe(30000);
    expect(summary.isOverBudget).toBe(false);
  });

  it('flags going over budget', () => {
    const summary = summarizeBudget([selection('APPROVED', '60000')], '50000');

    expect(summary.isOverBudget).toBe(true);
    expect(summary.remaining).toBe(-10000);
  });

  it('caps the bar at 100% so overspending cannot overflow it', () => {
    const summary = summarizeBudget([selection('APPROVED', '80000')], '50000');

    expect(summary.approvedPercent).toBe(100);
  });

  it('does not divide by zero when no budget was set', () => {
    const summary = summarizeBudget([selection('APPROVED', '5000')], '0');

    expect(summary.approvedPercent).toBe(0);
  });
});

describe('daysUntil', () => {
  const today = new Date('2026-08-01T22:00:00');

  it('counts whole days ahead', () => {
    expect(daysUntil('2026-08-11', today)).toBe(10);
  });

  it('returns 0 for an event later the same day, not -1', () => {
    expect(daysUntil('2026-08-01', today)).toBe(0);
  });

  it('goes negative once the date has passed', () => {
    expect(daysUntil('2026-07-30', today)).toBe(-2);
  });
});

describe('formatDaysRemaining', () => {
  it('uses the right Arabic shape for each count', () => {
    expect(formatDaysRemaining(1)).toBe('باقي يوم واحد');
    expect(formatDaysRemaining(2)).toBe('باقي يومان');
    expect(formatDaysRemaining(5)).toBe('باقي 5 أيام');
    expect(formatDaysRemaining(40)).toBe('باقي 40 يوماً');
  });

  it('has its own wording for today and for a date that passed', () => {
    expect(formatDaysRemaining(0)).toBe('المناسبة اليوم');
    expect(formatDaysRemaining(-3)).toBe('انقضى موعد المناسبة');
  });
});

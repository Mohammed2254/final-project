import { PriceText } from '@/components/common/PriceText';
import type { BudgetSummary } from '@/features/weddingPlan/utils/planSummary';

/**
 * Turns the plan's budget from a number nobody acts on into the running total
 * of what the couple has actually committed to.
 */
export function BudgetBar({ summary }: { summary: BudgetSummary }) {
  return (
    <div className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-muted-foreground">
          المتفق عليه: <PriceText price={summary.approved} className="text-sm" />
        </span>

        {summary.pending > 0 && (
          <span className="text-muted-foreground">
            بانتظار الموافقة: <PriceText price={summary.pending} className="text-sm" />
          </span>
        )}

        <span className={summary.isOverBudget ? 'font-medium text-destructive' : 'text-muted-foreground'}>
          {summary.isOverBudget ? 'تجاوزتم الميزانية بـ ' : 'المتبقي: '}
          <PriceText
            price={Math.abs(summary.remaining)}
            className={summary.isOverBudget ? 'text-sm text-destructive' : 'text-sm'}
          />
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(summary.approvedPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="نسبة الميزانية المستهلكة"
        className="h-2 w-full overflow-hidden rounded-full bg-border"
      >
        <div
          className={summary.isOverBudget ? 'h-full bg-destructive' : 'h-full bg-gold'}
          style={{ width: `${summary.approvedPercent}%` }}
        />
      </div>
    </div>
  );
}

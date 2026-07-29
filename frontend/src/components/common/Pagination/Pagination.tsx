import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Builds the page list with ellipses, always keeping first, last, current and
 * its neighbours: [1] … [4] [5] [6] … [20]
 */
function buildPages(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'gap')[] = [1];

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push('gap');
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < totalPages - 1) pages.push('gap');

  pages.push(totalPages);
  return pages;
}

const stepClasses =
  'inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-gold hover:text-foreground disabled:pointer-events-none disabled:opacity-40';

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="تنقل بين الصفحات" className={cn('flex items-center justify-center gap-1.5', className)}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="الصفحة السابقة"
        className={stepClasses}
      >
        {/* RTL: "previous" points right */}
        <ChevronRight size={16} aria-hidden="true" />
      </button>

      {buildPages(page, totalPages).map((entry, index) =>
        entry === 'gap' ? (
          <span key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onPageChange(entry)}
            aria-label={`الصفحة ${entry}`}
            aria-current={entry === page ? 'page' : undefined}
            className={cn(
              'inline-flex size-9 items-center justify-center rounded-md border text-sm transition-colors',
              entry === page
                ? 'border-gold bg-gold font-bold text-gold-foreground'
                : 'border-border text-muted-foreground hover:border-gold hover:text-foreground',
            )}
          >
            {entry}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="الصفحة التالية"
        className={stepClasses}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}

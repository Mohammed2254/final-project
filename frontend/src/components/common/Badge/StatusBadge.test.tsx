import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { StatusBadge } from '@/components/common/Badge/StatusBadge';

describe('StatusBadge', () => {
  it('translates every booking status', () => {
    const cases = [
      ['PENDING', 'قيد الانتظار'],
      ['CONFIRMED', 'مؤكد'],
      // Regression guard: MyBookingsPage's own STATUS_LABELS map only ever
      // listed CANCELLED (a value the API never sends) and never REJECTED,
      // so a rejected booking rendered the raw English string.
      ['REJECTED', 'مرفوض'],
    ] as const;

    for (const [status, label] of cases) {
      const { unmount } = render(<StatusBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });

  it('translates the wedding-plan APPROVED status', () => {
    render(<StatusBadge status="APPROVED" />);

    expect(screen.getByText('مقبول')).toBeInTheDocument();
  });

  it('pairs the colour with an icon so the state survives greyscale', () => {
    const { container } = render(<StatusBadge status="PENDING" />);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

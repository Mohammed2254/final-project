import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { EmptyState } from '@/components/common/EmptyState/EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="لا توجد حجوزات" />);

    expect(screen.getByText('لا توجد حجوزات')).toBeInTheDocument();
  });

  it('renders the description when given one', () => {
    render(<EmptyState title="لا توجد حجوزات" description="لم تقم بأي حجز بعد." />);

    expect(screen.getByText('لم تقم بأي حجز بعد.')).toBeInTheDocument();
  });

  it('renders no description element when none is given', () => {
    render(<EmptyState title="لا توجد حجوزات" />);

    // Only the title paragraph should be there.
    expect(screen.queryByText('لم تقم بأي حجز بعد.')).not.toBeInTheDocument();
  });

  it('renders an action when provided', () => {
    render(<EmptyState title="لا توجد حجوزات" action={<button>تصفح القاعات</button>} />);

    expect(screen.getByRole('button', { name: 'تصفح القاعات' })).toBeInTheDocument();
  });
});

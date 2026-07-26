import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorState } from '@/components/common/EmptyState/ErrorState';

describe('ErrorState', () => {
  it('shows the error message inside an alert region', () => {
    render(<ErrorState message="تعذر تحميل الحجوزات" />);

    expect(screen.getByRole('alert')).toHaveTextContent('تعذر تحميل الحجوزات');
  });

  it('hides the retry button when no retry handler is given', () => {
    render(<ErrorState message="تعذر تحميل الحجوزات" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn();
    render(<ErrorState message="تعذر تحميل الحجوزات" onRetry={onRetry} />);

    await userEvent.click(screen.getByRole('button', { name: 'إعادة المحاولة' }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});

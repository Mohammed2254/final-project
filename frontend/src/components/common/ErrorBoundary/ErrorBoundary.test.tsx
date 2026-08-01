import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ErrorBoundary } from '@/components/common/ErrorBoundary/ErrorBoundary';

function Boom(): never {
  throw new Error('انفجر المكوّن');
}

// React logs every caught error itself, so a passing run would still print a
// stack trace and look like a failure. Silence it, then restore.
const silenceConsole = () => vi.spyOn(console, 'error').mockImplementation(() => {});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  it('renders its children while nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>محتوى الصفحة</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText('محتوى الصفحة')).toBeInTheDocument();
  });

  it('shows the fallback instead of a blank page when a child throws', () => {
    silenceConsole();

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('حدث خطأ غير متوقع');
    expect(screen.getByRole('button', { name: 'إعادة تحميل الصفحة' })).toBeInTheDocument();
  });

  it('hides the crashed children once the fallback takes over', () => {
    silenceConsole();

    render(
      <ErrorBoundary>
        <p>محتوى الصفحة</p>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.queryByText('محتوى الصفحة')).not.toBeInTheDocument();
  });
});

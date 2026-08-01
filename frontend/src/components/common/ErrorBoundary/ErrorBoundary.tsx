import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button } from '@/components/common/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** A class, not a hook: getDerivedStateFromError has no hook equivalent. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('خطأ غير متوقع أثناء العرض:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    return (
      <div
        role="alert"
        className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <h1 className="text-xl font-bold text-foreground">حدث خطأ غير متوقع</h1>

        <p className="max-w-md text-sm text-muted-foreground">
          نعتذر، تعطّل جزء من الصفحة. جرّبوا إعادة التحميل، وإن تكرر الأمر عودوا
          إلى الصفحة الرئيسية.
        </p>

        {import.meta.env.DEV && (
          <pre className="max-w-full overflow-x-auto rounded-md border border-border bg-destructive/5 p-3 text-start text-xs text-destructive">
            {error.message}
          </pre>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          <Button type="button" onClick={() => window.location.reload()}>
            إعادة تحميل الصفحة
          </Button>

          {/* A full page load, not a router link: staying inside React would
              re-render the route that just crashed. */}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            الصفحة الرئيسية
          </Button>
        </div>
      </div>
    );
  }
}

import { CheckCircle2, X, XCircle } from 'lucide-react';

import { useToasts } from '@/hooks/useToasts';
import { cn } from '@/lib/utils';

/** Mounted next to the router, so a toast survives the navigation that raised it. */
export function ToastViewport() {
  const { toasts, dismissToast } = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => {
        const isError = toast.tone === 'error';

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg',
              'animate-in fade-in slide-in-from-bottom-4 duration-300',
              isError
                ? 'border-destructive/40 bg-destructive/10 text-destructive'
                : 'border-gold/40 bg-background text-foreground',
            )}
          >
            {isError ? (
              <XCircle size={18} aria-hidden="true" className="shrink-0" />
            ) : (
              <CheckCircle2 size={18} aria-hidden="true" className="shrink-0 text-gold" />
            )}

            <p className="flex-1">{toast.message}</p>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="إغلاق الإشعار"
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

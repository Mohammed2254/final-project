import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
      aria-pressed={isDark}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-gold hover:text-foreground',
        className,
      )}
    >
      {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}

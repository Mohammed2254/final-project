import { createStore } from '@/store/createStore';
import { localStorageService } from '@/services/storage/localStorage';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'farah.theme';

/** Saved choice wins; otherwise follow the OS setting. */
function resolveInitialTheme(): Theme {
  const saved = localStorageService.getRaw(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * index.css already ships a full `.dark` palette behind
 * `@custom-variant dark (&:is(.dark *))` - all that was missing was something
 * to put the class on <html>. That's this store.
 */
function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

const initialTheme = resolveInitialTheme();
applyTheme(initialTheme);

export const themeStore = createStore<{ theme: Theme }>({ theme: initialTheme });

export const themeActions = {
  toggle(): void {
    const next: Theme = themeStore.getState().theme === 'dark' ? 'light' : 'dark';
    localStorageService.setRaw(THEME_KEY, next);
    applyTheme(next);
    themeStore.setState({ theme: next });
  },
};

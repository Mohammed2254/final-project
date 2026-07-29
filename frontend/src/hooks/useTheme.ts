import { useSyncExternalStore } from 'react';

import { themeActions, themeStore } from '@/store/theme.store';

export function useTheme() {
  const state = useSyncExternalStore(themeStore.subscribe, themeStore.getState, themeStore.getState);

  return { theme: state.theme, toggleTheme: themeActions.toggle };
}

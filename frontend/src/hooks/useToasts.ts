import { useSyncExternalStore } from 'react';

import { toastActions, toastStore } from '@/store/toast.store';

export function useToasts() {
  const state = useSyncExternalStore(toastStore.subscribe, toastStore.getState, toastStore.getState);

  return { toasts: state.toasts, dismissToast: toastActions.dismiss };
}

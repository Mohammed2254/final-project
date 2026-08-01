import { createStore } from '@/store/createStore';

export type ToastTone = 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

const VISIBLE_MS = 4000;

let nextId = 1;

export const toastStore = createStore<{ toasts: Toast[] }>({ toasts: [] });

function dismiss(id: number): void {
  toastStore.setState((prev) => ({
    toasts: prev.toasts.filter((toast) => toast.id !== id),
  }));
}

function push(message: string, tone: ToastTone): void {
  const id = nextId++;

  toastStore.setState((prev) => ({ toasts: [...prev.toasts, { id, message, tone }] }));
  window.setTimeout(() => dismiss(id), VISIBLE_MS);
}

export const toastActions = {
  success: (message: string) => push(message, 'success'),
  error: (message: string) => push(message, 'error'),
  dismiss,
};

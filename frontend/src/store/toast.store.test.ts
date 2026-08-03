import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { toastActions, toastStore } from '@/store/toast.store';

describe('toast store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    toastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds a toast with the tone it was raised with', () => {
    toastActions.success('تم الحفظ');

    expect(toastStore.getState().toasts).toHaveLength(1);
    expect(toastStore.getState().toasts[0]).toMatchObject({ message: 'تم الحفظ', tone: 'success' });
  });

  it('stacks several toasts instead of replacing the previous one', () => {
    toastActions.success('تم الحفظ');
    toastActions.error('تعذر الحفظ');

    expect(toastStore.getState().toasts.map((toast) => toast.tone)).toEqual(['success', 'error']);
  });

  it('removes a toast on its own once it has been on screen long enough', () => {
    toastActions.success('تم الحفظ');
    vi.advanceTimersByTime(4000);

    expect(toastStore.getState().toasts).toHaveLength(0);
  });

  it('dismisses only the toast that was closed, leaving the rest', () => {
    toastActions.success('الأولى');
    toastActions.success('الثانية');

    toastActions.dismiss(toastStore.getState().toasts[0].id);

    expect(toastStore.getState().toasts.map((toast) => toast.message)).toEqual(['الثانية']);
  });
});

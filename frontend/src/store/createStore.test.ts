import { describe, it, expect, vi } from 'vitest';

import { createStore } from '@/store/createStore';

interface CounterState {
  count: number;
  label: string;
}

const initial: CounterState = { count: 0, label: 'start' };

describe('createStore', () => {
  it('returns the initial state', () => {
    const store = createStore(initial);

    expect(store.getState()).toEqual({ count: 0, label: 'start' });
  });

  it('merges a partial update instead of replacing the whole state', () => {
    const store = createStore(initial);

    store.setState({ count: 5 });

    expect(store.getState()).toEqual({ count: 5, label: 'start' });
  });

  it('accepts an updater function based on the previous state', () => {
    const store = createStore(initial);

    store.setState((prev) => ({ count: prev.count + 3 }));

    expect(store.getState().count).toBe(3);
  });

  it('notifies subscribers on every update', () => {
    const store = createStore(initial);
    const listener = vi.fn();

    store.subscribe(listener);
    store.setState({ count: 1 });
    store.setState({ count: 2 });

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('stops notifying after unsubscribe', () => {
    const store = createStore(initial);
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    store.setState({ count: 1 });
    unsubscribe();
    store.setState({ count: 2 });

    expect(listener).toHaveBeenCalledOnce();
  });
});

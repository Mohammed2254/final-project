type Listener = () => void;

/**
 * Minimal external store, enough for app-wide state like auth without
 * pulling in a state-management library or wrapping the tree in Context.
 * Pairs with React's built-in `useSyncExternalStore`.
 */
export function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<Listener>();

  return {
    getState: () => state,
    setState: (partial: Partial<T> | ((prev: T) => Partial<T>)) => {
      const patch = typeof partial === 'function' ? (partial as (prev: T) => Partial<T>)(state) : partial;
      state = { ...state, ...patch };
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

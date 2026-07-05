/**
 * Thin abstraction over window.localStorage so the rest of the app never
 * touches the browser API directly. Makes it trivial to swap storage
 * strategies later (e.g. secure cookies) without touching call sites.
 */
export const localStorageService = {
  get<T>(key: string): T | null {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  getRaw(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can fail in private mode / quota errors - fail silently,
      // the app should keep working in-memory for the session.
    }
  },

  setRaw(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },

  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

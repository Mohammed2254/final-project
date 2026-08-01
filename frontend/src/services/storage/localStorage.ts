/** Wraps window.localStorage so nothing else in the app touches it directly. */
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
      // Private mode and quota errors throw here - the app keeps working without it.
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

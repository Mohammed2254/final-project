import { createStore } from '@/store/createStore';
import { LOGOUT_EVENT } from '@/store/auth.store';

interface FavoritesState {
  ids: Set<number>;
  isLoaded: boolean;
  isLoading: boolean;
}

export const favoritesStore = createStore<FavoritesState>({
  ids: new Set(),
  isLoaded: false,
  isLoading: false,
});

export const favoritesActions = {
  setLoading(isLoading: boolean): void {
    favoritesStore.setState({ isLoading });
  },

  setIds(ids: number[]): void {
    favoritesStore.setState({ ids: new Set(ids), isLoaded: true, isLoading: false });
  },

  add(serviceId: number): void {
    const next = new Set(favoritesStore.getState().ids);
    next.add(serviceId);
    favoritesStore.setState({ ids: next });
  },

  remove(serviceId: number): void {
    const next = new Set(favoritesStore.getState().ids);
    next.delete(serviceId);
    favoritesStore.setState({ ids: next });
  },

  reset(): void {
    favoritesStore.setState({ ids: new Set(), isLoaded: false, isLoading: false });
  },
};

// Favorites are per-user - never let them survive into the next session on
// the same browser.
window.addEventListener(LOGOUT_EVENT, () => {
  favoritesActions.reset();
});

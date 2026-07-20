import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';

import { favoritesStore, favoritesActions } from '@/store/favorites.store';
import { favoriteService } from '@/features/favorites/services/favorite.service';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

/**
 * Shared favorite-state hook used by every card's heart button and the
 * Favorites page itself, so they all read/update the same in-memory set
 * instead of each fetching independently.
 */
export function useFavorites() {
  const { isAuthenticated, account } = useAuth();
  const navigate = useNavigate();
  const state = useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getState,
    favoritesStore.getState,
  );

  const canFavorite = isAuthenticated && account?.role === 'Customer';

  useEffect(() => {
    if (!canFavorite || state.isLoaded || state.isLoading) return;

    favoritesActions.setLoading(true);
    favoriteService
      .listServiceIds()
      .then((ids) => favoritesActions.setIds(ids))
      .catch(() => favoritesActions.setLoading(false));
  }, [canFavorite, state.isLoaded, state.isLoading]);

  const isFavorited = useCallback((serviceId: number) => state.ids.has(serviceId), [state.ids]);

  const toggleFavorite = useCallback(
    async (serviceId: number) => {
      if (!canFavorite) {
        navigate(ROUTES.LOGIN);
        return;
      }

      const wasFavorited = state.ids.has(serviceId);

      // Optimistic update - reverted if the request fails.
      if (wasFavorited) {
        favoritesActions.remove(serviceId);
        try {
          await favoriteService.remove(serviceId);
        } catch {
          favoritesActions.add(serviceId);
        }
      } else {
        favoritesActions.add(serviceId);
        try {
          await favoriteService.add(serviceId);
        } catch {
          favoritesActions.remove(serviceId);
        }
      }
    },
    [canFavorite, navigate, state.ids],
  );

  return { isFavorited, toggleFavorite, isLoaded: state.isLoaded, canFavorite };
}

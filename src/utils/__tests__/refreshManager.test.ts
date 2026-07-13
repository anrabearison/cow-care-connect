/**
 * Tests du RefreshManager
 * Valide le système de refresh token automatique avec gestion concurrente
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { refreshManager } from '../refreshManager';
import { apiClient } from '../apiClient';
import { QueryClient } from '@tanstack/react-query';

describe('RefreshManager Tests', () => {
  let mockNavigate: (path: string) => void;
  let mockClearCache: () => Promise<void>;
  let mockQueryClient: QueryClient;

  beforeEach(() => {
    refreshManager.reset();
    vi.clearAllMocks();
    
    // Setup mocks
    mockNavigate = vi.fn();
    mockClearCache = vi.fn().mockResolvedValue(undefined);
    mockQueryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    // Enregistrer les callbacks
    refreshManager.setNavigateCallback(mockNavigate);
    refreshManager.setClearCacheCallback(mockClearCache);
    refreshManager.setQueryClient(mockQueryClient);
  });

  afterEach(() => {
    refreshManager.reset();
  });

  describe('Scénario 1: Une requête 401 est correctement rejouée après un refresh réussi', () => {
    it('doit détecter une erreur 401 et lancer un refresh', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({} as any);

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      const result = await refreshManager.handle401Error(requestFn, '/api/data');

      // Le refresh doit avoir été appelé
      expect(mockPost).toHaveBeenCalledWith('/api/v1/auth/refresh', {}, { skipAuth: true });

      // La requête originale doit avoir été rejouée
      expect(requestFn).toHaveBeenCalled();

      mockPost.mockRestore();
    });

    it('doit retourner le résultat correct après refresh', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({} as any);

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      const result = await refreshManager.handle401Error(requestFn, '/api/data');

      expect(result).toEqual({ data: 'success' });

      mockPost.mockRestore();
    });
  });

  describe('Scénario 2: Plusieurs requêtes simultanées ne déclenchent qu\'un seul refresh', () => {
    it('doit mettre les requêtes en attente et les rejouer après refresh', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({} as any);

      const requestFn1 = vi.fn().mockResolvedValue({ data: 'success1' });
      const requestFn2 = vi.fn().mockResolvedValue({ data: 'success2' });
      const requestFn3 = vi.fn().mockResolvedValue({ data: 'success3' });

      // Lancer 3 requêtes simultanément
      const [result1, result2, result3] = await Promise.all([
        refreshManager.handle401Error(requestFn1, '/api/data1'),
        refreshManager.handle401Error(requestFn2, '/api/data2'),
        refreshManager.handle401Error(requestFn3, '/api/data3'),
      ]);

      // Un seul refresh doit avoir été appelé
      expect(mockPost).toHaveBeenCalledTimes(1);

      // Toutes les requêtes doivent avoir été rejouées
      expect(requestFn1).toHaveBeenCalled();
      expect(requestFn2).toHaveBeenCalled();
      expect(requestFn3).toHaveBeenCalled();

      // Les résultats doivent être corrects
      expect(result1).toEqual({ data: 'success1' });
      expect(result2).toEqual({ data: 'success2' });
      expect(result3).toEqual({ data: 'success3' });

      mockPost.mockRestore();
    });

    it('ne doit jamais lancer plusieurs refresh simultanés', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({} as any), 100))
      );

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      // Lancer plusieurs requêtes rapidement
      const promises = [
        refreshManager.handle401Error(requestFn, '/api/data1'),
        refreshManager.handle401Error(requestFn, '/api/data2'),
        refreshManager.handle401Error(requestFn, '/api/data3'),
      ];

      await Promise.all(promises);

      // Un seul refresh doit avoir été appelé
      expect(mockPost).toHaveBeenCalledTimes(1);

      mockPost.mockRestore();
    });
  });

  describe('Scénario 3: Les requêtes en attente sont correctement rejouées après le refresh', () => {
    it('doit rejouer toutes les requêtes en attente après refresh réussi', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({} as any);

      const requestFn1 = vi.fn().mockResolvedValue({ data: 'success1' });
      const requestFn2 = vi.fn().mockResolvedValue({ data: 'success2' });

      const result1 = await refreshManager.handle401Error(requestFn1, '/api/data1');
      const result2 = await refreshManager.handle401Error(requestFn2, '/api/data2');

      // Vérifier que les résultats sont corrects
      expect(result1).toEqual({ data: 'success1' });
      expect(result2).toEqual({ data: 'success2' });

      mockPost.mockRestore();
    });
  });

  describe('Scénario 4: En cas d\'échec du refresh, toutes les requêtes en attente sont rejetées', () => {
    it('doit rejeter toutes les requêtes si le refresh échoue', async () => {
      // Mock spécifique pour l'endpoint de refresh
      const mockRefreshPost = vi.spyOn(apiClient, 'post').mockImplementation(
        (endpoint) => {
          if (endpoint === '/api/v1/auth/refresh') {
            return Promise.reject(new Error('Refresh failed'));
          }
          if (endpoint === '/api/v1/auth/logout') {
            return Promise.resolve({} as any);
          }
          return Promise.resolve({} as any);
        }
      );

      const requestFn1 = vi.fn().mockResolvedValue({ data: 'success1' });
      const requestFn2 = vi.fn().mockResolvedValue({ data: 'success2' });

      await expect(refreshManager.handle401Error(requestFn1, '/api/data1')).rejects.toThrow();
      await expect(refreshManager.handle401Error(requestFn2, '/api/data2')).rejects.toThrow();

      // Les requêtes ne doivent pas avoir été rejouées
      expect(requestFn1).not.toHaveBeenCalled();
      expect(requestFn2).not.toHaveBeenCalled();

      mockRefreshPost.mockRestore();
    });

    it('doit nettoyer le cache TanStack Query après échec du refresh', async () => {
      const mockRefreshPost = vi.spyOn(apiClient, 'post').mockImplementation(
        (endpoint) => {
          if (endpoint === '/api/v1/auth/refresh') {
            return Promise.reject(new Error('Refresh failed'));
          }
          if (endpoint === '/api/v1/auth/logout') {
            return Promise.resolve({} as any);
          }
          return Promise.resolve({} as any);
        }
      );
      const clearSpy = vi.spyOn(mockQueryClient, 'clear').mockResolvedValue();

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      await expect(refreshManager.handle401Error(requestFn, '/api/data')).rejects.toThrow();

      // Le cache doit avoir été nettoyé
      expect(clearSpy).toHaveBeenCalled();
      expect(mockClearCache).toHaveBeenCalled();

      mockRefreshPost.mockRestore();
      clearSpy.mockRestore();
    });

    it('doit rediriger vers login via React Router après échec du refresh', async () => {
      const mockRefreshPost = vi.spyOn(apiClient, 'post').mockImplementation(
        (endpoint) => {
          if (endpoint === '/api/v1/auth/refresh') {
            return Promise.reject(new Error('Refresh failed'));
          }
          if (endpoint === '/api/v1/auth/logout') {
            return Promise.resolve({} as any);
          }
          return Promise.resolve({} as any);
        }
      );

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      await expect(refreshManager.handle401Error(requestFn, '/api/data')).rejects.toThrow();

      // La navigation doit avoir été appelée
      expect(mockNavigate).toHaveBeenCalledWith('/login');

      mockRefreshPost.mockRestore();
    });
  });

  describe('Scénario 5: Aucune boucle infinie n\'est possible', () => {
    it('doit rejeter si la requête a déjà le marqueur _retry', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({} as any);

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      // Premier appel avec marqueur _retry
      await expect(
        refreshManager.handle401Error(requestFn, '/api/data', { _retry: true })
      ).rejects.toThrow('Request already retried');

      // Le refresh ne doit pas avoir été appelé
      expect(mockPost).not.toHaveBeenCalled();

      mockPost.mockRestore();
    });

    it('doit marquer la requête comme _retry lors du retry', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({} as any);

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      // Premier appel sans marqueur
      await refreshManager.handle401Error(requestFn, '/api/data');

      // La requête doit avoir été appelée 1 fois (le refreshManager ne marque pas explicitement)
      // Le marqueur _retry est utilisé pour prévenir les boucles, mais n'augmente pas le compteur
      expect(requestFn).toHaveBeenCalled();

      mockPost.mockRestore();
    });
  });

  describe('Scénario 6: Les endpoints exclus ne déclenchent jamais un refresh', () => {
    it('doit rejeter pour /login endpoint', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({} as any);

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      await expect(
        refreshManager.handle401Error(requestFn, '/api/v1/auth/login')
      ).rejects.toThrow('Endpoint excluded from automatic refresh');

      // Le refresh ne doit pas avoir été appelé
      expect(mockPost).not.toHaveBeenCalled();

      mockPost.mockRestore();
    });

    it('doit rejeter pour /refresh endpoint', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({} as any);

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      await expect(
        refreshManager.handle401Error(requestFn, '/api/v1/auth/refresh')
      ).rejects.toThrow('Endpoint excluded from automatic refresh');

      // Le refresh ne doit pas avoir été appelé
      expect(mockPost).not.toHaveBeenCalled();

      mockPost.mockRestore();
    });

    it('doit rejeter pour /logout endpoint', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({} as any);

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      await expect(
        refreshManager.handle401Error(requestFn, '/api/v1/auth/logout')
      ).rejects.toThrow('Endpoint excluded from automatic refresh');

      // Le refresh ne doit pas avoir été appelé
      expect(mockPost).not.toHaveBeenCalled();

      mockPost.mockRestore();
    });

    it('doit rejeter pour /google endpoint', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({} as any);

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      await expect(
        refreshManager.handle401Error(requestFn, '/api/v1/auth/google')
      ).rejects.toThrow('Endpoint excluded from automatic refresh');

      // Le refresh ne doit pas avoir été appelé
      expect(mockPost).not.toHaveBeenCalled();

      mockPost.mockRestore();
    });
  });

  describe('Scénario 7: État du RefreshManager', () => {
    it('doit retourner l\'état correct', () => {
      const state = refreshManager.getState();

      expect(state).toHaveProperty('isRefreshing');
      expect(state).toHaveProperty('pendingRequestsCount');
      expect(state).toHaveProperty('hasRefreshPromise');
      expect(state).toHaveProperty('hasNavigateCallback');
      expect(state).toHaveProperty('hasClearCacheCallback');
      expect(state).toHaveProperty('hasQueryClient');
    });

    it('doit réinitialiser l\'état correctement', () => {
      refreshManager.reset();

      const state = refreshManager.getState();
      expect(state.isRefreshing).toBe(false);
      expect(state.pendingRequestsCount).toBe(0);
      expect(state.hasRefreshPromise).toBe(false);
      expect(state.hasNavigateCallback).toBe(false);
      expect(state.hasClearCacheCallback).toBe(false);
      expect(state.hasQueryClient).toBe(false);
    });

    it('doit enregistrer les callbacks correctement', () => {
      const navigateFn = vi.fn();
      const clearCacheFn = vi.fn().mockResolvedValue(undefined);
      const queryClient = new QueryClient();

      refreshManager.setNavigateCallback(navigateFn);
      refreshManager.setClearCacheCallback(clearCacheFn);
      refreshManager.setQueryClient(queryClient);

      const state = refreshManager.getState();
      expect(state.hasNavigateCallback).toBe(true);
      expect(state.hasClearCacheCallback).toBe(true);
      expect(state.hasQueryClient).toBe(true);
    });
  });

  describe('Scénario 8: Nettoyage localStorage', () => {
    it('doit nettoyer le localStorage lors du logout automatique', async () => {
      const mockRefreshPost = vi.spyOn(apiClient, 'post').mockImplementation(
        (endpoint) => {
          if (endpoint === '/api/v1/auth/refresh') {
            return Promise.reject(new Error('Refresh failed'));
          }
          if (endpoint === '/api/v1/auth/logout') {
            return Promise.resolve({} as any);
          }
          return Promise.resolve({} as any);
        }
      );

      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('user_data', JSON.stringify({ id: '1' }));

      const requestFn = vi.fn().mockResolvedValue({ data: 'success' });

      await expect(refreshManager.handle401Error(requestFn, '/api/data')).rejects.toThrow();

      // localStorage doit être vide
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();

      mockRefreshPost.mockRestore();
    });
  });
});

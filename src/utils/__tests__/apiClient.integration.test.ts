/**
 * Tests d'intégration pour apiClient avec RefreshManager
 * Valide que l'apiClient utilise correctement le RefreshManager pour gérer les 401
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiClient } from '../apiClient';
import { refreshManager } from '../refreshManager';
import { QueryClient } from '@tanstack/react-query';

describe('ApiClient Integration Tests with RefreshManager', () => {
  let mockNavigate: (path: string) => void;
  let mockClearCache: () => Promise<void>;
  let mockQueryClient: QueryClient;
  let mockFetch: ReturnType<typeof vi.fn> & typeof global.fetch;

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

    // Mock global fetch
    mockFetch = vi.fn() as unknown as ReturnType<typeof vi.fn> & typeof global.fetch;
    global.fetch = mockFetch;
  });

  afterEach(() => {
    refreshManager.reset();
    vi.restoreAllMocks();
  });

  describe('Scénario 1: Requête 401 avec refresh réussi', () => {
    it('doit rejouer automatiquement la requête après un refresh réussi', async () => {
      refreshManager.markSessionAsActive();
      // Premier appel: 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        url: 'http://localhost:8000/api/v1/data',
        json: async () => ({ message: 'Unauthorized' }),
      });

      // Appel refresh: succès
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: 'http://localhost:8000/api/v1/auth/refresh',
        json: async () => ({ success: true }),
      });

      // Deuxième appel après refresh: succès
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: 'http://localhost:8000/api/v1/data',
        json: async () => ({ success: true }),
      });

      const result = await apiClient.get('/api/v1/data');

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledTimes(3); // 401 + refresh + retry
    });
  });

  describe('Scénario 2: Plusieurs requêtes 401 simultanées', () => {
    it('doit déclencher un seul refresh pour plusieurs requêtes 401', async () => {
      refreshManager.markSessionAsActive();
      let callCount = 0;
      let refreshCallCount = 0;

      mockFetch.mockImplementation(async (url: string) => {
        callCount++;
        
        // Vérifier si c'est un appel refresh
        if (url.includes('/auth/refresh')) {
          refreshCallCount++;
          return {
            ok: true,
            status: 200,
            url: url,
            json: async () => ({ success: true }),
          };
        }
        
        // Première requête: 401
        if (callCount <= 2) {
          return {
            ok: false,
            status: 401,
            url: url,
            json: async () => ({ message: 'Unauthorized' }),
          };
        }
        
        // Requêtes rejouées
        return {
          ok: true,
          status: 200,
          url: url,
          json: async () => ({ success: true }),
        };
      });

      const [result1, result2] = await Promise.all([
        apiClient.get('/api/v1/data1'),
        apiClient.get('/api/v1/data2'),
      ]);

      expect(result1).toEqual({ success: true });
      expect(result2).toEqual({ success: true });

      // Un seul refresh doit avoir été appelé
      expect(refreshCallCount).toBe(1);
    });
  });

  describe('Scénario 3: Endpoint refresh exclu du refresh automatique', () => {
    it('ne doit pas tenter de refresh pour l\'endpoint /auth/refresh', async () => {
      refreshManager.markSessionAsActive();
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        url: 'http://localhost:8000/api/v1/auth/refresh',
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(
        apiClient.post('/api/v1/auth/refresh', {})
      ).rejects.toThrow();

      // Un seul appel doit avoir été fait (pas de retry)
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('ne doit pas tenter de refresh pour l\'endpoint /auth/login', async () => {
      refreshManager.markSessionAsActive();
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        url: 'http://localhost:8000/api/v1/auth/login',
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(
        apiClient.post('/api/v1/auth/login', { email: 'test', password: 'test' })
      ).rejects.toThrow();

      // Un seul appel doit avoir été fait (pas de retry)
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('ne doit pas tenter de refresh pour l\'endpoint /auth/logout', async () => {
      refreshManager.markSessionAsActive();
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        url: 'http://localhost:8000/api/v1/auth/logout',
        json: async () => ({ message: 'Unauthorized' }),
      });

      await expect(
        apiClient.post('/api/v1/auth/logout')
      ).rejects.toThrow();

      // Un seul appel doit avoir été fait (pas de retry)
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Scénario 4: Échec du refresh', () => {
    it('doit rejouer la requête et nettoyer l\'état si le refresh échoue', async () => {
      refreshManager.markSessionAsActive();
      // Premier appel: 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        url: 'http://localhost:8000/api/v1/data',
        json: async () => ({ message: 'Unauthorized' }),
      });

      // Appel refresh: échec
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        url: 'http://localhost:8000/api/v1/auth/refresh',
        json: async () => ({ message: 'Refresh failed' }),
      });

      // Appel logout: succès
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: 'http://localhost:8000/api/v1/auth/logout',
        json: async () => ({ success: true }),
      });

      await expect(apiClient.get('/api/v1/data')).rejects.toThrow();

      // Le cache doit avoir été nettoyé
      expect(mockClearCache).toHaveBeenCalled();

      // La navigation doit avoir été appelée
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Scénario 5: Méthodes HTTP différentes', () => {
    it('doit gérer le refresh pour les requêtes GET', async () => {
      refreshManager.markSessionAsActive();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        url: 'http://localhost:8000/api/v1/data',
        json: async () => ({ message: 'Unauthorized' }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: 'http://localhost:8000/api/v1/auth/refresh',
        json: async () => ({ success: true }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: 'http://localhost:8000/api/v1/data',
        json: async () => ({ success: true }),
      });

      const result = await apiClient.get('/api/v1/data');
      expect(result).toEqual({ success: true });
    });

    it('doit gérer le refresh pour les requêtes POST', async () => {
      refreshManager.markSessionAsActive();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        url: 'http://localhost:8000/api/v1/data',
        json: async () => ({ message: 'Unauthorized' }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: 'http://localhost:8000/api/v1/auth/refresh',
        json: async () => ({ success: true }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: 'http://localhost:8000/api/v1/data',
        json: async () => ({ success: true }),
      });

      const result = await apiClient.post('/api/v1/data', { test: 'data' });
      expect(result).toEqual({ success: true });
    });

    it('doit gérer le refresh pour les requêtes PUT', async () => {
      refreshManager.markSessionAsActive();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        url: 'http://localhost:8000/api/v1/data',
        json: async () => ({ message: 'Unauthorized' }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: 'http://localhost:8000/api/v1/auth/refresh',
        json: async () => ({ success: true }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: 'http://localhost:8000/api/v1/data',
        json: async () => ({ success: true }),
      });

      const result = await apiClient.put('/api/v1/data', { test: 'data' });
      expect(result).toEqual({ success: true });
    });

    it('doit gérer le refresh pour les requêtes DELETE', async () => {
      refreshManager.markSessionAsActive();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        url: 'http://localhost:8000/api/v1/data',
        json: async () => ({ message: 'Unauthorized' }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: 'http://localhost:8000/api/v1/auth/refresh',
        json: async () => ({ success: true }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        url: 'http://localhost:8000/api/v1/data',
        json: async () => ({ success: true }),
      });

      const result = await apiClient.delete('/api/v1/data');
      expect(result).toEqual({ success: true });
    });
  });
});

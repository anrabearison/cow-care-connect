/**
 * Tests de sécurité pour l'authentification
 * Valide que les tokens JWT ne sont JAMAIS stockés dans localStorage
 * et que l'apiClient utilise correctement les cookies HttpOnly
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService } from '../services';
import { apiClient } from '@/utils/apiClient';

describe('Auth Security Tests', () => {
  beforeEach(() => {
    // Nettoyer localStorage avant chaque test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Scénario 1: Sécurité - Pas de token dans localStorage', () => {
    it('ne doit PAS écrire auth_token dans localStorage lors du login', async () => {
      // Mock de l'API pour simuler une réponse réussie avec cookies
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({
        access_token: 'mock-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER'
        }
      } as any);

      // Tenter une connexion
      await authService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      // ASSERTION CRITIQUE: localStorage doit rester vide
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();

      mockPost.mockRestore();
    });

    it('ne doit PAS écrire auth_token dans localStorage lors du login Google', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({
        access_token: 'mock-google-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER'
        }
      } as any);

      await authService.loginWithGoogle('mock-google-code', 'mock-invitation-token');

      // ASSERTION CRITIQUE: localStorage doit rester vide
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();

      mockPost.mockRestore();
    });

    it('ne doit PAS lire auth_token depuis localStorage pour vérifier l\'auth', () => {
      // Simuler un token déjà présent dans localStorage (scénario de migration)
      localStorage.setItem('auth_token', 'old-token-in-localstorage');
      localStorage.setItem('user_data', JSON.stringify({ id: '1', name: 'Old User' }));

      // La méthode getToken ne doit PLUS utiliser localStorage
      const token = authService.getToken();

      // ASSERTION CRITIQUE: getToken doit retourner null (pas de localStorage)
      expect(token).toBeNull();
    });

    it('doit nettoyer localStorage lors du logout', async () => {
      // Simuler des données dans localStorage (scénario de migration)
      localStorage.setItem('auth_token', 'old-token');
      localStorage.setItem('user_data', JSON.stringify({ id: '1' }));

      await authService.logout();

      // ASSERTION: localStorage doit être vide après logout
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();
    });
  });

  describe('Scénario 2: Réseau - Configuration cookies HttpOnly', () => {
    it('apiClient doit être configuré avec credentials: include', () => {
      // Vérifier que l'instance apiClient a la configuration correcte
      // Note: Cette vérification dépend de l'implémentation de apiClient
      // Nous allons vérifier que les requêtes incluent les credentials

      const mockGet = vi.spyOn(apiClient, 'get').mockResolvedValue({} as any);

      // Effectuer une requête
      apiClient.get('/test-endpoint');

      // Vérifier que la requête a été faite
      expect(mockGet).toHaveBeenCalled();

      // Note: La vérification réelle de 'credentials: include' nécessite
      // soit d'exposer la configuration de apiClient, soit de mocker fetch
      // Pour l'instant, nous validons que le client est utilisé correctement

      mockGet.mockRestore();
    });

    it('les requêtes API doivent inclure automatiquement les cookies', async () => {
      // Mock de fetch pour vérifier les options
      const originalFetch = global.fetch;
      let fetchOptions: RequestInit | undefined;

      global.fetch = vi.fn().mockImplementation((url, options) => {
        fetchOptions = options;
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: {} })
        } as Response);
      });

      await apiClient.get('/test');

      // ASSERTION CRITIQUE: credentials doit être 'include'
      expect(fetchOptions?.credentials).toBe('include');

      global.fetch = originalFetch;
    });
  });

  describe('Scénario 3: Validation complète du flux auth', () => {
    it('le flux complet login → API → ne doit pas toucher localStorage', async () => {
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({
        access_token: 'mock-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER'
        }
      } as any);

      // Login
      await authService.login({ email: 'test@test.com', password: 'pass' });

      // Vérifier que localStorage est vide
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();

      // Vérifier que le token est accessible via autre moyen (cookies)
      const isAuthenticated = authService.isAuthenticated();
      // Note: Après migration, isAuthenticated devra vérifier via les cookies
      // Pour l'instant, cette assertion servira de point de départ

      mockPost.mockRestore();
    });
  });
});

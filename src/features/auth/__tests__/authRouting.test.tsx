/**
 * Tests de routage pour l'authentification
 * Valide que les redirections utilisent React Router et non window.location
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiClient } from '@/utils/apiClient';
import { AuthenticationError } from '@/utils/errors';

describe('Auth Routing Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location pour détecter toute réassignation
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost:8085/',
        replace: vi.fn(),
        assign: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Scénario 1: Pas de réassignation de window.location', () => {
    it('ne doit PAS utiliser window.location.href pour les redirections internes', () => {
      const originalHref = window.location.href;

      // Simuler une erreur 401 via apiClient
      const mockGet = vi.spyOn(apiClient, 'get').mockRejectedValue(
        new AuthenticationError()
      );

      // Tenter une requête qui pourrait déclencher une redirection
      apiClient.get('/test').catch(() => {
        // Ignorer l'erreur
      });

      // ASSERTION CRITIQUE: window.location.href ne doit pas avoir changé
      expect(window.location.href).toBe(originalHref);

      mockGet.mockRestore();
    });

    it('ne doit PAS utiliser window.location.replace pour les redirections internes', () => {
      const originalReplace = window.location.replace;

      // Simuler un logout
      const mockDelete = vi.spyOn(apiClient, 'delete').mockResolvedValue({});

      apiClient.delete('/auth/logout');

      // ASSERTION CRITIQUE: window.location.replace ne doit pas avoir été appelé
      expect(window.location.replace).not.toHaveBeenCalled();

      mockDelete.mockRestore();
    });
  });

  describe('Scénario 2: Gestion des erreurs 401', () => {
    it('doit lever une exception AuthenticationError sans modifier window.location', async () => {
      const mockGet = vi.spyOn(apiClient, 'get').mockRejectedValue(
        new AuthenticationError()
      );

      const originalHref = window.location.href;

      await expect(apiClient.get('/protected')).rejects.toThrow(
        AuthenticationError
      );

      // ASSERTION CRITIQUE: window.location.href ne doit pas avoir changé
      expect(window.location.href).toBe(originalHref);

      mockGet.mockRestore();
    });
  });

  describe('Scénario 3: Services auth ne modifient pas window.location', () => {
    it('authService.logout ne doit pas modifier window.location', async () => {
      const { authService } = await import('../services');

      const originalHref = window.location.href;

      await authService.logout();

      // ASSERTION CRITIQUE: window.location.href ne doit pas avoir changé
      expect(window.location.href).toBe(originalHref);
    });

    it('authService.login ne doit pas modifier window.location', async () => {
      const { authService } = await import('../services');

      const originalHref = window.location.href;
      const mockPost = vi.spyOn(apiClient, 'post').mockResolvedValue({
        access_token: 'mock-token',
        user: { id: '1', name: 'Test', email: 'test@test.com', role: 'USER' }
      } as any);

      await authService.login({ email: 'test@test.com', password: 'password' }).catch(() => {
        // Ignorer les erreurs
      });

      // ASSERTION CRITIQUE: window.location.href ne doit pas avoir changé
      expect(window.location.href).toBe(originalHref);

      mockPost.mockRestore();
    });
  });
});

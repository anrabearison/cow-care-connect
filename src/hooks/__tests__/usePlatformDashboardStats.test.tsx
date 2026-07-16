/**
 * Tests du hook usePlatformDashboardStats avec TanStack Query
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { usePlatformDashboardStats } from '../usePlatformDashboardStats';
import * as dashboardService from '@/features/dashboard/services';

describe('usePlatformDashboardStats Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  const createWrapper = () => {
    return function Wrapper({ children }: { children: React.ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
  };

  describe('Scénario 1: Récupération', () => {
    it('doit récupérer les statistiques plateforme avec succès', async () => {
      const mockStats = {
        totalOwners: 10,
        totalUsers: 50,
        totalPendingInvitations: 5,
      };

      vi.spyOn(dashboardService, 'dashboardService', 'get').mockReturnValue({
        getPlatformStatistics: vi.fn().mockResolvedValue(mockStats),
      } as any);

      const { result } = renderHook(() => usePlatformDashboardStats(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockStats);
    });
  });

  describe('Scénario 2: Loading', () => {
    it('doit être en état de loading initial', () => {
      vi.spyOn(dashboardService, 'dashboardService', 'get').mockReturnValue({
        getPlatformStatistics: vi.fn().mockImplementation(() => new Promise(() => {})),
      } as any);

      const { result } = renderHook(() => usePlatformDashboardStats(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Scénario 3: Erreur', () => {
    it('doit gérer les erreurs de récupération', async () => {
      const mockError = new Error('Failed to fetch');

      vi.spyOn(dashboardService, 'dashboardService', 'get').mockReturnValue({
        getPlatformStatistics: vi.fn().mockRejectedValue(mockError),
      } as any);

      const { result } = renderHook(() => usePlatformDashboardStats(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('Scénario 4: Cache', () => {
    it('doit utiliser le cache pour les requêtes répétées', async () => {
      const mockStats = {
        totalOwners: 10,
        totalUsers: 50,
        totalPendingInvitations: 5,
      };

      const getStatsSpy = vi.fn().mockResolvedValue(mockStats);

      vi.spyOn(dashboardService, 'dashboardService', 'get').mockReturnValue({
        getPlatformStatistics: getStatsSpy,
      } as any);

      const { result } = renderHook(() => usePlatformDashboardStats(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Re-render avec le même query key
      renderHook(() => usePlatformDashboardStats(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Le service ne doit être appelé qu'une fois grâce au cache
      expect(getStatsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Scénario 5: Invalidation', () => {
    it('doit refetch après invalidation du cache', async () => {
      const mockStats = {
        totalOwners: 10,
        totalUsers: 50,
        totalPendingInvitations: 5,
      };

      const getStatsSpy = vi.fn().mockResolvedValue(mockStats);

      vi.spyOn(dashboardService, 'dashboardService', 'get').mockReturnValue({
        getPlatformStatistics: getStatsSpy,
      } as any);

      const { result } = renderHook(() => usePlatformDashboardStats(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Invalider le cache
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'platformStats'] });

      await waitFor(() => expect(getStatsSpy).toHaveBeenCalledTimes(2));
    });
  });
});

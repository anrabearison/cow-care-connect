/**
 * Tests du hook useDashboardStats avec TanStack Query
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardStats } from '../useDashboardStats';
import * as dashboardService from '@/features/dashboard/services';

// Mock useOwnerSelection
vi.mock('@/contexts/OwnerSelectionContext', () => ({
  useOwnerSelection: () => ({ selectedOwnerId: null }),
}));

describe('useDashboardStats Tests', () => {
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
    it('doit récupérer les statistiques avec succès', async () => {
      const mockStats = {
        totalCattle: 100,
        totalEvents: 50,
        totalTreatments: 25,
      };

      vi.spyOn(dashboardService, 'dashboardService', 'get').mockReturnValue({
        getStatistics: vi.fn().mockResolvedValue(mockStats),
      } as any);

      const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockStats);
    });
  });

  describe('Scénario 2: Loading', () => {
    it('doit être en état de loading initial', () => {
      vi.spyOn(dashboardService, 'dashboardService', 'get').mockReturnValue({
        getStatistics: vi.fn().mockImplementation(() => new Promise(() => {})),
      } as any);

      const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Scénario 3: Erreur', () => {
    it('doit gérer les erreurs de récupération', async () => {
      const mockError = new Error('Failed to fetch');

      vi.spyOn(dashboardService, 'dashboardService', 'get').mockReturnValue({
        getStatistics: vi.fn().mockRejectedValue(mockError),
      } as any);

      const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('Scénario 4: Cache', () => {
    it('doit utiliser le cache pour les requêtes répétées', async () => {
      const mockStats = {
        totalCattle: 100,
        totalEvents: 50,
        totalTreatments: 25,
      };

      const getStatsSpy = vi.fn().mockResolvedValue(mockStats);

      vi.spyOn(dashboardService, 'dashboardService', 'get').mockReturnValue({
        getStatistics: getStatsSpy,
      } as any);

      const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Re-render avec le même query key
      renderHook(() => useDashboardStats(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Le service ne doit être appelé qu'une fois grâce au cache
      expect(getStatsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Scénario 5: Invalidation', () => {
    it('doit refetch après invalidation du cache', async () => {
      const mockStats = {
        totalCattle: 100,
        totalEvents: 50,
        totalTreatments: 25,
      };

      const getStatsSpy = vi.fn().mockResolvedValue(mockStats);

      vi.spyOn(dashboardService, 'dashboardService', 'get').mockReturnValue({
        getStatistics: getStatsSpy,
      } as any);

      const { result } = renderHook(() => useDashboardStats(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Invalider le cache
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });

      await waitFor(() => expect(getStatsSpy).toHaveBeenCalledTimes(2));
    });
  });
});

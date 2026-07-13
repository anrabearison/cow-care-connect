import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateHerdBookCattle, useUpdateHerdBookCattle, useDeleteHerdBookCattle } from '../herdBookCattleHooks';
import { herdBookCattleService } from '../../services/herdBookCattleService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/herdBookCattleService', () => ({
  herdBookCattleService: {
    createHerdBookCattle: vi.fn(),
    updateHerdBookCattle: vi.fn(),
    deleteHerdBookCattle: vi.fn(),
  },
}));

describe('herdBookCattleHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateHerdBookCattle', () => {
    it('should call createHerdBookCattle service on mutation', async () => {
      const mockData = { herdBookId: 'hb-1', categoryId: ' cat-1' } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(herdBookCattleService.createHerdBookCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateHerdBookCattle(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(herdBookCattleService.createHerdBookCattle).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { herdBookId: 'hb-1', categoryId: ' cat-1' } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(herdBookCattleService.createHerdBookCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateHerdBookCattle(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Bovin ajouté au livre de troupeau avec succès",
        });
      });
    });
  });

  describe('useUpdateHerdBookCattle', () => {
    it('should call updateHerdBookCattle service on mutation', async () => {
      const mockData = { id: '1', data: { categoryId: 'cat-2' } } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(herdBookCattleService.updateHerdBookCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateHerdBookCattle(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(herdBookCattleService.updateHerdBookCattle).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { categoryId: 'cat-2' } } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(herdBookCattleService.updateHerdBookCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateHerdBookCattle(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Bovin mis à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteHerdBookCattle', () => {
    it('should call deleteHerdBookCattle service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(herdBookCattleService.deleteHerdBookCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteHerdBookCattle(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(herdBookCattleService.deleteHerdBookCattle).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(herdBookCattleService.deleteHerdBookCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteHerdBookCattle(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Bovin supprimé du livre de troupeau avec succès",
        });
      });
    });
  });
});

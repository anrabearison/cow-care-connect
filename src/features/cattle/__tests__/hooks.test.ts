import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCattle, useCattleById, useCreateCattle, useUpdateCattle, useDeleteCattle } from '../hooks';
import { cattleService } from '../services';
import { createTestQueryClient } from '@/test/setup';
import { TestWrapper } from '@/test/test-utils';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

vi.mock('../services', () => ({
  cattleService: {
    getCattleList: vi.fn(),
    getCattleById: vi.fn(),
    createCattle: vi.fn(),
    updateCattle: vi.fn(),
    deleteCattle: vi.fn(),
  },
}));

describe('cattle hooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCattle', () => {
    it('should fetch cattle list successfully', async () => {
      const mockData = [
        { id: '1', name: 'Cattle 1', tag_number: 'TAG001' },
        { id: '2', name: 'Cattle 2', tag_number: 'TAG002' },
      ];
      const mockResponse = { success: true, data: mockData, total: 2 } as unknown as any;
      vi.mocked(cattleService.getCattleList).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCattle('herdbook-1'), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.cattle).toEqual(mockData);
      });
    });

    it('should handle loading state', () => {
      vi.mocked(cattleService.getCattleList).mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useCattle('herdbook-1'), { wrapper: TestWrapper });

      expect(result.current.loading).toBe(true);
    });

    it('should handle error state', async () => {
      const mockResponse = { success: false, message: 'Error fetching cattle', data: [] } as unknown as any;
      vi.mocked(cattleService.getCattleList).mockRejectedValue(mockResponse);

      const { result } = renderHook(() => useCattle('herdbook-1'), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe('useCattleById', () => {
    it('should fetch single cattle successfully', async () => {
      const mockData = { id: '1', name: 'Cattle 1', tag_number: 'TAG001' };
      const mockResponse = { success: true, data: mockData } as unknown as any;
      vi.mocked(cattleService.getCattleById).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCattleById('1'), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.cattle).toEqual(mockData);
      });
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useCattleById(''), { wrapper: TestWrapper });

      expect(result.current.cattle).toBeNull();
      expect(cattleService.getCattleById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateCattle', () => {
    it('should call createCattle service on mutation', async () => {
      const mockData = { cattle: { name: 'New Cattle', tag_number: 'TAG003' } as any, herdBookId: 'hb-1' };
      const mockResponse = { success: true, data: { id: '3', ...mockData.cattle } } as unknown as any;
      vi.mocked(cattleService.createCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateCattle(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(cattleService.createCattle).toHaveBeenCalledWith(mockData.cattle, mockData.herdBookId, undefined);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { cattle: { name: 'New Cattle', tag_number: 'TAG003' } as any, herdBookId: 'hb-1' };
      const mockResponse = { success: true, data: { id: '3', ...mockData.cattle } } as unknown as any;
      vi.mocked(cattleService.createCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateCattle(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "L'animal a été ajouté avec succès et inscrit dans le livre de troupeau",
        });
      });
    });
  });

  describe('useUpdateCattle', () => {
    it('should call updateCattle service on mutation', async () => {
      const mockData = { id: '1', data: { name: 'Updated Cattle' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data } } as unknown as any;
      vi.mocked(cattleService.updateCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateCattle(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(cattleService.updateCattle).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { name: 'Updated Cattle' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data } } as unknown as any;
      vi.mocked(cattleService.updateCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateCattle(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "L'animal a été mis à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteCattle', () => {
    it('should call deleteCattle service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(cattleService.deleteCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteCattle(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(cattleService.deleteCattle).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(cattleService.deleteCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteCattle(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "L'animal a été supprimé avec succès",
        });
      });
    });
  });
});

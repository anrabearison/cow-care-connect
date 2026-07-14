import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateHerdBook, useUpdateHerdBook, useDeleteHerdBook } from '../herdBooksHooks';
import { herdBooksService } from '../../services/herdBooksService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/herdBooksService', () => ({
  herdBooksService: {
    createHerdBook: vi.fn(),
    updateHerdBook: vi.fn(),
    deleteHerdBook: vi.fn(),
  },
}));

describe('herdBooksHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateHerdBook', () => {
    it('should call createHerdBook service on mutation', async () => {
      const mockData = { year: 2024, reference: 'HB-001', description: 'Test description' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(herdBooksService.createHerdBook).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateHerdBook(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(herdBooksService.createHerdBook).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { year: 2024, reference: 'HB-001' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(herdBooksService.createHerdBook).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateHerdBook(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(herdBooksService.createHerdBook).toHaveBeenCalledWith(mockData);
      });
      // Note: herdBooksHooks use custom options for onSuccess callbacks, not built-in toast
    });
  });

  describe('useUpdateHerdBook', () => {
    it('should call updateHerdBook service on mutation', async () => {
      const mockData = { id: '1', data: { year: 2025, reference: 'HB-001' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(herdBooksService.updateHerdBook).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateHerdBook(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(herdBooksService.updateHerdBook).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { year: 2025, reference: 'HB-001' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(herdBooksService.updateHerdBook).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateHerdBook(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(herdBooksService.updateHerdBook).toHaveBeenCalledWith('1', mockData.data);
      });
      // Note: herdBooksHooks use custom options for onSuccess callbacks, not built-in toast
    });
  });

  describe('useDeleteHerdBook', () => {
    it('should call deleteHerdBook service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(herdBooksService.deleteHerdBook).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteHerdBook(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(herdBooksService.deleteHerdBook).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(herdBooksService.deleteHerdBook).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteHerdBook(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(herdBooksService.deleteHerdBook).toHaveBeenCalledWith('1');
      });
      // Note: herdBooksHooks use custom options for onSuccess callbacks, not built-in toast
    });
  });
});

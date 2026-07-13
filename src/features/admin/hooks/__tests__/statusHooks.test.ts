import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateStatus, useUpdateStatus, useDeleteStatus } from '../statusHooks';
import { statusService } from '../../services/statusService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/statusService', () => ({
  statusService: {
    createStatus: vi.fn(),
    updateStatus: vi.fn(),
    deleteStatus: vi.fn(),
  },
}));

describe('statusHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateStatus', () => {
    it('should call createStatus service on mutation', async () => {
      const mockData = { name: 'Test Status', description: 'Test description' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(statusService.createStatus).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateStatus(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(statusService.createStatus).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { name: 'Test Status' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(statusService.createStatus).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateStatus(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Statut créé avec succès",
        });
      });
    });
  });

  describe('useUpdateStatus', () => {
    it('should call updateStatus service on mutation', async () => {
      const mockData = { id: '1', data: { name: 'Updated Status' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(statusService.updateStatus).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateStatus(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(statusService.updateStatus).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { name: 'Updated Status' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(statusService.updateStatus).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateStatus(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Statut mis à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteStatus', () => {
    it('should call deleteStatus service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(statusService.deleteStatus).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteStatus(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(statusService.deleteStatus).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(statusService.deleteStatus).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteStatus(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Statut supprimé avec succès",
        });
      });
    });
  });
});

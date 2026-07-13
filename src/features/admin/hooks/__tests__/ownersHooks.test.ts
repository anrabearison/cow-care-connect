import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateOwner, useUpdateOwner, useDeleteOwner } from '../ownersHooks';
import { ownersService } from '../../services/ownersService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/ownersService', () => ({
  ownersService: {
    createOwner: vi.fn(),
    updateOwner: vi.fn(),
    deleteOwner: vi.fn(),
  },
}));

describe('ownersHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateOwner', () => {
    it('should call createOwner service on mutation', async () => {
      const mockData = { name: 'Test Owner', email: 'test@example.com' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(ownersService.createOwner).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateOwner(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(ownersService.createOwner).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { name: 'Test Owner', email: 'test@example.com' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(ownersService.createOwner).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateOwner(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Propriétaire créé avec succès",
        });
      });
    });
  });

  describe('useUpdateOwner', () => {
    it('should call updateOwner service on mutation', async () => {
      const mockData = { id: '1', data: { name: 'Updated Owner' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(ownersService.updateOwner).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateOwner(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(ownersService.updateOwner).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { name: 'Updated Owner' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(ownersService.updateOwner).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateOwner(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Propriétaire mis à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteOwner', () => {
    it('should call deleteOwner service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(ownersService.deleteOwner).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteOwner(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(ownersService.deleteOwner).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(ownersService.deleteOwner).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteOwner(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Propriétaire supprimé avec succès",
        });
      });
    });
  });
});

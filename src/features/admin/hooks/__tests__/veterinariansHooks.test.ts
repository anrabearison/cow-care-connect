import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateVeterinarian, useUpdateVeterinarian, useDeleteVeterinarian } from '../veterinariansHooks';
import { veterinariansService } from '../../services/veterinariansService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/veterinariansService', () => ({
  veterinariansService: {
    createVeterinarian: vi.fn(),
    updateVeterinarian: vi.fn(),
    deleteVeterinarian: vi.fn(),
  },
}));

describe('veterinariansHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateVeterinarian', () => {
    it('should call createVeterinarian service on mutation', async () => {
      const mockData = { name: 'Test Veterinarian', email: 'test@example.com', phone: '1234567890' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(veterinariansService.createVeterinarian).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateVeterinarian(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(veterinariansService.createVeterinarian).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { name: 'Test Veterinarian', email: 'test@example.com', phone: '1234567890' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(veterinariansService.createVeterinarian).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateVeterinarian(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Vétérinaire créé avec succès",
        });
      });
    });
  });

  describe('useUpdateVeterinarian', () => {
    it('should call updateVeterinarian service on mutation', async () => {
      const mockData = { id: '1', data: { name: 'Updated Veterinarian' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(veterinariansService.updateVeterinarian).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateVeterinarian(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(veterinariansService.updateVeterinarian).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { name: 'Updated Veterinarian' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(veterinariansService.updateVeterinarian).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateVeterinarian(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Vétérinaire mis à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteVeterinarian', () => {
    it('should call deleteVeterinarian service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(veterinariansService.deleteVeterinarian).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteVeterinarian(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(veterinariansService.deleteVeterinarian).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(veterinariansService.deleteVeterinarian).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteVeterinarian(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Vétérinaire supprimé avec succès",
        });
      });
    });
  });
});

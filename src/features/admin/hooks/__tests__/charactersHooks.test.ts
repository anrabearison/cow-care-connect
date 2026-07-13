import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateCharacter, useUpdateCharacter, useDeleteCharacter } from '../charactersHooks';
import { charactersService } from '../../services/charactersService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/charactersService', () => ({
  charactersService: {
    createCharacter: vi.fn(),
    updateCharacter: vi.fn(),
    deleteCharacter: vi.fn(),
  },
}));

describe('charactersHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateCharacter', () => {
    it('should call createCharacter service on mutation', async () => {
      const mockData = { name: 'Test Character', description: 'Test description' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(charactersService.createCharacter).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateCharacter(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(charactersService.createCharacter).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { name: 'Test Character' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(charactersService.createCharacter).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateCharacter(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Caractère créé avec succès",
        });
      });
    });
  });

  describe('useUpdateCharacter', () => {
    it('should call updateCharacter service on mutation', async () => {
      const mockData = { id: '1', data: { name: 'Updated Character' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(charactersService.updateCharacter).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateCharacter(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(charactersService.updateCharacter).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { name: 'Updated Character' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(charactersService.updateCharacter).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateCharacter(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Caractère mis à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteCharacter', () => {
    it('should call deleteCharacter service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(charactersService.deleteCharacter).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteCharacter(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(charactersService.deleteCharacter).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(charactersService.deleteCharacter).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteCharacter(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Caractère supprimé avec succès",
        });
      });
    });
  });
});

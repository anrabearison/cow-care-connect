import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '../categoriesHooks';
import { categoriesService } from '../../services/categoriesService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/categoriesService', () => ({
  categoriesService: {
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  },
}));

describe('categoriesHooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateCategory', () => {
    it('should call createCategory service on mutation', async () => {
      const mockData = { name: 'Test Category', description: 'Test description' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(categoriesService.createCategory).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateCategory(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(categoriesService.createCategory).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { name: 'Test Category' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(categoriesService.createCategory).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateCategory(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Catégorie créée avec succès",
        });
      });
    });
  });

  describe('useUpdateCategory', () => {
    it('should call updateCategory service on mutation', async () => {
      const mockData = { id: '1', data: { name: 'Updated Category' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(categoriesService.updateCategory).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateCategory(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(categoriesService.updateCategory).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { name: 'Updated Category' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(categoriesService.updateCategory).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateCategory(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Catégorie mise à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteCategory', () => {
    it('should call deleteCategory service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(categoriesService.deleteCategory).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteCategory(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(categoriesService.deleteCategory).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(categoriesService.deleteCategory).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteCategory(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Catégorie supprimée avec succès",
        });
      });
    });
  });
});

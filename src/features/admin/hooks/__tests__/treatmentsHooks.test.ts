import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateTreatment, useUpdateTreatment, useDeleteTreatment } from '../treatmentsHooks';
import { treatmentsService } from '../../services/treatmentsService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/treatmentsService', () => ({
  treatmentsService: {
    createTreatment: vi.fn(),
    updateTreatment: vi.fn(),
    deleteTreatment: vi.fn(),
  },
}));

describe('treatmentsHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateTreatment', () => {
    it('should call createTreatment service on mutation', async () => {
      const mockData = { name: 'Test Treatment', description: 'Test description' } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(treatmentsService.createTreatment).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateTreatment(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(treatmentsService.createTreatment).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { name: 'Test Treatment' } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(treatmentsService.createTreatment).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateTreatment(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Traitement créé avec succès",
        });
      });
    });
  });

  describe('useUpdateTreatment', () => {
    it('should call updateTreatment service on mutation', async () => {
      const mockData = { id: '1', data: { name: 'Updated Treatment' } } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(treatmentsService.updateTreatment).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateTreatment(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(treatmentsService.updateTreatment).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { name: 'Updated Treatment' } } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(treatmentsService.updateTreatment).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateTreatment(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Traitement mis à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteTreatment', () => {
    it('should call deleteTreatment service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(treatmentsService.deleteTreatment).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteTreatment(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(treatmentsService.deleteTreatment).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(treatmentsService.deleteTreatment).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteTreatment(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Traitement supprimé avec succès",
        });
      });
    });
  });
});

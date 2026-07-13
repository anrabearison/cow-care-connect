import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateMedicament, useUpdateMedicament, useDeleteMedicament } from '../medicamentsHooks';
import { medicamentsService } from '../../services/medicamentsService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/medicamentsService', () => ({
  medicamentsService: {
    createMedicament: vi.fn(),
    updateMedicament: vi.fn(),
    deleteMedicament: vi.fn(),
  },
}));

describe('medicamentsHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateMedicament', () => {
    it('should call createMedicament service on mutation', async () => {
      const mockData = { name: 'Test Medicament', type: 'antibiotic', description: 'Test description' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(medicamentsService.createMedicament).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateMedicament(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(medicamentsService.createMedicament).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { name: 'Test Medicament', type: 'antibiotic' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(medicamentsService.createMedicament).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateMedicament(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Médicament créé avec succès",
        });
      });
    });
  });

  describe('useUpdateMedicament', () => {
    it('should call updateMedicament service on mutation', async () => {
      const mockData = { id: '1', data: { name: 'Updated Medicament', type: 'antibiotic' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(medicamentsService.updateMedicament).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateMedicament(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(medicamentsService.updateMedicament).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { name: 'Updated Medicament', type: 'antibiotic' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(medicamentsService.updateMedicament).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateMedicament(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Médicament mis à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteMedicament', () => {
    it('should call deleteMedicament service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(medicamentsService.deleteMedicament).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteMedicament(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(medicamentsService.deleteMedicament).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(medicamentsService.deleteMedicament).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteMedicament(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Médicament supprimé avec succès",
        });
      });
    });
  });
});

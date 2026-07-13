import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateEventType, useUpdateEventType, useDeleteEventType } from '../eventTypesHooks';
import { eventTypesService } from '../../services/eventTypesService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/eventTypesService', () => ({
  eventTypesService: {
    createEventType: vi.fn(),
    updateEventType: vi.fn(),
    deleteEventType: vi.fn(),
  },
}));

describe('eventTypesHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateEventType', () => {
    it('should call createEventType service on mutation', async () => {
      const mockData = { name: 'Test EventType', description: 'Test description' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(eventTypesService.createEventType).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateEventType(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(eventTypesService.createEventType).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { name: 'Test EventType' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(eventTypesService.createEventType).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateEventType(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Type d'événement créé avec succès",
        });
      });
    });
  });

  describe('useUpdateEventType', () => {
    it('should call updateEventType service on mutation', async () => {
      const mockData = { id: '1', data: { name: 'Updated EventType' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(eventTypesService.updateEventType).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateEventType(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(eventTypesService.updateEventType).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { name: 'Updated EventType' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } };
      vi.mocked(eventTypesService.updateEventType).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateEventType(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Type d'événement mis à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteEventType', () => {
    it('should call deleteEventType service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(eventTypesService.deleteEventType).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteEventType(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(eventTypesService.deleteEventType).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(eventTypesService.deleteEventType).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteEventType(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Type d'événement supprimé avec succès",
        });
      });
    });
  });
});

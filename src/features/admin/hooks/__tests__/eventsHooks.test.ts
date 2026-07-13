import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from '../eventsHooks';
import { eventsService } from '../../services/eventsService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/eventsService', () => ({
  eventsService: {
    createEvent: vi.fn(),
    updateEvent: vi.fn(),
    deleteEvent: vi.fn(),
  },
}));

describe('eventsHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateEvent', () => {
    it('should call createEvent service on mutation', async () => {
      const mockData = { cattleId: 'cattle-1', date: '2024-01-01', name: 'Test Event', description: 'Test description' } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', cattleId: 'cattle-1', date: '2024-01-01', name: 'Test Event', description: 'Test description', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(eventsService.createEvent).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateEvent(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(eventsService.createEvent).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { cattleId: 'cattle-1', date: '2024-01-01', name: 'Test Event' } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(eventsService.createEvent).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateEvent(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Événement créé avec succès",
        });
      });
    });
  });

  describe('useUpdateEvent', () => {
    it('should call updateEvent service on mutation', async () => {
      const mockData = { id: '1', data: { name: 'Updated Event' } } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(eventsService.updateEvent).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateEvent(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(eventsService.updateEvent).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { name: 'Updated Event' } } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(eventsService.updateEvent).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateEvent(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Événement mis à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteEvent', () => {
    it('should call deleteEvent service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(eventsService.deleteEvent).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteEvent(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(eventsService.deleteEvent).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(eventsService.deleteEvent).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteEvent(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Événement supprimé avec succès",
        });
      });
    });
  });
});

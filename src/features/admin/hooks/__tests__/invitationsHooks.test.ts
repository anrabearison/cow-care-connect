import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateInvitation, useDeleteInvitation } from '../invitationsHooks';
import { invitationsService } from '../../services/invitationsService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/invitationsService', () => ({
  invitationsService: {
    createInvitation: vi.fn(),
    deleteInvitation: vi.fn(),
  },
}));

describe('invitationsHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateInvitation', () => {
    it('should call createInvitation service on mutation', async () => {
      const mockData = { email: 'test@example.com', role: 'OWNER_USER' as const };
      const mockResponse = { success: true, data: { id: '1', ...mockData } } as unknown as any;
      vi.mocked(invitationsService.createInvitation).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateInvitation(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(invitationsService.createInvitation).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { email: 'test@example.com', role: 'OWNER_USER' as const };
      const mockResponse = { success: true, data: { id: '1', ...mockData } } as unknown as any;
      vi.mocked(invitationsService.createInvitation).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateInvitation(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Invitation créée avec succès",
        });
      });
    });
  });

  describe('useDeleteInvitation', () => {
    it('should call deleteInvitation service on mutation', async () => {
      vi.mocked(invitationsService.deleteInvitation).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteInvitation(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(invitationsService.deleteInvitation).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      vi.mocked(invitationsService.deleteInvitation).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteInvitation(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Invitation supprimée avec succès",
        });
      });
    });
  });
});

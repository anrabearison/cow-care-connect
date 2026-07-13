import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreateUser, useUpdateUser, useDeleteUser } from '../usersHooks';
import { usersService } from '../../services/usersService';
import { createTestQueryClient } from '@/test/setup';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/usersService', () => ({
  usersService: {
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

describe('usersHooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useCreateUser', () => {
    it('should call createUser service on mutation', async () => {
      const mockData = { email: 'test@example.com', name: 'Test User', role: 'OWNER_USER' as const, password: 'password123' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(usersService.createUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateUser(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(usersService.createUser).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { email: 'test@example.com', name: 'Test User', role: 'OWNER_USER' as const, password: 'password123' };
      const mockResponse = { success: true, data: { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(usersService.createUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateUser(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Utilisateur créé avec succès",
        });
      });
    });
  });

  describe('useUpdateUser', () => {
    it('should call updateUser service on mutation', async () => {
      const mockData = { id: '1', data: { name: 'Updated User' } } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(usersService.updateUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateUser(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(usersService.updateUser).toHaveBeenCalledWith('1', mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { id: '1', data: { name: 'Updated User' } } as unknown as any;
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(usersService.updateUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateUser(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Utilisateur mis à jour avec succès",
        });
      });
    });
  });

  describe('useDeleteUser', () => {
    it('should call deleteUser service on mutation', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(usersService.deleteUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteUser(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(usersService.deleteUser).toHaveBeenCalledWith('1');
      });
    });

    it('should show success toast on successful deletion', async () => {
      const mockResponse = { success: true, data: true };
      vi.mocked(usersService.deleteUser).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useDeleteUser(), { wrapper: TestWrapper });
      result.current.mutate('1');

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Utilisateur désactivé avec succès",
        });
      });
    });
  });
});

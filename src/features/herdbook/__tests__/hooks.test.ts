import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useHerdBooks, useHerdBookById, useHerdBookCattle, useCattleHistory, useCreateHerdBook, useRegisterCattle, useUpdateRegistration } from '../hooks';
import { herdBookService } from '../services';
import { createTestQueryClient } from '@/test/setup';
import { TestWrapper } from '@/test/test-utils';

const toastMock = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

vi.mock('../services', () => ({
  herdBookService: {
    getHerdBooksByOwner: vi.fn(),
    getHerdBookById: vi.fn(),
    getCattleInHerdBook: vi.fn(),
    getCattleHistory: vi.fn(),
    createHerdBook: vi.fn(),
    registerCattle: vi.fn(),
    updateRegistration: vi.fn(),
  },
}));

describe('herdbook hooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useHerdBooks', () => {
    it('should fetch herd books successfully', async () => {
      const mockData = [
        { id: '1', year: 2024, reference: 'HB-001' },
        { id: '2', year: 2023, reference: 'HB-002' },
      ];
      const mockResponse = { data: mockData, total: 2 } as unknown as any;
      vi.mocked(herdBookService.getHerdBooksByOwner).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useHerdBooks('owner-1'), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse);
      });
    });

    it('should handle loading state', () => {
      vi.mocked(herdBookService.getHerdBooksByOwner).mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useHerdBooks('owner-1'), { wrapper: TestWrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it('should handle error state', async () => {
      const mockResponse = { success: false, message: 'Error fetching herd books', data: [] } as unknown as any;
      vi.mocked(herdBookService.getHerdBooksByOwner).mockRejectedValue(mockResponse);

      const { result } = renderHook(() => useHerdBooks('owner-1'), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  describe('useHerdBookById', () => {
    it('should fetch single herd book successfully', async () => {
      const mockData = { id: '1', year: 2024, reference: 'HB-001' };
      const mockResponse = { success: true, data: mockData } as unknown as any;
      vi.mocked(herdBookService.getHerdBookById).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useHerdBookById('1'), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse);
      });
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useHerdBookById(''), { wrapper: TestWrapper });

      expect(result.current.data).toBeUndefined();
      expect(herdBookService.getHerdBookById).not.toHaveBeenCalled();
    });
  });

  describe('useHerdBookCattle', () => {
    it('should fetch cattle in herd book successfully', async () => {
      const mockData = [
        { id: '1', name: 'Cattle 1', tag_number: 'TAG001' },
        { id: '2', name: 'Cattle 2', tag_number: 'TAG002' },
      ];
      const mockResponse = { success: true, data: mockData, total: 2 } as unknown as any;
      vi.mocked(herdBookService.getCattleInHerdBook).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useHerdBookCattle('hb-1'), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse);
      });
    });
  });

  describe('useCattleHistory', () => {
    it('should fetch cattle history successfully', async () => {
      const mockData = [
        { id: '1', event: 'Birth', date: '2024-01-01' },
        { id: '2', event: 'Vaccination', date: '2024-02-01' },
      ];
      const mockResponse = { success: true, data: mockData } as unknown as any;
      vi.mocked(herdBookService.getCattleHistory).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCattleHistory('cattle-1'), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });
    });
  });

  describe('useCreateHerdBook', () => {
    it('should call createHerdBook service on mutation', async () => {
      const mockData = { year: 2024, reference: 'HB-001', owner_id: 'owner-1', description: 'Test description' };
      const mockResponse = { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as unknown as any;
      vi.mocked(herdBookService.createHerdBook).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateHerdBook(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(herdBookService.createHerdBook).toHaveBeenCalledWith(mockData);
      });
    });

    it('should show success toast on successful creation', async () => {
      const mockData = { year: 2024, reference: 'HB-001', owner_id: 'owner-1' };
      const mockResponse = { id: '1', ...mockData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as unknown as any;
      vi.mocked(herdBookService.createHerdBook).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCreateHerdBook(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Le livre de troupeau a été créé avec succès",
        });
      });
    });
  });

  describe('useRegisterCattle', () => {
    it('should call registerCattle service on mutation', async () => {
      const mockData = { herdBookId: 'hb-1', data: { cattle_id: 'cattle-1', n_carnet: '123', category_id: 'cat-1', status_id: 'status-1' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(herdBookService.registerCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRegisterCattle(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(herdBookService.registerCattle).toHaveBeenCalledWith(mockData.herdBookId, mockData.data);
      });
    });

    it('should show success toast on successful registration', async () => {
      const mockData = { herdBookId: 'hb-1', data: { cattle_id: 'cattle-1', n_carnet: '123', category_id: 'cat-1', status_id: 'status-1' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(herdBookService.registerCattle).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRegisterCattle(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "Le bœuf a été inscrit dans le livre de troupeau",
        });
      });
    });
  });

  describe('useUpdateRegistration', () => {
    it('should call updateRegistration service on mutation', async () => {
      const mockData = { registrationId: '1', data: { n_carnet: '456' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(herdBookService.updateRegistration).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateRegistration(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(herdBookService.updateRegistration).toHaveBeenCalledWith(mockData.registrationId, mockData.data);
      });
    });

    it('should show success toast on successful update', async () => {
      const mockData = { registrationId: '1', data: { n_carnet: '456' } };
      const mockResponse = { success: true, data: { id: '1', ...mockData.data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } as unknown as any;
      vi.mocked(herdBookService.updateRegistration).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useUpdateRegistration(), { wrapper: TestWrapper });
      result.current.mutate(mockData);

      await waitFor(() => {
        expect(toastMock).toHaveBeenCalledWith({
          title: "Succès",
          description: "L'inscription a été mise à jour",
        });
      });
    });
  });
});

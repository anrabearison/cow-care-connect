import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePassports } from '../hooks';
import { passportService } from '../services/passportService';
import { createTestQueryClient, toastMock } from '@/test/setup';
import { TestWrapper } from '@/test/test-utils';

vi.mock('../services/passportService', () => ({
  passportService: {
    findAll: vi.fn(),
  },
}));

describe('passport hooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('usePassports', () => {
    it('should fetch passports list successfully', async () => {
      const mockData = [
        { id: '1', number: 'PASS001', cattleId: 'cattle-1' },
        { id: '2', number: 'PASS002', cattleId: 'cattle-2' },
      ];
      const mockResponse = { data: mockData, meta: { total: 2, page: 1, limit: 10 } } as unknown as any;
      vi.mocked(passportService.findAll).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePassports('herdbook-1'), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse);
      });
    });

    it('should handle loading state', () => {
      vi.mocked(passportService.findAll).mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => usePassports('herdbook-1'), { wrapper: TestWrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it('should handle error state', async () => {
      const mockResponse = { success: false, message: 'Error fetching passports', data: [] } as unknown as any;
      vi.mocked(passportService.findAll).mockRejectedValue(mockResponse);

      const { result } = renderHook(() => usePassports('herdbook-1'), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });

    it('should not fetch when herdBookId is empty', () => {
      const { result } = renderHook(() => usePassports(''), { wrapper: TestWrapper });

      expect(result.current.data).toBeUndefined();
      expect(passportService.findAll).not.toHaveBeenCalled();
    });
  });
});

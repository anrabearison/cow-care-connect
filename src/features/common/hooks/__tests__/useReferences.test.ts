import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEventTypes, useVeterinarians, useMedicaments, useCategories, useCharacters, useStatuses } from '../useReferences';
import { referenceService } from '../../services/referenceService';
import { createTestQueryClient, toastMock } from '@/test/setup';
import { TestWrapper } from '@/test/test-utils';

vi.mock('../../services/referenceService', () => ({
  referenceService: {
    getEventTypes: vi.fn(),
    getVeterinarians: vi.fn(),
    getMedicaments: vi.fn(),
    getCategories: vi.fn(),
    getCharacters: vi.fn(),
    getStatuses: vi.fn(),
  },
}));

vi.mock('@/contexts/OwnerSelectionContext', () => ({
  useOwnerSelection: () => ({ selectedOwnerId: 'owner-1' }),
}));

describe('common hooks', () => {
  beforeEach(() => {
    createTestQueryClient();
    vi.clearAllMocks();
  });

  describe('useEventTypes', () => {
    it('should fetch event types successfully', async () => {
      const mockData = [{ id: '1', name: 'Event Type 1' }];
      vi.mocked(referenceService.getEventTypes).mockResolvedValue({ success: true, data: mockData } as any);

      const { result } = renderHook(() => useEventTypes(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual({ success: true, data: mockData });
      });
    });
  });

  describe('useVeterinarians', () => {
    it('should fetch veterinarians successfully', async () => {
      const mockData = [{ id: '1', name: 'Vet 1' }];
      vi.mocked(referenceService.getVeterinarians).mockResolvedValue({ success: true, data: mockData } as any);

      const { result } = renderHook(() => useVeterinarians(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual({ success: true, data: mockData });
      });
    });
  });

  describe('useMedicaments', () => {
    it('should fetch medicaments successfully', async () => {
      const mockData = [{ id: '1', name: 'Medicament 1' }];
      vi.mocked(referenceService.getMedicaments).mockResolvedValue({ success: true, data: mockData } as any);

      const { result } = renderHook(() => useMedicaments(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual({ success: true, data: mockData });
      });
    });
  });

  describe('useCategories', () => {
    it('should fetch categories successfully', async () => {
      const mockData = [{ id: '1', name: 'Category 1' }];
      vi.mocked(referenceService.getCategories).mockResolvedValue({ success: true, data: mockData } as any);

      const { result } = renderHook(() => useCategories(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual({ success: true, data: mockData });
      });
    });
  });

  describe('useCharacters', () => {
    it('should fetch characters successfully', async () => {
      const mockData = [{ id: '1', name: 'Character 1' }];
      vi.mocked(referenceService.getCharacters).mockResolvedValue({ success: true, data: mockData } as any);

      const { result } = renderHook(() => useCharacters(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual({ success: true, data: mockData });
      });
    });
  });

  describe('useStatuses', () => {
    it('should fetch statuses successfully', async () => {
      const mockData = [{ id: '1', name: 'Status 1' }];
      vi.mocked(referenceService.getStatuses).mockResolvedValue({ success: true, data: mockData } as any);

      const { result } = renderHook(() => useStatuses(), { wrapper: TestWrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual({ success: true, data: mockData });
      });
    });
  });
});


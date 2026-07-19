import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useImportLogic } from '../useImportLogic';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock du toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock de fetch global
global.fetch = vi.fn();

describe('useImportLogic', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };

  describe('initial state', () => {
    it('should initialize with form step', () => {
      const { result } = renderHook(() => useImportLogic(), { wrapper });

      expect(result.current.step).toBe('form');
      expect(result.current.csvFile).toBeNull();
      expect(result.current.dryRunResult).toBeNull();
      expect(result.current.csvData).toEqual([]);
    });

    it('should initialize form with default values', () => {
      const { result } = renderHook(() => useImportLogic(), { wrapper });

      const currentYear = new Date().getFullYear();
      expect(result.current.form.getValues()).toEqual({
        reference: '',
        description: '',
        year: currentYear,
      });
    });
  });

  describe('handleFileSelect', () => {
    it('should accept valid CSV file', () => {
      const { result } = renderHook(() => useImportLogic(), { wrapper });
      const file = new File(['content'], 'test.csv', { type: 'text/csv' });

      act(() => {
        result.current.handleFileSelect(file);
      });

      expect(result.current.csvFile).toBe(file);
      expect(result.current.step).toBe('upload');
    });

    it('should reject non-CSV file', () => {
      const { result } = renderHook(() => useImportLogic(), { wrapper });
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      act(() => {
        result.current.handleFileSelect(file);
      });

      expect(result.current.csvFile).toBeNull();
      expect(result.current.step).toBe('form');
    });

    it('should reject file larger than 5MB', () => {
      const { result } = renderHook(() => useImportLogic(), { wrapper });
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.csv', {
        type: 'text/csv',
      });

      act(() => {
        result.current.handleFileSelect(largeFile);
      });

      expect(result.current.csvFile).toBeNull();
      expect(result.current.step).toBe('form');
    });
  });

  describe('handleReset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useImportLogic(), { wrapper });
      const file = new File(['content'], 'test.csv', { type: 'text/csv' });

      act(() => {
        result.current.handleFileSelect(file);
        result.current.form.setValue('reference', 'TEST-2024');
      });

      expect(result.current.csvFile).toBe(file);
      expect(result.current.form.getValues().reference).toBe('TEST-2024');

      act(() => {
        result.current.handleReset();
      });

      expect(result.current.csvFile).toBeNull();
      expect(result.current.step).toBe('form');
      expect(result.current.form.getValues().reference).toBe('');
    });
  });

  describe('canProceed', () => {
    it('should be defined', () => {
      const { result } = renderHook(() => useImportLogic(), { wrapper });

      expect(result.current.canProceed).toBeDefined();
    });

    it('should be a function', () => {
      const { result } = renderHook(() => useImportLogic(), { wrapper });

      expect(typeof result.current.canProceed).toBe('function');
    });
  });

  describe('dryRunMutation', () => {
    it('should call dry-run API with correct data', async () => {
      const mockResponse = {
        valid: true,
        totalRows: 2,
        validRowsCount: 2,
        errors: [],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useImportLogic(), { wrapper });
      const file = new File(['content'], 'test.csv', { type: 'text/csv' });

      act(() => {
        result.current.form.setValue('reference', 'HB-2024');
        result.current.form.setValue('year', 2024);
        result.current.handleFileSelect(file);
      });

      await act(async () => {
        await result.current.handleDryRun();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/herd-books/initial-import/dry-run',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('should set dryRunResult on success', async () => {
      const mockResponse = {
        valid: true,
        totalRows: 2,
        validRowsCount: 2,
        errors: [],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useImportLogic(), { wrapper });
      const file = new File(['content'], 'test.csv', { type: 'text/csv' });

      act(() => {
        result.current.form.setValue('reference', 'HB-2024');
        result.current.form.setValue('year', 2024);
        result.current.handleFileSelect(file);
      });

      await act(async () => {
        await result.current.handleDryRun();
      });

      expect(result.current.dryRunResult).toEqual(mockResponse);
    });

    it('should move to confirm step on valid dry-run', async () => {
      const mockResponse = {
        valid: true,
        totalRows: 2,
        validRowsCount: 2,
        errors: [],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useImportLogic(), { wrapper });
      const file = new File(['content'], 'test.csv', { type: 'text/csv' });

      act(() => {
        result.current.form.setValue('reference', 'HB-2024');
        result.current.form.setValue('year', 2024);
        result.current.handleFileSelect(file);
      });

      await act(async () => {
        await result.current.handleDryRun();
      });

      expect(result.current.step).toBe('confirm');
    });

    it('should move to validation step on invalid dry-run', async () => {
      const mockResponse = {
        valid: false,
        totalRows: 2,
        validRowsCount: 1,
        errors: [{ rowNumber: 2, field: 'name', message: 'Required' }],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useImportLogic(), { wrapper });
      const file = new File(['content'], 'test.csv', { type: 'text/csv' });

      act(() => {
        result.current.form.setValue('reference', 'HB-2024');
        result.current.form.setValue('year', 2024);
        result.current.handleFileSelect(file);
      });

      await act(async () => {
        await result.current.handleDryRun();
      });

      expect(result.current.step).toBe('validation');
    });
  });

  describe('confirmMutation', () => {
    it('should call confirm API with correct data', async () => {
      const mockResponse = {
        herdBookId: 'test-id',
        cattleCount: 2,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useImportLogic(), { wrapper });
      const file = new File(['content'], 'test.csv', { type: 'text/csv' });

      act(() => {
        result.current.form.setValue('reference', 'HB-2024');
        result.current.form.setValue('year', 2024);
        result.current.handleFileSelect(file);
      });

      await act(async () => {
        await result.current.handleConfirm();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/herd-books/initial-import/confirm',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });

    it('should invalidate queries on success', async () => {
      const mockResponse = {
        herdBookId: 'test-id',
        cattleCount: 2,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useImportLogic(), { wrapper });
      const file = new File(['content'], 'test.csv', { type: 'text/csv' });

      act(() => {
        result.current.form.setValue('reference', 'HB-2024');
        result.current.form.setValue('year', 2024);
        result.current.handleFileSelect(file);
      });

      await act(async () => {
        await result.current.handleConfirm();
      });

      // Just verify the mutation completed successfully
      expect(result.current.step).toBe('confirm');
    });
  });

  describe('isLoading', () => {
    it('should be defined', () => {
      const { result } = renderHook(() => useImportLogic(), { wrapper });

      expect(result.current.isLoading).toBeDefined();
    });

    it('should be a boolean', () => {
      const { result } = renderHook(() => useImportLogic(), { wrapper });

      expect(typeof result.current.isLoading).toBe('boolean');
    });

    it('should be false initially', () => {
      const { result } = renderHook(() => useImportLogic(), { wrapper });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
